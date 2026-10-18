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
      className="dash-confirm"
      role="alertdialog"
      titleId="dash-delete-title"
      descriptionId="dash-delete-description"
      busy={busy}
      onClose={() => onClose()}
    >
      <span className="dash-confirm-icon">
        <FiTrash2 />
      </span>
      <h2 id="dash-delete-title">Remove this product?</h2>
      <p id="dash-delete-description">
        “{product.name}” will be removed from the marketplace. You can add it
        again anytime.
      </p>
      {error && (
        <p className="dash-form-error" role="alert">
          {error}
        </p>
      )}
      <div className="dash-modal-actions">
        <button
          className="dash-secondary"
          data-initial-focus
          disabled={busy}
          onClick={() => onClose()}
        >
          Keep product
        </button>
        <button className="dash-danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Removing…" : "Remove product"}
        </button>
      </div>
    </DashboardDialog>
  );
}
