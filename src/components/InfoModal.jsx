import { FiArrowRight } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import Modal from "./Modal.jsx";

export default function InfoModal({ info, onClose }) {
  return (
    <Modal
      titleId="info-title"
      onClose={onClose}
      closeLabel="Close information"
    >
      <LuSprout className="info-sprout" />
      <span className="eyebrow">A LITTLE ABOUT NOOK</span>
      <h2 id="info-title">{info.title}</h2>
      <p>{info.text}</p>
      <button className="primary-button" onClick={onClose}>
        Make yourself at home <FiArrowRight />
      </button>
    </Modal>
  );
}
