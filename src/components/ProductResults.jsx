import { FiArrowRight, FiHelpCircle, FiSearch } from "react-icons/fi";
import ProductGrid from "./ProductGrid.jsx";

export default function ProductResults({
  products = [],
  loading,
  error,
  savedOnly = false,
  onReset,
  onRetry,
  emptyMessage,
}) {
  if (error)
    return (
      <div
        className="catalog-empty flex flex-col items-center rounded-lg border border-[#e5e8dc] bg-[#f8f9f3] px-5 py-14 text-center"
        role="alert"
      >
        <FiHelpCircle className="mb-5 size-8 text-[#80916f]" />
        <h3 className="font-serif text-2xl text-[#2d4734]">
          We couldn’t load the collection.
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-7 text-[#7a8471]">
          {error}
        </p>
        <button
          type="button"
          className="primary-button mt-7 rounded bg-[#234d39] px-6 py-3 text-xs font-medium text-white transition hover:bg-[#346148]"
          onClick={onRetry || (() => window.location.reload())}
        >
          Try again
        </button>
      </div>
    );
  if (loading)
    return (
      <div
        className="product-grid grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
        role="status"
        aria-label="Loading products"
      >
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="product-skeleton aspect-[4/5] animate-pulse rounded-lg bg-[#edf0e8] motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  if (products.length) return <ProductGrid products={products} />;
  return (
    <div className="catalog-empty flex flex-col items-center rounded-lg border border-dashed border-[#dfe4d5] px-5 py-14 text-center">
      <FiSearch className="mb-5 size-8 text-[#8c9b7e]" />
      <h3 className="font-serif text-2xl text-[#2d4734]">No finds just yet.</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#7a8471]">
        {emptyMessage ||
          (savedOnly
            ? "Tap a heart on something you love, and it’ll be waiting here."
            : "Try another search or explore a different category.")}
      </p>
      {onReset && (
        <button
          type="button"
          className="text-link mt-6 inline-flex items-center gap-2 border-b border-[#a0ae91] pb-1 text-xs text-[#3d5a40]"
          onClick={onReset}
        >
          Explore all finds <FiArrowRight />
        </button>
      )}
    </div>
  );
}
