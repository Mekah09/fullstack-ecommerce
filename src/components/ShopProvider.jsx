import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RouteContext } from "../context/RouteContext.jsx";
import { ShopContext } from "../context/ShopContext.jsx";
import { readStoredArray, writeStored } from "../utils/storage.jsx";
import { cartKey, cartRecords, changeCartQuantity, increaseCart, restoreCart } from "../utils/cart.jsx";
import { clearSession, readSession, saveSession } from "../services/auth.jsx";

export default function ShopProvider({ children }) {
  const { location, navigate } = useContext(RouteContext);
  const [session, setSession] = useState(() => readSession());
  const [products, setProducts] = useState([]);
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [createdProductIds, setCreatedProductIds] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(() => readStoredArray("nook_favorites"));
  const [catalogReady, setCatalogReady] = useState(false);
  const initialCart = useRef(readStoredArray("nook_cart"));
  const hydrated = useRef(false);
  const [overlay, setOverlay] = useState(null);
  const [info, setInfo] = useState(null);
  const [toast, setToast] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [sellersError, setSellersError] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const user = session?.user || null;
  const token = session?.token || "";

  useEffect(() => {
    if (!catalogReady) return;
    writeStored("nook_cart", cartRecords(cart));
  }, [cart, catalogReady]);
  useEffect(() => { writeStored("nook_favorites", favorites); }, [favorites]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Pages fetch their own products. This only shares their real API results
  // with the bag and saved finds; no network request happens in this provider.
  const setCatalog = useCallback((records) => {
    const firstLoad = !hydrated.current;
    hydrated.current = true;
    setProducts(records);
    setCart((current) => restoreCart(records, firstLoad ? initialCart.current : cartRecords(current)));
    setCatalogReady(true);
  }, []);

  const recordProduct = useCallback((product) => {
    setProducts((current) => [product, ...current.filter((item) => item.id !== product.id)]);
    setCreatedProductIds((current) => [...new Set([...current, product.id])]);
    setCatalogVersion((version) => version + 1);
  }, []);
  const notify = useCallback((message) => setToast(message), []);
  const openAuth = (role = "buyer", mode = "signup") => setOverlay({ type: "auth", role, mode });
  const closeOverlay = () => { if (!checkoutBusy) setOverlay(null); };
  const authenticate = async (verifiedSession) => {
    const account = saveSession(verifiedSession) || verifiedSession;
    setSession(account);
    setCreatedProductIds([]);
    setOrders([]);
    setSellers([]);
    setOverlay(null);
    notify(`Welcome ${account.user.name?.split(" ")[0] || "to Nook"}!`);
    navigate(account.user.role === "admin" ? "/admin" : account.user.role === "seller" ? "/seller" : "/account");
  };
  const logout = () => {
    clearSession();
    setSession(null);
    setCreatedProductIds([]);
    setOrders([]);
    setSellers([]);
    setOverlay(null);
    navigate("/");
    notify("You’re signed out.");
  };
  const addToCart = (product, requested = 1) => {
    const quantity = Math.floor(Number(requested));
    const live = products.find((item) => item.id === product.id);
    if (!live || !Number.isSafeInteger(quantity) || quantity < 1) return false;
    const used = cart.filter((item) => item.id === live.id).reduce((sum, item) => sum + item.quantity, 0);
    if (live.stock != null && used + quantity > live.stock) {
      notify("The requested quantity exceeds the available stock.");
      return false;
    }
    setCart((current) => increaseCart(current, { ...live, selectedColor: product.selectedColor, selectedFinish: product.selectedFinish }, quantity));
    notify(`${live.name} added to your bag`);
    return true;
  };
  const placeOrder = async (data) => {
    const endpoint = import.meta.env.VITE_ORDERS_API_URL;
    if (!endpoint) throw new Error("Checkout will be available when the order API is connected.");
    if (!user) throw new Error("Please sign in before placing your order.");
    setCheckoutBusy(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          items: data.items.map((item) => ({ productId: item.id, quantity: item.quantity, ...(item.selectedColor ? { selectedColor: item.selectedColor } : {}) })),
          shippingAddress: data.shippingAddress,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to place your order.");
      const order = payload.order || payload;
      if (!(order.id || order._id) || !Array.isArray(order.items) || !Number.isFinite(Number(order.total))) throw new Error("The order API returned an incomplete order.");
      const saved = { ...order, id: String(order.id || order._id), total: Number(order.total) };
      setOrders((current) => [saved, ...current]);
      setLastOrder(saved);
      setCart([]);
      setOverlay({ type: "success" });
      setCatalogVersion((version) => version + 1);
      return saved;
    } finally { setCheckoutBusy(false); }
  };

  return (
    <ShopContext.Provider value={{
      user, token, authLoading: false, products, setCatalog, recordProduct, catalogVersion,
      createdProductIds, cart, favorites, overlay, info, toast, checkoutBusy, lastOrder,
      orders, setOrders, ordersLoading, setOrdersLoading, ordersError, setOrdersError,
      sellers, setSellers, sellersLoading, setSellersLoading, sellersError, setSellersError,
      location, navigate, notify, authenticate, logout, openAuth, closeOverlay,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      toggleFavorite: (id) => setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]),
      updateQuantity: (id, quantity) => setCart((current) => changeCartQuantity(current, id, quantity)),
      removeFromCart: (id) => setCart((current) => current.filter((item) => cartKey(item) !== id)),
      addToCart, openCart: () => setOverlay({ type: "cart" }),
      viewProduct: (product) => setOverlay({ type: "product", product }),
      openCheckout: () => user ? setOverlay({ type: "checkout" }) : openAuth("buyer", "signin"),
      showInfo: setInfo, closeInfo: () => setInfo(null), dismissToast: () => setToast(""),
      refreshProducts: () => setCatalogVersion((version) => version + 1),
      addProduct: recordProduct, updateProduct: (_id, product) => recordProduct(product),
      deleteProduct: async () => { throw new Error("Product deletion needs your backend endpoint."); },
      approveSeller: async () => { throw new Error("Seller approval needs your backend endpoint."); },
      placeOrder,
    }}>{children}</ShopContext.Provider>
  );
}
