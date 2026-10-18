import { FiArrowRight, FiCheck } from "react-icons/fi";
import withShop from "./withShop.jsx";
import { money } from "../utils/format.jsx";
import Modal from "./Modal.jsx";

function OrderConfirmation({ shop: { lastOrder, closeOverlay, navigate } }) {
  return (
    <Modal
      className="info-modal success-modal"
      titleId="success-title"
      onClose={closeOverlay}
      closeLabel="Close confirmation"
    >
      <span className="success-icon">
        <FiCheck />
      </span>
      <span className="eyebrow">A LITTLE HAPPY MAIL</span>
      <h2 id="success-title">Good things are coming.</h2>
      <p>Your order has been received.</p>
      <div className="success-order">
        {lastOrder?.id &&
          `ORDER #${String(lastOrder.id).slice(-8).toUpperCase()}`}
        {lastOrder?.total != null &&
          Number.isFinite(Number(lastOrder.total)) && (
            <b>{money(Number(lastOrder.total))}</b>
          )}
      </div>
      <button
        className="primary-button"
        onClick={() => {
          closeOverlay();
          navigate("/account");
        }}
      >
        View my orders <FiArrowRight />
      </button>
    </Modal>
  );
}

export default withShop(OrderConfirmation);
