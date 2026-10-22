import { money } from "../utils/format.jsx";

export default function OrderSummary({ items, subtotal }) {
  return (
    <div className="checkout-summary my-6 rounded-lg bg-[#f3f5ed] px-4 py-2 text-xs [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:gap-4 [&>div]:py-3 [&_small]:ml-1 [&_small]:text-[#8a957e] [&_b]:shrink-0 [&_b]:font-medium">
      {items.map((item) => <div key={item.cartId || item.id}><span>{item.name} <small>× {item.quantity}</small></span><b>{money(item.price * item.quantity)}</b></div>)}
      <div><span>Shipping</span><b>Calculated by the store</b></div>
      <div className="checkout-total border-t border-[#dce3d2] text-sm"><span>Estimated subtotal</span><b>{money(subtotal)}</b></div>
    </div>
  );
}
