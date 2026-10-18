import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import { Link } from "react-router-dom";
import withShop from "./withShop.jsx";
import ProductResults from "./ProductResults.jsx";

function FeaturedProducts({ shop }) {
  const { products, loading, loadError } = shop;
  const featured = [...products]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 4);

  return (
    <section
      className="catalog-section page-width"
      aria-labelledby="featured-heading"
    >
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">A FEW OF OUR FAVORITES</span>
          <h2 id="featured-heading">Your space. Your style.</h2>
          <p>A little look at the good stuff. There’s more to discover.</p>
        </div>
        <Link className="text-link" to="/products">
          View all products <FiArrowUpRight />
        </Link>
      </div>
      <ProductResults
        products={featured}
        loading={loading}
        error={loadError}
        emptyMessage="Our next good finds are on their way."
      />
      <div className="collection-note">
        <LuSprout />
        <span>
          A little character. A lot to love. Always thoughtfully chosen.
        </span>
        <Link to="/products" aria-label="Browse the full collection">
          <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default withShop(FeaturedProducts);
