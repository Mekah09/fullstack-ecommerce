import { Component } from "react";
import { createPath, parsePath, Router } from "react-router-dom";
import { RouteContext } from "../context/RouteContext.jsx";

function readLocation() {
  const { pathname, search, hash } = window.location;
  return {
    pathname,
    search,
    hash,
    state: window.history.state?.usr ?? null,
    key: window.history.state?.key || "default",
  };
}

// React Router's declarative components can use this class-based browser adapter
// without application code calling router or React hooks.
export default class AppRouter extends Component {
  state = { location: readLocation(), action: "POP" };
  handlePopState = () =>
    this.setState({ location: readLocation(), action: "POP" });

  componentDidMount() {
    window.addEventListener("popstate", this.handlePopState);
  }
  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
  }

  navigate = (to, options = {}) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    const href = typeof to === "string" ? to : createPath(to);
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }
    const action = options.replace ? "REPLACE" : "PUSH";
    const historyState = {
      usr: options.state ?? null,
      key: crypto.randomUUID(),
      idx: (window.history.state?.idx || 0) + (options.replace ? 0 : 1),
    };
    window.history[options.replace ? "replaceState" : "pushState"](
      historyState,
      "",
      url.pathname + url.search + url.hash,
    );
    this.setState({ location: readLocation(), action });
  };

  navigator = {
    createHref: (to) => (typeof to === "string" ? to : createPath(to)),
    encodeLocation: (to) => {
      const path = typeof to === "string" ? parsePath(to) : to;
      const url = new URL(createPath(path), window.location.href);
      return { pathname: url.pathname, search: url.search, hash: url.hash };
    },
    push: (to, state) => this.navigate(to, { state }),
    replace: (to, state) => this.navigate(to, { state, replace: true }),
    go: (amount) => window.history.go(amount),
  };

  render() {
    const { location, action } = this.state;
    return (
      <RouteContext.Provider value={{ location, navigate: this.navigate }}>
        <Router
          location={location}
          navigationType={action}
          navigator={this.navigator}
        >
          {this.props.children}
        </Router>
      </RouteContext.Provider>
    );
  }
}
