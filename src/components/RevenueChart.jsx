import { FiTrendingUp } from "react-icons/fi";

export default function RevenueChart({ admin }) {
  return (
    <section className="dash-panel dash-chart-panel">
      <div className="dash-panel-title">
        <div>
          <h2>{admin ? "Marketplace performance" : "Revenue overview"}</h2>
          <p>A little growth, every day.</p>
        </div>
        <span className="dash-demo-label">Demo data</span>
      </div>
      <div className="dash-chart-total">
        {admin ? "$42,856" : "$8,240"}
        <span>
          <FiTrendingUp /> 18.6% this month
        </span>
      </div>
      <div
        className="dash-chart"
        role="img"
        aria-label="Demo revenue grows steadily from January through June"
      >
        <div className="dash-chart-y">
          <span>$10k</span>
          <span>$7.5k</span>
          <span>$5k</span>
          <span>$2.5k</span>
        </div>
        <div className="dash-chart-body">
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="dashChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8baa7e" stopOpacity=".24" />
                <stop offset="100%" stopColor="#8baa7e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="#e8ebe4" strokeDasharray="4 5">
              <path d="M0 15H600M0 65H600M0 115H600M0 165H600" />
            </g>
            <path
              d="M0 151C25 151 38 135 60 138S104 164 130 128S165 107 190 116S229 138 254 97S298 103 325 83S358 106 383 66S423 75 450 43S488 64 510 35S559 55 600 14V180H0Z"
              fill="url(#dashChartFill)"
            />
            <path
              d="M0 151C25 151 38 135 60 138S104 164 130 128S165 107 190 116S229 138 254 97S298 103 325 83S358 106 383 66S423 75 450 43S488 64 510 35S559 55 600 14"
              fill="none"
              stroke="#3d6b4e"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="dash-chart-x">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
