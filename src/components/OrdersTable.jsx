import { Component } from "react";
import { currency } from "./dashboardData.jsx";

const displayStatus = (status) => {
  const value = String(status || "Pending");
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default class OrdersTable extends Component {
  state = { filter: "All orders" };

  render() {
    const {
      full = false,
      orders = [],
      error = "",
      loading = false,
    } = this.props;
    const { filter } = this.state;
    const statuses = [
      ...new Set(orders.map((order) => displayStatus(order.status))),
    ];
    const filtered =
      filter === "All orders"
        ? orders
        : orders.filter((order) => displayStatus(order.status) === filter);
    const visible = full ? filtered : filtered.slice(0, 4);
    return (
      <section className="dash-panel">
        <div className="dash-panel-title">
          <div>
            <h2>{full ? "Your orders" : "Recent orders"}</h2>
            <p>Keep track of the orders returned by your backend.</p>
          </div>
        </div>
        {error && (
          <p className="dash-form-error" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <div className="dash-empty" role="status">
            <p>Loading orders…</p>
          </div>
        )}
        {full && orders.length > 0 && (
          <div className="dash-order-tabs">
            {["All orders", ...statuses].map((value) => (
              <button
                key={value}
                className={filter === value ? "active" : ""}
                onClick={() => this.setState({ filter: value })}
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
              {visible.map((order) => {
                const status = displayStatus(order.status);
                const date = order.createdAt ? new Date(order.createdAt) : null;
                const dateLabel =
                  date && !Number.isNaN(date.getTime())
                    ? date.toLocaleDateString()
                    : "—";
                const customer =
                  order.shippingAddress?.name ||
                  order.customer?.name ||
                  order.customerName ||
                  "—";
                return (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <small>
                        {(order.items || [])
                          .map((item) => item.name || item.product?.name)
                          .filter(Boolean)
                          .join(", ") || `${order.items?.length || 0} items`}
                      </small>
                    </td>
                    <td>{customer}</td>
                    <td className="dash-td-muted">{dateLabel}</td>
                    <td>
                      <strong>{currency(order.total)}</strong>
                    </td>
                    <td>
                      <span
                        className={`dash-status dash-status-${status.toLowerCase().replace(/[^a-z0-9-]/g, "")}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && !error && visible.length === 0 && (
            <div className="dash-empty">
              <h3>
                {orders.length ? "No orders in this status" : "No orders yet"}
              </h3>
              <p>
                {orders.length
                  ? "Choose another status to see more orders."
                  : "Your API orders will appear here when available."}
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }
}
