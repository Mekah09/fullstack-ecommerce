import { Component, createRef } from "react";
import { Link, NavLink } from "react-router-dom";
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
import { SITE_INFO } from "../data/siteContent.jsx";
import withShop from "./withShop.jsx";
import Brand from "./Brand.jsx";

class SiteHeader extends Component {
  state = { menu: null };
  headerRef = createRef();
  accountRef = createRef();

  componentDidMount() {
    document.addEventListener("pointerdown", this.onPointerDown);
    document.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("popstate", this.closeMenus);
  }

  componentWillUnmount() {
    document.removeEventListener("pointerdown", this.onPointerDown);
    document.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("popstate", this.closeMenus);
  }

  closeMenus = () => this.setState({ menu: null });

  onPointerDown = (event) => {
    if (!this.headerRef.current?.contains(event.target)) this.closeMenus();
    if (
      this.accountRef.current &&
      !this.accountRef.current.contains(event.target)
    ) {
      this.setState(({ menu }) => ({
        menu: menu?.name === "account" ? null : menu,
      }));
    }
  };

  onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    const trigger = this.headerRef.current?.querySelector(
      '[aria-expanded="true"]',
    );
    this.closeMenus();
    trigger?.focus();
  };

  render() {
    const {
      user,
      cartCount,
      favorites,
      openAuth,
      openCart,
      logout,
      showInfo,
      location,
    } = this.props.shop;
    const { menu } = this.state;
    const { headerRef, accountRef, closeMenus } = this;
    const menuOpen = (name) => menu?.name === name && menu.key === location.key;
    const toggleMenu = (name) =>
      this.setState({
        menu: menuOpen(name) ? null : { name, key: location.key },
      });
    const savedOnly =
      location.pathname === "/products" &&
      new URLSearchParams(location.search).get("saved") === "true";
    const activeClass = ({ isActive }) => (isActive ? "active" : "");

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
              <FiTruck /> Find your next favorite
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
}

export default withShop(SiteHeader);
