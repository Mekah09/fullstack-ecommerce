import { useState } from "react";
import { currency, demoOrders } from "./dashboardData.jsx";

export default function OrdersTable({ full = false }) {
  const [filter, setFilter] = useState("All orders");
  const orders =
    filter === "All orders"
      ? demoOrders
      : demoOrders.filter((order) => order.status === filter);
  return (
    <section className="dash-panel">
      <div className="dash-panel-title">
        <div>
          <h2>{full ? "Your orders" : "Recent orders"}</h2>
          <p>
            {full
              ? "Keep an eye on every little delivery."
              : "Good things, on their way."}
          </p>
        </div>
        <span className="dash-demo-label">Demo data</span>
      </div>
      {full && (
        <div className="dash-order-tabs">
          {["All orders", "Processing", "Shipped", "Delivered"].map((value) => (
            <button
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}
      <div className="dash-table-scroll">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                  <small>{order.product}</small>
                </td>
                <td>{order.customer}</td>
                <td className="dash-td-muted">{order.date}</td>
                <td>
                  <strong>{currency(order.total)}</strong>
                </td>
                <td>
                  <span
                    className={`dash-status dash-status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
