import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiArrowUpRight,
  FiGrid,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { SITE_INFO } from "../../data/siteContent";
import { useShop } from "../../hooks/useShop";
import Brand from "./Brand";

export default function SiteHeader() {
  const { user, cartCount, favorites, openAuth, openCart, logout, showInfo } =
    useShop();
  const location = useLocation();
  const headerRef = useRef(null);
  const accountRef = useRef(null);
  const [menu, setMenu] = useState(null);
  const menuOpen = (name) => menu?.name === name && menu.key === location.key;
  const closeMenus = () => setMenu(null);
  const toggleMenu = (name) =>
    setMenu(menuOpen(name) ? null : { name, key: location.key });
  const savedOnly =
    location.pathname === "/products" &&
    new URLSearchParams(location.search).get("saved") === "true";
  const activeClass = ({ isActive }) => (isActive ? "active" : "");

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenu(null);
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setMenu((current) => (current?.name === "account" ? null : current));
      }
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      const trigger = headerRef.current?.querySelector(
        '[aria-expanded="true"]',
      );
      setMenu(null);
      trigger?.focus();
    };
    const onNavigation = () => setMenu(null);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onNavigation);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onNavigation);
    };
  }, []);

  function signIn() {
    closeMenus();
    openAuth("buyer", "signin");
  }
  function showStory() {
    closeMenus();
    showInfo(SITE_INFO.story);
  }
  function sellerSignUp() {
    closeMenus();
    openAuth("seller", "signup");
  }
  function navigation() {
    return (
      <>
        <NavLink to="/" end className={activeClass} onClick={closeMenus}>
          Discover
        </NavLink>
        <NavLink to="/products" className={activeClass} onClick={closeMenus}>
          Shop all
        </NavLink>
        <button onClick={showStory}>Our story</button>
        {user?.role === "seller" ? (
          <NavLink
            to="/seller"
            className={({ isActive }) =>
              `seller-nav ${isActive ? "active" : ""}`
            }
            onClick={closeMenus}
          >
            Your shop <FiArrowUpRight />
          </NavLink>
        ) : (
          <button className="seller-nav" onClick={sellerSignUp}>
            Become a seller <FiArrowUpRight />
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <div className="page-width">
          <span>
            <LuLeaf /> A little better, every day.
          </span>
          <span>Good finds. Independent minds.</span>
          <span>
            <FiTruck /> Free shipping on orders $100+
          </span>
        </div>
      </div>
      <header className="site-header" ref={headerRef}>
        <div className="header-inner page-width">
          <Brand onClick={closeMenus} />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation()}
          </nav>
          <div className="header-actions">
            <Link
              className="icon-button"
              to="/products?search=focus"
              aria-label="Search products"
              onClick={closeMenus}
            >
              <FiSearch />
            </Link>
            <Link
              className={`icon-button ${savedOnly ? "action-active" : ""}`}
              to="/products?saved=true"
              aria-label={`View ${favorites.length} favorites`}
              onClick={closeMenus}
            >
              <FiHeart />
              {favorites.length > 0 && <i className="tiny-dot" />}
            </Link>
            <div className="account-wrap" ref={accountRef}>
              <button
                className="icon-button"
                aria-label={
                  user ? "Open account menu" : "Sign in or create account"
                }
                aria-expanded={user ? menuOpen("account") : undefined}
                aria-controls={user ? "account-navigation" : undefined}
                onClick={() => (user ? toggleMenu("account") : signIn())}
              >
                <FiUser />
                {user && <i className="tiny-dot" />}
              </button>
              {user && menuOpen("account") && (
                <div className="account-menu" id="account-navigation">
                  <p>
                    Hi, {user.name?.split(" ")[0]}{" "}
                    <span>{user.role} account</span>
                  </p>
                  <Link to="/account" onClick={closeMenus}>
                    <FiShoppingBag /> My orders & saved finds
                  </Link>
                  {user.role !== "buyer" && (
                    <Link
                      to={user.role === "admin" ? "/admin" : "/seller"}
                      onClick={closeMenus}
                    >
                      <FiGrid />{" "}
                      {user.role === "admin"
                        ? "Admin dashboard"
                        : "Seller dashboard"}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeMenus();
                      logout();
                    }}
                  >
                    <FiLogOut /> Sign out
                  </button>
                </div>
              )}
            </div>
            <span className="header-divider" />
            <button
              className="bag-button"
              aria-label={`Open shopping bag, ${cartCount} items`}
              onClick={() => {
                closeMenus();
                openCart();
              }}
            >
              <FiShoppingBag />
              <span className="bag-label">Bag</span>
              <span className="bag-count">{cartCount}</span>
            </button>
            <button
              className="icon-button mobile-menu-button"
              aria-label={
                menuOpen("mobile") ? "Close navigation" : "Open navigation"
              }
              aria-expanded={menuOpen("mobile")}
              aria-controls="mobile-navigation"
              onClick={() => toggleMenu("mobile")}
            >
              {menuOpen("mobile") ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {menuOpen("mobile") && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            {navigation()}
          </nav>
        )}
      </header>
    </>
  );
}
