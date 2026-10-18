import { Component } from "react";
import withShop from "./withShop.jsx";

class ScrollToTop extends Component {
  componentDidMount() {
    this.scrollToTop();
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.shop.location.pathname !== this.props.shop.location.pathname
    ) {
      this.scrollToTop();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  render() {
    return null;
  }
}

export default withShop(ScrollToTop);
