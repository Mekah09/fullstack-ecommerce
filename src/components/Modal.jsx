import { FiX } from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";

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
  return (
    <div
      className="nook-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <DialogPanel
        className={className}
        titleId={titleId}
        onClose={close}
        busy={busy}
      >
        <button
          className="modal-close"
          type="button"
          onClick={close}
          aria-label={closeLabel}
          disabled={busy}
        >
          <FiX />
        </button>
        {children}
      </DialogPanel>
    </div>
  );
}
