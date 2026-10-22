import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";
import OverlayHost from "./OverlayHost.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

export default function AppLayout() {
  useEffect(() => {
    const observed = new WeakSet();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = !reduceMotion && "IntersectionObserver" in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("opacity-0", "translate-y-4");
        entry.target.classList.add("opacity-100", "translate-y-0", "is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 }) : null;
    function reveal(element) {
      if (observed.has(element)) return;
      observed.add(element);
      if (observer) {
        element.classList.remove("opacity-100", "translate-y-0", "is-visible");
        element.classList.add("opacity-0", "translate-y-4", "transition-all", "duration-700", "ease-out");
        observer.observe(element);
      } else element.classList.add("opacity-100", "translate-y-0", "is-visible");
    }
    document.querySelectorAll("[data-reveal]").forEach(reveal);
    const mutations = new MutationObserver(records => records.forEach(({ addedNodes }) => addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches("[data-reveal]")) reveal(node);
      node.querySelectorAll("[data-reveal]").forEach(reveal);
    })));
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer?.disconnect(); mutations.disconnect();
      document.querySelectorAll("[data-reveal]").forEach(element => {
        element.classList.remove("opacity-0", "translate-y-4");
        element.classList.add("opacity-100", "translate-y-0");
      });
    };
  }, []);
  return <><ScrollToTop /><SiteHeader /><Outlet /><SiteFooter /><OverlayHost /></>;
}
