import { useId, useState } from "react";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import useOverlay from "../hooks/useOverlay.jsx";
import { money } from "../utils/format.jsx";
import OverlayClose from "./OverlayClose.jsx";
import "./commerce-overlays.css";

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
