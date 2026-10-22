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
import { hasStockLimit } from "../utils/cart.jsx";

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
        className="overlay-backdrop overlay-drawer-backdrop fixed inset-0 z-50 flex justify-end bg-[#17291f]/45 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) this.close();
        }}
      >
        <DialogPanel
          className="cart-drawer flex h-dvh w-full max-w-lg flex-col overflow-y-auto bg-[#fffefa] shadow-2xl"
          titleId={titleId}
          onClose={this.close}
          busy={checkoutBusy}
        >
          <header className="cart-header flex items-center justify-between border-b border-[#e6e8de] px-6 py-6 sm:px-8 [&_h2]:mt-2 [&_h2]:font-serif [&_h2]:text-3xl [&_h2>span]:ml-2 [&_h2>span]:font-sans [&_h2>span]:text-sm [&_h2>span]:text-[#7c8873]">
            <div>
              <span className="overlay-eyebrow text-[10px] font-semibold tracking-[0.2em] text-[#7d896f]">GOOD FINDS, ALL YOURS</span>
              <h2 id={titleId}>
                Your bag <span>{count}</span>
              </h2>
            </div>
            <OverlayClose onClose={this.close} label="Close shopping bag" />
          </header>
          {items.length ? (
            <>
              <div className="cart-items flex-1 px-6 sm:px-8">
                {items.map((item) => {
                  const cartId = item.cartId || item.id;
                  const productQuantity = items
                    .filter((other) => other.id === item.id)
                    .reduce((sum, other) => sum + other.quantity, 0);
                  return (
                    <article className="cart-item relative grid grid-cols-[80px_1fr] gap-4 border-b border-[#e6e8de] py-6 sm:grid-cols-[90px_1fr] [&>img]:h-28 [&>img]:w-full [&>img]:rounded-lg [&>img]:object-cover [&>.product-image-placeholder]:h-28 [&>.product-image-placeholder]:rounded-lg [&>.product-image-placeholder]:bg-[#f0f1ea]" key={cartId}>
                      <ProductImage
                        src={item.image}
                        alt={item.name || item.title}
                      />
                      <div className="cart-item-details min-w-0 pr-12 [&_h3]:mt-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:leading-relaxed">
                        <span className="cart-category block text-[10px] uppercase tracking-wider text-[#7f8877]">
                          {item.category}
                          {item.selectedFinish
                            ? ` · ${item.selectedFinish}`
                            : ""}
                        </span>
                        <h3>{item.name || item.title}</h3>
                        <p className="cart-item-price mt-2 text-xs text-[#68785d]">{money(item.price)}</p>
                        <div className="cart-item-controls mt-3 flex items-center gap-4">
                          <div className="overlay-quantity flex items-center rounded border border-[#dce2d4] bg-white [&_button]:grid [&_button]:h-8 [&_button]:w-8 [&_button]:place-items-center [&_button]:text-[#526247] [&_button]:transition [&_button]:hover:bg-[#edf1e7] [&_button]:disabled:opacity-35 [&_span]:min-w-7 [&_span]:text-center [&_span]:text-xs">
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
                                productQuantity >=
                                (hasStockLimit(item.stock)
                                  ? item.stock
                                  : Number.MAX_SAFE_INTEGER)
                              }
                            >
                              <FiPlus />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-remove grid h-8 w-8 place-items-center text-[#8e9686] transition hover:text-red-700"
                            onClick={() => onRemove(cartId)}
                            aria-label={`Remove ${item.name || item.title} from bag`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <strong className="cart-line-total absolute right-0 top-7 text-xs font-medium">
                        {money(item.price * item.quantity)}
                      </strong>
                    </article>
                  );
                })}
              </div>
              <footer className="cart-footer border-t border-[#e0e5d8] bg-[#f6f7f0] px-6 py-6 sm:px-8">
                <div className="cart-summary-line mb-3 flex items-center justify-between gap-4 text-xs [&>span:last-child]:text-right [&>span:last-child]:font-medium">
                  <span>Estimated subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="cart-summary-line mb-3 flex items-center justify-between gap-4 text-xs [&>span:last-child]:text-right [&>span:last-child]:font-medium">
                  <span>Shipping</span>
                  <span>Calculated by the store</span>
                </div>
                <p className="cart-tax-note mb-5 text-[11px] leading-relaxed text-[#858e7b]">
                  Any applicable taxes are calculated at checkout.
                </p>
                {error && (
                  <p className="overlay-error my-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-700" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  className="overlay-primary cart-checkout flex min-h-12 w-full items-center justify-between gap-3 rounded bg-[#234d39] px-5 py-3 text-sm text-white transition hover:bg-[#183e2b] disabled:cursor-wait disabled:opacity-50"
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
                  className="cart-keep-shopping mt-4 w-full text-center text-xs text-[#6b7d5b] underline decoration-[#b0ba9e] underline-offset-4 hover:text-[#234d39]"
                  onClick={this.close}
                >
                  A little more browsing
                </button>
              </footer>
            </>
          ) : (
            <div className="cart-empty flex flex-1 flex-col items-center justify-center px-8 py-16 text-center [&_h3]:mt-4 [&_h3]:font-serif [&_h3]:text-3xl [&_p]:mt-3 [&_p]:max-w-72 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[#7b8770]">
              <span className="cart-empty-icon mb-7 grid h-20 w-20 place-items-center rounded-full bg-[#edf1e6] text-3xl text-[#718264]">
                <FiShoppingBag />
              </span>
              <span className="overlay-eyebrow text-[10px] font-semibold tracking-[0.2em] text-[#7d896f]">ROOM FOR SOMETHING GOOD</span>
              <h3>Your bag’s feeling a little empty.</h3>
              <p>
                Thoughtful things for your everyday are just around the corner.
              </p>
              <button
                type="button"
                className="overlay-primary mt-7 inline-flex items-center justify-center gap-4 rounded bg-[#234d39] px-5 py-3 text-sm text-white transition hover:bg-[#183e2b]"
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
