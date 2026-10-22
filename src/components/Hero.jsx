import { FiArrowRight, FiArrowUpRight, FiSun } from "react-icons/fi";
import { LuArmchair } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero mx-auto grid w-[calc(100%-36px)] max-w-[1200px] items-center gap-10 py-10 sm:w-[calc(100%-64px)] sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20">
      <div className="hero-copy max-w-xl">
        <div className="hero-eyebrow mb-6 flex items-center gap-2 text-[9px] font-semibold tracking-[2px] text-[#7e8d6b]"><span className="h-1.5 w-1.5 rounded-full bg-[#9eaf81]" />CURATED FINDS. EVERYDAY JOY.</div>
        <h1 className="font-serif text-[44px] leading-[1.08] tracking-[-2px] text-[#263e31] sm:text-[58px] lg:text-[65px]">A little more you.<br />A lot more <em className="font-normal text-[#789262]">home.</em></h1>
        <p className="mt-6 max-w-sm text-[13px] leading-7 text-[#858d7b] sm:text-sm">Thoughtful pieces for the spaces you love.<br className="hidden sm:block" /> Discover something that feels like you.</p>
        <Link className="primary-button mt-8 inline-flex items-center gap-7 rounded-[4px] bg-[#234d39] px-6 py-4 text-xs font-medium text-white transition hover:bg-[#35634b]" to="/products">Explore the collection <FiArrowRight aria-hidden="true" /></Link>
        <div className="hero-social mt-10 flex items-center gap-3">
          <div className="mini-avatars flex -space-x-2" aria-hidden="true">{["J", "A", "♡"].map((letter, index) => <span key={letter} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#fffefa] text-[10px] ${index === 0 ? "bg-[#d7c5ae]" : index === 1 ? "bg-[#b9c3ac]" : "bg-[#e5dfd0]"}`}>{letter}</span>)}</div>
          <div><div className="hero-stars text-[11px] text-[#879b66]">✦ <b className="ml-1 text-[#42553d]">Nook</b></div><span className="text-[9px] text-[#939a88]">Thoughtful finds for everyday living</span></div>
        </div>
      </div>
      <div className="hero-visual relative min-w-0 pb-5">
        <div className="relative h-[360px] overflow-hidden rounded-t-[150px] rounded-b-[7px] bg-[#e8e4d6] sm:h-[460px] lg:h-[500px]">
          <img className="hero-photo h-full w-full object-cover" src="/images/bright-home.jpg" alt="A thoughtfully styled living room with warm, natural furniture" />
          <div className="hero-image-tint pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2c392b]/30 via-transparent to-transparent" />
          <span className="hero-photo-caption pointer-events-none absolute bottom-9 left-7 font-serif text-base italic text-white">A slower pace. A softer space.</span>
        </div>
        <div className="hero-seal absolute -right-2 top-9 grid h-20 w-20 place-content-center rounded-full border border-[#d4dcc6] bg-[#f4f5e9] text-center text-[#71845a] sm:-right-5 sm:h-24 sm:w-24"><FiSun className="mx-auto mb-1 h-5 w-5" aria-hidden="true" /><span className="text-[7px] font-semibold leading-3 tracking-[1.4px]">GOOD THINGS<br />LIVE HERE</span></div>
        <Link className="hero-image-card absolute -bottom-1 left-4 right-4 flex items-center gap-3 rounded-md border border-[#e7e8df] bg-[#fffefa] px-4 py-4 shadow-[0_8px_25px_#293b2d12] sm:left-7 sm:right-7" to="/products">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-[#eef1e7] text-[#6e8658]"><LuArmchair className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><small className="block text-[7px] tracking-[1.3px] text-[#949b86]">MAKE ROOM FOR THE GOOD</small><b className="mt-1 block font-serif text-sm font-normal text-[#344733]">The everyday living edit</b></span><FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
