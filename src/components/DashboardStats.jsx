import {
  FiCreditCard,
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
      icon: FiCreditCard,
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
    <div className="dash-stats grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, note }) => (
        <section className="dash-stat min-w-0 rounded-xl border border-[#e4e8dd] bg-white p-5 [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:gap-2 [&>div>span:first-child]:text-[11px] [&>div>span:first-child]:text-[#7b866f] [&>strong]:mt-4 [&>strong]:block [&>strong]:break-words [&>strong]:text-2xl [&>strong]:font-medium [&>p]:mt-2 [&>p]:text-[10px] [&>p]:leading-5 [&>p]:text-[#929b88]" key={label}>
          <div>
            <span>{label}</span>
            <span className="dash-stat-icon grid size-8 shrink-0 place-items-center rounded-lg bg-[#eef3e7] text-[#5c7752] [&_svg]:size-4">
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
