import { FiArrowUpRight, FiSun } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import withShop from "./withShop.jsx";

function MakersBanner({ shop }) {
  return (
    <section className="makers-section relative mx-auto my-16 grid w-[calc(100%-36px)] max-w-[1200px] overflow-hidden rounded-md bg-[#234d39] sm:w-[calc(100%-64px)] md:grid-cols-2" data-reveal>
      <div className="makers-image relative min-h-[280px] md:min-h-[370px]"><img className="absolute inset-0 h-full w-full object-cover" src="/images/sunlit-living-room.png" alt="Thoughtfully crafted home accessories in a sunlit living room" loading="lazy" /><span className="makers-image-label absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-[#fffefa]/95 px-3 py-2 text-[9px] text-[#6c7d58]"><LuLeaf aria-hidden="true" /> Made with a little more heart.</span></div>
      <div className="makers-copy relative z-10 px-7 py-10 text-white sm:px-12 sm:py-12 md:self-center"><span className="eyebrow text-[8px] font-medium tracking-[2px] text-[#b8c5a5]">SMALL SHOPS. BIG HEART.</span><h2 className="mt-5 font-serif text-[31px] leading-tight tracking-[-1px] lg:text-[36px]">Behind every good find,<br />there’s a good story.</h2><p className="mt-5 max-w-sm text-xs leading-6 text-[#c0cdb9]">Meet the independent makers, dreamers, and doers bringing a little more meaning to your everyday.</p><button className="light-button mt-7 inline-flex items-center gap-5 rounded bg-[#f4f4e9] px-5 py-3 text-[10px] font-semibold text-[#35523b] transition hover:bg-white" onClick={() => shop.openAuth("seller", "signup")}>Bring your shop to Nook <FiArrowUpRight aria-hidden="true" /></button><span className="makers-note mt-5 block font-serif text-xs italic text-[#b0c19b]">Your craft. Your corner of the world.</span></div>
      <FiSun className="makers-sun pointer-events-none absolute -bottom-10 -right-8 h-48 w-48 text-[#c6d4b4]/10" aria-hidden="true" />
    </section>
  );
}
export default withShop(MakersBanner);
