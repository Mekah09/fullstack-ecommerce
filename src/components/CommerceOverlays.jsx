import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiHeart,
  FiLock,
  FiMail,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiStar,
  FiTrash2,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import "./commerce-overlays.css";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value) || 0,
  );
const colorLabel = (color, index) =>
  typeof color === "object"
    ? color.name
    : color.startsWith("#")
      ? `Finish ${index + 1}`
      : color;

function useOverlay(onClose) {
  const panelRef = useRef(null);
  const closeOverlay = useEffectEvent(onClose);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    const initialFocus =
      panel?.querySelector("[data-initial-focus]") ||
      panel?.querySelector(focusableSelector);
    initialFocus?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeOverlay();
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll(focusableSelector)].filter(
        (element) => element.getClientRects().length,
      );
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  return panelRef;
}

function OverlayClose({ onClose, label = "Close dialog", className = "" }) {
  return (
    <button
      type="button"
      className={`overlay-close ${className}`}
      aria-label={label}
      onClick={onClose}
    >
      <FiX size={21} />
    </button>
  );
}

export function AuthModal({
  onClose,
  onSubmit,
  initialMode = "signup",
  initialRole = "buyer",
  isDemo = true,
}) {
  const panelRef = useOverlay(onClose);
  const titleId = useId();
  const descriptionId = useId();
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(
    initialRole === "seller" ? "seller" : "buyer",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const signup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      await onSubmit({
        mode,
        role,
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        password: String(data.get("password") || ""),
      });
    } catch (err) {
      setError(err?.message || "We couldn’t continue. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function exploreAdmin() {
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        mode: "demo",
        role: "admin",
        name: "Alex Morgan",
        email: "admin@nook.demo",
      });
    } catch (err) {
      setError(
        err?.message || "We couldn’t open the admin demo. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function changeMode() {
    setMode(signup ? "signin" : "signup");
    setError("");
  }

  return (
    <div
      className="overlay-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        ref={panelRef}
        tabIndex={-1}
      >
        <OverlayClose onClose={onClose} />
        <div className="auth-brand">
          nook<span>®</span>
        </div>
        <span className="overlay-eyebrow">A little more you.</span>
        <h2 id={titleId}>
          {signup ? "Make yourself at home." : "Welcome back."}
        </h2>
        <p className="auth-intro" id={descriptionId}>
          {signup
            ? "Join a community of good finds and great taste."
            : "Your next favorite find is waiting for you."}
        </p>
        <div
          className="auth-role-switch"
          role="group"
          aria-label="Account type"
        >
          <button
            type="button"
            className={role === "buyer" ? "auth-role active" : "auth-role"}
            aria-pressed={role === "buyer"}
            onClick={() => setRole("buyer")}
            disabled={busy}
          >
            <FiShoppingBag />
            <span>
              I’m here to shop<small>Discover something good</small>
            </span>
            {role === "buyer" && <FiCheck className="auth-role-check" />}
          </button>
          <button
            type="button"
            className={role === "seller" ? "auth-role active" : "auth-role"}
            aria-pressed={role === "seller"}
            onClick={() => setRole("seller")}
            disabled={busy}
          >
            <FiPackage />
            <span>
              I’m here to sell<small>Share what you create</small>
            </span>
            {role === "seller" && <FiCheck className="auth-role-check" />}
          </button>
        </div>
        {isDemo && (
          <p className="auth-demo-note">
            <span>DEMO EXPERIENCE</span> Explore with a local demo account. No
            real account is created. Use a sample password.
          </p>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          {signup && (
            <label>
              Full name
              <div className="auth-input-wrap">
                <FiUser />
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                  maxLength={80}
                  data-initial-focus
                />
              </div>
            </label>
          )}
          <label>
            Email address
            <div className="auth-input-wrap">
              <FiMail />
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                data-initial-focus={!signup ? true : undefined}
              />
            </div>
          </label>
          <label>
            Password
            <div className="auth-input-wrap">
              <FiLock />
              <input
                type="password"
                name="password"
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder={signup ? "At least 8 characters" : "Your password"}
                minLength={signup ? 8 : undefined}
                required
              />
            </div>
          </label>
          {error && (
            <p className="overlay-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="overlay-primary auth-submit"
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Just a moment…"
              : signup
                ? isDemo
                  ? "Create demo account"
                  : "Create account"
                : isDemo
                  ? "Enter demo account"
                  : "Sign in"}
            <FiArrowRight />
          </button>
        </form>
        <p className="auth-switch">
          {signup
            ? "Already part of the neighborhood?"
            : "New to the neighborhood?"}{" "}
          <button type="button" onClick={changeMode} disabled={busy}>
            {signup ? "Sign in" : "Join Nook"}
          </button>
        </p>
        {isDemo && (
          <div className="auth-admin">
            <button type="button" onClick={exploreAdmin} disabled={busy}>
              Explore admin demo <FiArrowRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function CartDrawer({
  items = [],
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  checkoutBusy = false,
}) {
  const panelRef = useOverlay(onClose);
  const titleId = useId();
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shipping = subtotal >= 100 || !items.length ? 0 : 8;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const remaining = Math.max(100 - subtotal, 0);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setError("");
    try {
      await onCheckout();
    } catch (err) {
      setError(
        err?.message || "Checkout couldn’t be opened. Please try again.",
      );
    }
  }

  return (
    <div
      className="overlay-backdrop overlay-drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="cart-header">
          <div>
            <span className="overlay-eyebrow">GOOD FINDS, ALL YOURS</span>
            <h2 id={titleId}>
              Your bag <span>{count}</span>
            </h2>
          </div>
          <OverlayClose onClose={onClose} label="Close shopping bag" />
        </header>
        {items.length ? (
          <>
            <div className="cart-shipping">
              <p>
                <FiTruck />
                {remaining > 0 ? (
                  <span>
                    You’re <strong>{money(remaining)}</strong> away from free
                    shipping.
                  </span>
                ) : (
                  <span>
                    A little perk: <strong>your shipping is on us.</strong>
                  </span>
                )}
              </p>
              <div className="cart-progress">
                <span
                  style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="cart-items">
              {items.map((item) => {
                const cartId = item.cartId || item.id;
                return (
                  <article className="cart-item" key={cartId}>
                    <img src={item.image} alt={item.name || item.title} />
                    <div className="cart-item-details">
                      <span className="cart-category">
                        {item.category}
                        {item.selectedFinish ? ` · ${item.selectedFinish}` : ""}
                      </span>
                      <h3>{item.name || item.title}</h3>
                      <p className="cart-item-price">{money(item.price)}</p>
                      <div className="cart-item-controls">
                        <div className="overlay-quantity">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name || item.title}`}
                            onClick={() =>
                              onUpdateQuantity(cartId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span aria-label={`Quantity ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name || item.title}`}
                            onClick={() =>
                              onUpdateQuantity(cartId, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >=
                              (typeof item.stock === "number" ? item.stock : 99)
                            }
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => onRemove(cartId)}
                          aria-label={`Remove ${item.name || item.title} from bag`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <strong className="cart-line-total">
                      {money(item.price * item.quantity)}
                    </strong>
                  </article>
                );
              })}
            </div>
            <footer className="cart-footer">
              <div className="cart-summary-line">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="cart-summary-line">
                <span>Shipping</span>
                <span>
                  {shipping ? (
                    money(shipping)
                  ) : (
                    <span className="cart-free">On us</span>
                  )}
                </span>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span>
                  {money(subtotal + shipping)} <small>USD</small>
                </span>
              </div>
              <p className="cart-tax-note">
                Any applicable taxes are calculated at checkout.
              </p>
              {error && (
                <p className="overlay-error" role="alert">
                  {error}
                </p>
              )}
              <button
                type="button"
                className="overlay-primary cart-checkout"
                onClick={handleCheckout}
                disabled={checkoutBusy}
              >
                {checkoutBusy ? "Preparing checkout…" : "Continue to checkout"}
                <FiArrowRight />
              </button>
              <button
                type="button"
                className="cart-keep-shopping"
                onClick={onClose}
              >
                A little more browsing
              </button>
            </footer>
          </>
        ) : (
          <div className="cart-empty">
            <span className="cart-empty-icon">
              <FiShoppingBag />
            </span>
            <span className="overlay-eyebrow">ROOM FOR SOMETHING GOOD</span>
            <h3>Your bag’s feeling a little empty.</h3>
            <p>
              Thoughtful things for your everyday are just around the corner.
            </p>
            <button type="button" className="overlay-primary" onClick={onClose}>
              Find your next favorite
              <FiArrowRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function ProductModal(props) {
  return props.product ? (
    <ProductDetails key={props.product.id} {...props} />
  ) : null;
}

function ProductDetails({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) {
  const panelRef = useOverlay(onClose);
  const titleId = useId();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const stock = typeof product.stock === "number" ? product.stock : 99;
  const name = product.name || product.title;
  const rating = Number.isFinite(Number(product.rating))
    ? Math.max(0, Math.min(5, Number(product.rating)))
    : 4.8;
  const colors = product.colors || [];
  const [selectedColor, setSelectedColor] = useState(
    colors[0]?.name || colors[0] || "",
  );

  async function addToBag() {
    setError("");
    try {
      const selectedIndex = colors.findIndex(
        (color) => (color.name || color) === selectedColor,
      );
      await onAddToCart(
        selectedIndex >= 0
          ? {
              ...product,
              selectedColor,
              selectedFinish: colorLabel(colors[selectedIndex], selectedIndex),
            }
          : product,
        quantity,
      );
      setAdded(true);
    } catch (err) {
      setError(err?.message || "We couldn’t add this item. Please try again.");
    }
  }

  return (
    <div
      className="overlay-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <OverlayClose onClose={onClose} />
        <div className="detail-image">
          <img src={product.image} alt={name} />
          {product.badge && (
            <span className="detail-badge">{product.badge}</span>
          )}
          <span className="detail-image-note">Made for the everyday.</span>
        </div>
        <div className="detail-content">
          <span className="overlay-eyebrow">{product.category}</span>
          <h2 id={titleId}>{name}</h2>
          <div className="detail-rating">
            <span aria-label={`${rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={
                    star <= Math.round(rating) ? "detail-star-filled" : ""
                  }
                />
              ))}
            </span>
            <strong>{rating.toFixed(1)}</strong>
            <span className="detail-review-count">
              ({product.reviews || product.reviewCount || 0} reviews)
            </span>
          </div>
          <div className="detail-price">
            {money(product.price)}
            {product.originalPrice > product.price && (
              <del>{money(product.originalPrice)}</del>
            )}
          </div>
          <p className="detail-description">
            {product.description ||
              "A thoughtful addition to your everyday. Beautifully considered, easy to love, and ready for a place in your home."}
          </p>
          {colors.length > 0 && (
            <div className="detail-colors">
              <p>
                Color{" "}
                <strong>
                  {colorLabel(
                    colors.find(
                      (color) => (color.name || color) === selectedColor,
                    ) || colors[0],
                    colors.findIndex(
                      (color) => (color.name || color) === selectedColor,
                    ),
                  )}
                </strong>
              </p>
              <div role="group" aria-label="Choose a color">
                {colors.map((color, index) => {
                  const colorName = color.name || color;
                  return (
                    <button
                      type="button"
                      key={colorName}
                      className={
                        selectedColor === colorName
                          ? "detail-color selected"
                          : "detail-color"
                      }
                      aria-label={colorLabel(color, index)}
                      aria-pressed={selectedColor === colorName}
                      onClick={() => {
                        setSelectedColor(colorName);
                        setAdded(false);
                      }}
                      style={{
                        "--swatch": color.hex || color.value || colorName,
                      }}
                    >
                      <span />
                      {selectedColor === colorName && <FiCheck />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <p className={`detail-stock ${stock === 0 ? "unavailable" : ""}`}>
            <span />
            {stock === 0
              ? "Currently out of stock"
              : stock <= 5
                ? `Just ${stock} left in stock`
                : "In stock and ready for you"}
          </p>
          <div className="detail-add-row">
            <div className="overlay-quantity detail-quantity">
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.max(1, value - 1));
                  setAdded(false);
                }}
                disabled={quantity <= 1 || !stock}
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.min(stock, value + 1));
                  setAdded(false);
                }}
                disabled={quantity >= stock || !stock}
                aria-label="Increase quantity"
              >
                <FiPlus />
              </button>
            </div>
            <button
              type="button"
              className="overlay-primary detail-add"
              disabled={!stock}
              onClick={addToBag}
            >
              {added ? <FiCheck /> : <FiShoppingBag />}
              {!stock
                ? "Sold out"
                : added
                  ? "Add another to bag"
                  : "Add to bag"}
            </button>
            <button
              type="button"
              className={`detail-wishlist ${isWishlisted ? "active" : ""}`}
              onClick={() => onToggleWishlist(product.id)}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Save to wishlist"
              }
              aria-pressed={isWishlisted}
            >
              <FiHeart />
            </button>
          </div>
          {added && (
            <p className="detail-added" role="status">
              <FiCheckCircle /> A good choice. Added to your bag.
            </p>
          )}
          {error && (
            <p className="overlay-error" role="alert">
              {error}
            </p>
          )}
          <div className="detail-perks">
            <div>
              <FiTruck />
              <span>
                <strong>A little something on us</strong>Free shipping on orders
                $100+
              </span>
            </div>
            <div>
              <FiPackage />
              <span>
                <strong>Find your perfect fit</strong>Explore more thoughtful
                everyday essentials
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
