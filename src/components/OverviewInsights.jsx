import { FiArrowRight, FiTrendingUp } from "react-icons/fi";
import RevenueChart from "./RevenueChart.jsx";

export default function OverviewInsights({
  admin,
  orders = [],
  loading = false,
  onViewSellers,
  onAddProduct,
}) {
  return (
    <div className="dash-overview-grid grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <RevenueChart admin={admin} orders={orders} loading={loading} />
      <section className="dash-panel min-w-0 overflow-hidden rounded-xl border border-[#e4e8dd] bg-white dash-insight relative overflow-hidden bg-[#edf2e4] p-6 [&>h2]:mt-3 [&>h2]:max-w-64 [&>h2]:font-serif [&>h2]:text-3xl [&>h2]:leading-tight [&>h2]:tracking-[-0.03em] [&>p]:mt-4 [&>p]:max-w-72 [&>p]:text-xs [&>p]:leading-6 [&>p]:text-[#7c8b6c] [&>button]:relative [&>button]:z-10 [&>button]:mt-5 [&>button]:inline-flex [&>button]:items-center [&>button]:gap-2 [&>button]:text-xs [&>button]:font-medium [&>button]:hover:underline">
        <span className="dash-insight-icon mb-5 grid size-9 place-items-center rounded-full bg-[#dae6ca] text-[#64834f] [&_svg]:size-4">
          <FiTrendingUp />
        </span>
        <span className="dash-eyebrow text-[9px] font-semibold tracking-[0.18em] text-[#7b8b6b]">A GOOD THING GROWING</span>
        <h2>
          {admin
            ? "A community with good taste."
            : "Your next good thing is waiting."}
        </h2>
        <p>
          {admin
            ? "Give independent shops a place to shine. Review new applications and keep your marketplace thoughtfully curated."
            : "A beautiful collection starts with one thoughtful addition. Share what you love with someone who will love it too."}
        </p>
        <button onClick={() => (admin ? onViewSellers() : onAddProduct())}>
          {admin ? "Meet your sellers" : "Grow your collection"}
          <FiArrowRight />
        </button>
        <div className="dash-insight-doodle pointer-events-none absolute -bottom-8 -right-3 text-[150px] leading-none text-[#dbe5cd]" aria-hidden="true">
          ✳
        </div>
      </section>
    </div>
  );
}
