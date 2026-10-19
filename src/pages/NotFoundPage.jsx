import { FiArrowRight, FiHome } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import { Link } from "react-router-dom";
import "./not-found-page.css";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found-page page-width">
      <section
        className="not-found-panel"
        aria-labelledby="not-found-heading"
        data-reveal
      >
        <div className="not-found-art" aria-hidden="true">
          <span className="not-found-code">404</span>
          <span className="not-found-sprout"><LuSprout /></span>
        </div>
        <span className="eyebrow">A LITTLE DETOUR · ERROR 404</span>
        <h1 id="not-found-heading">Page not found.</h1>
        <p>
          We couldn’t find the page you’re looking for. The link may have
          changed, or the address may be incorrect.
        </p>
        <div className="not-found-actions">
          <Link className="primary-button" to="/">
            <FiHome aria-hidden="true" /> Back to home
          </Link>
          <Link className="text-link" to="/products">
            Explore products <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
