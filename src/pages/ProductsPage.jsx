import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { useSearchParams, Link } from "react-router-dom";
import { FiChevronRight, FiHeart } from "react-icons/fi";
import ProductFilters from "../components/ProductFilters.jsx";
import ProductResults from "../components/ProductResults.jsx";

export default function ProductsPage() {
  const { setCatalog, catalogVersion } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const { favorites } = useContext(ShopContext);
  const [params, setParams] = useSearchParams();
  // The request and product state live in this page, not in an API service.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    async function fetchProducts() {
      try {
        const url = import.meta.env.VITE_PRODUCTS_API_URL || "https://fullstack-ecommerce2.onrender.com/products";
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to fetch products.");
        const records = Array.isArray(data) ? data : data.products;
        if (!Array.isArray(records)) throw new Error("The products API must return an array or { products: [...] }.");
        const items = records.map((record) => {
          const id = String(record._id ?? record.id ?? "");
          const name = record.productName ?? record.name ?? record.title;
          const rawPrice = record.productPrice ?? record.price;
          const price = Number(rawPrice);
          if (!id || typeof name !== "string" || !name.trim() || !["string", "number"].includes(typeof rawPrice) || !Number.isFinite(price) || price < 0) throw new Error("A product is missing a valid ID, name, or price.");
          const stock = record.stock == null || record.stock === "" ? null : Number(record.stock);
          if (stock !== null && (!Number.isSafeInteger(stock) || stock < 0)) throw new Error("A product has invalid stock.");
          let image = "";
          try {
            const value = record.productImage ?? record.image;
            if (typeof value === "string" && value.trim()) {
              const imageUrl = new URL(value, url);
              if (["https:", "http:"].includes(imageUrl.protocol)) image = imageUrl.href;
            }
          } catch { /* ProductImage displays an unavailable-image icon. */ }
          const category = record.productCategory ?? record.category?.name ?? record.category;
          return {
            ...record, id, name: name.trim(), price, image, stock,
            category: typeof category === "string" ? category : "",
            seller: typeof record.seller === "string" ? record.seller : record.seller?.name || "",
            sellerId: record.sellerId ?? record.seller?.id ?? record.seller?._id,
            description: typeof record.description === "string" ? record.description : "",
            colors: Array.isArray(record.colors) ? record.colors.filter((color) => typeof color === "string") : [],
            badge: typeof record.badge === "string" ? record.badge : "",
            rating: typeof record.rating === "number" ? record.rating : undefined,
            reviews: typeof record.reviews === "number" ? record.reviews : undefined,
          };
        });
        if (new Set(items.map((item) => item.id)).size !== items.length) throw new Error("The API returned duplicate product IDs.");
        if (!controller.signal.aborted) { setProducts(items); setCatalog(items); }
      } catch (error) {
        if (!controller.signal.aborted) { setError(error.message || "Unable to load products."); setProducts([]); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    fetchProducts();
    return () => controller.abort();
  }, [setCatalog, catalogVersion, retryKey]);
  useEffect(() => { if (params.get("search") === "focus") document.getElementById("product-search")?.focus(); }, [params]);
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const category = categories.includes(params.get("category")) ? params.get("category") : "All finds";
  const search = params.get("q") || "";
  const savedOnly = params.get("saved") === "true";
  const sort = params.get("sort") || "recommended";
  const visibleProducts = products
    .filter((product) => category === "All finds" || product.category === category)
    .filter((product) => !savedOnly || favorites.includes(product.id))
    .filter((product) => `${product.name} ${product.category} ${product.seller}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? (b.rating || 0) - (a.rating || 0) : Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  function changeFilter(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "recommended") next.delete(key); else next.set(key, value);
    setParams(next, { replace: key === "q" });
  }
  return (
    <main id="main-content" className="products-page mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
      <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-3 text-xs text-stone-500"><Link to="/" className="hover:text-emerald-900">Home</Link><FiChevronRight /><span aria-current="page">{savedOnly ? "Saved finds" : "All products"}</span></nav>
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-stone-200 pb-10 sm:flex-row sm:items-end" data-reveal>
        <div><span className="text-[10px] font-semibold tracking-[.25em] text-[#6c805c]">{savedOnly ? "THE KEEPERS" : "THE WHOLE COLLECTION"}</span><h1 className="my-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{savedOnly ? "Your saved little favorites." : "Good finds for every corner."}</h1><p className="max-w-md text-sm leading-7 text-stone-500">Thoughtful pieces. Independent makers. Find something that feels like you.</p></div>
        <Link to={savedOnly ? "/products" : "/products?saved=true"} className="inline-flex items-center gap-2 self-start border-b border-[#8d9e73] pb-2 text-xs text-[#58724d] sm:self-auto"><FiHeart />{savedOnly ? "View all products" : "Your saved finds"}</Link>
      </div>
      <section aria-label="Product collection">
        <ProductFilters categories={categories} category={category} search={search} sort={sort} savedOnly={savedOnly} count={visibleProducts.length} loading={loading} onChange={changeFilter} />
        <ProductResults products={visibleProducts} loading={loading} error={error} savedOnly={savedOnly} onReset={() => setParams({})} onRetry={() => setRetryKey((key) => key + 1)} />
      </section>
    </main>
  );
}
