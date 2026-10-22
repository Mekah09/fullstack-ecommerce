import { FiX } from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";

export default function Modal({ children, titleId, className = "info-modal max-w-xl", onClose, closeLabel = "Close dialog", busy = false }) {
  const close = () => { if (!busy) onClose(); };
  return (
    <div className="nook-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17291f]/45 p-4 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <DialogPanel className={`relative max-h-[90dvh] w-full overflow-y-auto rounded-xl bg-[#fffefa] p-6 text-[#263e31] shadow-2xl sm:p-9 ${className}`} titleId={titleId} onClose={close} busy={busy}>
        <button className="modal-close absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#7a8770] transition hover:bg-[#eef1e8] disabled:opacity-40" type="button" onClick={close} aria-label={closeLabel} disabled={busy}><FiX /></button>
        {children}
      </DialogPanel>
    </div>
  );
}
