import { FiArrowRight, FiHome } from "react-icons/fi";
import { LuSprout } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found-page page-width mx-auto grid min-h-[68vh] w-[calc(100%-2rem)] max-w-6xl items-center py-10 sm:w-[calc(100%-4rem)] sm:py-16">
      <section className="not-found-panel w-full rounded-xl border border-[#e2e7d9] bg-[#f5f7ef] px-5 py-12 text-center sm:px-8 sm:py-16" aria-labelledby="not-found-heading">
        <div className="not-found-art relative mx-auto mb-6 w-fit" aria-hidden="true"><span className="not-found-code block pr-2 font-serif text-[110px] leading-none tracking-[-8px] text-[#c5d4b9] sm:text-[164px]">404</span><span className="not-found-sprout absolute -bottom-1 -right-2 grid h-12 w-12 rotate-12 place-items-center rounded-full bg-[#234d39] text-2xl text-[#fffefa]"><LuSprout /></span></div>
        <span className="eyebrow text-[9px] font-semibold tracking-[0.2em] text-[#778b63]">A LITTLE DETOUR · ERROR 404</span>
        <h1 id="not-found-heading" className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">Page not found.</h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#7d8b70]">We couldn’t find the page you’re looking for. The link may have changed, or the address may be incorrect.</p>
        <div className="not-found-actions mt-7 flex flex-wrap items-center justify-center gap-6">
          <Link className="primary-button inline-flex items-center gap-3 rounded bg-[#234d39] px-5 py-3 text-sm text-white transition hover:bg-[#183e2b]" to="/"><FiHome aria-hidden="true" /> Back to home</Link>
          <Link className="text-link inline-flex items-center gap-3 border-b border-[#a3b38c] pb-2 text-sm text-[#6f825d]" to="/products">Explore products <FiArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
