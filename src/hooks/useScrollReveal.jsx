import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observed = new WeakSet();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observer =
      !reducedMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
              });
            },
            { threshold: 0.08 },
          )
        : null;

    function reveal(element) {
      if (observed.has(element)) return;
      observed.add(element);
      if (observer) observer.observe(element);
      else element.classList.add("is-visible");
    }

    document.querySelectorAll("[data-reveal]").forEach(reveal);
    const mutations = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches("[data-reveal]")) reveal(node);
          node.querySelectorAll("[data-reveal]").forEach(reveal);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer?.disconnect();
      mutations.disconnect();
    };
  }, []);
}
