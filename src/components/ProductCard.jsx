import { FiHeart, FiPlus, FiStar } from "react-icons/fi";
import withShop from "./withShop.jsx";
import { money } from "../utils/format.jsx";

function ProductCard({ product, index = 0, shop }) {
  const { viewProduct, addToCart, toggleFavorite, favorites } = shop;
  const favorite = favorites.includes(product.id);
  return (
    <article
      className="product-card group min-w-0"
      data-reveal
      style={{ "--delay": `${(index % 4) * 65}ms` }}
    >
      <div className={`product-visual product-tint-${index % 4}`}>
        <button
          className="product-image-button"
          onClick={() => viewProduct(product)}
          aria-label={`View ${product.name}`}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
        </button>
        {product.badge && (
          <span
            className={`product-badge ${product.badge.toLowerCase().includes("new") ? "badge-new" : ""}`}
          >
            {product.badge}
          </span>
        )}
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={`${favorite ? "Remove" : "Save"} ${product.name} ${favorite ? "from" : "to"} favorites`}
          aria-pressed={favorite}
        >
          <FiHeart />
        </button>
        <button
          className="quick-add"
          onClick={() => addToCart(product, 1)}
          disabled={!product.stock}
          aria-label={`Add ${product.name} to cart`}
        >
          <FiPlus />
        </button>
      </div>
      <div className="product-meta flex items-center justify-between">
        <span>{product.category}</span>
        {Number.isFinite(product.rating) && (
          <span className="product-rating">
            <FiStar />
            {product.rating.toFixed(1)}{" "}
            {Number.isFinite(product.reviews) && (
              <small>({product.reviews})</small>
            )}
          </span>
        )}
      </div>
      <div className="product-title-row flex items-start justify-between">
        <button onClick={() => viewProduct(product)}>{product.name}</button>
        <span>{money(product.price)}</span>
      </div>
      <div className="product-subline flex items-center justify-between">
        <span>By {product.seller}</span>
        {product.originalPrice > product.price && (
          <del>{money(product.originalPrice)}</del>
        )}
      </div>
    </article>
  );
}

export default withShop(ProductCard);
