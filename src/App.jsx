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
import AddProductPage from "./pages/AddProductPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#fffefa] font-sans text-[#263e31] antialiased selection:bg-[#dbe6cf] selection:text-[#234d39] [&_svg]:shrink-0 [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_input]:accent-[#234d39] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[#8d9e73] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#8d9e73]">
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
            <Route path="seller/add-product" element={<RequireRole role="seller"><AddProductPage /></RequireRole>} />
            <Route path="admin/add-product" element={<RequireRole role="admin"><AddProductPage /></RequireRole>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ShopProvider>
    </AppRouter>
    </div>
  );
}
