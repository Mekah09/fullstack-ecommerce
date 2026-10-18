import { Component } from "react";
import { FiCheckCircle, FiPackage, FiStar, FiTruck } from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";
import { money } from "../utils/format.jsx";
import OverlayClose from "./OverlayClose.jsx";
import ProductOptions from "./ProductOptions.jsx";
import ProductImage from "./ProductImage.jsx";
import { colorLabel } from "./productVariants.jsx";
import "./commerce-overlays.css";

let nextProductId = 0;

export default class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.titleId = `product-title-${++nextProductId}`;
    const colors = props.product.colors || [];
    this.state = {
      quantity: 1,
      added: false,
      error: "",
      selectedColor: colors[0]?.name || colors[0] || "",
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  addToBag = async () => {
    this.setState({ error: "", added: false });
    const { product, onAddToCart } = this.props;
    const { quantity, selectedColor } = this.state;
    const colors = product.colors || [];
    try {
      const selectedIndex = colors.findIndex(
        (color) => (color.name || color) === selectedColor,
      );
      const result = await onAddToCart(
        selectedIndex >= 0
          ? {
              ...product,
              selectedColor,
              selectedFinish: colorLabel(colors[selectedIndex], selectedIndex),
            }
          : product,
        quantity,
      );
      if (result === false) {
        throw new Error("The requested quantity exceeds the available stock.");
      }
      if (this.mounted) this.setState({ added: true });
    } catch (err) {
      if (this.mounted) {
        this.setState({
          error: err?.message || "We couldn’t add this item. Please try again.",
        });
      }
    }
  };

  changeQuantity = (value) => {
    this.setState(({ quantity }) => ({
      quantity: typeof value === "function" ? value(quantity) : value,
      added: false,
    }));
  };

  render() {
    const {
      product,
      onClose,
      onToggleWishlist,
      isWishlisted = false,
    } = this.props;
    const { quantity, added, error, selectedColor } = this.state;
    const { titleId } = this;
    const stock = typeof product.stock === "number" ? product.stock : 99;
    const name = product.name || product.title;
    const hasRating =
      product.rating !== undefined &&
      product.rating !== null &&
      product.rating !== "" &&
      Number.isFinite(Number(product.rating));
    const rating = Number.isFinite(Number(product.rating))
      ? Math.max(0, Math.min(5, Number(product.rating)))
      : 0;
    const reviewCount = product.reviews ?? product.reviewCount;
    const colors = product.colors || [];

    return (
      <div
        className="overlay-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <DialogPanel
          className="detail-dialog"
          titleId={titleId}
          onClose={onClose}
        >
          <OverlayClose onClose={onClose} />
          <div className="detail-image">
            <ProductImage src={product.image} alt={name} />
            {product.badge && (
              <span className="detail-badge">{product.badge}</span>
            )}
            <span className="detail-image-note">Made for the everyday.</span>
          </div>
          <div className="detail-content">
            <span className="overlay-eyebrow">{product.category}</span>
            <h2 id={titleId}>{name}</h2>
            {hasRating && (
              <div className="detail-rating">
                <span aria-label={`${rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={
                        star <= Math.round(rating) ? "detail-star-filled" : ""
                      }
                    />
                  ))}
                </span>
                <strong>{rating.toFixed(1)}</strong>
                {reviewCount !== undefined && reviewCount !== null && (
                  <span className="detail-review-count">
                    ({reviewCount} reviews)
                  </span>
                )}
              </div>
            )}
            <div className="detail-price">
              {money(product.price)}
              {product.originalPrice > product.price && (
                <del>{money(product.originalPrice)}</del>
              )}
            </div>
            <p className="detail-description">
              {product.description || "No description has been provided."}
            </p>
            <ProductOptions
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={(color) => {
                this.setState({ selectedColor: color, added: false });
              }}
              stock={stock}
              quantity={quantity}
              onChangeQuantity={this.changeQuantity}
              added={added}
              onAddToBag={this.addToBag}
              isWishlisted={isWishlisted}
              onToggleWishlist={() => onToggleWishlist(product.id)}
            />
            {added && (
              <p className="detail-added" role="status">
                <FiCheckCircle /> A good choice. Added to your bag.
              </p>
            )}
            {error && (
              <p className="overlay-error" role="alert">
                {error}
              </p>
            )}
            <div className="detail-perks">
              <div>
                <FiTruck />
                <span>
                  <strong>Delivery information</strong>Delivery details are
                  confirmed by the store.
                </span>
              </div>
              <div>
                <FiPackage />
                <span>
                  <strong>Find your perfect fit</strong>Explore more thoughtful
                  everyday essentials
                </span>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    );
  }
}
