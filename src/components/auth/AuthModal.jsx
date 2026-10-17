import { useId, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiLock,
  FiMail,
  FiPackage,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import useOverlay from "../../hooks/useOverlay";
import OverlayClose from "../ui/OverlayClose";
import "../commerce-overlays.css";

export function AuthModal({
  onClose,
  onSubmit,
  initialMode = "signup",
  initialRole = "buyer",
  isDemo = true,
}) {
  const panelRef = useOverlay(onClose);
  const titleId = useId();
  const descriptionId = useId();
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(
    initialRole === "seller" ? "seller" : "buyer",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const signup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      await onSubmit({
        mode,
        role,
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        password: String(data.get("password") || ""),
      });
    } catch (err) {
      setError(err?.message || "We couldn’t continue. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function exploreAdmin() {
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        mode: "demo",
        role: "admin",
        name: "Alex Morgan",
        email: "admin@nook.demo",
      });
    } catch (err) {
      setError(
        err?.message || "We couldn’t open the admin demo. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function changeMode() {
    setMode(signup ? "signin" : "signup");
    setError("");
  }

  return (
    <div
      className="overlay-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        ref={panelRef}
        tabIndex={-1}
      >
        <OverlayClose onClose={onClose} />
        <div className="auth-brand">
          nook<span>®</span>
        </div>
        <span className="overlay-eyebrow">A little more you.</span>
        <h2 id={titleId}>
          {signup ? "Make yourself at home." : "Welcome back."}
        </h2>
        <p className="auth-intro" id={descriptionId}>
          {signup
            ? "Join a community of good finds and great taste."
            : "Your next favorite find is waiting for you."}
        </p>
        <div
          className="auth-role-switch"
          role="group"
          aria-label="Account type"
        >
          <button
            type="button"
            className={role === "buyer" ? "auth-role active" : "auth-role"}
            aria-pressed={role === "buyer"}
            onClick={() => setRole("buyer")}
            disabled={busy}
          >
            <FiShoppingBag />
            <span>
              I’m here to shop<small>Discover something good</small>
            </span>
            {role === "buyer" && <FiCheck className="auth-role-check" />}
          </button>
          <button
            type="button"
            className={role === "seller" ? "auth-role active" : "auth-role"}
            aria-pressed={role === "seller"}
            onClick={() => setRole("seller")}
            disabled={busy}
          >
            <FiPackage />
            <span>
              I’m here to sell<small>Share what you create</small>
            </span>
            {role === "seller" && <FiCheck className="auth-role-check" />}
          </button>
        </div>
        {isDemo && (
          <p className="auth-demo-note">
            <span>DEMO EXPERIENCE</span> Explore with a local demo account. No
            real account is created. Use a sample password.
          </p>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          {signup && (
            <label>
              Full name
              <div className="auth-input-wrap">
                <FiUser />
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                  maxLength={80}
                  data-initial-focus
                />
              </div>
            </label>
          )}
          <label>
            Email address
            <div className="auth-input-wrap">
              <FiMail />
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                data-initial-focus={!signup ? true : undefined}
              />
            </div>
          </label>
          <label>
            Password
            <div className="auth-input-wrap">
              <FiLock />
              <input
                type="password"
                name="password"
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder={signup ? "At least 8 characters" : "Your password"}
                minLength={signup ? 8 : undefined}
                required
              />
            </div>
          </label>
          {error && (
            <p className="overlay-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="overlay-primary auth-submit"
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Just a moment…"
              : signup
                ? isDemo
                  ? "Create demo account"
                  : "Create account"
                : isDemo
                  ? "Enter demo account"
                  : "Sign in"}
            <FiArrowRight />
          </button>
        </form>
        <p className="auth-switch">
          {signup
            ? "Already part of the neighborhood?"
            : "New to the neighborhood?"}{" "}
          <button type="button" onClick={changeMode} disabled={busy}>
            {signup ? "Sign in" : "Join Nook"}
          </button>
        </p>
        {isDemo && (
          <div className="auth-admin">
            <button type="button" onClick={exploreAdmin} disabled={busy}>
              Explore admin demo <FiArrowRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
