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
    <section className="dash-panel dash-chart-panel">
      <div className="dash-panel-title">
        <div>
          <h2>{admin ? "Marketplace performance" : "Revenue overview"}</h2>
          <p>
            Daily totals from loaded orders, excluding cancellations and
            refunds.
          </p>
        </div>
      </div>
      <div className="dash-chart-total">
        {loading ? "—" : currency(total)}
        <span>{revenueOrders.length} orders</span>
      </div>
      {loading ? (
        <div className="dash-empty" role="status">
          <p>Loading order revenue…</p>
        </div>
      ) : !series.length ? (
        <div className="dash-empty">
          <h3>No revenue history yet</h3>
          <p>Orders with dates will appear in your revenue chart.</p>
        </div>
      ) : (
        <div
          className="dash-chart"
          role="img"
          aria-label={`Daily revenue for ${series.length} days, total ${currency(total)}`}
        >
          <div className="dash-chart-y">
            <span>{currency(maximum)}</span>
            <span>{currency(maximum / 2)}</span>
            <span>{currency(0)}</span>
          </div>
          <div className="dash-chart-body">
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
            <div className="dash-chart-x">
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
