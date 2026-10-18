import Dashboard from "./Dashboard.jsx";
import withShop from "./withShop.jsx";

function WorkspacePage({ role, shop }) {
  return (
    <main id="main-content">
      <Dashboard
        role={role}
        user={shop.user}
        products={shop.products}
        productsLoading={shop.loading}
        productsError={shop.loadError}
        orders={shop.orders}
        ordersLoading={shop.ordersLoading}
        ordersError={shop.ordersError}
        sellers={shop.sellers}
        sellersLoading={shop.sellersLoading}
        sellersError={shop.sellersError}
        onApproveSeller={shop.approveSeller}
        onAddProduct={shop.addProduct}
        onUpdateProduct={shop.updateProduct}
        onDeleteProduct={shop.deleteProduct}
        onToast={shop.notify}
        onBackToShop={() => shop.navigate("/")}
      />
    </main>
  );
}

export default withShop(WorkspacePage);
