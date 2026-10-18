import DashboardHeader from "./DashboardHeader.jsx";
import DashboardNotice from "./DashboardNotice.jsx";
import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardStats from "./DashboardStats.jsx";
import DeleteProductDialog from "./DeleteProductDialog.jsx";
import InventoryPanel from "./InventoryPanel.jsx";
import OrdersTable from "./OrdersTable.jsx";
import OverviewInsights from "./OverviewInsights.jsx";
import ProductForm from "./ProductForm.jsx";
import ProductInspiration from "./ProductInspiration.jsx";
import SellersPanel from "./SellersPanel.jsx";
import ShopSettings from "./ShopSettings.jsx";
import { getNavigation } from "./dashboardNavigation.jsx";
import useDashboard from "./useDashboard.jsx";
import "./dashboard.css";

export default function Dashboard({
  role = "seller",
  user,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToast,
  onBackToShop,
}) {
  const dashboard = useDashboard({
    role,
    user,
    products,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onToast,
  });
  const { admin, tab, setTab, modal, setModal, managedProducts, sellers } =
    dashboard;
  const navigation = getNavigation(admin);
  const openProductForm = () => setModal({});
  const inventoryProps = {
    managedProducts,
    filteredProducts: dashboard.filteredProducts,
    search: dashboard.search,
    onSearch: dashboard.setSearch,
    onViewAll: () => setTab("products"),
    onAdd: openProductForm,
    onEdit: setModal,
    onDelete: dashboard.requestDelete,
  };
  const sellerPanel = (
    <SellersPanel
      sellers={sellers}
      full={tab === "sellers"}
      onApprove={dashboard.approveSeller}
    />
  );

  return (
    <div className="dash-layout">
      <DashboardSidebar
        admin={admin}
        shopName={dashboard.shopName}
        navigation={navigation}
        tab={tab}
        onTabChange={setTab}
        productCount={managedProducts.length}
        sellers={sellers}
        user={user}
        onBackToShop={onBackToShop}
      />
      <div className="dash-main">
        <DashboardHeader
          admin={admin}
          tab={tab}
          navigation={navigation}
          onAddProduct={openProductForm}
        />
        {tab === "overview" && (
          <>
            <DashboardNotice tab="overview" />
            <DashboardStats
              admin={admin}
              productCount={managedProducts.length}
              stockCount={dashboard.stockCount}
              sellers={sellers}
            />
            <OverviewInsights
              admin={admin}
              onViewSellers={() => setTab("sellers")}
              onAddProduct={openProductForm}
            />
            {admin ? (
              sellerPanel
            ) : (
              <InventoryPanel {...inventoryProps} compact />
            )}
            <OrdersTable />
          </>
        )}
        {tab === "products" && (
          <>
            <InventoryPanel {...inventoryProps} />
            {dashboard.sampleProducts.length > 0 && (
              <ProductInspiration products={dashboard.sampleProducts} />
            )}
          </>
        )}
        {tab === "sellers" && (
          <>
            <DashboardNotice tab="sellers" />
            {sellerPanel}
          </>
        )}
        {tab === "orders" && (
          <>
            <DashboardNotice tab="orders" />
            <OrdersTable full />
          </>
        )}
        {tab === "settings" && (
          <ShopSettings
            shopName={dashboard.shopName}
            user={user}
            onShopNameChange={dashboard.setShopName}
            onSave={() => onToast?.("Shop name updated for this session.")}
          />
        )}
        <footer className="dash-footer">
          <span>A little more considered. A little more Nook.</span>
          <span>Made for everyday living. ✳</span>
        </footer>
      </div>
      {modal && (
        <ProductForm
          product={modal.id ? modal : null}
          sellerName={dashboard.shopName}
          onSave={dashboard.saveProduct}
          onClose={() => setModal(null)}
        />
      )}
      {dashboard.deleteProduct && (
        <DeleteProductDialog
          product={dashboard.deleteProduct}
          busy={dashboard.deleting}
          error={dashboard.deleteError}
          onClose={() => dashboard.setDeleteProduct(null)}
          onConfirm={dashboard.confirmDelete}
        />
      )}
    </div>
  );
}
