import { FiArrowRight, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import withShop from "./withShop.jsx";

function RequireRole({ role, children, shop }) {
  const { user, authLoading, openAuth } = shop;
  if (authLoading)
    return (
      <main id="main-content" className="buyer-page utility-page page-width">
        <p role="status">Opening your workspace…</p>
      </main>
    );
  if (user?.role === role) return children;
  return (
    <main id="main-content" className="buyer-page utility-page page-width">
      <section className="catalog-empty">
        <FiLock />
        <span className="eyebrow">YOUR {role.toUpperCase()} WORKSPACE</span>
        <h1>
          {user
            ? "This workspace needs a different account."
            : "Your little space to grow."}
        </h1>
        <p>Sign in with a {role} account to open this dashboard.</p>
        <button
          className="primary-button"
          onClick={() =>
            openAuth(role === "seller" ? "seller" : "buyer", "signin")
          }
        >
          Sign in to continue <FiArrowRight />
        </button>
        <p>
          <Link className="text-link" to="/">
            Back to Nook <FiArrowRight />
          </Link>
        </p>
      </section>
    </main>
  );
}

export default withShop(RequireRole);
