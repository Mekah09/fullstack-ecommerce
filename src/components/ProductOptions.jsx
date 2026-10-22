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
  colors = [],
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
        <div className="detail-colors mt-6">
          <p className="text-xs text-[#819071]">
            Color{" "}
            <strong className="ml-2 font-medium text-[#405a3c]">
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
          <div
            className="mt-3 flex flex-wrap gap-2"
            role="group"
            aria-label="Choose a color"
          >
            {colors.map((color, index) => {
              const colorName = color.name || color;
              const colorValue = color.hex || color.value || colorName;
              const selected = selectedColor === colorName;
              return (
                <button
                  type="button"
                  key={colorName}
                  className={`detail-color relative grid size-9 place-items-center rounded-full border-2 p-1 transition ${selected ? "selected border-[#45613c]" : "border-transparent hover:border-[#bdc8b1]"}`}
                  aria-label={colorLabel(color, index)}
                  aria-pressed={selected}
                  onClick={() => onSelectColor(colorName)}
                >
                  <svg
                    className="size-full rounded-full"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <circle cx="16" cy="16" r="16" fill={colorValue} />
                  </svg>
                  {selected && (
                    <FiCheck className="pointer-events-none absolute size-3.5 text-white mix-blend-difference" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <p
        className={`detail-stock mt-6 flex items-center gap-2 text-[11px] ${soldOut ? "unavailable text-[#a7775b]" : knownStock ? "text-[#788d5c]" : "text-[#89927f]"}`}
      >
        {knownStock && (
          <span
            className={`size-1.5 rounded-full ${soldOut ? "bg-[#bd9279]" : "bg-[#97ad79]"}`}
          />
        )}
        {!knownStock
          ? "Availability confirmed at checkout"
          : soldOut
            ? "Currently out of stock"
            : stock <= 5
              ? `Just ${stock} left in stock`
              : "In stock and ready for you"}
      </p>
      <div className="detail-add-row mt-4 flex flex-wrap items-stretch gap-2 sm:gap-3">
        <div className="overlay-quantity detail-quantity flex h-12 items-center rounded border border-[#dce2d2] text-[#49613e]">
          <button
            type="button"
            className="grid h-full w-9 place-items-center transition hover:bg-[#f1f4e9] disabled:opacity-35 sm:w-10"
            onClick={() => onChangeQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1 || soldOut}
            aria-label="Decrease quantity"
          >
            <FiMinus className="size-3.5" />
          </button>
          <span
            className="min-w-5 text-center text-xs"
            aria-label={`Quantity ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            className="grid h-full w-9 place-items-center transition hover:bg-[#f1f4e9] disabled:opacity-35 sm:w-10"
            onClick={() =>
              onChangeQuantity((value) =>
                Math.min(
                  knownStock ? stock : Number.MAX_SAFE_INTEGER,
                  value + 1,
                ),
              )
            }
            disabled={
              soldOut ||
              quantity >= (knownStock ? stock : Number.MAX_SAFE_INTEGER)
            }
            aria-label="Increase quantity"
          >
            <FiPlus className="size-3.5" />
          </button>
        </div>
        <button
          type="button"
          className="overlay-primary detail-add inline-flex min-w-28 flex-1 items-center justify-center gap-2 rounded bg-[#234d39] px-4 py-3 text-xs font-medium text-white transition hover:bg-[#346148] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={soldOut}
          onClick={onAddToBag}
        >
          {added ? (
            <FiCheck className="size-4" />
          ) : (
            <FiShoppingBag className="size-4" />
          )}
          {soldOut ? "Sold out" : added ? "Add another to bag" : "Add to bag"}
        </button>
        <button
          type="button"
          className={`detail-wishlist grid size-12 shrink-0 place-items-center rounded border transition hover:border-[#80956b] ${isWishlisted ? "active border-[#96ab7d] bg-[#eef3e7] text-[#345b35]" : "border-[#dce2d2] text-[#829475]"}`}
          onClick={onToggleWishlist}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Save to wishlist"
          }
          aria-pressed={isWishlisted}
        >
          <FiHeart
            className={isWishlisted ? "size-4 fill-current" : "size-4"}
          />
        </button>
      </div>
    </>
  );
}
