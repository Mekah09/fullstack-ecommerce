import { useState } from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";
import withShop from "./withShop.jsx";
import Modal from "./Modal.jsx";
import ShippingAddressForm from "./ShippingAddressForm.jsx";
import OrderSummary from "./OrderSummary.jsx";

function CheckoutModal({ shop }) {
  const [error, setError] = useState("");
  const { cart, user, closeOverlay, checkoutBusy, placeOrder } = shop;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  async function submit(event) {
    event.preventDefault();
    if (checkoutBusy) return;
    setError("");
    const shippingAddress = Object.fromEntries(new FormData(event.currentTarget));
    try { await placeOrder({ items: cart, shippingAddress }); }
    catch (issue) { setError(issue.message || "We couldn’t place your order. Please try again."); }
  }
  return (
    <Modal className="checkout-modal max-w-2xl" titleId="checkout-heading" onClose={closeOverlay} closeLabel="Close checkout" busy={checkoutBusy}>
      <span className="eyebrow pr-8 text-[10px] font-semibold tracking-[0.18em] text-[#81916e]">ONE STEP CLOSER TO A GOOD FIND</span>
      <h2 id="checkout-heading" className="mt-3 font-serif text-4xl">Make it yours.</h2>
      <p className="demo-note my-5 flex items-start gap-3 rounded-lg bg-[#f0f4e9] p-3 text-xs leading-relaxed text-[#748266]"><FiShield className="mt-0.5 shrink-0" />Review your order and delivery details. The store confirms final prices and delivery fees.</p>
      <form onSubmit={submit}>
        <ShippingAddressForm user={user} />
        <OrderSummary items={cart} subtotal={subtotal} />
        {error && <p className="form-error mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <button className="primary-button checkout-submit flex min-h-12 w-full items-center justify-between rounded bg-[#234d39] px-5 text-sm text-white transition hover:bg-[#183e2b] disabled:opacity-50" disabled={checkoutBusy || cart.length === 0} type="submit">{checkoutBusy ? "Placing your order…" : "Place order"}<FiArrowRight /></button>
      </form>
    </Modal>
  );
}
export default withShop(CheckoutModal);
