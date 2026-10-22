import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { currency } from "./dashboardData.jsx";
import ProductImage from "./ProductImage.jsx";
import { hasStockLimit } from "../utils/cart.jsx";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <table className="dash-table w-full min-w-[630px] border-collapse text-left text-xs [&_th]:border-b [&_th]:border-[#edf0e7] [&_th]:bg-[#fbfcf8] [&_th]:px-5 [&_th]:py-3 [&_th]:text-[10px] [&_th]:font-medium [&_th]:text-[#8a957f] [&_td]:border-b [&_td]:border-[#edf0e7] [&_td]:px-5 [&_td]:py-4 [&_tr:last-child_td]:border-b-0 [&_strong]:font-medium [&_small]:mt-1 [&_small]:block [&_small]:max-w-52 [&_small]:truncate [&_small]:text-[10px] [&_small]:text-[#8a957f]">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>
            <span className="dash-sr-only sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <div className="dash-product-cell flex items-center gap-3 [&>img]:size-11 [&>img]:shrink-0 [&>img]:rounded-md [&>img]:object-cover [&>.product-image-placeholder]:size-11 [&>.product-image-placeholder]:shrink-0 [&>.product-image-placeholder]:rounded-md [&>.product-image-placeholder]:bg-[#f0f3e9] [&>div]:min-w-0 [&_strong]:block [&_strong]:max-w-52 [&_strong]:truncate">
                <ProductImage src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.seller}</small>
                </div>
              </div>
            </td>
            <td className="dash-td-muted text-[#86917c]">{product.category}</td>
            <td>
              <strong>{currency(product.price)}</strong>
            </td>
            <td>
              <span
                className={`dash-status inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] ${!hasStockLimit(product.stock) ? "bg-[#f1f3ed] text-[#89927e]" : product.stock > 0 ? "dash-status-delivered bg-[#edf4e6] text-[#66844f]" : "dash-status-out bg-[#fcf0e9] text-[#aa6f56]"}`}
              >
                {!hasStockLimit(product.stock)
                  ? "Stock not provided"
                  : product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
              </span>
            </td>
            <td>
              <div className="dash-row-actions flex justify-end gap-1.5">
                <button
                  className="dash-icon-button inline-flex size-8 items-center justify-center rounded-md border border-[#e1e6d9] text-[#6e7f62] transition hover:bg-[#f1f5eb] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-3.5"
                  aria-label={`Edit ${product.name}`}
                  onClick={() => onEdit(product)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="dash-icon-button inline-flex size-8 items-center justify-center rounded-md border border-[#e1e6d9] text-[#6e7f62] transition hover:bg-[#f1f5eb] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-3.5 dash-delete-button hover:border-[#e8c2ba] hover:bg-[#fff2ee] hover:text-[#a64e43]"
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
