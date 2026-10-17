import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "./ShopContext";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useCatalog } from "../hooks/useCatalog";
import { useOrders } from "../hooks/useOrders";
import { usePersistedState } from "../hooks/usePersistedState";
import * as api from "../services/api";

export default function ShopProvider({ children }) {
  const navigate = useNavigate();
  const [overlay, setOverlay] = useState(null);
  const [info, setInfo] = useState(null);
  const [toast, setToast] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [favorites, setFavorites] = usePersistedState("nook_favorites", []);
  const notify = useCallback((message) => setToast(message), []);
  const auth = useAuth();
  const catalog = useCatalog();
  const bag = useCart(notify);
  const orderState = useOrders(auth.user?.id, auth.authLoading);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function openAuth(role = "buyer", mode = "signup") {
    setOverlay({ type: "auth", role, mode });
  }
  function closeOverlay() {
    if (!checkoutBusy) setOverlay(null);
  }
  async function authenticate(data) {
    const account = await auth.authenticate(data);
    setOverlay(null);
    notify(
      `Welcome ${account.name?.split(" ")[0] || "to Nook"}! Make yourself at home.`,
    );
    navigate(
      account.role === "seller"
        ? "/seller"
        : account.role === "admin"
          ? "/admin"
          : "/account",
    );
  }
  async function logout() {
    await auth.logout();
    orderState.setOrders([]);
    navigate("/");
    notify("You’re signed out. See you around!");
  }
  async function addProduct(fields) {
    const product = await catalog.addProduct({
      ...fields,
      seller: auth.user?.name || "Your shop",
    });
    notify("Your new find is live in the shop.");
    return product;
  }
  async function updateProduct(id, fields) {
    const product = await catalog.updateProduct(id, fields);
    notify("Product updated. Looking good!");
    return product;
  }
  async function deleteProduct(id) {
    await catalog.deleteProduct(id);
    bag.removeProductFromCart(id);
    notify("Product removed from your shop.");
  }
  async function placeOrder(data) {
    setCheckoutBusy(true);
    try {
      const order = await api.createOrder(data);
      orderState.setOrders((current) => [order, ...current]);
      setLastOrder(order);
      bag.clearCart();
      setOverlay({ type: "success" });
      catalog.refreshProducts().catch(() => {});
    } finally {
      setCheckoutBusy(false);
    }
  }

  const value = {
    ...catalog,
    ...auth,
    ...bag,
    ...orderState,
    isDemo: !api.API_BASE_URL,
    favorites,
    toggleFavorite,
    overlay,
    info,
    toast,
    checkoutBusy,
    lastOrder,
    notify,
    dismissToast: () => setToast(""),
    showInfo: setInfo,
    closeInfo: () => setInfo(null),
    openAuth,
    closeOverlay,
    openCart: () => setOverlay({ type: "cart" }),
    viewProduct: (product) => setOverlay({ type: "product", product }),
    openCheckout: () => {
      if (bag.cart.length) setOverlay({ type: "checkout" });
    },
    authenticate,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    placeOrder,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
