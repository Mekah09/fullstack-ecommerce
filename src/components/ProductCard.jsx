import { FiHeart, FiPlus, FiStar } from "react-icons/fi";
import withShop from "./withShop.jsx";
import ProductImage from "./ProductImage.jsx";
import { money } from "../utils/format.jsx";

const backgrounds = [
  "bg-[#edf0e8]",
  "bg-[#f1eee7]",
  "bg-[#e8ece7]",
  "bg-[#f0f0e6]",
];

function ProductCard({ product, index = 0, shop }) {
  const { viewProduct, addToCart, toggleFavorite, favorites } = shop;
  const favorite = favorites.includes(product.id);
  return (
    <article className="product-card group min-w-0" data-reveal>
      <div
        className={`product-visual relative overflow-hidden rounded-lg ${backgrounds[index % backgrounds.length]}`}
      >
        <button
          type="button"
          className="product-image-button block aspect-[4/4.5] w-full overflow-hidden sm:aspect-[4/4.3]"
          onClick={() => viewProduct(product)}
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          />
        </button>
        {product.badge && (
          <span className="product-badge absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold tracking-wide text-[#34533d]">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          className={`favorite-button absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-[#fffefa]/95 shadow-sm transition hover:scale-105 ${favorite ? "is-favorite text-[#234d39]" : "text-[#84917c]"}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={`${favorite ? "Remove" : "Save"} ${product.name} ${favorite ? "from" : "to"} favorites`}
          aria-pressed={favorite}
        >
          <FiHeart className={favorite ? "size-4 fill-current" : "size-4"} />
        </button>
        <button
          type="button"
          className="quick-add absolute bottom-3 right-3 grid size-8 place-items-center rounded-full bg-[#fffefa] text-[#34533d] shadow-sm transition hover:bg-[#234d39] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => addToCart(product, 1)}
          disabled={product.stock === 0}
          aria-label={`Add ${product.name} to cart`}
        >
          <FiPlus className="size-4" />
        </button>
      </div>
      <div className="product-meta mt-4 flex items-center justify-between gap-2 text-[9px] text-[#84917c] sm:text-[10px]">
        <span className="truncate">{product.category}</span>
        {Number.isFinite(product.rating) && (
          <span className="product-rating flex shrink-0 items-center gap-1 text-[#64765b]">
            <FiStar className="size-3 fill-[#a3b58a] text-[#a3b58a]" />
            {product.rating.toFixed(1)}
            {Number.isFinite(product.reviews) && (
              <small className="text-[#929b89]">({product.reviews})</small>
            )}
          </span>
        )}
      </div>
      <div className="product-title-row mt-2 flex flex-col items-start gap-1.5 min-[500px]:flex-row min-[500px]:justify-between min-[500px]:gap-3">
        <button
          type="button"
          className="text-left text-[12px] leading-relaxed text-[#2b4433] transition hover:text-[#6f815f] sm:text-[13px]"
          onClick={() => viewProduct(product)}
        >
          {product.name}
        </button>
        <span className="shrink-0 text-[11px] font-medium leading-relaxed text-[#36513b] sm:text-xs">
          {money(product.price)}
        </span>
      </div>
      {(product.seller || product.originalPrice > product.price) && (
        <div className="product-subline mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[9px] text-[#929b89] sm:text-[10px]">
          {product.seller && <span>By {product.seller}</span>}
          {product.originalPrice > product.price && (
            <del>{money(product.originalPrice)}</del>
          )}
        </div>
      )}
    </article>
  );
}

export default withShop(ProductCard);
