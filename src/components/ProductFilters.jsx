import {
  FiChevronDown,
  FiGrid,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";
import {
  LuArmchair,
  LuCookingPot,
  LuFlower2,
  LuLamp,
  LuSprout,
} from "react-icons/lu";

const categoryIcons = {
  Furniture: LuArmchair,
  Lighting: LuLamp,
  Decor: LuFlower2,
  Kitchen: LuCookingPot,
  Lifestyle: LuSprout,
};

export default function ProductFilters({
  categories = [],
  category,
  search,
  sort,
  savedOnly,
  count,
  loading,
  onChange,
}) {
  return (
    <>
      <div className="catalog-controls">
        <div
          className="category-tabs"
          role="group"
          aria-label="Product category"
        >
          {["All finds", ...categories].map((name) => {
            const Icon = categoryIcons[name] || FiGrid;
            return (
              <button
                key={name}
                className={category === name ? "selected" : ""}
                aria-pressed={category === name}
                onClick={() =>
                  onChange("category", name === "All finds" ? "" : name)
                }
              >
                <Icon />
                {name}
              </button>
            );
          })}
        </div>
        <div className="sort-wrap">
          <FiSliders />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => onChange("sort", event.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <FiChevronDown />
        </div>
      </div>
      <div className="catalog-search-row">
        <span role="status" aria-live="polite">
          {loading
            ? "Finding the good stuff…"
            : `${count} thoughtfully chosen ${count === 1 ? "find" : "finds"}`}
          {savedOnly && (
            <button
              className="clear-favorite-filter"
              onClick={() => onChange("saved", "")}
              aria-label="Show all products, including unsaved finds"
            >
              Saved only <FiX />
            </button>
          )}
        </span>
        <label className="catalog-search">
          <FiSearch />
          <input
            id="product-search"
            type="search"
            aria-label="Search the collection"
            value={search}
            placeholder="Find your next favorite"
            onChange={(event) => onChange("q", event.target.value)}
          />
          {search && (
            <button onClick={() => onChange("q", "")} aria-label="Clear search">
              <FiX />
            </button>
          )}
        </label>
      </div>
    </>
  );
}
