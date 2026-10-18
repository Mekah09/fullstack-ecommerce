import { Component } from "react";
import { RouteContext } from "../context/RouteContext.jsx";
import { ShopContext } from "../context/ShopContext.jsx";
import { readStoredArray, writeStored } from "../utils/storage.jsx";
import {
  cartKey,
  cartRecords,
  changeCartQuantity,
  increaseCart,
} from "../utils/cart.jsx";
import * as api from "../services/api.jsx";
import * as account from "../services/accountActions.jsx";
import * as catalog from "../services/catalogActions.jsx";
import * as orders from "../services/orderActions.jsx";

export default class ShopProvider extends Component {
  static contextType = RouteContext;
  alive = false;
  accountVersion = 0;
  catalogVersion = 0;
  savedCartRecords = readStoredArray("nook_cart");
  savedFavoriteIds = readStoredArray("nook_favorites");
  state = {
    products: [],
    loading: true,
    loadError: "",
    user: null,
    authLoading: true,
    cart: [],
    favorites: [],
    orders: [],
    ordersLoading: false,
    ordersError: "",
    sellers: [],
    sellersLoading: false,
    sellersError: "",
    overlay: null,
    info: null,
    toast: "",
    checkoutBusy: false,
    lastOrder: null,
  };

  componentDidMount() {
    this.alive = true;
    this.refreshProducts().catch(() => {});
    account.restoreSession(this);
  }
  componentWillUnmount() {
    this.alive = false;
    ++this.accountVersion;
    ++this.catalogVersion;
    clearTimeout(this.toastTimer);
  }

  navigate = (to, options) => this.context.navigate(to, options);
  notify = (message) => {
    if (!this.alive) return;
    clearTimeout(this.toastTimer);
    this.setState({ toast: message });
    this.toastTimer = setTimeout(() => {
      if (this.alive) this.setState({ toast: "" });
    }, 3500);
  };
  persistShopping = () => {
    this.savedCartRecords = cartRecords(this.state.cart);
    this.savedFavoriteIds = this.state.favorites;
    writeStored("nook_cart", this.savedCartRecords);
    writeStored("nook_favorites", this.savedFavoriteIds);
  };
  toggleFavorite = (id) =>
    this.setState(
      (current) => ({
        favorites: current.favorites.includes(id)
          ? current.favorites.filter((item) => item !== id)
          : [...current.favorites, id],
      }),
      this.persistShopping,
    );
  openAuth = (role = "buyer", mode = "signup") =>
    this.setState({ overlay: { type: "auth", role, mode } });
  closeOverlay = () => {
    if (!this.state.checkoutBusy) this.setState({ overlay: null });
  };
  openCart = () => this.setState({ overlay: { type: "cart" } });
  viewProduct = (product) =>
    this.setState({ overlay: { type: "product", product } });
  openCheckout = () => {
    if (this.state.cart.length)
      this.setState({ overlay: { type: "checkout" } });
  };
  showInfo = (info) => this.setState({ info });
  closeInfo = () => this.setState({ info: null });
  dismissToast = () => {
    clearTimeout(this.toastTimer);
    this.setState({ toast: "" });
  };

  addToCart = (product, requested = 1) => {
    const live = this.state.products.find((item) => item.id === product.id);
    const used = this.state.cart
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);
    if (!live || live.stock <= used) {
      this.notify("This quantity is currently unavailable.");
      return false;
    }
    const quantity = Math.min(
      Math.max(1, Math.floor(Number(requested) || 1)),
      live.stock - used,
    );
    const item = {
      ...live,
      selectedColor: product.selectedColor,
      selectedFinish: product.selectedFinish,
    };
    this.setState(
      (current) => ({ cart: increaseCart(current.cart, item, quantity) }),
      this.persistShopping,
    );
    this.notify(`${live.name} added to your bag`);
    return true;
  };
  updateQuantity = (key, quantity) =>
    this.setState(
      (current) => ({ cart: changeCartQuantity(current.cart, key, quantity) }),
      this.persistShopping,
    );
  removeFromCart = (key) =>
    this.setState(
      (current) => ({
        cart: current.cart.filter((item) => cartKey(item) !== key),
      }),
      this.persistShopping,
    );
  authenticate = (data) => account.authenticate(this, data);
  logout = () => account.logout(this);
  refreshProducts = () => catalog.refreshProducts(this);
  addProduct = (fields) => catalog.addProduct(this, fields);
  updateProduct = (id, fields) => catalog.updateProduct(this, id, fields);
  deleteProduct = (id) => catalog.deleteProduct(this, id);
  placeOrder = (data) => orders.placeOrder(this, data);
  approveSeller = (id) => orders.approveSeller(this, id);
  subscribeNewsletter = (email) => api.subscribeNewsletter(email);

  render() {
    const value = {
      ...this.state,
      location: this.context.location,
      navigate: this.navigate,
      cartCount: this.state.cart.reduce((sum, item) => sum + item.quantity, 0),
      apiConfigured: api.API_CONFIGURED,
      notify: this.notify,
      dismissToast: this.dismissToast,
      toggleFavorite: this.toggleFavorite,
      openAuth: this.openAuth,
      closeOverlay: this.closeOverlay,
      openCart: this.openCart,
      viewProduct: this.viewProduct,
      openCheckout: this.openCheckout,
      showInfo: this.showInfo,
      closeInfo: this.closeInfo,
      addToCart: this.addToCart,
      updateQuantity: this.updateQuantity,
      removeFromCart: this.removeFromCart,
      authenticate: this.authenticate,
      logout: this.logout,
      refreshProducts: this.refreshProducts,
      addProduct: this.addProduct,
      updateProduct: this.updateProduct,
      deleteProduct: this.deleteProduct,
      placeOrder: this.placeOrder,
      approveSeller: this.approveSeller,
      subscribeNewsletter: this.subscribeNewsletter,
    };
    return (
      <ShopContext.Provider value={value}>
        {this.props.children}
      </ShopContext.Provider>
    );
  }
}
