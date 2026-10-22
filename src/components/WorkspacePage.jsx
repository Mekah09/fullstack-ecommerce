import { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Dashboard from "./Dashboard.jsx";

export default function WorkspacePage({ role, products, loading, error, onRetry }) {
  const shop = useContext(ShopContext);
  const requestedTab = new URLSearchParams(shop.location.search).get("tab");
  const initialTab = ["overview", "products", "orders", role === "admin" ? "sellers" : "settings"].includes(requestedTab) ? requestedTab : "overview";
  return (
    <main id="main-content">
      {error && <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 bg-red-50 px-6 py-4 text-sm text-red-800" role="alert"><p>{error}</p><button onClick={onRetry} className="shrink-0 rounded-lg border border-red-200 px-4 py-2">Try again</button></div>}
      <Dashboard role={role} initialTab={initialTab} user={shop.user} products={products} createdProductIds={shop.createdProductIds}
        productsLoading={loading} productsError={error} orders={shop.orders} ordersLoading={shop.ordersLoading}
        ordersError={shop.ordersError} sellers={shop.sellers} sellersLoading={shop.sellersLoading} sellersError={shop.sellersError}
        onApproveSeller={shop.approveSeller} onAddProduct={shop.recordProduct} onUpdateProduct={shop.updateProduct}
        onDeleteProduct={shop.deleteProduct} onToast={shop.notify} onBackToShop={() => shop.navigate("/")}
        onAddProductPage={() => shop.navigate(`/${role}/add-product`)} />
    </main>
  );
}
