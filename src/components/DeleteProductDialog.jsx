import { FiTrash2 } from "react-icons/fi";
import DashboardDialog from "./DashboardDialog.jsx";

export default function DeleteProductDialog({
  product,
  busy,
  error,
  onClose,
  onConfirm,
}) {
  return (
    <DashboardDialog
      className="dash-confirm max-w-md text-center"
      role="alertdialog"
      titleId="dash-delete-title"
      descriptionId="dash-delete-description"
      busy={busy}
      onClose={() => onClose()}
    >
      <span className="dash-confirm-icon mx-auto mb-5 grid size-14 place-items-center rounded-full bg-[#fcf0e9] text-[#a75d46] [&_svg]:size-6">
        <FiTrash2 />
      </span>
      <h2 id="dash-delete-title" className="font-serif text-2xl tracking-tight">Remove this product?</h2>
      <p id="dash-delete-description" className="mt-3 text-xs leading-6 text-[#839074]">
        “{product.name}” will be removed from the marketplace. You can add it
        again anytime.
      </p>
      {error && (
        <p className="dash-form-error m-4 rounded-md border border-[#f0d5cf] bg-[#fcf1ee] px-4 py-3 text-xs leading-6 text-[#a64e43]" role="alert">
          {error}
        </p>
      )}
      <div className="dash-modal-actions mt-7 flex flex-wrap items-center justify-end gap-3">
        <button
          className="dash-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#dfe5d7] bg-white px-5 py-3 text-xs font-medium transition hover:bg-[#f2f5ed] disabled:cursor-not-allowed disabled:opacity-50"
          data-initial-focus
          disabled={busy}
          onClick={() => onClose()}
        >
          Keep product
        </button>
        <button className="dash-danger inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#aa4e43] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#8c3b32] disabled:cursor-not-allowed disabled:opacity-50" disabled={busy} onClick={onConfirm}>
          {busy ? "Removing…" : "Remove product"}
        </button>
      </div>
    </DashboardDialog>
  );
}
