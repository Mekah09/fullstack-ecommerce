import { FiCheck, FiCheckCircle } from "react-icons/fi";

export default function SellersPanel({
  sellers = [],
  products = [],
  full = false,
  onApprove,
  approvingId = null,
  error = "",
  loading = false,
}) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-title">
        <div>
          <h2>{full ? "Our seller community" : "Seller applications"}</h2>
          <p>Manage seller applications returned by your backend.</p>
        </div>
      </div>
      {error && (
        <p className="dash-form-error" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <div className="dash-empty" role="status">
          <p>Loading seller applications…</p>
        </div>
      )}
      <div className="dash-table-scroll">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Shop</th>
              <th>Products</th>
              <th>Status</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => {
              const status = String(seller.status || "pending").toLowerCase();
              const name =
                seller.shopName || seller.name || seller.email || "Seller";
              const productCount = Array.isArray(seller.products)
                ? seller.products.length
                : Number(
                    seller.productCount ??
                      seller.products ??
                      products.filter(
                        (product) =>
                          String(product.sellerId) === String(seller.id),
                      ).length,
                  ) || 0;
              return (
                <tr key={seller.id}>
                  <td>
                    <div className="dash-seller-cell">
                      <span className="dash-avatar dash-avatar-sage">
                        {name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <div>
                        <strong>{name}</strong>
                        <small>{seller.category || seller.email || ""}</small>
                      </div>
                    </div>
                  </td>
                  <td>{productCount}</td>
                  <td>
                    <span
                      className={`dash-status ${status === "approved" ? "dash-status-delivered" : "dash-status-processing"}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {status === "pending" ? (
                      <button
                        className="dash-approve"
                        disabled={approvingId !== null}
                        onClick={() => onApprove(seller.id)}
                      >
                        <FiCheck />{" "}
                        {approvingId === seller.id ? "Approving…" : "Approve"}
                      </button>
                    ) : (
                      <span className="dash-approved">
                        <FiCheckCircle /> Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && !error && sellers.length === 0 && (
          <div className="dash-empty">
            <h3>No seller applications yet</h3>
            <p>Your API seller applications will appear here when available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
