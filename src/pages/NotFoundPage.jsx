import { FiArrowRight } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="buyer-page utility-page page-width">
      <section className="catalog-empty">
        <LuSprout />
        <span className="eyebrow">A LITTLE DETOUR · 404</span>
        <h1>This corner is still waiting to be found.</h1>
        <p>Let’s get you back to the good things.</p>
        <Link className="primary-button" to="/products">
          Explore the collection <FiArrowRight />
        </Link>
      </section>
    </main>
  );
}
