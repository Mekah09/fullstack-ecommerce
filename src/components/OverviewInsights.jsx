import { FiArrowRight, FiTrendingUp } from "react-icons/fi";
import RevenueChart from "./RevenueChart.jsx";

export default function OverviewInsights({
  admin,
  onViewSellers,
  onAddProduct,
}) {
  return (
    <div className="dash-overview-grid">
      <RevenueChart admin={admin} />
      <section className="dash-panel dash-insight">
        <span className="dash-insight-icon">
          <FiTrendingUp />
        </span>
        <span className="dash-eyebrow">A GOOD THING GROWING</span>
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
        <div className="dash-insight-doodle" aria-hidden="true">
          ✳
        </div>
      </section>
    </div>
  );
}
