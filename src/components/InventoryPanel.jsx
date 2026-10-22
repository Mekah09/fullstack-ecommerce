import { FiArrowRight, FiSearch, FiPackage, FiPlus } from "react-icons/fi";
import ProductTable from "./ProductTable.jsx";

export default function InventoryPanel({
  compact = false,
  loading = false,
  error = "",
  managedProducts,
  filteredProducts,
  search,
  onSearch,
  onViewAll,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="dash-panel min-w-0 overflow-hidden rounded-xl border border-[#e4e8dd] bg-white dash-products-panel">
      <div className="dash-panel-title flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0e7] p-5 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mt-1 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#8a947e]">
        <div>
          <h2>
            {compact ? "Your collection" : "Product inventory"}{" "}
            <span className="dash-count ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#edf2e5] px-1.5 py-0.5 text-[10px] font-medium text-[#6d805a]">{managedProducts.length}</span>
          </h2>
          <p>Thoughtfully chosen, beautifully made.</p>
        </div>
        {compact ? (
          <button className="dash-text-button inline-flex items-center gap-2 text-xs font-medium text-[#476740] hover:underline [&_svg]:size-3.5" onClick={() => onViewAll()}>
            View all <FiArrowRight />
          </button>
        ) : (
          <label className="dash-search flex w-full items-center gap-2 rounded-md border border-[#e1e6d9] px-3 py-2 text-[#8d9881] sm:w-60 [&_svg]:size-4 [&_input]:min-w-0 [&_input]:w-full [&_input]:bg-transparent [&_input]:text-xs [&_input]:text-[#344a37] [&_input]:outline-none">
            <FiSearch />
            <input
              aria-label="Search your products"
              placeholder="Search products…"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </label>
        )}
      </div>
      {error && (
        <p className="dash-form-error m-4 rounded-md border border-[#f0d5cf] bg-[#fcf1ee] px-4 py-3 text-xs leading-6 text-[#a64e43]" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5" role="status">
          <p>Loading your products…</p>
        </div>
      )}
      <div className="dash-table-scroll relative max-w-full overflow-x-auto">
        <ProductTable
          products={compact ? managedProducts.slice(0, 4) : filteredProducts}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        {!loading &&
          !error &&
          !(compact ? managedProducts : filteredProducts).length && (
            <div className="dash-empty flex flex-col items-center px-5 py-10 text-center [&>svg]:mb-3 [&>svg]:size-8 [&>svg]:text-[#97a58a] [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-[#8c9780] [&>button]:mt-5">
              <FiPackage />
              <h3>
                {!compact && search
                  ? "No products found"
                  : "Your next chapter starts here"}
              </h3>
              <p>
                {!compact && search
                  ? "Try a different product name or category."
                  : "Add your first product and give it a home on Nook."}
              </p>
              {(compact || !search) && (
                <button className="dash-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#234d39] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#183e2b] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#769563] [&_svg]:size-4" onClick={() => onAdd()}>
                  <FiPlus /> Add your first product
                </button>
              )}
            </div>
          )}
      </div>
    </section>
  );
}
