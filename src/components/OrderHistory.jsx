import { FiArrowRight, FiCheckCircle, FiPackage, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { money } from "../utils/format.jsx";

export default function OrderHistory({ orders = [], loading = false, error = "" }) {
  return (
    <section className="buyer-orders my-10 rounded-xl border border-[#e2e7d9] bg-white p-5 sm:p-7">
      <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl"><FiPackage className="text-lg text-[#7e9367]" />Your orders <span className="ml-1 rounded-full bg-[#edf2e6] px-2 py-1 font-sans text-xs text-[#71855e]">{orders.length}</span></h2>
      {loading ? <p className="muted py-8 text-sm text-[#819071]" role="status">Finding your orders…</p> : error ? <p className="form-error rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900" role="alert">{error}</p> : orders.length ? orders.map((order) => (
        <article className="buyer-order flex flex-wrap items-center justify-between gap-4 border-t border-[#e7ebdf] py-5 text-sm" key={order.id}>
          <div><b className="font-medium">Order #{String(order.id).slice(-8).toUpperCase()}</b><p className="mt-2 text-xs text-[#8a957d]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-NG") : "Just placed"} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div>
          <span className="order-status inline-flex items-center gap-2 rounded-full bg-[#edf3e5] px-3 py-2 text-[11px] text-[#6a8255]"><FiCheckCircle />{order.status || "Received"}</span>
          <strong className="font-medium">{money(order.total)}</strong>
        </article>
      )) : <div className="buyer-empty flex flex-col items-center py-12 text-center"><FiShoppingBag className="mb-5 text-4xl text-[#a2b28c]" /><h3 className="font-serif text-2xl">Your next favorite is waiting.</h3><p className="mt-3 text-sm text-[#859178]">When you place an order, you’ll find it right here.</p><Link className="primary-button mt-6 inline-flex items-center gap-4 rounded bg-[#234d39] px-5 py-3 text-sm text-white transition hover:bg-[#183e2b]" to="/products">Find something good <FiArrowRight /></Link></div>}
    </section>
  );
}
