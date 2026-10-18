import { Component } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import DashboardDialog from "./DashboardDialog.jsx";

export default class ProductForm extends Component {
  constructor(props) {
    super(props);
    const { product } = props;
    this.state = {
      form: {
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price ?? "",
        category: product?.category || "",
        stock: product?.stock ?? 0,
        image: product?.image || "",
      },
      saving: false,
      error: "",
    };
  }

  change = (event) => {
    const { name, value } = event.target;
    this.setState((current) => ({ form: { ...current.form, [name]: value } }));
  };

  submit = async (event) => {
    event.preventDefault();
    if (this.state.saving) return;
    this.setState({ saving: true, error: "" });
    const { form } = this.state;
    const { product, sellerName, onSave, onClose } = this.props;
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
          "Use a full http(s) image URL or a local path starting with /.",
        );
      if (
        !form.name.trim() ||
        !form.description.trim() ||
        !form.category.trim()
      ) {
        throw new Error("Please enter a name, description, and category.");
      }
      const price = Number(form.price);
      const stock = Number(form.stock);
      if (!Number.isFinite(price) || price <= 0)
        throw new Error("Enter a price greater than zero.");
      if (!Number.isInteger(stock) || stock < 0)
        throw new Error("Enter a whole stock quantity of zero or more.");
      await onSave({
        ...form,
        image,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price,
        stock,
        seller: product?.seller || sellerName || "",
      });
      onClose();
    } catch (issue) {
      this.setState({
        error:
          issue.message || "We couldn’t save this product. Please try again.",
      });
    } finally {
      this.setState({ saving: false });
    }
  };

  render() {
    const { product, categories = [], onClose } = this.props;
    const { form, saving, error } = this.state;
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
        <form onSubmit={this.submit} className="dash-form">
          <label>
            Product name
            <input
              name="name"
              data-initial-focus
              required
              maxLength={120}
              placeholder="e.g. Everyday ceramic mug"
              value={form.name}
              onChange={this.change}
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
              onChange={this.change}
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
                onChange={this.change}
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
                onChange={this.change}
              />
            </label>
          </div>
          <label>
            Category
            <input
              name="category"
              required
              list="product-categories"
              placeholder="Enter a category"
              value={form.category}
              onChange={this.change}
            />
            <datalist id="product-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
          <label>
            Product image URL or path
            <input
              name="image"
              type="text"
              required
              placeholder="https://… or /images/product.jpg"
              value={form.image}
              onChange={this.change}
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
}
