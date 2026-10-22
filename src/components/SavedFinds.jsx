import withShop from "./withShop.jsx";
import ProductGrid from "./ProductGrid.jsx";
import ProductResults from "./ProductResults.jsx";

function SavedFinds({ shop, products = shop.products, loading = false, error = "", onRetry }) {
  const savedProducts = products.filter((product) =>
    shop.favorites.includes(product.id),
  );
  return (
    <section className="buyer-favorites mt-12 border-t border-[#e2e7da] pt-8">
      <div className="section-heading mb-7">
        <span className="eyebrow text-[9px] font-semibold tracking-[0.22em] text-[#7a8b68]">
          THE KEEPERS
        </span>
        <h2 className="mt-3 font-serif text-3xl text-[#2d4734]">
          Your saved finds{" "}
          <span className="ml-2 text-xl text-[#8a997b]">
            ({savedProducts.length})
          </span>
        </h2>
      </div>
      {loading || error ? (
        <ProductResults products={[]} loading={loading} error={error} onRetry={onRetry} />
      ) : savedProducts.length ? (
        <ProductGrid products={savedProducts} />
      ) : (
        <p className="muted text-sm leading-7 text-[#859078]">
          Tap the heart on any product to save it for a little later.
        </p>
      )}
    </section>
  );
}

export default withShop(SavedFinds);
