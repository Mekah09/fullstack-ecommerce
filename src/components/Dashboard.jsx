import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiDollarSign,
  FiEdit2,
  FiGrid,
  FiPackage,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiTrash2,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { API_BASE_URL } from "../services/api";
import "./dashboard.css";

const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
const categories = ["Furniture", "Lighting", "Decor", "Kitchen", "Lifestyle"];
const demoOrders = [
  {
    id: "#NK-1048",
    customer: "Olivia Martin",
    product: "Everyday essentials",
    date: "Today, 10:24 AM",
    total: 128,
    status: "Processing",
  },
  {
    id: "#NK-1047",
    customer: "James Wilson",
    product: "A little home refresh",
    date: "Yesterday",
    total: 245,
    status: "Shipped",
  },
  {
    id: "#NK-1046",
    customer: "Sofia Davis",
    product: "Thoughtfully chosen",
    date: "Yesterday",
    total: 89,
    status: "Delivered",
  },
  {
    id: "#NK-1045",
    customer: "Noah Williams",
    product: "Something special",
    date: "Jun 15, 2026",
    total: 156,
    status: "Delivered",
  },
];
const initialSellers = [
  {
    id: 1,
    name: "Form & Field",
    initials: "FF",
    category: "Furniture & living",
    products: 24,
    status: "Approved",
    color: "sage",
  },
  {
    id: 2,
    name: "Clay House",
    initials: "CH",
    category: "Ceramics & homewares",
    products: 18,
    status: "Approved",
    color: "sand",
  },
  {
    id: 3,
    name: "The Good Light",
    initials: "GL",
    category: "Lighting & decor",
    products: 12,
    status: "Pending",
    color: "lavender",
  },
  {
    id: 4,
    name: "Gather Studio",
    initials: "GS",
    category: "Everyday essentials",
    products: 9,
    status: "Pending",
    color: "rose",
  },
];

function DashboardDialog({
  children,
  onClose,
  busy = false,
  titleId,
  descriptionId,
  role = "dialog",
  className = "",
}) {
  const panelRef = useRef(null);
  const close = useEffectEvent(() => {
    if (!busy) onClose();
  });
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    const initialFocus =
      panel.querySelector("[data-initial-focus]") ||
      panel.querySelector(selector);
    initialFocus?.focus();
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...panel.querySelectorAll(selector)].filter(
        (element) => element.getClientRects().length,
      );
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);
  return (
    <div
      className="dash-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        ref={panelRef}
        tabIndex={-1}
        className={`dash-modal ${className}`}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {children}
      </section>
    </div>
  );
}

function ProductForm({ product, sellerName, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ?? "",
    category: product?.category || "Decor",
    stock: product?.stock ?? 10,
    image: product?.image || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const image = form.image.trim();
      let validImage = /^\/(?!\/)[^\s]*$/.test(image);
      try {
        validImage ||= ["https:", "http:"].includes(new URL(image).protocol);
      } catch {
        /* A local image path is supported above. */
      }
      if (!validImage)
        throw new Error(
          "Use a full http(s) image URL or a local path starting with /images/.",
        );
      if (!form.name.trim() || !form.description.trim())
        throw new Error("Please enter a product name and description.");
      await onSave({
        ...form,
        image,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        seller: product?.seller || sellerName || "My shop",
        rating: product?.rating ?? 0,
        reviews: product?.reviews ?? 0,
      });
      onClose();
    } catch (issue) {
      setError(
        issue.message || "We couldn’t save this product. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <DashboardDialog
      onClose={onClose}
      busy={saving}
      titleId="dash-product-title"
    >
      <div className="dash-modal-head">
        <div>
          <span className="dash-eyebrow">A little more to discover</span>
          <h2 id="dash-product-title">
            {product ? "Edit your product" : "Add a new product"}
          </h2>
        </div>
        <button
          className="dash-icon-button"
          aria-label="Close product form"
          disabled={saving}
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>
      <form onSubmit={submit} className="dash-form">
        <label>
          Product name
          <input
            name="name"
            data-initial-focus
            required
            maxLength={120}
            placeholder="e.g. Everyday ceramic mug"
            value={form.name}
            onChange={change}
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Tell buyers what makes it special…"
            value={form.description}
            onChange={change}
          />
        </label>
        <div className="dash-form-row">
          <label>
            Price (USD)
            <input
              name="price"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={change}
            />
          </label>
          <label>
            Stock available
            <input
              name="stock"
              type="number"
              required
              min="0"
              step="1"
              value={form.stock}
              onChange={change}
            />
          </label>
        </div>
        <label>
          Category
          <select name="category" value={form.category} onChange={change}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Product image URL or path
          <input
            name="image"
            type="text"
            required
            placeholder="https://… or /images/product.jpg"
            value={form.image}
            onChange={change}
          />
          <span className="dash-field-help">
            Use a public http(s) URL or a local image path, e.g.
            /images/product.jpg.
          </span>
        </label>
        {error && (
          <p className="dash-form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dash-modal-actions">
          <button
            type="button"
            className="dash-secondary"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="dash-primary" disabled={saving}>
            {saving ? "Saving…" : product ? "Save changes" : "Add product"}
            <FiArrowRight />
          </button>
        </div>
      </form>
    </DashboardDialog>
  );
}

function RevenueChart({ admin }) {
  return (
    <section className="dash-panel dash-chart-panel">
      <div className="dash-panel-title">
        <div>
          <h2>{admin ? "Marketplace performance" : "Revenue overview"}</h2>
          <p>A little growth, every day.</p>
        </div>
        <span className="dash-demo-label">Demo data</span>
      </div>
      <div className="dash-chart-total">
        {admin ? "$42,856" : "$8,240"}
        <span>
          <FiTrendingUp /> 18.6% this month
        </span>
      </div>
      <div
        className="dash-chart"
        role="img"
        aria-label="Demo revenue grows steadily from January through June"
      >
        <div className="dash-chart-y">
          <span>$10k</span>
          <span>$7.5k</span>
          <span>$5k</span>
          <span>$2.5k</span>
        </div>
        <div className="dash-chart-body">
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="dashChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8baa7e" stopOpacity=".24" />
                <stop offset="100%" stopColor="#8baa7e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="#e8ebe4" strokeDasharray="4 5">
              <path d="M0 15H600M0 65H600M0 115H600M0 165H600" />
            </g>
            <path
              d="M0 151C25 151 38 135 60 138S104 164 130 128S165 107 190 116S229 138 254 97S298 103 325 83S358 106 383 66S423 75 450 43S488 64 510 35S559 55 600 14V180H0Z"
              fill="url(#dashChartFill)"
            />
            <path
              d="M0 151C25 151 38 135 60 138S104 164 130 128S165 107 190 116S229 138 254 97S298 103 325 83S358 106 383 66S423 75 450 43S488 64 510 35S559 55 600 14"
              fill="none"
              stroke="#3d6b4e"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="dash-chart-x">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrdersTable({ full = false }) {
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

export default function Dashboard({
  role = "seller",
  user,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToast,
  onBackToShop,
}) {
  const admin = role === "admin";
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [sellers, setSellers] = useState(initialSellers);
  const [shopName, setShopName] = useState(
    user?.name ? `${user.name.split(" ")[0]}'s shop` : "My Nook shop",
  );
  const managedProducts = useMemo(
    () =>
      admin
        ? products
        : products.filter(
            (product) =>
              (product.sellerId && product.sellerId === user?.id) ||
              product.seller === user?.name,
          ),
    [admin, products, user?.id, user?.name],
  );
  const sampleProducts =
    !admin && !API_BASE_URL
      ? products
          .filter((product) => !managedProducts.includes(product))
          .slice(0, 4)
      : [];
  const filteredProducts = useMemo(
    () =>
      managedProducts.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [managedProducts, search],
  );
  const stockCount = managedProducts.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );
  const navigation = [
    { id: "overview", label: "Overview", icon: FiGrid },
    {
      id: "products",
      label: admin ? "All products" : "My products",
      icon: FiPackage,
    },
    ...(admin ? [{ id: "sellers", label: "Sellers", icon: FiUsers }] : []),
    { id: "orders", label: "Orders", icon: FiShoppingBag },
    ...(!admin
      ? [{ id: "settings", label: "Shop settings", icon: FiSettings }]
      : []),
  ];
  const titles = {
    overview: admin
      ? "A thoughtful marketplace, growing."
      : "Your shop, at a glance.",
    products: admin
      ? "The marketplace collection."
      : "Good things in your shop.",
    sellers: "The people behind the products.",
    orders: "Every order tells a story.",
    settings: "Make yourself at home.",
  };
  const subtitles = {
    overview: "Here’s how things are looking. Let’s make today a good one.",
    products: "Manage your collection and make room for something new.",
    sellers: "Meet, review, and welcome your community of independent sellers.",
    orders: "A clear view of what’s coming in and going out.",
    settings: "A few little details that make your shop yours.",
  };
  async function saveProduct(values) {
    if (modal?.id) await onUpdateProduct(modal.id, values);
    else await onAddProduct(values);
    onToast?.(
      modal?.id
        ? "Product updated successfully."
        : "Your new product is ready to discover.",
    );
  }
  async function confirmDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await onDeleteProduct(deleteProduct.id);
      setDeleteProduct(null);
      onToast?.("Product removed from your collection.");
    } catch (error) {
      setDeleteError(
        error.message || "We couldn’t remove this product. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }
  function approveSeller(id) {
    setSellers((current) =>
      current.map((seller) =>
        seller.id === id ? { ...seller, status: "Approved" } : seller,
      ),
    );
    onToast?.("Seller approved in this demo.");
  }
  const renderSellers = () => (
    <section className="dash-panel">
      <div className="dash-panel-title">
        <div>
          <h2>
            {tab === "sellers" ? "Our seller community" : "Seller applications"}
          </h2>
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
                      onClick={() => approveSeller(seller.id)}
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
  const renderProducts = (compact = false) => (
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
          <button
            className="dash-text-button"
            onClick={() => setTab("products")}
          >
            View all <FiArrowRight />
          </button>
        ) : (
          <label className="dash-search">
            <FiSearch />
            <input
              aria-label="Search your products"
              placeholder="Search products…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        )}
      </div>
      <div className="dash-table-scroll">
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
            {(compact ? managedProducts.slice(0, 4) : filteredProducts).map(
              (product) => (
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
                        onClick={() => setModal(product)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="dash-icon-button dash-delete-button"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => {
                          setDeleteProduct(product);
                          setDeleteError("");
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
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
              <button className="dash-primary" onClick={() => setModal({})}>
                <FiPlus /> Add your first product
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-workspace">
          <span className="dash-workspace-icon">
            {admin ? <FiGrid /> : <FiShoppingBag />}
          </span>
          <div>
            <strong>{admin ? "Nook workspace" : shopName}</strong>
            <span>{admin ? "Administrator" : "Seller workspace"}</span>
          </div>
          <FiChevronDown />
        </div>
        <span className="dash-nav-caption">WORKSPACE</span>
        <nav aria-label="Dashboard navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`dash-nav-item ${tab === id ? "active" : ""}`}
              onClick={() => setTab(id)}
            >
              <Icon />
              {label}
              {id === "products" && <span>{managedProducts.length}</span>}
              {id === "sellers" && (
                <span>
                  {
                    sellers.filter((seller) => seller.status === "Pending")
                      .length
                  }
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="dash-sidebar-bottom">
          <div className="dash-sidebar-tip">
            <span>
              Small shops.
              <br />
              Big possibilities.
            </span>
            <p>
              Thoughtful things start
              <br />
              with people like you.
            </p>
            <FiActivity />
          </div>
          <button className="dash-back" onClick={onBackToShop}>
            <FiArrowLeft /> Back to storefront
          </button>
          <div className="dash-user">
            <span>
              {(user?.name || "Nook Seller")
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <strong>
                {user?.name || (admin ? "Nook Admin" : "Nook Seller")}
              </strong>
              <small>{user?.email || "Welcome to your workspace"}</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="dash-main">
        <div className="dash-breadcrumb">
          Workspace <span>/</span>{" "}
          {navigation.find((item) => item.id === tab)?.label}
        </div>
        <header className="dash-page-head">
          <div>
            <span className="dash-eyebrow">
              {admin ? "MADE FOR YOUR COMMUNITY" : "A LITTLE SPACE TO GROW"}
            </span>
            <h1>{titles[tab]}</h1>
            <p>{subtitles[tab]}</p>
          </div>
          {["overview", "products"].includes(tab) && (
            <button className="dash-primary" onClick={() => setModal({})}>
              <FiPlus /> Add product
            </button>
          )}
        </header>
        {tab === "overview" && (
          <>
            <div className="dash-demo-banner">
              <span>
                <FiActivity /> Demo overview
              </span>
              <p>
                Sales, orders, and seller approvals use sample data. Product
                changes are saved to your current catalog.
              </p>
            </div>
            <div className="dash-stats">
              {[
                {
                  label: admin ? "Total revenue" : "Total sales",
                  value: admin ? "$42,856" : "$8,240",
                  icon: FiDollarSign,
                  change: "+18.6%",
                  note: "vs. last month",
                  demo: true,
                },
                {
                  label: "Orders",
                  value: admin ? "384" : "128",
                  icon: FiShoppingCart,
                  change: "+12.8%",
                  note: "vs. last month",
                  demo: true,
                },
                {
                  label: admin ? "Marketplace products" : "Active products",
                  value: managedProducts.length.toString().padStart(2, "0"),
                  icon: FiPackage,
                  change: `${stockCount}`,
                  note: "units in your catalog",
                },
                {
                  label: admin ? "Active sellers" : "Shop visitors",
                  value: admin
                    ? sellers
                        .filter((seller) => seller.status === "Approved")
                        .length.toString()
                        .padStart(2, "0")
                    : "2,486",
                  icon: FiUsers,
                  change: admin
                    ? `${sellers.filter((seller) => seller.status === "Pending").length} pending`
                    : "+24.2%",
                  note: admin ? "applications" : "vs. last month",
                  demo: true,
                },
              ].map(({ label, value, icon: Icon, change, note, demo }) => (
                <section className="dash-stat" key={label}>
                  <div>
                    <span>{label}</span>
                    <span className="dash-stat-icon">
                      <Icon />
                    </span>
                  </div>
                  <strong>{value}</strong>
                  <p>
                    <span>
                      {!change.includes("pending") && <FiArrowUpRight />}
                      {change}
                    </span>{" "}
                    {note}
                    {demo && <small>Demo</small>}
                  </p>
                </section>
              ))}
            </div>
            <div className="dash-overview-grid">
              <RevenueChart admin={admin} />
              <section className="dash-panel dash-insight">
                <span className="dash-insight-icon">
                  <FiTrendingUp />
                </span>
                <span className="dash-eyebrow">A GOOD THING GROWING</span>
                <h2>
                  {admin
                    ? "A community with good taste."
                    : "Your next good thing is waiting."}
                </h2>
                <p>
                  {admin
                    ? "Give independent shops a place to shine. Review new applications and keep your marketplace thoughtfully curated."
                    : "A beautiful collection starts with one thoughtful addition. Share what you love with someone who will love it too."}
                </p>
                <button
                  onClick={() => (admin ? setTab("sellers") : setModal({}))}
                >
                  {admin ? "Meet your sellers" : "Grow your collection"}
                  <FiArrowRight />
                </button>
                <div className="dash-insight-doodle" aria-hidden="true">
                  ✳
                </div>
              </section>
            </div>
            {admin ? renderSellers() : renderProducts(true)}
            <OrdersTable />
          </>
        )}
        {tab === "products" && (
          <>
            {renderProducts()}
            {sampleProducts.length > 0 && (
              <section className="dash-panel">
                <div className="dash-panel-title">
                  <div>
                    <h2>A little inspiration</h2>
                    <p>
                      Sample finds from other shops. Only your own listings can
                      be edited.
                    </p>
                  </div>
                  <span className="dash-demo-label">Demo · read only</span>
                </div>
                <div className="dash-sample-grid">
                  {sampleProducts.map((product) => (
                    <article className="dash-sample-product" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div>
                        <span>{product.category}</span>
                        <h3>{product.name}</h3>
                        <p>By {product.seller}</p>
                        <strong>{currency(product.price)}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        {tab === "sellers" && (
          <>
            <div className="dash-demo-banner">
              <span>
                <FiUsers /> Demo community
              </span>
              <p>
                Seller applications are illustrative. Approvals apply only to
                this preview session.
              </p>
            </div>
            {renderSellers()}
          </>
        )}
        {tab === "orders" && (
          <>
            <div className="dash-demo-banner">
              <span>
                <FiTruck /> Demo orders
              </span>
              <p>
                Your live orders will appear here once your backend is
                connected.
              </p>
            </div>
            <OrdersTable full />
          </>
        )}
        {tab === "settings" && (
          <section className="dash-panel dash-settings">
            <div className="dash-panel-title">
              <div>
                <h2>Shop details</h2>
                <p>A warm welcome starts with the little things.</p>
              </div>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onToast?.("Shop name updated for this session.");
              }}
            >
              <label>
                Shop name
                <input
                  required
                  value={shopName}
                  maxLength={60}
                  onChange={(event) => setShopName(event.target.value)}
                />
              </label>
              <label>
                Contact email
                <input readOnly value={user?.email || "seller@nook.example"} />
              </label>
              <p className="dash-settings-note">
                Shop settings are a frontend preview. Connect your backend to
                save changes to your account.
              </p>
              <button type="submit" className="dash-primary">
                Save shop details
                <FiCheck />
              </button>
            </form>
          </section>
        )}
        <footer className="dash-footer">
          <span>A little more considered. A little more Nook.</span>
          <span>Made for everyday living. ✳</span>
        </footer>
      </div>
      {modal && (
        <ProductForm
          product={modal.id ? modal : null}
          sellerName={shopName}
          onSave={saveProduct}
          onClose={() => setModal(null)}
        />
      )}
      {deleteProduct && (
        <DashboardDialog
          className="dash-confirm"
          role="alertdialog"
          titleId="dash-delete-title"
          descriptionId="dash-delete-description"
          busy={deleting}
          onClose={() => setDeleteProduct(null)}
        >
          <span className="dash-confirm-icon">
            <FiTrash2 />
          </span>
          <h2 id="dash-delete-title">Remove this product?</h2>
          <p id="dash-delete-description">
            “{deleteProduct.name}” will be removed from the marketplace. You can
            add it again anytime.
          </p>
          {deleteError && (
            <p className="dash-form-error" role="alert">
              {deleteError}
            </p>
          )}
          <div className="dash-modal-actions">
            <button
              className="dash-secondary"
              data-initial-focus
              disabled={deleting}
              onClick={() => setDeleteProduct(null)}
            >
              Keep product
            </button>
            <button
              className="dash-danger"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "Removing…" : "Remove product"}
            </button>
          </div>
        </DashboardDialog>
      )}
    </div>
  );
}
