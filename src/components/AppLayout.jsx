import { Outlet } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal.jsx";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";
import OverlayHost from "./OverlayHost.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

export default function AppLayout() {
  useScrollReveal();
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <OverlayHost />
    </>
  );
}
