import { FiActivity, FiTruck, FiUsers } from "react-icons/fi";

const notices = {
  overview: {
    icon: FiActivity,
    label: "Demo overview",
    message:
      "Sales, orders, and seller approvals use sample data. Product changes are saved to your current catalog.",
  },
  sellers: {
    icon: FiUsers,
    label: "Demo community",
    message:
      "Seller applications are illustrative. Approvals apply only to this preview session.",
  },
  orders: {
    icon: FiTruck,
    label: "Demo orders",
    message:
      "Your live orders will appear here once your backend is connected.",
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
