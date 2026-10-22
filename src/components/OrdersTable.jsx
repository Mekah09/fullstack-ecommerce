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
      <section className="dash-panel min-w-0 overflow-hidden rounded-xl border border-[#e4e8dd] bg-white">
        <div className="dash-panel-title flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0e7] p-5 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mt-1 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#8a947e]">
          <div>
            <h2>{full ? "Your orders" : "Recent orders"}</h2>
            <p>Keep track of the orders returned by your backend.</p>
          </div>
        </div>
        {error && (
          <p className="dash-form-error m-4 rounded-md border border-[#f0d5cf] bg-[#fcf1ee] px-4 py-3 text-xs leading-6 text-[#a64e43]" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5" role="status">
            <p>Loading orders…</p>
          </div>
        )}
        {full && orders.length > 0 && (
          <div className="dash-order-tabs flex flex-wrap gap-2 border-b border-[#edf0e7] px-5 py-3">
            {["All orders", ...statuses].map((value) => (
              <button
                key={value}
                className={`rounded-md px-3 py-2 text-[11px] transition hover:bg-[#f0f4e9] ${filter === value ? "active bg-[#e9f0df] font-medium text-[#3f6236]" : "text-[#89947c]"}`}
                onClick={() => this.setState({ filter: value })}
              >
                {value}
              </button>
            ))}
          </div>
        )}
        <div className="dash-table-scroll relative max-w-full overflow-x-auto">
          <table className="dash-table w-full min-w-[630px] border-collapse text-left text-xs [&_th]:border-b [&_th]:border-[#edf0e7] [&_th]:bg-[#fbfcf8] [&_th]:px-5 [&_th]:py-3 [&_th]:text-[10px] [&_th]:font-medium [&_th]:text-[#8a957f] [&_td]:border-b [&_td]:border-[#edf0e7] [&_td]:px-5 [&_td]:py-4 [&_tr:last-child_td]:border-b-0 [&_strong]:font-medium [&_small]:mt-1 [&_small]:block [&_small]:max-w-52 [&_small]:truncate [&_small]:text-[10px] [&_small]:text-[#8a957f]">
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
                    <td className="dash-td-muted text-[#86917c]">{dateLabel}</td>
                    <td>
                      <strong>{currency(order.total)}</strong>
                    </td>
                    <td>
                      <span
                        className={`dash-status inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] ${["delivered", "completed", "paid"].includes(status.toLowerCase()) ? "bg-[#edf4e6] text-[#66844f]" : ["cancelled", "canceled", "refunded"].includes(status.toLowerCase()) ? "bg-[#fcf0e9] text-[#aa6f56]" : "bg-[#f4f1df] text-[#988440]"}`}
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
            <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5">
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
