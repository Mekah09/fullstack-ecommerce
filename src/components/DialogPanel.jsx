import { Component, createRef } from "react";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const openPanels = [];
let bodyWasLocked = false;

export default class DialogPanel extends Component {
  panelRef = createRef();

  componentDidMount() {
    this.previousFocus = document.activeElement;
    if (!openPanels.length) {
      bodyWasLocked = document.body.classList.contains("overflow-hidden");
      document.body.classList.add("overflow-hidden");
    }
    openPanels.push(this);
    const panel = this.panelRef.current;
    const initialFocus = panel.querySelector("[data-initial-focus]");
    const firstControl = this.getFocusableElements()[0];
    if (
      initialFocus &&
      !initialFocus.disabled &&
      initialFocus.getClientRects().length
    ) {
      initialFocus.focus();
    } else {
      (firstControl || panel).focus();
    }
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    const wasTopPanel = openPanels.at(-1) === this;
    const index = openPanels.indexOf(this);
    if (index >= 0) openPanels.splice(index, 1);
    document.removeEventListener("keydown", this.handleKeyDown);
    if (!openPanels.length) {
      if (!bodyWasLocked) document.body.classList.remove("overflow-hidden");
    }
    if (
      wasTopPanel &&
      this.previousFocus instanceof HTMLElement &&
      this.previousFocus.isConnected
    ) {
      this.previousFocus.focus();
    }
  }

  getFocusableElements = () =>
    [...this.panelRef.current.querySelectorAll(focusableSelector)].filter(
      (element) => element.getClientRects().length && !element.hidden,
    );

  handleKeyDown = (event) => {
    if (openPanels.at(-1) !== this) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (!this.props.busy) this.props.onClose?.();
      return;
    }
    if (event.key !== "Tab") return;
    const panel = this.panelRef.current;
    const controls = this.getFocusableElements();
    if (!controls.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = controls[0];
    const last = controls.at(-1);
    const focusOutsideControls =
      !panel.contains(document.activeElement) ||
      document.activeElement === panel;
    if (
      event.shiftKey &&
      (document.activeElement === first || focusOutsideControls)
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last || focusOutsideControls)
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  render() {
    const {
      children,
      className,
      onClose,
      busy = false,
      titleId,
      descriptionId,
      role = "dialog",
      ...sectionProps
    } = this.props;
    // Closing and busy handling belong to the keyboard handler, not DOM props.
    void onClose;
    void busy;
    return (
      <section
        {...sectionProps}
        ref={this.panelRef}
        className={`${className || ""} outline-none`}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {children}
      </section>
    );
  }
}
