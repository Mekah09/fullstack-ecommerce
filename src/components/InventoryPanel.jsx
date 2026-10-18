import { FiArrowRight, FiSearch, FiPackage, FiPlus } from "react-icons/fi";
import ProductTable from "./ProductTable.jsx";

export default function InventoryPanel({
  compact = false,
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
    <section className="dash-panel dash-products-panel">
      <div className="dash-panel-title">
        <div>
          <h2>
            {compact ? "Your collection" : "Product inventory"}{" "}
            <span className="dash-count">{managedProducts.length}</span>
          </h2>
          <p>Thoughtfully chosen, beautifully made.</p>
        </div>
        {compact ? (
          <button className="dash-text-button" onClick={() => onViewAll()}>
            View all <FiArrowRight />
          </button>
        ) : (
          <label className="dash-search">
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
      <div className="dash-table-scroll">
        <ProductTable
          products={compact ? managedProducts.slice(0, 4) : filteredProducts}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        {!(compact ? managedProducts : filteredProducts).length && (
          <div className="dash-empty">
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
              <button className="dash-primary" onClick={() => onAdd()}>
                <FiPlus /> Add your first product
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
