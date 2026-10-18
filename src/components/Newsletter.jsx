import { useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useShop } from "../hooks/useShop.jsx";

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const { notify } = useShop();

  function subscribe(event) {
    event.preventDefault();
    setSubscribed(true);
    notify("You’re on the demo mailing list. Thanks for stopping by!");
  }

  return (
    <section className="newsletter page-width" data-reveal>
      <div>
        <span className="eyebrow">A NOTE FROM NOOK</span>
        <h2>Good things come to your inbox.</h2>
        <p>Fresh finds, little inspirations, and a few things just for you.</p>
      </div>
      {subscribed ? (
        <div className="newsletter-success" role="status">
          <FiCheckCircle />
          <span>You’re on the list. Make yourself at home!</span>
        </div>
      ) : (
        <form onSubmit={subscribe}>
          <div className="newsletter-input">
            <input
              required
              aria-label="Your email for the newsletter"
              type="email"
              placeholder="Your email address"
            />
            <button type="submit" aria-label="Join the newsletter">
              <FiArrowRight />
            </button>
          </div>
          <small>Just the good stuff. Unsubscribe anytime.</small>
        </form>
      )}
    </section>
  );
}
