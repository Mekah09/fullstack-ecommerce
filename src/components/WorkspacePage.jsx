import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import { useShop } from "../hooks/useShop.jsx";

export default function WorkspacePage({ role }) {
  const shop = useShop();
  const navigate = useNavigate();
  return (
    <main id="main-content">
      <Dashboard
        role={role}
        user={shop.user}
        products={shop.products}
        onAddProduct={shop.addProduct}
        onUpdateProduct={shop.updateProduct}
        onDeleteProduct={shop.deleteProduct}
        onToast={shop.notify}
        onBackToShop={() => navigate("/")}
      />
    </main>
  );
}
