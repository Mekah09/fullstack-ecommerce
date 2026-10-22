import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import WorkspacePage from "../components/WorkspacePage.jsx";

export default function SellerDashboardPage() {
  const { setCatalog, catalogVersion } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
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
  return <WorkspacePage role="seller" products={products} loading={loading} error={error} onRetry={() => setRetryKey((key) => key + 1)} />;
}
