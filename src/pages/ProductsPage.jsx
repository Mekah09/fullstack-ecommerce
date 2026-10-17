import { FiArrowRight, FiChevronRight, FiHeart } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import { Link } from "react-router-dom";
import ProductFilters from "../components/products/ProductFilters";
import ProductResults from "../components/products/ProductResults";
import { useProductFilters } from "../hooks/useProductFilters";
import { useShop } from "../hooks/useShop";
import "./products-page.css";

export default function ProductsPage() {
  const { products, loading, loadError, favorites } = useShop();
  const {
    category,
    search,
    sort,
    savedOnly,
    visibleProducts,
    changeFilter,
    resetFilters,
  } = useProductFilters(products, favorites);

  return (
    <main id="main-content" className="products-page page-width">
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight />
        <span aria-current="page">
          {savedOnly ? "Saved finds" : "All products"}
        </span>
      </nav>
      <div className="products-page-heading" data-reveal>
        <div>
          <span className="eyebrow">
            {savedOnly ? "THE KEEPERS" : "THE WHOLE COLLECTION"}
          </span>
          <h1>
            {savedOnly
              ? "Your saved little favorites."
              : "Good finds for every corner."}
          </h1>
          <p>
            {savedOnly
              ? "A few things you’ve got your eye on. Keep your favorites close."
              : "Thoughtful pieces. Independent makers. Find something that feels like you."}
          </p>
        </div>
        {savedOnly ? (
          <Link className="text-link" to="/products">
            View all products <FiArrowRight />
          </Link>
        ) : (
          <Link className="text-link" to="/products?saved=true">
            <FiHeart /> Your saved finds{" "}
            {favorites.length > 0 && `(${favorites.length})`}
          </Link>
        )}
      </div>
      <section className="products-collection" aria-label="Product collection">
        <ProductFilters
          category={category}
          search={search}
          sort={sort}
          savedOnly={savedOnly}
          count={visibleProducts.length}
          loading={loading}
          onChange={changeFilter}
        />
        <ProductResults
          products={visibleProducts}
          loading={loading}
          error={loadError}
          savedOnly={savedOnly}
          onReset={resetFilters}
        />
        <div className="collection-note">
          <LuSprout />
          <span>
            A little character. A lot to love. Always thoughtfully chosen.
          </span>
        </div>
      </section>
    </main>
  );
}
