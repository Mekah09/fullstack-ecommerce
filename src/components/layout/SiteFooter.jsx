import { Link } from "react-router-dom";
import { FiArrowUpRight, FiHeart, FiShield } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { SITE_INFO } from "../../data/siteContent";
import { useShop } from "../../hooks/useShop";
import Brand from "./Brand";

export default function SiteFooter() {
  const { user, openAuth, showInfo } = useShop();

  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <div className="footer-brand">
          <Brand />
          <p>
            Good things for your everyday.
            <br />
            From independent minds, to your home.
          </p>
          <span>
            <LuLeaf /> A little more thoughtful.
          </span>
        </div>
        <div>
          <h3>Find your thing</h3>
          {["Furniture", "Lighting", "Decor", "Kitchen"].map((name) => (
            <Link
              key={name}
              to={`/products?category=${encodeURIComponent(name)}`}
            >
              {name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Make yourself at home</h3>
          <button onClick={() => showInfo(SITE_INFO.story)}>About Nook</button>
          {user?.role === "seller" ? (
            <Link to="/seller">Your seller dashboard</Link>
          ) : (
            <button onClick={() => openAuth("seller", "signup")}>
              Become a seller
            </button>
          )}
          <button onClick={() => showInfo(SITE_INFO.help)}>
            Help & contact
          </button>
          <button onClick={() => showInfo(SITE_INFO.shipping)}>
            Shipping & returns
          </button>
        </div>
        <div className="footer-promise">
          <FiHeart />
          <h3>Little finds. Lasting love.</h3>
          <p>
            Pieces you’ll reach for.
            <br />
            People you’ll feel good supporting.
          </p>
          <button
            className="text-link"
            onClick={() => showInfo(SITE_INFO.story)}
          >
            That’s the Nook way <FiArrowUpRight />
          </button>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>
          © {new Date().getFullYear()} Nook. A little better, together.
        </span>
        <div>
          <button onClick={() => showInfo(SITE_INFO.privacy)}>Privacy</button>
          <span>·</span>
          <button onClick={() => showInfo(SITE_INFO.terms)}>Terms</button>
        </div>
        <span className="payment-note">
          <FiShield /> Safe & secure shopping
        </span>
      </div>
    </footer>
  );
}
