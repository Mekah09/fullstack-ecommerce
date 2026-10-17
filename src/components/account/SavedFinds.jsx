import { useShop } from "../../hooks/useShop";
import ProductGrid from "../products/ProductGrid";

export default function SavedFinds() {
  const { products, favorites } = useShop();
  const savedProducts = products.filter((product) =>
    favorites.includes(product.id),
  );
  return (
    <section className="buyer-favorites">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE KEEPERS</span>
          <h2>
            Your saved finds <span>({savedProducts.length})</span>
          </h2>
        </div>
      </div>
      {savedProducts.length ? (
        <ProductGrid products={savedProducts} />
      ) : (
        <p className="muted">
          Tap the heart on any product to save it for a little later.
        </p>
      )}
    </section>
  );
}
