import { Component } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiLock,
  FiMail,
  FiPackage,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";
import OverlayClose from "./OverlayClose.jsx";
import "./commerce-overlays.css";

let nextAuthId = 0;

export class AuthModal extends Component {
  constructor(props) {
    super(props);
    this.titleId = `auth-title-${++nextAuthId}`;
    this.descriptionId = `${this.titleId}-description`;
    this.state = {
      mode: props.initialMode || "signup",
      role: props.initialRole === "seller" ? "seller" : "buyer",
      busy: false,
      error: "",
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  close = () => {
    if (!this.state.busy) this.props.onClose();
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.busy) return;
    this.setState({ error: "", busy: true });
    const data = new FormData(event.currentTarget);
    const { mode, role } = this.state;
    try {
      await this.props.onSubmit({
        mode,
        role,
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        password: String(data.get("password") || ""),
      });
    } catch (err) {
      if (this.mounted) {
        this.setState({
          error: err?.message || "We couldn’t continue. Please try again.",
        });
      }
    } finally {
      if (this.mounted) this.setState({ busy: false });
    }
  };

  changeMode = () => {
    this.setState(({ mode }) => ({
      mode: mode === "signup" ? "signin" : "signup",
      error: "",
    }));
  };

  render() {
    const { mode, role, busy, error } = this.state;
    const { titleId, descriptionId } = this;
    const signup = mode === "signup";

    return (
      <div
        className="overlay-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) this.close();
        }}
      >
        <DialogPanel
          className="auth-dialog"
          titleId={titleId}
          descriptionId={descriptionId}
          onClose={this.close}
          busy={busy}
        >
          <OverlayClose onClose={this.close} />
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
              onClick={() => this.setState({ role: "buyer" })}
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
              onClick={() => this.setState({ role: "seller" })}
              disabled={busy}
            >
              <FiPackage />
              <span>
                I’m here to sell<small>Share what you create</small>
              </span>
              {role === "seller" && <FiCheck className="auth-role-check" />}
            </button>
          </div>
          <form className="auth-form" onSubmit={this.handleSubmit}>
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
                  placeholder={
                    signup ? "At least 8 characters" : "Your password"
                  }
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
              {busy ? "Just a moment…" : signup ? "Create account" : "Sign in"}
              <FiArrowRight />
            </button>
          </form>
          <p className="auth-switch">
            {signup
              ? "Already part of the neighborhood?"
              : "New to the neighborhood?"}{" "}
            <button type="button" onClick={this.changeMode} disabled={busy}>
              {signup ? "Sign in" : "Join Nook"}
            </button>
          </p>
        </DialogPanel>
      </div>
    );
  }
}
