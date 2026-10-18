import { Link } from "react-router-dom";

export default function Brand({ onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label="Nook home">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      nook<span className="brand-dot">.</span>
    </Link>
  );
}
