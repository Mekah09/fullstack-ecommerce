import { FiArrowRight, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../hooks/useShop";
import { money } from "../../utils/format";
import Modal from "../ui/Modal";

export default function OrderConfirmation() {
  const { isDemo, lastOrder, closeOverlay } = useShop();
  const navigate = useNavigate();
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
      <p>
        {isDemo
          ? "Your demo order is placed. No payment was taken."
          : "Your order has been received."}
      </p>
      <div className="success-order">
        ORDER #{String(lastOrder?.id).slice(-8).toUpperCase()}
        <b>{money(lastOrder?.total || 0)}</b>
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
