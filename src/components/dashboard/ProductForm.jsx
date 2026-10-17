import { useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import DashboardDialog from "./DashboardDialog";
import { categories } from "./dashboardData";

export default function ProductForm({ product, sellerName, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    category: product?.category || "Decor",
    stock: product?.stock ?? 10,
    image: product?.image || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const image = form.image.trim();
      let validImage = /^\/(?!\/)[^\s]*$/.test(image);
      try {
        validImage ||= ["https:", "http:"].includes(new URL(image).protocol);
      } catch {
        /* A local image path is supported above. */
      }
      if (!validImage)
        throw new Error(
          "Use a full http(s) image URL or a local path starting with /images/.",
        );
      if (!form.name.trim() || !form.description.trim())
        throw new Error("Please enter a product name and description.");
      await onSave({
        ...form,
        image,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        seller: product?.seller || sellerName || "My shop",
        rating: product?.rating ?? 0,
        reviews: product?.reviews ?? 0,
      });
      onClose();
    } catch (issue) {
      setError(
        issue.message || "We couldn’t save this product. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <DashboardDialog
      onClose={onClose}
      busy={saving}
      titleId="dash-product-title"
    >
      <div className="dash-modal-head">
        <div>
          <span className="dash-eyebrow">A little more to discover</span>
          <h2 id="dash-product-title">
            {product ? "Edit your product" : "Add a new product"}
          </h2>
        </div>
        <button
          className="dash-icon-button"
          aria-label="Close product form"
          disabled={saving}
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>
      <form onSubmit={submit} className="dash-form">
        <label>
          Product name
          <input
            name="name"
            data-initial-focus
            required
            maxLength={120}
            placeholder="e.g. Everyday ceramic mug"
            value={form.name}
            onChange={change}
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Tell buyers what makes it special…"
            value={form.description}
            onChange={change}
          />
        </label>
        <div className="dash-form-row">
          <label>
            Price (USD)
            <input
              name="price"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={change}
            />
          </label>
          <label>
            Stock available
            <input
              name="stock"
              type="number"
              required
              min="0"
              step="1"
              value={form.stock}
              onChange={change}
            />
          </label>
        </div>
        <label>
          Category
          <select name="category" value={form.category} onChange={change}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Product image URL or path
          <input
            name="image"
            type="text"
            required
            placeholder="https://… or /images/product.jpg"
            value={form.image}
            onChange={change}
          />
          <span className="dash-field-help">
            Use a public http(s) URL or a local image path, e.g.
            /images/product.jpg.
          </span>
        </label>
        {error && (
          <p className="dash-form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dash-modal-actions">
          <button
            type="button"
            className="dash-secondary"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="dash-primary" disabled={saving}>
            {saving ? "Saving…" : product ? "Save changes" : "Add product"}
            <FiArrowRight />
          </button>
        </div>
      </form>
    </DashboardDialog>
  );
}
