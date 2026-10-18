import { Component } from "react";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardNotice from "./DashboardNotice.jsx";
import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardStats from "./DashboardStats.jsx";
import DeleteProductDialog from "./DeleteProductDialog.jsx";
import InventoryPanel from "./InventoryPanel.jsx";
import OrdersTable from "./OrdersTable.jsx";
import OverviewInsights from "./OverviewInsights.jsx";
import ProductForm from "./ProductForm.jsx";
import SellersPanel from "./SellersPanel.jsx";
import ShopSettings from "./ShopSettings.jsx";
import { getNavigation } from "./dashboardNavigation.jsx";
import "./dashboard.css";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "overview",
      search: "",
      modal: null,
      deleteProduct: null,
      deleting: false,
      deleteError: "",
      approvingId: null,
      approvalError: "",
      shopName: props.user?.shopName || props.user?.name || "My shop",
    };
  }

  saveProduct = async (values) => {
    const { modal } = this.state;
    if (modal?.id) await this.props.onUpdateProduct(modal.id, values);
    else await this.props.onAddProduct(values);
    this.props.onToast?.(modal?.id ? "Product updated." : "Product added.");
  };

  requestDelete = (product) => {
    this.setState({ deleteProduct: product, deleteError: "" });
  };

  confirmDelete = async () => {
    const { deleteProduct } = this.state;
    if (!deleteProduct || this.state.deleting) return;
    this.setState({ deleting: true, deleteError: "" });
    try {
      await this.props.onDeleteProduct(deleteProduct.id);
      this.setState({ deleteProduct: null });
      this.props.onToast?.("Product removed.");
    } catch (error) {
      this.setState({
        deleteError: error.message || "Could not remove this product.",
      });
    } finally {
      this.setState({ deleting: false });
    }
  };

  approveSeller = async (id) => {
    if (this.state.approvingId !== null) return;
    this.setState({ approvingId: id, approvalError: "" });
    try {
      if (!this.props.onApproveSeller)
        throw new Error("Seller approval is unavailable.");
      await this.props.onApproveSeller(id);
      this.props.onToast?.("Seller approved.");
    } catch (error) {
      this.setState({
        approvalError: error.message || "Could not approve this seller.",
      });
    } finally {
      this.setState({ approvingId: null });
    }
  };

  render() {
    const {
      role = "seller",
      user,
      products = [],
      orders = [],
      sellers = [],
      sellersError = "",
      ordersError = "",
      productsError = "",
      productsLoading = false,
      ordersLoading = false,
      sellersLoading = false,
      onBackToShop,
    } = this.props;
    const { tab, search, modal, shopName } = this.state;
    const admin = role === "admin";
    const managedProducts = admin
      ? products
      : products.filter(
          (product) =>
            (product.sellerId != null &&
              user?.id != null &&
              String(product.sellerId) === String(user.id)) ||
            (Boolean(user?.name) && product.seller === user.name),
        );
    const filteredProducts = managedProducts.filter((product) =>
      `${product.name || ""} ${product.category || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    const navigation = getNavigation(admin);
    const setTab = (nextTab) => this.setState({ tab: nextTab });
    const openProductForm = () => this.setState({ modal: {} });
    const inventoryProps = {
      managedProducts,
      filteredProducts,
      search,
      loading: productsLoading,
      error: productsError,
      onSearch: (value) => this.setState({ search: value }),
      onViewAll: () => setTab("products"),
      onAdd: openProductForm,
      onEdit: (product) => this.setState({ modal: product }),
      onDelete: this.requestDelete,
    };
    const sellerPanel = (
      <SellersPanel
        sellers={sellers}
        products={products}
        full={tab === "sellers"}
        loading={sellersLoading}
        error={this.state.approvalError || sellersError}
        approvingId={this.state.approvingId}
        onApprove={this.approveSeller}
      />
    );

    return (
      <div className="dash-layout">
        <DashboardSidebar
          admin={admin}
          shopName={shopName}
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
                products={managedProducts}
                orders={orders}
                sellers={sellers}
                productsLoading={productsLoading}
                ordersLoading={ordersLoading}
                sellersLoading={sellersLoading}
              />
              <OverviewInsights
                admin={admin}
                orders={orders}
                loading={ordersLoading}
                onViewSellers={() => setTab("sellers")}
                onAddProduct={openProductForm}
              />
              {admin ? (
                sellerPanel
              ) : (
                <InventoryPanel {...inventoryProps} compact />
              )}
              <OrdersTable
                orders={orders}
                loading={ordersLoading}
                error={ordersError}
              />
            </>
          )}
          {tab === "products" && <InventoryPanel {...inventoryProps} />}
          {tab === "sellers" && (
            <>
              <DashboardNotice tab="sellers" />
              {sellerPanel}
            </>
          )}
          {tab === "orders" && (
            <>
              <DashboardNotice tab="orders" />
              <OrdersTable
                orders={orders}
                loading={ordersLoading}
                error={ordersError}
                full
              />
            </>
          )}
          {tab === "settings" && (
            <ShopSettings
              shopName={shopName}
              user={user}
              onShopNameChange={(value) => this.setState({ shopName: value })}
              onSave={() =>
                this.props.onToast?.("Shop name applied for this session.")
              }
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
            sellerName={shopName}
            categories={[
              ...new Set(
                products.map((product) => product.category).filter(Boolean),
              ),
            ]}
            onSave={this.saveProduct}
            onClose={() => this.setState({ modal: null })}
          />
        )}
        {this.state.deleteProduct && (
          <DeleteProductDialog
            product={this.state.deleteProduct}
            busy={this.state.deleting}
            error={this.state.deleteError}
            onClose={() => this.setState({ deleteProduct: null })}
            onConfirm={this.confirmDelete}
          />
        )}
      </div>
    );
  }
}
