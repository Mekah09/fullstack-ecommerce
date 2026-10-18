import { Component } from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";
import OverlayHost from "./OverlayHost.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

export default class AppLayout extends Component {
  componentDidMount() {
    const observed = new WeakSet();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.revealObserver =
      !reducedMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                this.revealObserver.unobserve(entry.target);
              });
            },
            { threshold: 0.08 },
          )
        : null;

    const reveal = (element) => {
      if (observed.has(element)) return;
      observed.add(element);
      if (this.revealObserver) this.revealObserver.observe(element);
      else element.classList.add("is-visible");
    };
    document.querySelectorAll("[data-reveal]").forEach(reveal);
    this.mutations = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches("[data-reveal]")) reveal(node);
          node.querySelectorAll("[data-reveal]").forEach(reveal);
        });
      });
    });
    this.mutations.observe(document.body, { childList: true, subtree: true });
  }

  componentWillUnmount() {
    this.revealObserver?.disconnect();
    this.mutations?.disconnect();
  }

  render() {
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
}
