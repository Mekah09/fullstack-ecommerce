import { money } from "../utils/format.jsx";

export default function OrderSummary({ items, subtotal }) {
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
        <b>Calculated by the store</b>
      </div>
      <div className="checkout-total">
        <span>Estimated subtotal</span>
        <b>{money(subtotal)}</b>
      </div>
    </div>
  );
}
