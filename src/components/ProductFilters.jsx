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
      <div className="catalog-controls flex flex-col gap-5 border-t border-[#e3e7dc] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="category-tabs flex flex-wrap gap-2"
          role="group"
          aria-label="Product category"
        >
          {["All finds", ...categories].map((name) => {
            const Icon = categoryIcons[name] || FiGrid;
            return (
              <button
                type="button"
                key={name}
                className={`inline-flex items-center gap-2 rounded border px-3.5 py-2.5 text-[11px] transition ${category === name ? "selected border-[#2b4d37] bg-[#2b4d37] text-white" : "border-[#e0e5d8] bg-[#fffefa] text-[#7a8770] hover:border-[#93a181] hover:text-[#345439]"}`}
                aria-pressed={category === name}
                onClick={() =>
                  onChange("category", name === "All finds" ? "" : name)
                }
              >
                <Icon className="size-3.5" />
                {name}
              </button>
            );
          })}
        </div>
        <div className="sort-wrap relative flex shrink-0 items-center self-end text-[#7c8871] sm:self-auto">
          <FiSliders className="mr-2 size-3.5" />
          <select
            className="max-w-40 cursor-pointer appearance-none bg-transparent py-2 pl-1 pr-6 text-[11px] outline-offset-4"
            aria-label="Sort products"
            value={sort}
            onChange={(event) => onChange("sort", event.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <FiChevronDown className="pointer-events-none absolute right-0 size-3" />
        </div>
      </div>
      <div className="catalog-search-row mb-7 mt-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span
          className="flex flex-wrap items-center gap-3 text-[10px] text-[#8b977f]"
          role="status"
          aria-live="polite"
        >
          {loading
            ? "Finding the good stuff…"
            : `${count} thoughtfully chosen ${count === 1 ? "find" : "finds"}`}
          {savedOnly && (
            <button
              type="button"
              className="clear-favorite-filter inline-flex items-center gap-2 rounded-full bg-[#eef2e7] px-2 py-1 text-[#4e6c46]"
              onClick={() => onChange("saved", "")}
              aria-label="Show all products, including unsaved finds"
            >
              Saved only <FiX />
            </button>
          )}
        </span>
        <label className="catalog-search flex w-full items-center gap-2.5 rounded border border-[#e2e7da] px-3.5 py-3 text-[#8d9a80] sm:w-64">
          <FiSearch className="size-3.5 shrink-0" />
          <input
            className="min-w-0 flex-1 bg-transparent text-xs text-[#395139] outline-none placeholder:text-[#a8b19f]"
            id="product-search"
            type="search"
            aria-label="Search the collection"
            value={search}
            placeholder="Find your next favorite"
            onChange={(event) => onChange("q", event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="grid size-4 shrink-0 place-items-center"
              onClick={() => onChange("q", "")}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </label>
      </div>
    </>
  );
}
