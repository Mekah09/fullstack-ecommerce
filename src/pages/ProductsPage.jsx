import { Component } from "react";
import { FiArrowRight, FiChevronRight, FiHeart } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import { Link } from "react-router-dom";
import ProductFilters from "../components/ProductFilters.jsx";
import ProductResults from "../components/ProductResults.jsx";
import withShop from "../components/withShop.jsx";
import "./products-page.css";

const sorts = ["recommended", "price-low", "price-high", "rating"];

class ProductsPage extends Component {
  constructor(props) {
    super(props);
    this.pendingParams = new URLSearchParams(props.shop.location.search);
  }

  componentDidMount() {
    this.focusSearch();
  }

  componentDidUpdate(previousProps) {
    const previousSearch = previousProps.shop.location.search;
    const currentSearch = this.props.shop.location.search;
    if (previousSearch !== currentSearch) {
      this.pendingParams = new URLSearchParams(currentSearch);
      if (new URLSearchParams(previousSearch).get("search") !== "focus") {
        this.focusSearch();
      }
    }
  }

  focusSearch() {
    const params = new URLSearchParams(this.props.shop.location.search);
    if (params.get("search") === "focus") {
      document.getElementById("product-search")?.focus();
    }
  }

  changeFilter = (key, value) => {
    // Keep rapid search and sort changes together before navigation completes.
    const params = new URLSearchParams(this.pendingParams);
    if (!value || (key === "sort" && value === "recommended"))
      params.delete(key);
    else params.set(key, value);
    this.pendingParams = params;
    this.navigateToFilters(params, key === "q");
  };

  resetFilters = () => {
    this.pendingParams = new URLSearchParams();
    this.navigateToFilters(this.pendingParams);
  };

  navigateToFilters(params, replace = false) {
    const { location, navigate } = this.props.shop;
    const search = params.toString();
    navigate(
      `${location.pathname}${search ? `?${search}` : ""}${location.hash || ""}`,
      { replace },
    );
  }

  render() {
    const { products, loading, loadError, favorites, location } =
      this.props.shop;
    const params = new URLSearchParams(location.search);
    const categories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
    const category = categories.includes(params.get("category"))
      ? params.get("category")
      : "All finds";
    const search = params.get("q") || "";
    const sort = sorts.includes(params.get("sort"))
      ? params.get("sort")
      : "recommended";
    const savedOnly = params.get("saved") === "true";
    const query = search.trim().toLowerCase();
    const visibleProducts = products
      .filter(
        (product) => category === "All finds" || product.category === category,
      )
      .filter((product) => !savedOnly || favorites.includes(product.id))
      .filter((product) =>
        `${product.name} ${product.category} ${product.seller}`
          .toLowerCase()
          .includes(query),
      )
      .sort((a, b) =>
        sort === "price-low"
          ? a.price - b.price
          : sort === "price-high"
            ? b.price - a.price
            : sort === "rating"
              ? (b.rating || 0) - (a.rating || 0)
              : Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );

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
        <section
          className="products-collection"
          aria-label="Product collection"
        >
          <ProductFilters
            categories={categories}
            category={category}
            search={search}
            sort={sort}
            savedOnly={savedOnly}
            count={visibleProducts.length}
            loading={loading}
            onChange={this.changeFilter}
          />
          <ProductResults
            products={visibleProducts}
            loading={loading}
            error={loadError}
            savedOnly={savedOnly}
            onReset={this.resetFilters}
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
}

export default withShop(ProductsPage);
