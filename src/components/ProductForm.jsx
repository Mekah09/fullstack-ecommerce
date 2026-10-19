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
        stock: product?.stock ?? "",
        image: product?.image || "",
      },
      imageFile: null,
      saving: false,
      error: "",
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  change = (event) => {
    const { name, value } = event.target;
    this.setState((current) => ({
      form: { ...current.form, [name]: value },
      error: "",
    }));
  };

  changeImage = (event) => {
    this.setState({
      imageFile: event.target.files?.[0] || null,
      error: "",
    });
  };

  submit = async (event) => {
    event.preventDefault();
    if (this.state.saving) return;
    this.setState({ saving: true, error: "" });
    const { form, imageFile } = this.state;
    const { product, sellerName, onSave, onClose } = this.props;
    try {
      if (!form.name.trim() || !form.category.trim())
        throw new Error("Please enter a product name and category.");
      const price = Number(form.price);
      if (!Number.isFinite(price) || price <= 0)
        throw new Error("Enter a price greater than zero.");
      const fields = {
        name: form.name.trim(),
        category: form.category.trim(),
        price,
      };
      if (product) {
        const image = form.image.trim();
        if (image) {
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
        }
        fields.image = image;
        fields.seller = product.seller || sellerName || "";
        if (product.description) fields.description = form.description.trim();
        if (product.stock != null) {
          const stock = Number(form.stock);
          if (form.stock === "" || !Number.isInteger(stock) || stock < 0)
            throw new Error("Enter a whole stock quantity of zero or more.");
          fields.stock = stock;
        }
      } else {
        if (!imageFile || imageFile.size === 0)
          throw new Error("Choose a product image file to upload.");
        if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type))
          throw new Error("Choose a JPG, JPEG, PNG, or WebP image.");
        if (imageFile.size > 2 * 1024 * 1024)
          throw new Error("Choose an image that is 2 MB or smaller.");
        fields.image = imageFile;
      }
      await onSave(fields);
      if (this.mounted) onClose();
    } catch (issue) {
      if (this.mounted)
        this.setState({
          error:
            issue.message || "We couldn’t save this product. Please try again.",
        });
    } finally {
      if (this.mounted) this.setState({ saving: false });
    }
  };

  render() {
    const { product, categories = [], onClose } = this.props;
    const { form, imageFile, saving, error } = this.state;
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
              disabled={saving}
              maxLength={120}
              placeholder="e.g. Everyday ceramic mug"
              value={form.name}
              onChange={this.change}
            />
          </label>
          {product?.description && (
            <label>
              Description
              <textarea
                name="description"
                disabled={saving}
                rows={3}
                placeholder="Tell buyers what makes it special…"
                value={form.description}
                onChange={this.change}
              />
            </label>
          )}
          <div className={product?.stock != null ? "dash-form-row" : ""}>
            <label>
              Price (₦ NGN)
              <input
                name="price"
                type="number"
                required
                disabled={saving}
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={this.change}
              />
            </label>
            {product?.stock != null && (
              <label>
                Stock available
                <input
                  name="stock"
                  type="number"
                  required
                  disabled={saving}
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={this.change}
                />
              </label>
            )}
          </div>
          <label>
            Category
            <input
              name="category"
              required
              disabled={saving}
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
          {product ? (
            <label>
              Product image URL or path
              <input
                name="image"
                type="text"
                disabled={saving}
                placeholder="https://… or /images/product.jpg"
                value={form.image}
                onChange={this.change}
                aria-describedby="product-image-help"
              />
              <span id="product-image-help" className="dash-field-help">
                Use a public http(s) URL or a local image path.
              </span>
            </label>
          ) : (
            <label>
              Product image
              <input
                name="productImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                required
                disabled={saving}
                onChange={this.changeImage}
                aria-describedby="product-image-help"
              />
              <span id="product-image-help" className="dash-field-help">
                {imageFile
                  ? `Selected: ${imageFile.name}. JPG, JPEG, PNG, or WebP; up to 2 MB.`
                  : "Choose a JPG, JPEG, PNG, or WebP image from your device, up to 2 MB."}
              </span>
            </label>
          )}
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
