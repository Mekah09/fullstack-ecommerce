import { Route, Routes } from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import ShopProvider from "./components/ShopProvider.jsx";
import AppLayout from "./components/AppLayout.jsx";
import RequireRole from "./components/RequireRole.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import BuyerAccountPage from "./pages/BuyerAccountPage.jsx";
import SellerDashboardPage from "./pages/SellerDashboardPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./App.css";

export default function App() {
  return (
    <AppRouter>
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
    </AppRouter>
  );
}
