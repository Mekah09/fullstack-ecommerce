import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import OrderHistory from "../components/account/OrderHistory";
import SavedFinds from "../components/account/SavedFinds";

export default function BuyerAccountPage() {
  const { user } = useShop();
  return (
    <main id="main-content" className="buyer-page page-width">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR LITTLE CORNER</span>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "friend"}.</h1>
          <p>All your good finds, in one place.</p>
        </div>
        <Link className="text-link" to="/products">
          Back to shopping <FiArrowRight />
        </Link>
      </div>
      <OrderHistory />
      <SavedFinds />
    </main>
  );
}
