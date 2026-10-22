import { Link } from "react-router-dom";
import { LuSprout } from "react-icons/lu";

export default function Brand({ onClick }) {
  return (
    <Link to="/" className="brand relative inline-flex items-baseline font-serif text-[43px] font-bold leading-none tracking-[-3px] text-[#234d39] sm:text-[49px]" onClick={onClick} aria-label="Nook home">
      nook<span className="brand-dot text-[#8c9e75]">.</span>
      <LuSprout className="absolute -right-3 -top-1 h-4 w-4 rotate-[-15deg] text-[#a9b594]" aria-hidden="true" />
    </Link>
  );
}
