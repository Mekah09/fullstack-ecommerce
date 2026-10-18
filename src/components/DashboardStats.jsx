import {
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import { countsTowardRevenue, currency } from "./dashboardData.jsx";
import { hasStockLimit } from "../utils/cart.jsx";

export default function DashboardStats({
  admin,
  products = [],
  orders = [],
  sellers = [],
  productsLoading = false,
  ordersLoading = false,
  sellersLoading = false,
}) {
  const revenue = orders
    .filter(countsTowardRevenue)
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const stock = products.reduce(
    (sum, product) => sum + (Number(product.stock) || 0),
    0,
  );
  const stockProvided = products.every((product) => hasStockLimit(product.stock));
  const approved = sellers.filter(
    (seller) => String(seller.status).toLowerCase() === "approved",
  ).length;
  const pending = sellers.filter(
    (seller) => String(seller.status).toLowerCase() === "pending",
  ).length;
  const stats = [
    {
      label: admin ? "Total revenue" : "Total sales",
      value: ordersLoading ? "—" : currency(revenue),
      icon: FiDollarSign,
      note: "From loaded orders",
    },
    {
      label: "Orders",
      value: ordersLoading ? "—" : orders.length,
      icon: FiShoppingCart,
      note: "Orders returned by your API",
    },
    {
      label: admin ? "Marketplace products" : "Active products",
      value: productsLoading ? "—" : products.length,
      icon: FiPackage,
      note: "Products in your catalog",
    },
    admin
      ? {
          label: "Active sellers",
          value: sellersLoading ? "—" : approved,
          icon: FiUsers,
          note: `${pending} pending applications`,
        }
      : {
          label: "Units in stock",
          value: productsLoading || !stockProvided ? "—" : stock,
          icon: FiPackage,
          note: stockProvided
            ? "Across your product inventory"
            : "Stock not provided by your API",
        },
  ];
  return (
    <div className="dash-stats">
      {stats.map(({ label, value, icon: Icon, note }) => (
        <section className="dash-stat" key={label}>
          <div>
            <span>{label}</span>
            <span className="dash-stat-icon">
              <Icon />
            </span>
          </div>
          <strong>{value}</strong>
          <p>{note}</p>
        </section>
      ))}
    </div>
  );
}
