import { useEffect, useId, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiCheckCircle, FiLock, FiMail, FiPackage, FiShoppingBag, FiUser } from "react-icons/fi";
import DialogPanel from "./DialogPanel.jsx";
import OverlayClose from "./OverlayClose.jsx";
import { beginAuth, canResendOtp, resendOtp, verifyOtp } from "../services/auth.jsx";

export function AuthModal({ initialMode = "signup", initialRole = "buyer", onClose, onSubmit }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole === "seller" ? "seller" : "buyer");
  const [stage, setStage] = useState("credentials");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [challengeId, setChallengeId] = useState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const busyRef = useRef(false);
  const mounted = useRef(true);
  const codeRef = useRef(null);
  const emailRef = useRef(null);
  const id = useId();
  const signup = mode === "signup";

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (stage === "otp") codeRef.current?.focus();
  }, [stage]);

  const close = () => { if (!busyRef.current) onClose(); };

  async function perform(action) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (issue) {
      if (mounted.current) setError(issue.message || "We couldn’t continue. Please try again.");
    } finally {
      busyRef.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  async function complete(session) {
    if (!mounted.current) return;
    await onSubmit(session);
    if (mounted.current) setStage("complete");
  }

  function submitCredentials(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = String(data.get("email") || "").trim();
    const fullName = String(data.get("name") || "").trim();
    perform(async () => {
      const result = await beginAuth({ mode, role, name: fullName, email: address, password: String(data.get("password") || "") });
      if (!mounted.current) return;
      if (result.session) return complete(result.session);
      setEmail(result.email);
      setName(fullName);
      setChallengeId(result.challengeId);
      setNotice(result.message);
      setStage("otp");
    });
  }

  function submitCode(event) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("otp") || "");
    perform(async () => {
      const result = await verifyOtp({ email, otp: code, challengeId, mode, role });
      if (!mounted.current) return;
      if (result.session) return complete(result.session);
      // This backend verifies the email without issuing a login token.
      // Return to sign-in without keeping the registration password.
      setMode("signin");
      setStage("credentials");
      setChallengeId(undefined);
      setNotice("Email verified. Sign in to continue.");
      requestAnimationFrame(() => emailRef.current?.focus());
    });
  }

  function verifyExistingEmail() {
    if (busyRef.current || !emailRef.current?.reportValidity()) return;
    setEmail(emailRef.current.value.trim());
    setChallengeId(undefined);
    setError("");
    setNotice("Enter the code sent to your email when you signed up.");
    setStage("otp");
  }

  function sendAgain() {
    perform(async () => {
      const result = await resendOtp({ email, challengeId, mode, role });
      if (!mounted.current) return;
      setChallengeId(result.challengeId);
      setNotice(result.message);
    });
  }

  function backToCredentials() {
    if (busyRef.current) return;
    setStage("credentials");
    setChallengeId(undefined);
    setError("");
    setNotice("");
    requestAnimationFrame(() => emailRef.current?.focus());
  }

  return (
    <div className="overlay-backdrop fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#142d20]/45 p-4 backdrop-blur-sm sm:p-7" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <DialogPanel className="auth-dialog relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-[#fffefa] p-6 text-[#263e31] shadow-2xl outline-none sm:p-9" titleId={`${id}-title`} descriptionId={`${id}-description`} onClose={close} busy={busy}>
        <OverlayClose onClose={close} className="absolute right-4 top-4" />
        <div className="mb-6 font-serif text-4xl font-bold tracking-[-2px] text-[#234d39]">nook<span className="ml-1 align-super font-sans text-[10px] tracking-normal">®</span></div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6c7b63]">A little more you.</span>
        <h2 id={`${id}-title`} className="mt-2 font-serif text-3xl tracking-tight">{stage === "otp" ? "Check your email." : stage === "complete" ? "You’re signed in." : signup ? "Make yourself at home." : "Welcome back."}</h2>
        <p id={`${id}-description`} className="mb-6 mt-3 text-sm leading-6 text-[#76816f]">{stage === "otp" ? <>Enter your verification code for <strong className="break-words font-medium text-[#234d39]">{email}</strong>.</> : stage === "complete" ? "Your account is ready. Let’s get you to your space." : signup ? "Choose your account, then verify your email to get started." : "Sign in with the email and password for your verified account."}</p>

        {stage === "credentials" && <>
          {signup && <div className="auth-role-switch mb-5 grid grid-cols-2 gap-2" role="group" aria-label="Account type">
            <button type="button" aria-pressed={role === "buyer"} disabled={busy} onClick={() => setRole("buyer")} className={`relative flex min-w-0 items-start gap-2 rounded-lg border p-3 text-left text-xs transition disabled:cursor-wait disabled:opacity-60 ${role === "buyer" ? "border-[#547858] bg-[#f0f4ed] text-[#234d39]" : "border-[#e2e4dc] bg-white text-[#68745f]"}`}><FiShoppingBag className="mt-0.5 shrink-0" /><span>I’m here to shop<small className="mt-1 block text-[10px] font-normal text-[#7c8774]">Find something good</small></span>{role === "buyer" && <FiCheck className="absolute right-1 top-1 text-[10px]" />}</button>
            <button type="button" aria-pressed={role === "seller"} disabled={busy} onClick={() => setRole("seller")} className={`relative flex min-w-0 items-start gap-2 rounded-lg border p-3 text-left text-xs transition disabled:cursor-wait disabled:opacity-60 ${role === "seller" ? "border-[#547858] bg-[#f0f4ed] text-[#234d39]" : "border-[#e2e4dc] bg-white text-[#68745f]"}`}><FiPackage className="mt-0.5 shrink-0" /><span>I’m here to sell<small className="mt-1 block text-[10px] font-normal text-[#7c8774]">Share what you create</small></span>{role === "seller" && <FiCheck className="absolute right-1 top-1 text-[10px]" />}</button>
          </div>}
          {notice && <p role="status" className="mb-5 rounded-lg border border-[#dce7d5] bg-[#f0f5ec] p-3 text-xs leading-5 text-[#47613e]">{notice}</p>}
          <form key={mode} className="auth-form space-y-4" onSubmit={submitCredentials}>
            {signup && <label className="block text-xs font-medium text-[#52604c]">Full name<div className="relative mt-1.5"><FiUser className="pointer-events-none absolute left-3 top-3.5 text-[#969d90]" /><input name="name" autoComplete="name" required maxLength={80} defaultValue={name} disabled={busy} data-initial-focus className="h-11 w-full rounded-lg border border-[#dfe4d8] bg-white pl-10 pr-3 text-sm text-[#293b2d] outline-none placeholder:text-[#a5aa9e] focus:border-[#6d8b61] focus:ring-3 focus:ring-[#edf1e8] disabled:opacity-60" placeholder="Your full name" /></div></label>}
            <label className="block text-xs font-medium text-[#52604c]">Email address<div className="relative mt-1.5"><FiMail className="pointer-events-none absolute left-3 top-3.5 text-[#969d90]" /><input ref={emailRef} name="email" type="email" autoComplete="email" required defaultValue={email} disabled={busy} data-initial-focus={!signup ? true : undefined} className="h-11 w-full rounded-lg border border-[#dfe4d8] bg-white pl-10 pr-3 text-sm text-[#293b2d] outline-none placeholder:text-[#a5aa9e] focus:border-[#6d8b61] focus:ring-3 focus:ring-[#edf1e8] disabled:opacity-60" placeholder="you@example.com" /></div></label>
            <label className="block text-xs font-medium text-[#52604c]">Password<div className="relative mt-1.5"><FiLock className="pointer-events-none absolute left-3 top-3.5 text-[#969d90]" /><input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 8 : undefined} disabled={busy} className="h-11 w-full rounded-lg border border-[#dfe4d8] bg-white pl-10 pr-3 text-sm text-[#293b2d] outline-none placeholder:text-[#a5aa9e] focus:border-[#6d8b61] focus:ring-3 focus:ring-[#edf1e8] disabled:opacity-60" placeholder={signup ? "At least 8 characters" : "Your password"} /></div></label>
            {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="auth-submit flex min-h-11 w-full items-center justify-between rounded-lg bg-[#234d39] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#183f2c] disabled:cursor-wait disabled:opacity-60">{busy ? "Just a moment…" : signup ? "Create account" : "Sign in"}<FiArrowRight /></button>
          </form>
          {!signup && <p className="mt-4 text-center text-xs leading-6 text-[#818b78]">Still need to confirm your account? <button type="button" disabled={busy} onClick={verifyExistingEmail} className="font-semibold text-[#234d39] underline-offset-4 hover:underline disabled:opacity-60">Verify your email</button></p>}
          <p className="mt-5 text-center text-xs leading-6 text-[#818b78]">{signup ? "Already part of the neighborhood?" : "New to the neighborhood?"} <button type="button" disabled={busy} onClick={() => { setEmail(emailRef.current?.value.trim() || ""); setMode(signup ? "signin" : "signup"); setError(""); setNotice(""); }} className="font-semibold text-[#234d39] underline-offset-4 hover:underline disabled:opacity-60">{signup ? "Sign in" : "Join Nook"}</button></p>
        </>}

        {stage === "otp" && <>
          {notice && <p role="status" className="mb-5 rounded-lg border border-[#dce7d5] bg-[#f0f5ec] p-3 text-xs leading-5 text-[#47613e]">{notice}</p>}
          <form className="space-y-4" onSubmit={submitCode}>
            <label className="block text-xs font-medium text-[#52604c]">Verification code<input ref={codeRef} name="otp" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" required minLength={6} maxLength={6} disabled={busy} placeholder="6-digit code" className="mt-2 h-12 w-full rounded-lg border border-[#dfe4d8] bg-white px-4 text-center text-xl tracking-[0.2em] text-[#293b2d] outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-[#a5aa9e] focus:border-[#6d8b61] focus:ring-3 focus:ring-[#edf1e8] disabled:opacity-60" /></label>
            {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-between rounded-lg bg-[#234d39] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#183f2c] disabled:cursor-wait disabled:opacity-60">{busy ? "Checking your code…" : "Verify email and continue"}<FiArrowRight /></button>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><button type="button" disabled={busy} onClick={backToCredentials} className="inline-flex items-center gap-1.5 text-[#68745f] hover:text-[#234d39] disabled:opacity-60"><FiArrowLeft /> Use a different email</button><button type="button" disabled={busy || !canResendOtp} onClick={sendAgain} className="font-medium text-[#234d39] underline-offset-4 hover:underline disabled:cursor-default disabled:text-[#a4ac9c]">Resend code</button></div>
          {!canResendOtp && <p className="mt-3 text-xs text-[#89927f]">Resending codes isn’t available yet.</p>}
        </>}
        {stage === "complete" && <div className="text-center"><FiCheckCircle className="mx-auto mb-5 size-12 text-[#507447]" /><button type="button" onClick={close} className="inline-flex items-center gap-3 rounded-lg bg-[#234d39] px-5 py-3 text-sm font-medium text-white">Continue <FiArrowRight /></button></div>}
      </DialogPanel>
    </div>
  );
}
