import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { currency } from "./dashboardData";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <table className="dash-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>
            <span className="dash-sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <div className="dash-product-cell">
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.seller}</small>
                </div>
              </div>
            </td>
            <td className="dash-td-muted">{product.category}</td>
            <td>
              <strong>{currency(product.price)}</strong>
            </td>
            <td>
              <span
                className={`dash-status ${product.stock > 0 ? "dash-status-delivered" : "dash-status-out"}`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </td>
            <td>
              <div className="dash-row-actions">
                <button
                  className="dash-icon-button"
                  aria-label={`Edit ${product.name}`}
                  onClick={() => onEdit(product)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="dash-icon-button dash-delete-button"
                  aria-label={`Delete ${product.name}`}
                  onClick={() => onDelete(product)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
