import { FiX } from "react-icons/fi";

export default function OverlayClose({ onClose, label = "Close dialog", className = "" }) {
  return (
    <button type="button" className={`overlay-close grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#64745a] transition hover:bg-[#eef2e8] hover:text-[#234d39] ${className}`} aria-label={label} onClick={onClose}>
      <FiX size={21} />
    </button>
  );
}
