import { money } from "../utils/format.jsx";

export default function OrderSummary({ items, subtotal, shipping }) {
  return (
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
  );
}
