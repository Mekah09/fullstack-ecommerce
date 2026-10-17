import { FiX } from "react-icons/fi";
import useOverlay from "../../hooks/useOverlay";

export default function Modal({
  children,
  titleId,
  className = "info-modal",
  onClose,
  closeLabel = "Close dialog",
  busy = false,
}) {
  const close = () => {
    if (!busy) onClose();
  };
  const panelRef = useOverlay(close);
  return (
    <div
      className="nook-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        ref={panelRef}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          onClick={close}
          aria-label={closeLabel}
          disabled={busy}
        >
          <FiX />
        </button>
        {children}
      </section>
    </div>
  );
}
