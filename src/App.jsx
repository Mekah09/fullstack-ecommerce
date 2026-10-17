import { useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiPlus,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiSliders,
  FiStar,
  FiSun,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import {
  LuArmchair,
  LuCookingPot,
  LuLamp,
  LuLeaf,
  LuSprout,
  LuFlower2,
} from "react-icons/lu";
import Dashboard from "./components/Dashboard";
import {
  AuthModal,
  CartDrawer,
  ProductModal,
} from "./components/CommerceOverlays";
import { categories } from "./data/products";
import * as api from "./services/api";
import "./App.css";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
const readStored = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const categoryIcons = {
  Furniture: LuArmchair,
  Lighting: LuLamp,
  Decor: LuFlower2,
  Kitchen: LuCookingPot,
  Lifestyle: LuSprout,
};

function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="Nook home">
      <span className="brand-mark">
        <span />
        <span />
        <span />
        <span />
      </span>
      nook<span className="brand-dot">.</span>
    </button>
  );
}

function ProductCard({ product, onView, onAdd, onFavorite, favorite, index }) {
  return (
    <article
      className="product-card group min-w-0"
      data-reveal
      style={{ "--delay": `${(index % 4) * 65}ms` }}
    >
      <div className={`product-visual product-tint-${index % 4}`}>
        <button
          className="product-image-button"
          onClick={() => onView(product)}
          aria-label={`View ${product.name}`}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
        </button>
        {product.badge && (
          <span
            className={`product-badge ${product.badge.toLowerCase().includes("new") ? "badge-new" : ""}`}
          >
            {product.badge}
          </span>
        )}
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          onClick={() => onFavorite(product.id)}
          aria-label={`${favorite ? "Remove" : "Save"} ${product.name} ${favorite ? "from" : "to"} favorites`}
          aria-pressed={favorite}
        >
          <FiHeart />
        </button>
        <button
          className="quick-add"
          onClick={() => onAdd(product, 1)}
          disabled={!product.stock}
          aria-label={`Add ${product.name} to cart`}
        >
          <FiPlus />
        </button>
      </div>
      <div className="product-meta flex items-center justify-between">
        <span>{product.category}</span>
        <span className="product-rating">
          <FiStar />
          {Number(product.rating || 0).toFixed(1)}{" "}
          <small>({product.reviews || 0})</small>
        </span>
      </div>
      <div className="product-title-row flex items-start justify-between">
        <button onClick={() => onView(product)}>{product.name}</button>
        <span>{money(product.price)}</span>
      </div>
      <div className="product-subline flex items-center justify-between">
        <span>By {product.seller}</span>
        {product.originalPrice > product.price && (
          <del>{money(product.originalPrice)}</del>
        )}
      </div>
    </article>
  );
}

function Checkout({ items, user, onClose, onPlaceOrder, busy }) {
  const [error, setError] = useState("");
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 100 ? 0 : 8;
  async function submit(event) {
    event.preventDefault();
    setError("");
    const shippingAddress = Object.fromEntries(
      new FormData(event.currentTarget),
    );
    try {
      await onPlaceOrder({
        items,
        shippingAddress,
        subtotal,
        shipping,
        total: subtotal + shipping,
      });
    } catch (err) {
      setError(
        err.message || "We couldn’t place your order. Please try again.",
      );
    }
  }
  return (
    <div className="nook-modal-backdrop" onClick={onClose}>
      <section
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close checkout"
        >
          <FiX />
        </button>
        <span className="eyebrow">ONE STEP CLOSER TO A GOOD FIND</span>
        <h2 id="checkout-heading">Make it yours.</h2>
        <p className="demo-note">
          <FiShield />
          {api.API_BASE_URL
            ? "Review your order and delivery details."
            : "Demo checkout · No payment will be collected."}
        </p>
        <form onSubmit={submit}>
          <div className="checkout-fields grid grid-cols-2">
            <label>
              Full name
              <input
                name="name"
                required
                defaultValue={user?.name}
                autoComplete="name"
                placeholder="Alex Morgan"
                autoFocus
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                defaultValue={user?.email}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label className="full-field">
              Street address
              <input
                name="address"
                required
                autoComplete="street-address"
                placeholder="Street address and apartment"
              />
            </label>
            <label>
              City
              <input
                name="city"
                required
                autoComplete="address-level2"
                placeholder="Your city"
              />
            </label>
            <label>
              Postal code
              <input
                name="postalCode"
                required
                autoComplete="postal-code"
                placeholder="Postal code"
              />
            </label>
          </div>
          <div className="checkout-summary">
            {items.map((item) => (
              <div key={item.cartId || item.id}>
                <span>
                  {item.name} <small>× {item.quantity}</small>
                </span>
                <b>{money(item.price * item.quantity)}</b>
              </div>
            ))}
            <div>
              <span>Shipping</span>
              <b>{shipping ? money(shipping) : "On us"}</b>
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <b>{money(subtotal + shipping)}</b>
            </div>
          </div>
          {error && (
            <p className="form-error text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary-button checkout-submit"
            disabled={busy}
            type="submit"
          >
            {busy
              ? "Placing your order…"
              : api.API_BASE_URL
                ? "Place order"
                : "Place demo order"}
            <FiArrowRight />
          </button>
        </form>
      </section>
    </div>
  );
}

function BuyerAccount({
  user,
  orders,
  favorites,
  products,
  onView,
  onAdd,
  onFavorite,
  onShop,
}) {
  return (
    <main className="buyer-page page-width">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR LITTLE CORNER</span>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "friend"}.</h1>
          <p>All your good finds, in one place.</p>
        </div>
        <button className="text-link" onClick={onShop}>
          Back to shopping <FiArrowRight />
        </button>
      </div>
      <section className="buyer-orders">
        <h2>
          <FiPackage /> Your orders <span>{orders.length}</span>
        </h2>
        {orders.length ? (
          orders.map((order) => (
            <article className="buyer-order" key={order.id}>
              <div>
                <b>Order #{String(order.id).slice(-8).toUpperCase()}</b>
                <p>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "Just placed"}{" "}
                  · {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <span className="order-status">
                <FiCheckCircle />{" "}
                {api.API_BASE_URL
                  ? order.status || "Received"
                  : "Demo order placed"}
              </span>
              <strong>{money(order.total)}</strong>
            </article>
          ))
        ) : (
          <div className="buyer-empty">
            <FiShoppingBag />
            <h3>Your next favorite is waiting.</h3>
            <p>When you place an order, you’ll find it right here.</p>
            <button className="primary-button" onClick={onShop}>
              Find something good <FiArrowRight />
            </button>
          </div>
        )}
      </section>
      <section className="buyer-favorites">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE KEEPERS</span>
            <h2>
              Your saved finds <span>({favorites.length})</span>
            </h2>
          </div>
        </div>
        {favorites.length ? (
          <div className="product-grid grid grid-cols-2 min-[651px]:grid-cols-3 min-[901px]:grid-cols-4">
            {products
              .filter((product) => favorites.includes(product.id))
              .map((product, index) => (
                <ProductCard
                  key={product.id}
                  {...{ product, index, onView, onAdd, onFavorite }}
                  favorite
                />
              ))}
          </div>
        ) : (
          <p className="muted">
            Tap the heart on any product to save it for a little later.
          </p>
        )}
      </section>
    </main>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState("shop");
  const [category, setCategory] = useState("All finds");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() =>
    readStored("nook_favorites", []),
  );
  const [cart, setCart] = useState(() => readStored("nook_cart", []));
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authRole, setAuthRole] = useState("buyer");
  const [authMode, setAuthMode] = useState("signup");
  const [toast, setToast] = useState("");
  const [accountMenu, setAccountMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [newsletter, setNewsletter] = useState(false);
  const [info, setInfo] = useState(null);
  const catalogRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    let active = true;
    api
      .getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    api
      .getCurrentUser()
      .then((account) => {
        if (active) setUser(account);
      })
      .catch(() => {});
    api
      .getOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("nook_cart", JSON.stringify(cart));
    } catch {
      /* Cart remains available in this session. */
    }
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("nook_favorites", JSON.stringify(favorites));
    } catch {
      /* Favorites remain available in this session. */
    }
  }, [favorites]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [view, products, category, search, favoritesOnly, favorites]);
  useEffect(() => {
    if (!info && !["checkout", "success"].includes(overlay)) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const dialog = document.querySelector(
      '.nook-modal-backdrop [role="dialog"]',
    );
    const selector =
      "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]";
    const focusable = () =>
      [...(dialog?.querySelectorAll(selector) || [])].filter(
        (element) => element.getClientRects().length,
      );
    (dialog?.querySelector("input") || focusable()[0])?.focus();
    const close = (event) => {
      if (event.key === "Escape" && !checkoutBusy) {
        setOverlay(null);
        setInfo(null);
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0],
        last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [overlay, info, checkoutBusy]);

  function notify(message) {
    setToast(message);
  }
  function home() {
    setFavoritesOnly(false);
    setCategory("All finds");
    setSearch("");
    setView("shop");
    setAccountMenu(false);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function browse(nextCategory = "All finds") {
    setCategory(nextCategory);
    setSearch("");
    setFavoritesOnly(false);
    setView("shop");
    setMobileMenu(false);
    setTimeout(
      () =>
        catalogRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      50,
    );
  }
  function showAuth(role = "buyer", mode = "signup") {
    setAuthRole(role);
    setAuthMode(mode);
    setOverlay("auth");
    setAccountMenu(false);
    setMobileMenu(false);
  }
  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function addToCart(product, quantity = 1) {
    if (!product.stock) {
      notify("This find is currently out of stock.");
      return;
    }
    const cartId = `${product.id}:${product.selectedColor || "default"}`;
    const inCart = cart
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);
    if (inCart >= product.stock) {
      notify("You have all the available stock in your bag.");
      return;
    }
    const amount = Math.min(quantity, product.stock - inCart);
    setCart((current) => {
      const existing = current.find((item) => item.cartId === cartId);
      return existing
        ? current.map((item) =>
            item.cartId === cartId
              ? { ...item, quantity: item.quantity + amount }
              : item,
          )
        : [...current, { ...product, cartId, quantity: amount }];
    });
    notify(`${product.name} added to your bag`);
  }
  function updateQuantity(cartId, quantity) {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => (item.cartId || item.id) !== cartId)
        : current.map((item) => {
            if ((item.cartId || item.id) !== cartId) return item;
            const others = current
              .filter(
                (other) =>
                  other.id === item.id && (other.cartId || other.id) !== cartId,
              )
              .reduce((sum, other) => sum + other.quantity, 0);
            return {
              ...item,
              quantity: Math.min(quantity, Math.max(1, item.stock - others)),
            };
          }),
    );
  }
  function viewProduct(product) {
    setSelectedProduct(product);
    setOverlay("product");
  }
  async function authenticate(data) {
    const account =
      data.mode === "demo"
        ? await api.signIn({ ...data, password: "demo-access" })
        : await (data.mode === "signup" ? api.signUp(data) : api.signIn(data));
    setUser(account);
    setOverlay(null);
    notify(
      `Welcome ${account.name?.split(" ")[0] || "to Nook"}! Make yourself at home.`,
    );
    api
      .getOrders()
      .then(setOrders)
      .catch(() => {});
    if (account.role === "seller" || account.role === "admin") {
      setView(account.role);
      window.scrollTo(0, 0);
    }
  }
  async function addProduct(fields) {
    const product = await api.createProduct({
      ...fields,
      seller: user?.name || "Your shop",
    });
    setProducts((current) => [product, ...current]);
    notify("Your new find is live in the shop.");
    return product;
  }
  async function updateProduct(id, fields) {
    const product = await api.updateProduct(id, fields);
    setProducts((current) =>
      current.map((item) => (item.id === id ? product : item)),
    );
    notify("Product updated. Looking good!");
    return product;
  }
  async function deleteProduct(id) {
    await api.deleteProduct(id);
    setProducts((current) => current.filter((item) => item.id !== id));
    setCart((current) => current.filter((item) => item.id !== id));
    notify("Product removed from your shop.");
  }
  async function placeOrder(data) {
    setCheckoutBusy(true);
    try {
      const order = await api.createOrder({
        ...data,
        userId: user?.id || "guest",
      });
      const completeOrder = { ...data, ...order };
      setOrders((current) => [completeOrder, ...current]);
      setLastOrder(completeOrder);
      setCart([]);
      setOverlay("success");
      api
        .getProducts()
        .then(setProducts)
        .catch(() => {});
    } finally {
      setCheckoutBusy(false);
    }
  }
  function openFavorites() {
    setView("shop");
    setFavoritesOnly(true);
    setCategory("All finds");
    setSearch("");
    setTimeout(
      () => catalogRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }
  async function logout() {
    await api.signOut();
    setUser(null);
    setOrders([]);
    setView("shop");
    setAccountMenu(false);
    notify("You’re signed out. See you around!");
  }
  const visibleProducts = products
    .filter(
      (product) =>
        (category === "All finds" || product.category === category) &&
        (!favoritesOnly || favorites.includes(product.id)) &&
        `${product.name} ${product.category} ${product.seller}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "rating"
            ? b.rating - a.rating
            : Number(b.featured || false) - Number(a.featured || false),
    );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const story = () =>
    setInfo({
      title: "Good things, from good people.",
      text: "We believe the things you bring home should mean a little more. Nook brings together independent makers and thoughtful everyday objects — a place to discover your style, support small shops, and find things you’ll love for years.",
    });

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <div className="page-width">
          <span>
            <LuLeaf /> A little better, every day.
          </span>
          <span>Good finds. Independent minds.</span>
          <span>
            <FiTruck /> Free shipping on orders $100+
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="header-inner page-width">
          <Brand onClick={home} />
          <nav className="desktop-nav" aria-label="Main navigation">
            <button
              className={view === "shop" && !favoritesOnly ? "active" : ""}
              onClick={home}
            >
              Discover
            </button>
            <button onClick={() => browse()}>Shop all</button>
            <button onClick={story}>Our story</button>
            <button
              className="seller-nav"
              onClick={() =>
                user?.role === "seller" ? setView("seller") : showAuth("seller")
              }
            >
              Become a seller <FiArrowUpRight />
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search products"
              onClick={() => {
                browse();
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
            >
              <FiSearch />
            </button>
            <button
              className={`icon-button ${favoritesOnly ? "action-active" : ""}`}
              aria-label={`View ${favorites.length} favorites`}
              onClick={openFavorites}
            >
              <FiHeart />
              {favorites.length > 0 && <i className="tiny-dot" />}
            </button>
            <div className="account-wrap">
              <button
                className="icon-button"
                aria-label={
                  user ? "Open account menu" : "Sign in or create account"
                }
                onClick={() =>
                  user
                    ? setAccountMenu(!accountMenu)
                    : showAuth("buyer", "signin")
                }
              >
                <FiUser />
                {user && <i className="tiny-dot" />}
              </button>
              {accountMenu && (
                <>
                  <button
                    className="account-dismiss"
                    aria-label="Close account menu"
                    onClick={() => setAccountMenu(false)}
                  />
                  <div className="account-menu">
                    <p>
                      Hi, {user.name?.split(" ")[0]}{" "}
                      <span>{user.role} account</span>
                    </p>
                    <button
                      onClick={() => {
                        setView("buyer");
                        setAccountMenu(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <FiShoppingBag /> My orders & saved finds
                    </button>
                    {user.role !== "buyer" && (
                      <button
                        onClick={() => {
                          setView(user.role);
                          setAccountMenu(false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <FiGrid />{" "}
                        {user.role === "admin"
                          ? "Admin dashboard"
                          : "Seller dashboard"}
                      </button>
                    )}
                    <button onClick={logout}>
                      <FiLogOut /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
            <span className="header-divider" />
            <button
              className="bag-button"
              aria-label={`Open shopping bag, ${cartCount} items`}
              onClick={() => setOverlay("cart")}
            >
              <FiShoppingBag />
              <span className="bag-label">Bag</span>
              <span className="bag-count">{cartCount}</span>
            </button>
            <button
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <button onClick={home}>Discover</button>
            <button onClick={() => browse()}>Shop all</button>
            <button
              onClick={() => {
                story();
                setMobileMenu(false);
              }}
            >
              Our story
            </button>
            <button onClick={() => showAuth("seller")}>
              Become a seller <FiArrowUpRight />
            </button>
          </nav>
        )}
      </header>

      {view === "shop" ? (
        <main id="main-content">
          <section className="hero page-width">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span /> CURATED FINDS. EVERYDAY JOY.
              </div>
              <h1>
                A little more you.
                <br />A lot more <em>home.</em>
              </h1>
              <p>
                Thoughtful pieces for the spaces you love.
                <br className="desktop-break" /> Discover something that feels
                like you.
              </p>
              <button className="primary-button" onClick={() => browse()}>
                Explore the collection <FiArrowRight />
              </button>
              <div className="hero-social">
                <div className="mini-avatars">
                  <span>J</span>
                  <span>A</span>
                  <span>♡</span>
                </div>
                <div>
                  <div className="hero-stars">
                    ★★★★★ <b>4.9/5</b>
                  </div>
                  <span>Loved by 2,000+ happy homes</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img
                className="hero-photo"
                src="/images/bright-home.jpg"
                alt="A thoughtfully styled living room with warm, natural furniture"
              />
              <div className="hero-image-tint" />
              <div className="hero-seal">
                <FiSun />
                <span>
                  GOOD THINGS
                  <br />
                  LIVE HERE
                </span>
              </div>
              <button
                className="hero-image-card"
                onClick={() => browse("Furniture")}
              >
                <span className="image-card-icon">
                  <LuArmchair />
                </span>
                <span>
                  <small>MAKE ROOM FOR THE GOOD</small>
                  <b>The everyday living edit</b>
                </span>
                <FiArrowUpRight />
              </button>
              <span className="hero-photo-caption pointer-events-none">
                A slower pace. A softer space.
              </span>
            </div>
          </section>
          <section
            className="benefits page-width"
            aria-label="Shopping benefits"
          >
            <div>
              <FiTruck />
              <span>
                <b>A little delivery joy</b>
                <small>Free shipping over $100</small>
              </span>
            </div>
            <div>
              <LuLeaf />
              <span>
                <b>Thoughtfully selected</b>
                <small>Good quality. Great design.</small>
              </span>
            </div>
            <div>
              <FiShield />
              <span>
                <b>Shop with confidence</b>
                <small>Secure & simple checkout</small>
              </span>
            </div>
            <div>
              <FiPackage />
              <span>
                <b>Love it, or return it</b>
                <small>Easy 30-day returns</small>
              </span>
            </div>
          </section>
          <section className="catalog-section page-width" ref={catalogRef}>
            <div className="section-heading" data-reveal>
              <div>
                <span className="eyebrow">THE GOOD STUFF</span>
                <h2>
                  {favoritesOnly
                    ? "Your saved little favorites."
                    : "Your space. Your style."}
                </h2>
                <p>
                  {favoritesOnly
                    ? "A few things you’ve got your eye on."
                    : "Everyday essentials with a little extra personality."}
                </p>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setCategory("All finds");
                  setSearch("");
                  setFavoritesOnly(false);
                  setSort("recommended");
                }}
              >
                View all products <FiArrowUpRight />
              </button>
            </div>
            <div className="catalog-controls">
              <div
                className="category-tabs"
                role="group"
                aria-label="Product category"
              >
                {["All finds", ...categories].map((name) => {
                  const Icon = categoryIcons[name] || FiGrid;
                  return (
                    <button
                      key={name}
                      className={category === name ? "selected" : ""}
                      onClick={() => setCategory(name)}
                    >
                      <Icon />
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="sort-wrap">
                <FiSliders />
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
                <FiChevronDown />
              </div>
            </div>
            <div className="catalog-search-row">
              <span>
                {loading
                  ? "Finding the good stuff…"
                  : `${visibleProducts.length} thoughtfully chosen ${visibleProducts.length === 1 ? "find" : "finds"}`}
                {favoritesOnly && (
                  <button
                    className="clear-favorite-filter"
                    onClick={() => setFavoritesOnly(false)}
                  >
                    Saved only <FiX />
                  </button>
                )}
              </span>
              <label className="catalog-search">
                <FiSearch />
                <input
                  ref={searchRef}
                  aria-label="Search the collection"
                  value={search}
                  placeholder="Find your next favorite"
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </label>
            </div>
            {loadError ? (
              <div className="catalog-empty">
                <FiHelpCircle />
                <h3>We couldn’t load the collection.</h3>
                <p>{loadError}</p>
                <button
                  className="primary-button"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="product-grid grid grid-cols-2 min-[651px]:grid-cols-3 min-[901px]:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="product-skeleton" />
                ))}
              </div>
            ) : visibleProducts.length ? (
              <div className="product-grid grid grid-cols-2 min-[651px]:grid-cols-3 min-[901px]:grid-cols-4">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    {...{ product, index }}
                    onView={viewProduct}
                    onAdd={addToCart}
                    onFavorite={toggleFavorite}
                    favorite={favorites.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <FiSearch />
                <h3>No finds just yet.</h3>
                <p>
                  {favoritesOnly
                    ? "Tap a heart on something you love, and it’ll be waiting here."
                    : "Try another search or explore a different category."}
                </p>
                <button className="text-link" onClick={() => browse()}>
                  Explore all finds <FiArrowRight />
                </button>
              </div>
            )}
            <div className="collection-note">
              <LuSprout />
              <span>
                A little character. A lot to love. Always thoughtfully chosen.
              </span>
              <FiArrowDown />
            </div>
          </section>
          <section className="makers-section page-width" data-reveal>
            <div className="makers-image">
              <img
                src="/images/sunlit-living-room.png"
                alt="Thoughtfully crafted home accessories in a sunlit living room"
                loading="lazy"
              />
              <span className="makers-image-label">
                <LuLeaf /> Made with a little more heart.
              </span>
            </div>
            <div className="makers-copy">
              <span className="eyebrow">SMALL SHOPS. BIG HEART.</span>
              <h2>
                Behind every good find,
                <br />
                there’s a good story.
              </h2>
              <p>
                Meet the independent makers, dreamers, and doers bringing a
                little more meaning to your everyday.
              </p>
              <button
                className="light-button"
                onClick={() => showAuth("seller")}
              >
                Bring your shop to Nook <FiArrowUpRight />
              </button>
              <span className="makers-note">
                Your craft. Your corner of the world.
              </span>
            </div>
            <span className="makers-sun">
              <FiSun />
            </span>
          </section>
          <section className="newsletter page-width" data-reveal>
            <div>
              <span className="eyebrow">A NOTE FROM NOOK</span>
              <h2>Good things come to your inbox.</h2>
              <p>
                Fresh finds, little inspirations, and a few things just for you.
              </p>
            </div>
            {newsletter ? (
              <div className="newsletter-success">
                <FiCheckCircle />
                <span>You’re on the list. Make yourself at home!</span>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setNewsletter(true);
                  notify(
                    "You’re on the demo mailing list. Thanks for stopping by!",
                  );
                }}
              >
                <div className="newsletter-input">
                  <input
                    required
                    aria-label="Your email for the newsletter"
                    type="email"
                    placeholder="Your email address"
                  />
                  <button type="submit" aria-label="Join the newsletter">
                    <FiArrowRight />
                  </button>
                </div>
                <small>Just the good stuff. Unsubscribe anytime.</small>
              </form>
            )}
          </section>
        </main>
      ) : view === "buyer" ? (
        <div id="main-content">
          <BuyerAccount
            {...{ user, orders, favorites, products }}
            onView={viewProduct}
            onAdd={addToCart}
            onFavorite={toggleFavorite}
            onShop={home}
          />
        </div>
      ) : (
        <main id="main-content">
          <Dashboard
            role={view}
            {...{ user, products }}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onToast={notify}
            onBackToShop={home}
          />
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-main page-width">
          <div className="footer-brand">
            <Brand onClick={home} />
            <p>
              Good things for your everyday.
              <br />
              From independent minds, to your home.
            </p>
            <span>
              <LuLeaf /> A little more thoughtful.
            </span>
          </div>
          <div>
            <h3>Find your thing</h3>
            {["Furniture", "Lighting", "Decor", "Kitchen"].map((name) => (
              <button key={name} onClick={() => browse(name)}>
                {name}
              </button>
            ))}
          </div>
          <div>
            <h3>Make yourself at home</h3>
            <button onClick={story}>About Nook</button>
            <button onClick={() => showAuth("seller")}>Become a seller</button>
            <button
              onClick={() =>
                setInfo({
                  title: "A little help, whenever you need it.",
                  text: "Questions about a product? You can find maker details on every product page. Nook is currently a frontend demo; customer support and seller messaging will be connected with the backend.",
                })
              }
            >
              Help & contact
            </button>
            <button
              onClick={() =>
                setInfo({
                  title: "Room for a change of heart.",
                  text: "Our demo storefront offers free shipping on orders of $100 or more, and $8 standard shipping on smaller orders. The store concept includes a 30-day return window. Real delivery, returns, and payment policies will be provided by the connected marketplace.",
                })
              }
            >
              Shipping & returns
            </button>
          </div>
          <div className="footer-promise">
            <FiHeart />
            <h3>Little finds. Lasting love.</h3>
            <p>
              Pieces you’ll reach for.
              <br />
              People you’ll feel good supporting.
            </p>
            <button className="text-link" onClick={story}>
              That’s the Nook way <FiArrowUpRight />
            </button>
          </div>
        </div>
        <div className="footer-bottom page-width">
          <span>
            © {new Date().getFullYear()} Nook. A little better, together.
          </span>
          <div>
            <button
              onClick={() =>
                setInfo({
                  title: "Your privacy matters.",
                  text: "This frontend demo stores your cart, favorites, demo account, and orders locally in your browser. Passwords are never stored. No real payment information is collected. Clear your browser’s site data to remove demo records.",
                })
              }
            >
              Privacy
            </button>
            <span>·</span>
            <button
              onClick={() =>
                setInfo({
                  title: "A note about this Nook.",
                  text: "Nook is a demonstration marketplace frontend. Products, reviews, shop activity, and checkout are sample data. No real transactions are processed. Buyer, seller, and administrator authorization must be enforced by the backend when connected.",
                })
              }
            >
              Terms
            </button>
          </div>
          <span className="payment-note">
            <FiShield /> Safe & secure shopping
          </span>
        </div>
      </footer>

      {overlay === "auth" && (
        <AuthModal
          initialRole={authRole}
          initialMode={authMode}
          isDemo={!api.API_BASE_URL}
          onClose={() => setOverlay(null)}
          onSubmit={authenticate}
        />
      )}
      {overlay === "cart" && (
        <CartDrawer
          items={cart}
          onClose={() => setOverlay(null)}
          onUpdateQuantity={updateQuantity}
          onRemove={(cartId) =>
            setCart((current) =>
              current.filter((item) => (item.cartId || item.id) !== cartId),
            )
          }
          onCheckout={() => {
            if (cart.length) setOverlay("checkout");
          }}
          checkoutBusy={checkoutBusy}
        />
      )}
      {overlay === "product" && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isWishlisted={favorites.includes(selectedProduct.id)}
          onToggleWishlist={toggleFavorite}
          onAddToCart={addToCart}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === "checkout" && (
        <Checkout
          items={cart}
          user={user}
          onClose={() => !checkoutBusy && setOverlay(null)}
          onPlaceOrder={placeOrder}
          busy={checkoutBusy}
        />
      )}
      {overlay === "success" && (
        <div className="nook-modal-backdrop" onClick={() => setOverlay(null)}>
          <section
            className="info-modal success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setOverlay(null)}
              aria-label="Close confirmation"
            >
              <FiX />
            </button>
            <span className="success-icon">
              <FiCheck />
            </span>
            <span className="eyebrow">A LITTLE HAPPY MAIL</span>
            <h2 id="success-title">Good things are coming.</h2>
            <p>
              {api.API_BASE_URL
                ? "Your order has been received."
                : "Your demo order is placed. No payment was taken."}
            </p>
            <div className="success-order">
              ORDER #{String(lastOrder?.id).slice(-8).toUpperCase()}
              <b>{money(lastOrder?.total || 0)}</b>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                setOverlay(null);
                setView("buyer");
                window.scrollTo(0, 0);
              }}
            >
              View my orders <FiArrowRight />
            </button>
          </section>
        </div>
      )}
      {info && (
        <div className="nook-modal-backdrop" onClick={() => setInfo(null)}>
          <section
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Close information"
              onClick={() => setInfo(null)}
            >
              <FiX />
            </button>
            <LuSprout className="info-sprout" />
            <span className="eyebrow">A LITTLE ABOUT NOOK</span>
            <h2 id="info-title">{info.title}</h2>
            <p>{info.text}</p>
            <button className="primary-button" onClick={() => setInfo(null)}>
              Make yourself at home <FiArrowRight />
            </button>
          </section>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <FiCheckCircle />
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <FiX />
          </button>
        </div>
      )}
    </>
  );
}
