import { useEffect, useEffectEvent, useRef } from "react";

export default function useOverlay(onClose) {
  const panelRef = useRef(null);
  const closeOverlay = useEffectEvent(onClose);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    const initialFocus =
      panel?.querySelector("[data-initial-focus]") ||
      panel?.querySelector(focusableSelector);
    initialFocus?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeOverlay();
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll(focusableSelector)].filter(
        (element) => element.getClientRects().length,
      );
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  return panelRef;
}
