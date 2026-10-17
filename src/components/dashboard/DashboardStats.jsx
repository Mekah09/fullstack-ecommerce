import {
  FiArrowUpRight,
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

export default function DashboardStats({
  admin,
  productCount,
  stockCount,
  sellers,
}) {
  return (
    <div className="dash-stats">
      {[
        {
          label: admin ? "Total revenue" : "Total sales",
          value: admin ? "$42,856" : "$8,240",
          icon: FiDollarSign,
          change: "+18.6%",
          note: "vs. last month",
          demo: true,
        },
        {
          label: "Orders",
          value: admin ? "384" : "128",
          icon: FiShoppingCart,
          change: "+12.8%",
          note: "vs. last month",
          demo: true,
        },
        {
          label: admin ? "Marketplace products" : "Active products",
          value: productCount.toString().padStart(2, "0"),
          icon: FiPackage,
          change: `${stockCount}`,
          note: "units in your catalog",
        },
        {
          label: admin ? "Active sellers" : "Shop visitors",
          value: admin
            ? sellers
                .filter((seller) => seller.status === "Approved")
                .length.toString()
                .padStart(2, "0")
            : "2,486",
          icon: FiUsers,
          change: admin
            ? `${sellers.filter((seller) => seller.status === "Pending").length} pending`
            : "+24.2%",
          note: admin ? "applications" : "vs. last month",
          demo: true,
        },
      ].map(({ label, value, icon: Icon, change, note, demo }) => (
        <section className="dash-stat" key={label}>
          <div>
            <span>{label}</span>
            <span className="dash-stat-icon">
              <Icon />
            </span>
          </div>
          <strong>{value}</strong>
          <p>
            <span>
              {!change.includes("pending") && <FiArrowUpRight />}
              {change}
            </span>{" "}
            {note}
            {demo && <small>Demo</small>}
          </p>
        </section>
      ))}
    </div>
  );
}
