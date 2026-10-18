import { Component } from "react";
import { FiImage } from "react-icons/fi";

export default class ProductImage extends Component {
  state = { failedSource: null };

  render() {
    const { src, alt = "", className = "", ...imageProps } = this.props;
    const source = typeof src === "string" ? src.trim() : "";

    if (!source || this.state.failedSource === source) {
      return (
        <span
          className={`product-image-placeholder ${className}`.trim()}
          role="img"
          aria-label={`Image unavailable${alt ? ` for ${alt}` : ""}`}
          title="Product image unavailable"
        >
          <FiImage aria-hidden="true" />
        </span>
      );
    }

    return (
      <img
        {...imageProps}
        src={source}
        alt={alt}
        className={className || undefined}
        onError={(event) => {
          this.setState({ failedSource: source });
          this.props.onError?.(event);
        }}
      />
    );
  }
}
