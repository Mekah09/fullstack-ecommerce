import {
  FiActivity,
  FiArrowLeft,
  FiChevronDown,
  FiGrid,
  FiShoppingBag,
} from "react-icons/fi";

export default function DashboardSidebar({
  admin,
  shopName,
  navigation,
  tab,
  onTabChange,
  productCount,
  sellers,
  user,
  onBackToShop,
}) {
  return (
    <aside className="dash-sidebar">
      <div className="dash-workspace">
        <span className="dash-workspace-icon">
          {admin ? <FiGrid /> : <FiShoppingBag />}
        </span>
        <div>
          <strong>{admin ? "Nook workspace" : shopName}</strong>
          <span>{admin ? "Administrator" : "Seller workspace"}</span>
        </div>
        <FiChevronDown />
      </div>
      <span className="dash-nav-caption">WORKSPACE</span>
      <nav aria-label="Dashboard navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`dash-nav-item ${tab === id ? "active" : ""}`}
            onClick={() => onTabChange(id)}
          >
            <Icon />
            {label}
            {id === "products" && <span>{productCount}</span>}
            {id === "sellers" && (
              <span>
                {sellers.filter((seller) => seller.status === "Pending").length}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="dash-sidebar-bottom">
        <div className="dash-sidebar-tip">
          <span>
            Small shops.
            <br />
            Big possibilities.
          </span>
          <p>
            Thoughtful things start
            <br />
            with people like you.
          </p>
          <FiActivity />
        </div>
        <button className="dash-back" onClick={onBackToShop}>
          <FiArrowLeft /> Back to storefront
        </button>
        <div className="dash-user">
          <span>
            {(user?.name || "Nook Seller")
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <strong>
              {user?.name || (admin ? "Nook Admin" : "Nook Seller")}
            </strong>
            <small>{user?.email || "Welcome to your workspace"}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
