import { useId, useState } from "react";
import { FiCheckCircle, FiPackage, FiStar, FiTruck } from "react-icons/fi";
import useOverlay from "../hooks/useOverlay.jsx";
import { money } from "../utils/format.jsx";
import OverlayClose from "./OverlayClose.jsx";
import ProductOptions from "./ProductOptions.jsx";
import { colorLabel } from "./productVariants.jsx";
import "./commerce-overlays.css";

export default function ProductDetails({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) {
  const panelRef = useOverlay(onClose);
  const titleId = useId();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const stock = typeof product.stock === "number" ? product.stock : 99;
  const name = product.name || product.title;
  const rating = Number.isFinite(Number(product.rating))
    ? Math.max(0, Math.min(5, Number(product.rating)))
    : 4.8;
  const colors = product.colors || [];
  const [selectedColor, setSelectedColor] = useState(
    colors[0]?.name || colors[0] || "",
  );

  async function addToBag() {
    setError("");
    try {
      const selectedIndex = colors.findIndex(
        (color) => (color.name || color) === selectedColor,
      );
      await onAddToCart(
        selectedIndex >= 0
          ? {
              ...product,
              selectedColor,
              selectedFinish: colorLabel(colors[selectedIndex], selectedIndex),
            }
          : product,
        quantity,
      );
      setAdded(true);
    } catch (err) {
      setError(err?.message || "We couldn’t add this item. Please try again.");
    }
  }

  return (
    <div
      className="overlay-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <OverlayClose onClose={onClose} />
        <div className="detail-image">
          <img src={product.image} alt={name} />
          {product.badge && (
            <span className="detail-badge">{product.badge}</span>
          )}
          <span className="detail-image-note">Made for the everyday.</span>
        </div>
        <div className="detail-content">
          <span className="overlay-eyebrow">{product.category}</span>
          <h2 id={titleId}>{name}</h2>
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
            <span className="detail-review-count">
              ({product.reviews || product.reviewCount || 0} reviews)
            </span>
          </div>
          <div className="detail-price">
            {money(product.price)}
            {product.originalPrice > product.price && (
              <del>{money(product.originalPrice)}</del>
            )}
          </div>
          <p className="detail-description">
            {product.description ||
              "A thoughtful addition to your everyday. Beautifully considered, easy to love, and ready for a place in your home."}
          </p>
          <ProductOptions
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={(color) => {
              setSelectedColor(color);
              setAdded(false);
            }}
            stock={stock}
            quantity={quantity}
            onChangeQuantity={(value) => {
              setQuantity(value);
              setAdded(false);
            }}
            added={added}
            onAddToBag={addToBag}
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
                <strong>A little something on us</strong>Free shipping on orders
                $100+
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
      </section>
    </div>
  );
}
