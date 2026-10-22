import { useId, useState } from "react";
import { FiCheckCircle, FiPackage, FiStar, FiTruck } from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";
import { money } from "../utils/format.jsx";
import OverlayClose from "./OverlayClose.jsx";
import ProductOptions from "./ProductOptions.jsx";
import ProductImage from "./ProductImage.jsx";
import { colorLabel } from "./productVariants.jsx";

export default function ProductDetails({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) {
  const titleId = useId();
  const colors = product.colors || [];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    colors[0]?.name || colors[0] || "",
  );
  const name = product.name || product.title;
  const hasRating =
    product.rating !== undefined &&
    product.rating !== null &&
    product.rating !== "" &&
    Number.isFinite(Number(product.rating));
  const rating = hasRating
    ? Math.max(0, Math.min(5, Number(product.rating)))
    : 0;
  const reviewCount = product.reviews ?? product.reviewCount;

  async function addToBag() {
    setError("");
    setAdded(false);
    try {
      const selectedIndex = colors.findIndex(
        (color) => (color.name || color) === selectedColor,
      );
      const item =
        selectedIndex < 0
          ? product
          : {
              ...product,
              selectedColor,
              selectedFinish: colorLabel(colors[selectedIndex], selectedIndex),
            };
      const result = await onAddToCart(item, quantity);
      if (result === false)
        throw new Error("The requested quantity exceeds the available stock.");
      setAdded(true);
    } catch (issue) {
      setError(
        issue?.message || "We couldn’t add this item. Please try again.",
      );
    }
  }

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#15291d]/45 p-3 backdrop-blur-sm sm:p-7"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <DialogPanel
        className="detail-dialog relative grid max-h-[calc(100dvh-24px)] w-full max-w-[950px] overflow-y-auto rounded-xl bg-[#fffefa] shadow-2xl outline-none sm:max-h-[calc(100dvh-56px)] lg:grid-cols-2"
        titleId={titleId}
        onClose={onClose}
      >
        <OverlayClose
          onClose={onClose}
          className="absolute right-4 top-4 z-10 bg-[#fffefa]/95"
        />
        <div className="detail-image relative flex min-h-64 items-center justify-center overflow-hidden bg-[#eef0e7] lg:min-h-[540px]">
          <ProductImage
            src={product.image}
            alt={name}
            className="aspect-square h-full w-full object-cover"
          />
          {product.badge && (
            <span className="detail-badge absolute left-5 top-5 rounded-full bg-[#fffefa]/90 px-3 py-1 text-[10px] text-[#526c45]">
              {product.badge}
            </span>
          )}
          <span className="detail-image-note absolute bottom-5 left-5 text-[10px] tracking-wide text-[#6c8059]">
            Made for the everyday.
          </span>
        </div>
        <div className="detail-content px-6 pb-8 pt-7 sm:px-9 sm:py-10">
          <span className="overlay-eyebrow text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a9a73]">
            {product.category}
          </span>
          <h2
            className="mt-3 max-w-sm font-serif text-[30px] leading-tight tracking-tight text-[#2d4734] sm:text-4xl"
            id={titleId}
          >
            {name}
          </h2>
          {hasRating && (
            <div className="detail-rating mt-4 flex flex-wrap items-center gap-2 text-[10px] text-[#849271]">
              <span
                className="flex gap-0.5"
                aria-label={`${rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`size-3 ${star <= Math.round(rating) ? "fill-[#9caf80] text-[#9caf80]" : "text-[#d3dbc8]"}`}
                  />
                ))}
              </span>
              <strong className="font-medium text-[#526a44]">
                {rating.toFixed(1)}
              </strong>
              {reviewCount !== undefined && reviewCount !== null && (
                <span className="detail-review-count">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>
          )}
          <div className="detail-price mt-5 flex flex-wrap items-center gap-3 text-xl font-medium text-[#385737]">
            {money(product.price)}
            {product.originalPrice > product.price && (
              <del className="text-sm font-normal text-[#a5af99]">
                {money(product.originalPrice)}
              </del>
            )}
          </div>
          <p className="detail-description mt-5 text-xs leading-7 text-[#859079]">
            {product.description || "No description has been provided."}
          </p>
          <ProductOptions
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={(color) => {
              setSelectedColor(color);
              setAdded(false);
            }}
            stock={product.stock}
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
            <p
              className="detail-added mt-3 flex items-center gap-2 text-[10px] text-[#6f8a50]"
              role="status"
            >
              <FiCheckCircle /> A good choice. Added to your bag.
            </p>
          )}
          {error && (
            <p
              className="overlay-error mt-3 rounded bg-[#fcf1e8] px-3 py-2 text-xs leading-6 text-[#a46544]"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="detail-perks mt-7 space-y-4 border-t border-[#e5e9dc] pt-6 text-[#8d9a7d]">
            <div className="flex gap-3">
              <FiTruck className="mt-0.5 size-4 shrink-0" />
              <span className="text-[10px] leading-5">
                <strong className="block font-medium text-[#657b51]">
                  Delivery information
                </strong>
                Delivery details are confirmed by the store.
              </span>
            </div>
            <div className="flex gap-3">
              <FiPackage className="mt-0.5 size-4 shrink-0" />
              <span className="text-[10px] leading-5">
                <strong className="block font-medium text-[#657b51]">
                  Find your perfect fit
                </strong>
                Explore more thoughtful everyday essentials
              </span>
            </div>
          </div>
        </div>
      </DialogPanel>
    </div>
  );
}
