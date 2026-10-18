import { useMemo, useState } from "react";
import { API_BASE_URL } from "../services/api.jsx";
import { initialSellers } from "./dashboardData.jsx";

export default function useDashboard({
  role,
  user,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToast,
}) {
  const admin = role === "admin";
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [sellers, setSellers] = useState(initialSellers);
  const [shopName, setShopName] = useState(
    user?.name ? `${user.name.split(" ")[0]}'s shop` : "My Nook shop",
  );
  const managedProducts = useMemo(
    () =>
      admin
        ? products
        : products.filter(
            (product) =>
              (product.sellerId && product.sellerId === user?.id) ||
              product.seller === user?.name,
          ),
    [admin, products, user?.id, user?.name],
  );
  const sampleProducts =
    !admin && !API_BASE_URL
      ? products
          .filter((product) => !managedProducts.includes(product))
          .slice(0, 4)
      : [];
  const filteredProducts = useMemo(
    () =>
      managedProducts.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [managedProducts, search],
  );
  const stockCount = managedProducts.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );

  async function saveProduct(values) {
    if (modal?.id) await onUpdateProduct(modal.id, values);
    else await onAddProduct(values);
    onToast?.(
      modal?.id
        ? "Product updated successfully."
        : "Your new product is ready to discover.",
    );
  }

  function requestDelete(product) {
    setDeleteProduct(product);
    setDeleteError("");
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await onDeleteProduct(deleteProduct.id);
      setDeleteProduct(null);
      onToast?.("Product removed from your collection.");
    } catch (error) {
      setDeleteError(
        error.message || "We couldn’t remove this product. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function approveSeller(id) {
    setSellers((current) =>
      current.map((seller) =>
        seller.id === id ? { ...seller, status: "Approved" } : seller,
      ),
    );
    onToast?.("Seller approved in this demo.");
  }

  return {
    admin,
    tab,
    setTab,
    search,
    setSearch,
    modal,
    setModal,
    deleteProduct,
    setDeleteProduct,
    deleting,
    deleteError,
    requestDelete,
    sellers,
    shopName,
    setShopName,
    managedProducts,
    sampleProducts,
    filteredProducts,
    stockCount,
    saveProduct,
    confirmDelete,
    approveSeller,
  };
}
