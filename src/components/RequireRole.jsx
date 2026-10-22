import { FiArrowRight, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import withShop from "./withShop.jsx";

function RequireRole({ role, children, shop }) {
  const { user, authLoading, openAuth } = shop;
  if (authLoading)
    return (
      <main id="main-content" className="mx-auto min-h-[60vh] max-w-7xl px-6 py-24">
        <p role="status">Opening your workspace…</p>
      </main>
    );
  if (user?.role === role) return children;
  return (
    <main id="main-content" className="mx-auto min-h-[65vh] max-w-3xl px-5 py-16 sm:px-8">
      <section className="catalog-empty flex flex-col items-center gap-5 rounded-2xl border border-stone-200 bg-[#f5f6ef] px-6 py-14 text-center">
        <FiLock className="mb-2 size-9 text-[#79906a]" />
        <span className="text-[10px] font-semibold tracking-[.2em] text-[#58724d]">YOUR {role.toUpperCase()} WORKSPACE</span>
        <h1 className="font-serif text-3xl sm:text-4xl">
          {user
            ? "This workspace needs a different account."
            : "Your little space to grow."}
        </h1>
        <p className="max-w-md text-sm leading-7 text-stone-500">Sign in with a {role} account to open this dashboard.{role === "admin" && " Your backend must assign the admin role; an API URL does not grant admin access."}</p>
        <button
          className="primary-button inline-flex items-center gap-3 rounded-lg bg-[#234d39] px-6 py-3 text-sm font-medium text-white hover:bg-[#315e48]"
          onClick={() =>
            openAuth(role === "seller" ? "seller" : "buyer", "signin")
          }
        >
          Sign in to continue <FiArrowRight />
        </button>
        <p>
          <Link className="inline-flex items-center gap-2 text-xs text-[#58724d] underline-offset-4 hover:underline" to="/">
            Back to Nook <FiArrowRight />
          </Link>
        </p>
      </section>
    </main>
  );
}

export default withShop(RequireRole);
