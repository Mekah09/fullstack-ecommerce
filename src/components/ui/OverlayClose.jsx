import { FiX } from "react-icons/fi";

export default function OverlayClose({ onClose, label = "Close dialog", className = "" }) {
  return (
    <button
      type="button"
      className={`overlay-close ${className}`}
      aria-label={label}
      onClick={onClose}
    >
      <FiX size={21} />
    </button>
  );
}
