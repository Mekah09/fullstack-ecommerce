import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext.jsx";
import ProductForm from "../components/ProductForm.jsx";

export default function AddProductPage() {
  const { products, recordProduct, notify } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const workspace = location.pathname.startsWith("/admin") ? "/admin" : "/seller";
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link to={workspace} className="mb-8 inline-flex items-center gap-2 text-sm text-[#58724d]"><FiArrowLeft /> Back to {workspace === "/admin" ? "admin" : "your shop"}</Link>
      <ProductForm standalone categories={[...new Set(products.map((product) => product.category).filter(Boolean))]}
        onSave={(product) => { recordProduct(product); notify("Your product has been added to the store."); }}
        onClose={() => navigate(`${workspace}?tab=products`)} />
    </main>
  );
}
