import { Link } from "react-router-dom";
import { FiArrowUpRight, FiHeart, FiShield } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { SITE_INFO } from "../data/siteContent.jsx";
import withShop from "./withShop.jsx";
import Brand from "./Brand.jsx";

function SiteFooter({ shop }) {
  const linkClass = "block w-fit text-left text-[11px] leading-6 text-[#929b82] transition hover:text-[#234d39]";
  return (
    <footer className="site-footer mt-16 bg-[#fffefa] pb-6 pt-5">
      <div className="footer-main mx-auto grid w-[calc(100%-36px)] max-w-[1200px] grid-cols-2 gap-x-7 gap-y-9 pb-12 sm:w-[calc(100%-64px)] lg:grid-cols-[1.2fr_0.8fr_1fr_1fr] lg:gap-12">
        <div className="footer-brand col-span-2 lg:col-span-1"><Brand /><p className="mt-5 text-xs leading-6 text-[#929b82]">Good things for your everyday.<br />From independent minds, to your home.</p><span className="mt-4 flex items-center gap-2 text-[10px] text-[#a5af95]"><LuLeaf aria-hidden="true" /> A little more thoughtful.</span></div>
        <div><h3 className="mb-4 text-[10px] font-semibold text-[#61734f]">Find your thing</h3>{["Furniture", "Lighting", "Decor", "Kitchen"].map(name => <Link className={linkClass} key={name} to={`/products?category=${encodeURIComponent(name)}`}>{name}</Link>)}</div>
        <div><h3 className="mb-4 text-[10px] font-semibold text-[#61734f]">Make yourself at home</h3><button className={linkClass} onClick={() => shop.showInfo(SITE_INFO.story)}>About Nook</button>{shop.user?.role === "seller" ? <Link className={linkClass} to="/seller">Your seller dashboard</Link> : <button className={linkClass} onClick={() => shop.openAuth("seller", "signup")}>Become a seller</button>}<button className={linkClass} onClick={() => shop.showInfo(SITE_INFO.help)}>Help & contact</button><button className={linkClass} onClick={() => shop.showInfo(SITE_INFO.shipping)}>Shipping & returns</button><Link className={linkClass} to="/admin">Admin workspace</Link></div>
        <div className="footer-promise col-span-2 sm:col-span-1"><FiHeart className="mb-3 h-6 w-6 text-[#9eaf84]" aria-hidden="true" /><h3 className="text-[11px] font-medium text-[#6a7b57]">Little finds. Lasting love.</h3><p className="mt-3 text-[10px] leading-5 text-[#a5ad95]">Pieces you’ll reach for.<br />People you’ll feel good supporting.</p><button className="text-link mt-4 inline-flex items-center gap-2 text-[10px] text-[#7d8c67] hover:text-[#234d39]" onClick={() => shop.showInfo(SITE_INFO.story)}>That’s the Nook way <FiArrowUpRight aria-hidden="true" /></button></div>
      </div>
      <div className="footer-bottom mx-auto flex w-[calc(100%-36px)] max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-[#e7e8df] pt-5 text-[9px] text-[#9da58e] sm:w-[calc(100%-64px)]"><span>© {new Date().getFullYear()} Nook. A little better, together.</span><div className="flex items-center gap-3"><button className="hover:text-[#234d39]" onClick={() => shop.showInfo(SITE_INFO.privacy)}>Privacy</button><span>·</span><button className="hover:text-[#234d39]" onClick={() => shop.showInfo(SITE_INFO.terms)}>Terms</button></div><span className="payment-note flex items-center gap-2"><FiShield className="h-3 w-3" aria-hidden="true" /> Safe & secure shopping</span></div>
    </footer>
  );
}
export default withShop(SiteFooter);
