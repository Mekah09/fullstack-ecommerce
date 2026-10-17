import { FiArrowRight, FiArrowUpRight, FiSun } from "react-icons/fi";
import { LuArmchair } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero page-width">
      <div className="hero-copy">
        <div className="hero-eyebrow">
          <span /> CURATED FINDS. EVERYDAY JOY.
        </div>
        <h1>
          A little more you.
          <br />A lot more <em>home.</em>
        </h1>
        <p>
          Thoughtful pieces for the spaces you love.
          <br className="desktop-break" /> Discover something that feels like
          you.
        </p>
        <Link className="primary-button" to="/products">
          Explore the collection <FiArrowRight />
        </Link>
        <div className="hero-social">
          <div className="mini-avatars">
            <span>J</span>
            <span>A</span>
            <span>♡</span>
          </div>
          <div>
            <div className="hero-stars">
              ★★★★★ <b>4.9/5</b>
            </div>
            <span>Loved by 2,000+ happy homes</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <img
          className="hero-photo"
          src="/images/bright-home.jpg"
          alt="A thoughtfully styled living room with warm, natural furniture"
        />
        <div className="hero-image-tint" />
        <div className="hero-seal">
          <FiSun />
          <span>
            GOOD THINGS
            <br />
            LIVE HERE
          </span>
        </div>
        <Link className="hero-image-card" to="/products?category=Furniture">
          <span className="image-card-icon">
            <LuArmchair />
          </span>
          <span>
            <small>MAKE ROOM FOR THE GOOD</small>
            <b>The everyday living edit</b>
          </span>
          <FiArrowUpRight />
        </Link>
        <span className="hero-photo-caption pointer-events-none">
          A slower pace. A softer space.
        </span>
      </div>
    </section>
  );
}
