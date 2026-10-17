import { Outlet } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import OverlayHost from "./OverlayHost";
import ScrollToTop from "./ScrollToTop";

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
