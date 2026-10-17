import { useState } from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { useShop } from "../../hooks/useShop";
import Modal from "../ui/Modal";
import ShippingAddressForm from "./ShippingAddressForm";
import OrderSummary from "./OrderSummary";

export default function CheckoutModal() {
  const { cart, user, isDemo, closeOverlay, placeOrder, checkoutBusy } =
    useShop();
  const [error, setError] = useState("");
  const subtotal = cart.reduce(
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
      await placeOrder({
        items: cart,
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
    <Modal
      className="checkout-modal"
      titleId="checkout-heading"
      onClose={closeOverlay}
      closeLabel="Close checkout"
      busy={checkoutBusy}
    >
      <span className="eyebrow">ONE STEP CLOSER TO A GOOD FIND</span>
      <h2 id="checkout-heading">Make it yours.</h2>
      <p className="demo-note">
        <FiShield />
        {isDemo
          ? "Demo checkout · No payment will be collected."
          : "Review your order and delivery details."}
      </p>
      <form onSubmit={submit}>
        <ShippingAddressForm user={user} />
        <OrderSummary items={cart} subtotal={subtotal} shipping={shipping} />
        {error && (
          <p className="form-error text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          className="primary-button checkout-submit"
          disabled={checkoutBusy}
          type="submit"
        >
          {checkoutBusy
            ? "Placing your order…"
            : isDemo
              ? "Place demo order"
              : "Place order"}
          <FiArrowRight />
        </button>
      </form>
    </Modal>
  );
}
