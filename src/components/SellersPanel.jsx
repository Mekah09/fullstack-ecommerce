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
    <section className="dash-panel min-w-0 overflow-hidden rounded-xl border border-[#e4e8dd] bg-white">
      <div className="dash-panel-title flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0e7] p-5 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mt-1 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#8a947e]">
        <div>
          <h2>{full ? "Our seller community" : "Seller applications"}</h2>
          <p>Manage seller applications returned by your backend.</p>
        </div>
      </div>
      {error && (
        <p className="dash-form-error m-4 rounded-md border border-[#f0d5cf] bg-[#fcf1ee] px-4 py-3 text-xs leading-6 text-[#a64e43]" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5" role="status">
          <p>Loading seller applications…</p>
        </div>
      )}
      <div className="dash-table-scroll relative max-w-full overflow-x-auto">
        <table className="dash-table w-full min-w-[630px] border-collapse text-left text-xs [&_th]:border-b [&_th]:border-[#edf0e7] [&_th]:bg-[#fbfcf8] [&_th]:px-5 [&_th]:py-3 [&_th]:text-[10px] [&_th]:font-medium [&_th]:text-[#8a957f] [&_td]:border-b [&_td]:border-[#edf0e7] [&_td]:px-5 [&_td]:py-4 [&_tr:last-child_td]:border-b-0 [&_strong]:font-medium [&_small]:mt-1 [&_small]:block [&_small]:max-w-52 [&_small]:truncate [&_small]:text-[10px] [&_small]:text-[#8a957f]">
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
                    <div className="dash-seller-cell flex items-center gap-3 [&_strong]:block">
                      <span className="dash-avatar grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-semibold dash-avatar-sage bg-[#e9efdF] text-[#658151]">
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
                      className={`dash-status inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] ${status === "approved" ? "dash-status-delivered bg-[#edf4e6] text-[#66844f]" : "dash-status-processing bg-[#f4f1df] text-[#988440]"}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {status === "pending" ? (
                      <button
                        className="dash-approve inline-flex items-center gap-1.5 rounded-md border border-[#bfcfb2] px-3 py-1.5 text-[10px] text-[#4f7141] transition hover:bg-[#eff5e9] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-3"
                        disabled={approvingId !== null}
                        onClick={() => onApprove(seller.id)}
                      >
                        <FiCheck />{" "}
                        {approvingId === seller.id ? "Approving…" : "Approve"}
                      </button>
                    ) : (
                      <span className="dash-approved inline-flex items-center gap-1.5 text-[10px] text-[#7d8d6e] [&_svg]:size-3">
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
          <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5">
            <h3>No seller applications yet</h3>
            <p>Your API seller applications will appear here when available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
