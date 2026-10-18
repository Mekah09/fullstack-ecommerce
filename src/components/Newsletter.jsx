import { Component } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import withShop from "./withShop.jsx";

class Newsletter extends Component {
  state = { subscribed: false, busy: false, error: "" };
  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  subscribe = async (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    this.setState({ busy: true, error: "" });
    try {
      await this.props.shop.subscribeNewsletter(email);
      if (this.mounted) this.setState({ subscribed: true });
    } catch (error) {
      if (this.mounted)
        this.setState({
          error: error.message || "Unable to subscribe. Please try again.",
        });
    } finally {
      if (this.mounted) this.setState({ busy: false });
    }
  };

  render() {
    const { subscribed, busy, error } = this.state;
    return (
      <section className="newsletter page-width" data-reveal>
        <div>
          <span className="eyebrow">A NOTE FROM NOOK</span>
          <h2>Good things come to your inbox.</h2>
          <p>
            Fresh finds, little inspirations, and a few things just for you.
          </p>
        </div>
        {subscribed ? (
          <div className="newsletter-success" role="status">
            <FiCheckCircle />
            <span>You’re on the list. Make yourself at home!</span>
          </div>
        ) : (
          <form onSubmit={this.subscribe}>
            <div className="newsletter-input">
              <input
                required
                name="email"
                aria-label="Your email for the newsletter"
                type="email"
                placeholder="Your email address"
                disabled={busy}
              />
              <button
                type="submit"
                aria-label={
                  busy ? "Joining the newsletter" : "Join the newsletter"
                }
                disabled={busy}
              >
                <FiArrowRight />
              </button>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <small>
              {busy
                ? "Joining the newsletter…"
                : "Just the good stuff. Unsubscribe anytime."}
            </small>
          </form>
        )}
      </section>
    );
  }
}

export default withShop(Newsletter);
