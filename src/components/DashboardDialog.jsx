import DialogPanel from "./DialogPanel.jsx";

export default function DashboardDialog({ children, onClose, busy = false, titleId, descriptionId, role = "dialog", className = "" }) {
  return (
    <div className="dash-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17291f]/45 p-4 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <DialogPanel className={`dash-modal max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-xl bg-[#fffefa] p-6 text-[#263e31] shadow-2xl sm:p-8 ${className}`} role={role} titleId={titleId} descriptionId={descriptionId} busy={busy} onClose={onClose}>
        {children}
      </DialogPanel>
    </div>
  );
}
