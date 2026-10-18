import DialogPanel from "./DialogPanel.jsx";

export default function DashboardDialog({
  children,
  onClose,
  busy = false,
  titleId,
  descriptionId,
  role = "dialog",
  className = "",
}) {
  return (
    <div
      className="dash-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <DialogPanel
        className={`dash-modal ${className}`}
        role={role}
        titleId={titleId}
        descriptionId={descriptionId}
        busy={busy}
        onClose={onClose}
      >
        {children}
      </DialogPanel>
    </div>
  );
}
