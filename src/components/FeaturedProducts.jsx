import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import ProductResults from "./ProductResults.jsx";

export default function FeaturedProducts({ products, loading, error, onRetry }) {
  const featured = [...products].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 4);
  return (
    <section className="catalog-section mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12" aria-labelledby="featured-heading">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end" data-reveal>
        <div><span className="text-[10px] font-semibold tracking-[.25em] text-[#6c805c]">A FEW OF OUR FAVORITES</span><h2 id="featured-heading" className="my-3 font-serif text-4xl tracking-tight sm:text-5xl">Your space. Your style.</h2><p className="text-sm leading-7 text-stone-500">A little look at the good stuff. There’s more to discover.</p></div>
        <Link to="/products" className="inline-flex items-center gap-2 self-start border-b border-[#8d9e73] pb-2 text-xs text-[#58724d]">View all products <FiArrowUpRight /></Link>
      </div>
      <ProductResults products={featured} loading={loading} error={error} onRetry={onRetry} emptyMessage="There are no products in the store yet." />
    </section>
  );
}
