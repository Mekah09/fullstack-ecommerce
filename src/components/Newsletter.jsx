import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  async function subscribe(event) {
    event.preventDefault();
    if (busy) return;
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    setBusy(true); setError("");
    try {
      const url = (import.meta.env.VITE_NEWSLETTER_API_URL || "").trim();
      if (!url) throw new Error("Newsletter signup will be available when the store connects its subscription service.");
      const response = await fetch(url, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const text = await response.text();
      let data = null;
      if (text) { try { data = JSON.parse(text); } catch { throw new Error("The subscription service returned an invalid response."); } }
      if (!response.ok) throw new Error(data?.message || "Unable to subscribe. Please try again.");
      if (mounted.current) setSubscribed(true);
    } catch (issue) { if (mounted.current) setError(issue.message || "Unable to subscribe. Please try again."); }
    finally { if (mounted.current) setBusy(false); }
  }

  return (
    <section className="newsletter mx-auto grid w-[calc(100%-36px)] max-w-[1200px] items-center gap-8 border-y border-[#e5e8db] py-11 sm:w-[calc(100%-64px)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20" data-reveal>
      <div><span className="eyebrow text-[8px] font-semibold tracking-[2px] text-[#899773]">A NOTE FROM NOOK</span><h2 className="mt-3 font-serif text-[28px] leading-tight tracking-[-0.6px] text-[#354b35] sm:text-[32px]">Good things come to your inbox.</h2><p className="mt-3 text-xs leading-6 text-[#949b88]">Fresh finds, little inspirations, and a few things just for you.</p></div>
      {subscribed ? <div className="newsletter-success flex items-center gap-3 text-xs text-[#406443]" role="status"><FiCheckCircle className="h-5 w-5" aria-hidden="true" /><span>You’re on the list. Make yourself at home!</span></div> : <form onSubmit={subscribe}><div className="newsletter-input flex overflow-hidden rounded border border-[#dfe4d5] bg-white focus-within:border-[#8aa076]"><input className="min-w-0 flex-1 bg-transparent px-4 py-4 text-xs text-[#3f543a] outline-none placeholder:text-[#a2a991] disabled:opacity-50" required name="email" aria-label="Your email for the newsletter" type="email" placeholder="Your email address" disabled={busy} /><button className="m-1 grid w-12 shrink-0 place-items-center rounded bg-[#234d39] text-white transition hover:bg-[#35634b] disabled:opacity-50" type="submit" aria-label={busy ? "Joining the newsletter" : "Join the newsletter"} disabled={busy}><FiArrowRight aria-hidden="true" /></button></div>{error && <p className="form-error mt-2 text-xs leading-5 text-[#a14f42]" role="alert">{error}</p>}<small className="mt-3 block text-[9px] text-[#a0a68f]">{busy ? "Joining the newsletter…" : "Just the good stuff. Unsubscribe anytime."}</small></form>}
    </section>
  );
}
