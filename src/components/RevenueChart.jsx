import { currency, countsTowardRevenue } from "./dashboardData.jsx";

export default function RevenueChart({ admin, orders = [], loading = false }) {
  const revenueOrders = orders.filter(countsTowardRevenue);
  const total = revenueOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  );
  const daily = new Map();
  revenueOrders.forEach((order) => {
    const date = order.createdAt ? new Date(order.createdAt) : null;
    if (!date || Number.isNaN(date.getTime())) return;
    const day = date.toISOString().slice(0, 10);
    daily.set(day, (daily.get(day) || 0) + (Number(order.total) || 0));
  });
  const series = [...daily.entries()].sort(([a], [b]) => a.localeCompare(b));
  const maximum = Math.max(1, ...series.map(([, amount]) => amount));
  const points = series.map(([, amount], index) => {
    const x = series.length === 1 ? 300 : (index / (series.length - 1)) * 600;
    return `${x},${165 - (amount / maximum) * 150}`;
  });
  const labels =
    series.length <= 6
      ? series
      : series.filter(
          (_, index) =>
            index === 0 ||
            index === series.length - 1 ||
            index % Math.ceil(series.length / 5) === 0,
        );
  return (
    <section className="dash-panel min-w-0 overflow-hidden rounded-xl border border-[#e4e8dd] bg-white dash-chart-panel">
      <div className="dash-panel-title flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0e7] p-5 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mt-1 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#8a947e]">
        <div>
          <h2>{admin ? "Marketplace performance" : "Revenue overview"}</h2>
          <p>
            Daily totals from loaded orders, excluding cancellations and
            refunds.
          </p>
        </div>
      </div>
      <div className="dash-chart-total flex flex-wrap items-baseline gap-3 px-5 pt-5 text-2xl font-medium [&_span]:text-[11px] [&_span]:font-normal [&_span]:text-[#92a080]">
        {loading ? "—" : currency(total)}
        <span>{revenueOrders.length} orders</span>
      </div>
      {loading ? (
        <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5" role="status">
          <p>Loading order revenue…</p>
        </div>
      ) : !series.length ? (
        <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5">
          <h3>No revenue history yet</h3>
          <p>Orders with dates will appear in your revenue chart.</p>
        </div>
      ) : (
        <div
          className="dash-chart grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-5"
          role="img"
          aria-label={`Daily revenue for ${series.length} days, total ${currency(total)}`}
        >
          <div className="dash-chart-y flex flex-col justify-between pb-6 text-[9px] text-[#8a957f]">
            <span>{currency(maximum)}</span>
            <span>{currency(maximum / 2)}</span>
            <span>{currency(0)}</span>
          </div>
          <div className="dash-chart-body min-w-0 [&>svg]:block [&>svg]:h-40 [&>svg]:w-full">
            <svg
              viewBox="0 0 600 180"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <g stroke="#e8ebe4" strokeDasharray="4 5">
                <path d="M0 15H600M0 90H600M0 165H600" />
              </g>
              {points.length > 1 && (
                <polyline
                  points={points.join(" ")}
                  fill="none"
                  stroke="#3d6b4e"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {points.map((point, index) => {
                const [x, y] = point.split(",");
                return (
                  <circle
                    key={series[index][0]}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3d6b4e"
                  />
                );
              })}
            </svg>
            <div className="dash-chart-x mt-3 flex justify-between gap-1 text-[9px] text-[#8a957f]">
              {labels.map(([day]) => (
                <span key={day}>
                  {new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
