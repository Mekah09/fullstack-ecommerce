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
    <div className="dash-demo-banner flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-[#e0e7d6] bg-[#f0f5e8] px-4 py-3 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:text-[11px] [&>span]:font-medium [&_svg]:size-4 [&>p]:text-[11px] [&>p]:leading-5 [&>p]:text-[#7d8a6e]">
      <span>
        <Icon /> {label}
      </span>
      <p>{message}</p>
    </div>
  );
}
