import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/products";

const sorts = ["recommended", "price-low", "price-high", "rating"];

export function useProductFilters(products, favorites) {
  const [params, setParams] = useSearchParams();
  const latestParams = useRef(params);
  const category = categories.includes(params.get("category"))
    ? params.get("category")
    : "All finds";
  const search = params.get("q") || "";
  const sort = sorts.includes(params.get("sort"))
    ? params.get("sort")
    : "recommended";
  const savedOnly = params.get("saved") === "true";
  const focusSearch = params.get("search") === "focus";
  const query = search.trim().toLowerCase();

  useEffect(() => {
    latestParams.current = params;
  }, [params]);
  useEffect(() => {
    if (focusSearch) document.getElementById("product-search")?.focus();
  }, [focusSearch]);

  // useSearchParams does not queue functional updates. Keep consecutive edits
  // together so a sort/category click cannot restore an older search query.
  function changeFilter(key, value) {
    const next = new URLSearchParams(latestParams.current);
    if (!value || (key === "sort" && value === "recommended")) next.delete(key);
    else next.set(key, value);
    latestParams.current = next;
    setParams(next, { replace: key === "q" });
  }
  function resetFilters() {
    latestParams.current = new URLSearchParams();
    setParams({});
  }
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
            ? b.rating - a.rating
            : Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
    );
  return {
    category,
    search,
    sort,
    savedOnly,
    visibleProducts,
    changeFilter,
    resetFilters,
  };
}
