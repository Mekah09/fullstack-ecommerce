import { FiArrowRight, FiCheck } from "react-icons/fi";
import withShop from "./withShop.jsx";
import { money } from "../utils/format.jsx";
import Modal from "./Modal.jsx";

function OrderConfirmation({ shop: { lastOrder, closeOverlay, navigate } }) {
  return (
    <Modal className="info-modal success-modal max-w-lg text-center" titleId="success-title" onClose={closeOverlay} closeLabel="Close confirmation">
      <span className="success-icon mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#eaf0df] text-3xl text-[#547744]"><FiCheck /></span>
      <span className="eyebrow text-[10px] font-semibold tracking-[0.2em] text-[#81916e]">A LITTLE HAPPY MAIL</span>
      <h2 id="success-title" className="mt-3 font-serif text-4xl">Good things are coming.</h2>
      <p className="mt-4 text-sm text-[#7a876e]">Your order has been received.</p>
      <div className="success-order my-6 rounded-lg bg-[#f2f5ec] p-4 text-xs tracking-wider text-[#738360]">{lastOrder?.id && `ORDER #${String(lastOrder.id).slice(-8).toUpperCase()}`}{lastOrder?.total != null && Number.isFinite(Number(lastOrder.total)) && <b className="mt-2 block text-lg tracking-normal text-[#234d39]">{money(Number(lastOrder.total))}</b>}</div>
      <button className="primary-button inline-flex items-center justify-center gap-5 rounded bg-[#234d39] px-5 py-3 text-sm text-white transition hover:bg-[#183e2b]" onClick={() => { closeOverlay(); navigate("/account"); }}>View my orders <FiArrowRight /></button>
    </Modal>
  );
}
export default withShop(OrderConfirmation);
