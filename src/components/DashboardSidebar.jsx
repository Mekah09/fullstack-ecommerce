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
    <aside className="dash-sidebar min-w-0 rounded-xl border border-[#e4e8dd] bg-[#f5f7ef] p-4 lg:sticky lg:top-6 lg:min-h-[720px]">
      <div className="dash-workspace flex items-center gap-3 border-b border-[#e0e6d8] pb-5 [&>div]:min-w-0 [&_strong]:block [&_strong]:truncate [&_strong]:text-sm [&_span]:text-xs [&>svg]:ml-auto [&>svg]:size-3 [&_div>span]:text-[#7c8574]">
        <span className="dash-workspace-icon grid size-10 shrink-0 place-items-center rounded-lg bg-[#234d39] text-white [&_svg]:size-5">
          {admin ? <FiGrid /> : <FiShoppingBag />}
        </span>
        <div>
          <strong>{admin ? "Nook workspace" : shopName}</strong>
          <span>{admin ? "Administrator" : "Seller workspace"}</span>
        </div>
        <FiChevronDown />
      </div>
      <span className="dash-nav-caption mb-3 mt-6 block text-[9px] font-semibold tracking-[0.2em] text-[#849078]">WORKSPACE</span>
      <nav className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible" aria-label="Dashboard navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`dash-nav-item flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-xs transition hover:bg-[#eaf0e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7f9a6b] [&>svg]:size-4 [&>span]:ml-auto [&>span]:rounded-full [&>span]:bg-white/70 [&>span]:px-2 [&>span]:py-0.5 [&>span]:text-[10px] ${tab === id ? "active bg-[#e2ecd6] font-semibold text-[#234d39]" : "text-[#7b896e]"}`}
            onClick={() => onTabChange(id)}
          >
            <Icon />
            {label}
            {id === "products" && <span>{productCount}</span>}
            {id === "sellers" && (
              <span>
                {
                  sellers.filter(
                    (seller) =>
                      String(seller.status).toLowerCase() === "pending",
                  ).length
                }
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="dash-sidebar-bottom mt-5 space-y-4 border-t border-[#e0e6d8] pt-5 lg:mt-14">
        <div className="dash-sidebar-tip relative hidden overflow-hidden rounded-lg bg-[#e8eedf] p-4 lg:block [&>span]:font-serif [&>span]:text-2xl [&>p]:mt-2 [&>p]:text-[11px] [&>p]:leading-5 [&>p]:text-[#6a785f] [&>svg]:absolute [&>svg]:bottom-4 [&>svg]:right-4 [&>svg]:size-7 [&>svg]:text-[#9eb08e]">
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
        <button className="dash-back flex items-center gap-2 text-xs text-[#5f7053] transition hover:text-[#234d39] [&_svg]:size-4" onClick={onBackToShop}>
          <FiArrowLeft /> Back to storefront
        </button>
        <div className="dash-user flex items-center gap-3 [&>span]:grid [&>span]:size-9 [&>span]:shrink-0 [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-[#dfe8d3] [&>span]:text-xs [&>span]:font-semibold [&>div]:min-w-0 [&_strong]:block [&_strong]:truncate [&_strong]:text-xs [&_small]:block [&_small]:truncate [&_small]:text-[10px] [&_small]:text-[#7c8574]">
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
