import { FiArrowUpRight, FiSun } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { useShop } from "../../hooks/useShop";

export default function MakersBanner() {
  const { openAuth } = useShop();
  return (
    <section className="makers-section page-width" data-reveal>
      <div className="makers-image">
        <img
          src="/images/sunlit-living-room.png"
          alt="Thoughtfully crafted home accessories in a sunlit living room"
          loading="lazy"
        />
        <span className="makers-image-label">
          <LuLeaf /> Made with a little more heart.
        </span>
      </div>
      <div className="makers-copy">
        <span className="eyebrow">SMALL SHOPS. BIG HEART.</span>
        <h2>
          Behind every good find,
          <br />
          there’s a good story.
        </h2>
        <p>
          Meet the independent makers, dreamers, and doers bringing a little
          more meaning to your everyday.
        </p>
        <button className="light-button" onClick={() => openAuth("seller")}>
          Bring your shop to Nook <FiArrowUpRight />
        </button>
        <span className="makers-note">
          Your craft. Your corner of the world.
        </span>
      </div>
      <span className="makers-sun">
        <FiSun />
      </span>
    </section>
  );
}
