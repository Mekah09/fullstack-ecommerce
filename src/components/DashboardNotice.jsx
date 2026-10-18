import { FiActivity, FiTruck, FiUsers } from "react-icons/fi";

const notices = {
  overview: {
    icon: FiActivity,
    label: "Your workspace",
    message:
      "This overview reflects the products, orders, and sellers returned by your API.",
  },
  sellers: {
    icon: FiUsers,
    label: "Seller community",
    message:
      "Review seller applications and send approval decisions to your backend.",
  },
  orders: {
    icon: FiTruck,
    label: "Order management",
    message: "Orders returned by your backend appear here.",
  },
};

export default function DashboardNotice({ tab }) {
  const { icon: Icon, label, message } = notices[tab];
  return (
    <div className="dash-demo-banner">
      <span>
        <Icon /> {label}
      </span>
      <p>{message}</p>
    </div>
  );
}
