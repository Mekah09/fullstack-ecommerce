import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShopProvider from "./context/ShopProvider";
import AppLayout from "./components/layout/AppLayout";
import RequireRole from "./components/layout/RequireRole";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import BuyerAccountPage from "./pages/BuyerAccountPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="account" element={<BuyerAccountPage />} />
            <Route
              path="seller"
              element={
                <RequireRole role="seller">
                  <SellerDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path="admin"
              element={
                <RequireRole role="admin">
                  <AdminDashboardPage />
                </RequireRole>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
