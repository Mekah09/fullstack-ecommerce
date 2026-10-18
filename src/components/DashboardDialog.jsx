import { useEffect, useEffectEvent, useRef } from "react";

export default function DashboardDialog({
  children,
  onClose,
  busy = false,
  titleId,
  descriptionId,
  role = "dialog",
  className = "",
}) {
  const panelRef = useRef(null);
  const close = useEffectEvent(() => {
    if (!busy) onClose();
  });
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    const initialFocus =
      panel.querySelector("[data-initial-focus]") ||
      panel.querySelector(selector);
    initialFocus?.focus();
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...panel.querySelectorAll(selector)].filter(
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
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);
  return (
    <div
      className="dash-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        ref={panelRef}
        tabIndex={-1}
        className={`dash-modal ${className}`}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {children}
      </section>
    </div>
  );
}
