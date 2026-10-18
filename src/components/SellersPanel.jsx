import { FiCheck, FiCheckCircle } from "react-icons/fi";

export default function SellersPanel({ sellers, full = false, onApprove }) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-title">
        <div>
          <h2>{full ? "Our seller community" : "Seller applications"}</h2>
          <p>Independent makers. A shared point of view.</p>
        </div>
        <span className="dash-demo-label">Demo data</span>
      </div>
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
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>
                  <div className="dash-seller-cell">
                    <span className={`dash-avatar dash-avatar-${seller.color}`}>
                      {seller.initials}
                    </span>
                    <div>
                      <strong>{seller.name}</strong>
                      <small>{seller.category}</small>
                    </div>
                  </div>
                </td>
                <td>{seller.products}</td>
                <td>
                  <span
                    className={`dash-status ${seller.status === "Approved" ? "dash-status-delivered" : "dash-status-processing"}`}
                  >
                    {seller.status}
                  </span>
                </td>
                <td>
                  {seller.status === "Pending" ? (
                    <button
                      className="dash-approve"
                      onClick={() => onApprove(seller.id)}
                    >
                      <FiCheck /> Approve
                    </button>
                  ) : (
                    <span className="dash-approved">
                      <FiCheckCircle /> Reviewed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
