import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiArrowUpRight, FiGrid, FiHeart, FiLogOut, FiMenu, FiSearch, FiShoppingBag, FiTruck, FiUser, FiX } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { SITE_INFO } from "../data/siteContent.jsx";
import withShop from "./withShop.jsx";
import Brand from "./Brand.jsx";

function SiteHeader({ shop }) {
  const [menu, setMenu] = useState(null);
  const headerRef = useRef(null);
  const accountRef = useRef(null);
  const { user, cartCount, favorites, openAuth, openCart, logout, showInfo, location } = shop;
  const closeMenus = () => setMenu(null);
  const menuOpen = name => menu?.name === name && menu.key === location.key;
  const toggleMenu = name => setMenu(menuOpen(name) ? null : { name, key: location.key });
  useEffect(() => {
    function pointerDown(event) {
      if (!headerRef.current?.contains(event.target)) { setMenu(null); return; }
      if (!accountRef.current?.contains(event.target)) setMenu(current => current?.name === "account" ? null : current);
    }
    function keyDown(event) {
      if (event.key !== "Escape") return;
      const trigger = headerRef.current?.querySelector('[aria-expanded="true"]');
      setMenu(null); trigger?.focus();
    }
    const close = () => setMenu(null);
    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("keydown", keyDown);
    window.addEventListener("popstate", close);
    return () => { document.removeEventListener("pointerdown", pointerDown); document.removeEventListener("keydown", keyDown); window.removeEventListener("popstate", close); };
  }, []);
  const savedOnly = location.pathname === "/products" && new URLSearchParams(location.search).get("saved") === "true";
  const iconClass = "icon-button relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#3c5039] transition hover:bg-[#f0f3e9] [&_svg]:h-[19px] [&_svg]:w-[19px]";
  const navClass = ({ isActive }) => `py-2 text-left text-[11px] transition hover:text-[#234d39] ${isActive ? "font-semibold text-[#234d39]" : "text-[#7c866f]"}`;
  const signIn = () => { closeMenus(); openAuth("buyer", "signin"); };
  function navigation() {
    return <>
      <NavLink to="/" end className={navClass} onClick={closeMenus}>Discover</NavLink>
      <NavLink to="/products" className={navClass} onClick={closeMenus}>Shop all</NavLink>
      <button className="py-2 text-left text-[11px] text-[#7c866f] transition hover:text-[#234d39]" onClick={() => { closeMenus(); showInfo(SITE_INFO.story); }}>Our story</button>
      {user?.role === "admin" ? <NavLink to="/admin" className={navClass} onClick={closeMenus}>Admin workspace</NavLink> : user?.role === "seller" ? <NavLink to="/seller" className={navClass} onClick={closeMenus}>Your shop <FiArrowUpRight className="ml-1 inline" aria-hidden="true" /></NavLink> : <button className="seller-nav flex items-center gap-1 py-2 text-left text-[11px] text-[#6e8257] hover:text-[#234d39]" onClick={() => { closeMenus(); openAuth("seller", "signup"); }}>Become a seller <FiArrowUpRight aria-hidden="true" /></button>}
    </>;
  }
  return <>
    <a className="skip-link fixed left-4 top-4 z-[200] -translate-y-24 rounded bg-[#234d39] px-4 py-3 text-xs text-white focus:translate-y-0" href="#main-content">Skip to content</a>
    <div className="announcement bg-[#234d39] text-[#e5eadb]"><div className="mx-auto flex min-h-8 w-[calc(100%-36px)] max-w-[1200px] items-center justify-center text-[8px] sm:w-[calc(100%-64px)] sm:justify-between"><span className="hidden items-center gap-2 sm:flex"><LuLeaf className="h-3 w-3" aria-hidden="true" /> A little better, every day.</span><span className="hidden lg:inline">Good finds. Independent minds.</span><span className="flex items-center gap-2"><FiTruck className="h-3 w-3" aria-hidden="true" /> Find your next favorite</span></div></div>
    <header className="site-header relative z-30 border-b border-[#eeeFE7] bg-[#fffefa]" ref={headerRef}>
      <div className="header-inner mx-auto flex min-h-[90px] w-[calc(100%-36px)] max-w-[1200px] items-center justify-between gap-5 sm:w-[calc(100%-64px)] sm:gap-8">
        <Brand onClick={closeMenus} />
        <nav className="desktop-nav hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main navigation">{navigation()}</nav>
        <div className="header-actions flex items-center gap-0.5 sm:gap-1.5">
          <Link className={`${iconClass} hidden sm:grid`} to="/products?search=focus" aria-label="Search products" onClick={closeMenus}><FiSearch aria-hidden="true" /></Link>
          <Link className={`${iconClass} ${savedOnly ? "bg-[#edf2e5]" : ""}`} to="/products?saved=true" aria-label={`View ${favorites.length} favorites`} onClick={closeMenus}><FiHeart aria-hidden="true" />{favorites.length > 0 && <i className="tiny-dot absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#9bad77]" />}</Link>
          <div className="account-wrap relative" ref={accountRef}>
            <button className={iconClass} aria-label={user ? "Open account menu" : "Sign in or create account"} aria-expanded={user ? menuOpen("account") : undefined} aria-controls={user ? "account-navigation" : undefined} onClick={() => user ? toggleMenu("account") : signIn()}><FiUser aria-hidden="true" />{user && <i className="tiny-dot absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#9bad77]" />}</button>
            {user && menuOpen("account") && <div className="account-menu absolute -right-12 top-12 z-40 w-60 overflow-hidden rounded-lg border border-[#e1e6d8] bg-[#fffefa] p-3 shadow-xl sm:right-0" id="account-navigation"><p className="border-b border-[#e7eade] px-2 pb-3 text-xs font-semibold text-[#3a5137]">Hi, {user.name?.split(" ")[0]}<span className="mt-1 block text-[10px] font-normal capitalize text-[#97a085]">{user.role} account</span></p><Link className="mt-2 flex items-center gap-2 rounded p-2 text-[11px] text-[#6c7b5e] hover:bg-[#f0f3e9]" to="/account" onClick={closeMenus}><FiShoppingBag aria-hidden="true" /> My orders & saved finds</Link>{user.role !== "buyer" && <Link className="flex items-center gap-2 rounded p-2 text-[11px] text-[#6c7b5e] hover:bg-[#f0f3e9]" to={user.role === "admin" ? "/admin" : "/seller"} onClick={closeMenus}><FiGrid aria-hidden="true" />{user.role === "admin" ? "Admin dashboard" : "Seller dashboard"}</Link>}<button className="flex w-full items-center gap-2 rounded p-2 text-left text-[11px] text-[#6c7b5e] hover:bg-[#f0f3e9]" onClick={() => { closeMenus(); logout(); }}><FiLogOut aria-hidden="true" /> Sign out</button></div>}
          </div>
          <span className="header-divider mx-1 hidden h-5 w-px bg-[#e5e9db] sm:block" />
          <button className="bag-button flex h-9 shrink-0 items-center gap-2 rounded-full px-1.5 text-[11px] text-[#42583a] hover:bg-[#f0f3e9] sm:px-2" aria-label={`Open shopping bag, ${cartCount} items`} onClick={() => { closeMenus(); openCart(); }}><FiShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" /><span className="bag-label hidden xl:inline">Bag</span><span className="bag-count grid h-4 min-w-4 place-items-center rounded-full bg-[#edf2e6] px-1 text-[8px] text-[#7f9065]">{cartCount}</span></button>
          <button className={`${iconClass} mobile-menu-button lg:hidden`} aria-label={menuOpen("mobile") ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen("mobile")} aria-controls="mobile-navigation" onClick={() => toggleMenu("mobile")}>{menuOpen("mobile") ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}</button>
        </div>
      </div>
      {menuOpen("mobile") && <nav className="mobile-nav absolute left-0 right-0 top-full z-30 grid gap-2 border-y border-[#e5e8dc] bg-[#fffefa] px-6 py-5 shadow-lg lg:hidden" id="mobile-navigation" aria-label="Mobile navigation">{navigation()}</nav>}
    </header>
  </>;
}
export default withShop(SiteHeader);
