import { Component } from "react";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";
import { money } from "../utils/format.jsx";
import OverlayClose from "./OverlayClose.jsx";
import ProductImage from "./ProductImage.jsx";
import "./commerce-overlays.css";

let nextCartId = 0;

export class CartDrawer extends Component {
  titleId = `cart-title-${++nextCartId}`;

  state = { error: "" };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  close = () => {
    if (!this.props.checkoutBusy) this.props.onClose();
  };

  handleCheckout = async () => {
    if (this.props.checkoutBusy) return;
    this.setState({ error: "" });
    try {
      await this.props.onCheckout();
    } catch (err) {
      if (this.mounted) {
        this.setState({
          error:
            err?.message || "Checkout couldn’t be opened. Please try again.",
        });
      }
    }
  };

  render() {
    const {
      items = [],
      onUpdateQuantity,
      onRemove,
      checkoutBusy = false,
    } = this.props;
    const { titleId } = this;
    const { error } = this.state;
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <div
        className="overlay-backdrop overlay-drawer-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) this.close();
        }}
      >
        <DialogPanel
          className="cart-drawer"
          titleId={titleId}
          onClose={this.close}
          busy={checkoutBusy}
        >
          <header className="cart-header">
            <div>
              <span className="overlay-eyebrow">GOOD FINDS, ALL YOURS</span>
              <h2 id={titleId}>
                Your bag <span>{count}</span>
              </h2>
            </div>
            <OverlayClose onClose={this.close} label="Close shopping bag" />
          </header>
          {items.length ? (
            <>
              <div className="cart-items">
                {items.map((item) => {
                  const cartId = item.cartId || item.id;
                  return (
                    <article className="cart-item" key={cartId}>
                      <ProductImage
                        src={item.image}
                        alt={item.name || item.title}
                      />
                      <div className="cart-item-details">
                        <span className="cart-category">
                          {item.category}
                          {item.selectedFinish
                            ? ` · ${item.selectedFinish}`
                            : ""}
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
                                (typeof item.stock === "number"
                                  ? item.stock
                                  : 99)
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
                  <span>Estimated subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="cart-summary-line">
                  <span>Shipping</span>
                  <span>Calculated by the store</span>
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
                  onClick={this.handleCheckout}
                  disabled={checkoutBusy}
                >
                  {checkoutBusy
                    ? "Preparing checkout…"
                    : "Continue to checkout"}
                  <FiArrowRight />
                </button>
                <button
                  type="button"
                  className="cart-keep-shopping"
                  onClick={this.close}
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
              <button
                type="button"
                className="overlay-primary"
                onClick={this.close}
              >
                Find your next favorite
                <FiArrowRight />
              </button>
            </div>
          )}
        </DialogPanel>
      </div>
    );
  }
}
