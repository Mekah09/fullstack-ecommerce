import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import withShop from "../components/withShop.jsx";
import OrderHistory from "../components/OrderHistory.jsx";
import SavedFinds from "../components/SavedFinds.jsx";

function BuyerAccountPage({ shop }) {
  const { user, token, setOrders: setSharedOrders, setOrdersLoading, setOrdersError } = shop;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ordersUrl = (import.meta.env.VITE_ORDERS_API_URL || "").trim();

  const { setCatalog, catalogVersion } = shop;
  const [products, setProducts] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  // The request and product state live in this page, not in an API service.
  useEffect(() => {
    const controller = new AbortController();
    setCatalogLoading(true);
    setCatalogError("");
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
        if (!controller.signal.aborted) { setCatalogError(error.message || "Unable to load products."); setProducts([]); }
      } finally { if (!controller.signal.aborted) setCatalogLoading(false); }
    }
    fetchProducts();
    return () => controller.abort();
  }, [setCatalog, catalogVersion, retryKey]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setOrders([]);
    setSharedOrders([]);
    setError("");
    setOrdersError("");
    if (!user) {
      setLoading(false);
      setOrdersLoading(false);
      return () => controller.abort();
    }
    if (!ordersUrl) {
      const message = "Order history will be available when the store connects its orders API.";
      setError(message);
      setOrdersError(message);
      setLoading(false);
      setOrdersLoading(false);
      return () => controller.abort();
    }
    async function fetchOrders() {
      setLoading(true);
      setOrdersLoading(true);
      try {
        const response = await fetch(ordersUrl, {
          signal: controller.signal,
          headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || `Unable to load orders (${response.status}).`);
        const records = Array.isArray(payload) ? payload : payload?.orders;
        if (!Array.isArray(records)) throw new Error("The orders API must return an orders array.");
        const received = records.map((order) => {
          const id = order?.id ?? order?._id;
          const total = Number(order?.total);
          if (!id || !Array.isArray(order.items) || !Number.isFinite(total) || total < 0) throw new Error("The orders API returned an invalid order.");
          return { ...order, id: String(id), total };
        });
        if (active) {
          setOrders(received);
          setSharedOrders(received);
        }
      } catch (issue) {
        if (active && issue.name !== "AbortError") {
          setError(issue.message || "We couldn’t load your orders. Please try again.");
          setOrdersError(issue.message || "We couldn’t load your orders. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setOrdersLoading(false);
        }
      }
    }
    fetchOrders();
    return () => { active = false; controller.abort(); };
  }, [ordersUrl, user?.id, token, setSharedOrders, setOrdersLoading, setOrdersError]);

  return (
    <main id="main-content" className="buyer-page page-width mx-auto w-[calc(100%-2rem)] max-w-6xl py-10 sm:w-[calc(100%-4rem)] sm:py-16">
      <div className="section-heading flex flex-wrap items-end justify-between gap-6">
        <div><span className="eyebrow text-[10px] font-semibold tracking-[0.2em] text-[#82936e]">YOUR LITTLE CORNER</span><h1 className="mt-3 font-serif text-4xl sm:text-5xl">Welcome back, {user?.name?.split(" ")[0] || "friend"}.</h1><p className="mt-4 text-sm text-[#8a947f]">All your good finds, in one place.</p></div>
        <Link className="text-link inline-flex items-center gap-3 border-b border-[#a3b38c] pb-2 text-sm text-[#6f825d]" to="/products">Back to shopping <FiArrowRight /></Link>
      </div>
      {user ? <OrderHistory orders={orders} loading={loading} error={error} /> : <section className="my-10 rounded-xl border border-[#e2e7d9] bg-[#f5f7ef] p-6 sm:p-8"><h2 className="font-serif text-2xl">Your orders belong here.</h2><p className="mt-3 text-sm leading-relaxed text-[#829172]">Sign in to see your account and order history.</p><button className="mt-5 inline-flex items-center gap-4 rounded bg-[#234d39] px-5 py-3 text-sm text-white hover:bg-[#183e2b]" onClick={() => shop.openAuth("buyer", "signin")}>Sign in <FiArrowRight /></button></section>}
      <SavedFinds products={products} loading={catalogLoading} error={catalogError} onRetry={() => setRetryKey((key) => key + 1)} />
    </main>
  );
}
export default withShop(BuyerAccountPage);
