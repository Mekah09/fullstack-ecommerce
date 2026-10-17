import { FiArrowRight, FiHelpCircle, FiSearch } from "react-icons/fi";
import ProductGrid from "./ProductGrid";

export default function ProductResults({
  products,
  loading,
  error,
  savedOnly = false,
  onReset,
  emptyMessage,
}) {
  if (error) {
    return (
      <div className="catalog-empty" role="alert">
        <FiHelpCircle />
        <h3>We couldn’t load the collection.</h3>
        <p>{error}</p>
        <button
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="product-grid" role="status" aria-label="Loading products">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="product-skeleton" />
        ))}
      </div>
    );
  }
  if (products.length) return <ProductGrid products={products} />;
  return (
    <div className="catalog-empty">
      <FiSearch />
      <h3>No finds just yet.</h3>
      <p>
        {emptyMessage ||
          (savedOnly
            ? "Tap a heart on something you love, and it’ll be waiting here."
            : "Try another search or explore a different category.")}
      </p>
      {onReset && (
        <button className="text-link" onClick={onReset}>
          Explore all finds <FiArrowRight />
        </button>
      )}
    </div>
  );
}
