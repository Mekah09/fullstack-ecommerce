import {
  FiCheck,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import { colorLabel } from "./productVariants.jsx";
import { hasStockLimit } from "../utils/cart.jsx";

export default function ProductOptions({
  colors,
  selectedColor,
  onSelectColor,
  stock,
  quantity,
  onChangeQuantity,
  added,
  onAddToBag,
  isWishlisted,
  onToggleWishlist,
}) {
  const knownStock = hasStockLimit(stock);
  const soldOut = stock === 0;
  return (
    <>
      {colors.length > 0 && (
        <div className="detail-colors">
          <p>
            Color{" "}
            <strong>
              {colorLabel(
                colors.find(
                  (color) => (color.name || color) === selectedColor,
                ) || colors[0],
                colors.findIndex(
                  (color) => (color.name || color) === selectedColor,
                ),
              )}
            </strong>
          </p>
          <div role="group" aria-label="Choose a color">
            {colors.map((color, index) => {
              const colorName = color.name || color;
              return (
                <button
                  type="button"
                  key={colorName}
                  className={
                    selectedColor === colorName
                      ? "detail-color selected"
                      : "detail-color"
                  }
                  aria-label={colorLabel(color, index)}
                  aria-pressed={selectedColor === colorName}
                  onClick={() => {
                    onSelectColor(colorName);
                  }}
                  style={{
                    "--swatch": color.hex || color.value || colorName,
                  }}
                >
                  <span />
                  {selectedColor === colorName && <FiCheck />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <p
        className={`detail-stock ${soldOut ? "unavailable" : ""}`}
        style={knownStock ? undefined : { color: "inherit" }}
      >
        {knownStock && <span />}
        {!knownStock
          ? "Availability confirmed at checkout"
          : soldOut
            ? "Currently out of stock"
            : stock <= 5
              ? `Just ${stock} left in stock`
              : "In stock and ready for you"}
      </p>
      <div className="detail-add-row">
        <div className="overlay-quantity detail-quantity">
          <button
            type="button"
            onClick={() => {
              onChangeQuantity((value) => Math.max(1, value - 1));
            }}
            disabled={quantity <= 1 || soldOut}
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
          <button
            type="button"
            onClick={() => {
              onChangeQuantity((value) =>
                Math.min(knownStock ? stock : Number.MAX_SAFE_INTEGER, value + 1),
              );
            }}
            disabled={
              soldOut ||
              quantity >= (knownStock ? stock : Number.MAX_SAFE_INTEGER)
            }
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>
        <button
          type="button"
          className="overlay-primary detail-add"
          disabled={soldOut}
          onClick={onAddToBag}
        >
          {added ? <FiCheck /> : <FiShoppingBag />}
          {soldOut ? "Sold out" : added ? "Add another to bag" : "Add to bag"}
        </button>
        <button
          type="button"
          className={`detail-wishlist ${isWishlisted ? "active" : ""}`}
          onClick={onToggleWishlist}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Save to wishlist"
          }
          aria-pressed={isWishlisted}
        >
          <FiHeart />
        </button>
      </div>
    </>
  );
}
