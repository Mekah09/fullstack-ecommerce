// Authentication is the only shared API adapter. Vite and Vercel proxy these
// defaults to https://fullstack-ecommerce2.onrender.com/user/... .
const endpoints = {
  signin: (import.meta.env?.VITE_AUTH_SIGN_IN_URL || "/account-api/signin").trim(),
  signup: (import.meta.env?.VITE_AUTH_SIGN_UP_URL || "/account-api/signup").trim(),
  verify: (import.meta.env?.VITE_AUTH_VERIFY_OTP_URL || "/account-api/verifyOTP").trim(),
  resend: (import.meta.env?.VITE_AUTH_RESEND_OTP_URL || "").trim(),
};

export const canResendOtp = Boolean(endpoints.resend);
const keys = { user: "nook.user.v1", token: "nook.token.v1" };
const memory = new Map();

function stored(key) {
  try {
    const value = window.sessionStorage.getItem(key);
    return value === null ? memory.get(key) ?? null : JSON.parse(value);
  } catch {
    return memory.get(key) ?? null;
  }
}

function store(key, value) {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage-restricted browsers keep the session in this tab's memory.
  }
}

function sessionFrom(payload) {
  const body = payload?.data ?? payload;
  const account = body?.user;
  const token = body?.token ?? body?.accessToken;
  const role = account?.role === "user" ? "buyer" : account?.role;
  const id = account?.id ?? account?._id;
  if (
    !account ||
    !["buyer", "seller", "admin"].includes(role) ||
    !["string", "number"].includes(typeof id) ||
    !String(id).trim() ||
    (typeof id === "number" && !Number.isFinite(id)) ||
    typeof token !== "string" ||
    !token.trim()
  ) {
    throw new Error("The authentication API must return a token and a user with an ID and account role.");
  }
  return {
    token,
    user: {
      id: String(id),
      name: typeof account.name === "string" ? account.name : "",
      email: typeof account.email === "string" ? account.email : "",
      role,
    },
  };
}

async function post(url, body, missingMessage, allowText = false) {
  if (!url) throw new Error(missingMessage);
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to reach the authentication service. Please try again.");
  }
  const text = await response.text();
  // Express res.send("message") uses text/html even for plain messages.
  // Reject actual markup, while accepting those existing OTP responses.
  if (/^\s*</.test(text)) {
    throw new Error("The authentication URL returned a web page. Please check the API route and try again.");
  }
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    if (response.ok && !allowText) throw new Error("The authentication API returned an invalid JSON response.");
    payload = text;
  }
  if (!response.ok) {
    const message = typeof payload === "string" ? payload : payload?.message ?? payload?.error?.message;
    throw new Error(typeof message === "string" ? message : `Authentication failed (${response.status}). Please try again.`);
  }
  return payload;
}

export async function beginAuth({ mode, role, name, email, password }) {
  const signup = mode === "signup";
  const address = String(email || "").trim();
  const fullName = String(name || "").trim();
  if (!/^\S+@\S+\.\S+$/.test(address)) throw new Error("Enter a valid email address.");
  if (typeof password !== "string" || !password || (signup && password.length < 8))
    throw new Error(signup ? "Use a password with at least 8 characters." : "Enter your password.");
  if (signup && !fullName) throw new Error("Enter your full name.");
  if (signup && !["buyer", "seller"].includes(role)) throw new Error("Choose a buyer or seller account.");
  const payload = await post(
    signup ? endpoints.signup : endpoints.signin,
    { email: address, password, ...(signup ? { name: fullName, role: role === "buyer" ? "user" : "seller" } : {}) },
    signup
      ? "Set VITE_AUTH_SIGN_UP_URL to connect registration."
      : "Set VITE_AUTH_SIGN_IN_URL to connect sign-in.",
  );
  const body = payload?.data ?? payload;
  const challengeId = body?.challengeId;
  const requiresOtp = body?.requiresOtp === true || body?.otpRequired === true ||
    (typeof challengeId === "string" && Boolean(challengeId.trim()));
  if (signup && body?.user?.role === "admin")
    throw new Error("Administrator accounts must be provisioned by the backend.");
  const challenge = {
    requiresOtp: true,
    email: address,
    challengeId: typeof challengeId === "string" ? challengeId : undefined,
    message: typeof body?.message === "string" ? body.message : "",
  };
  // Signup sends the email code; the current API returns only a message.
  // Sign-in checks verification on the backend and returns the actual role.
  if (signup && (requiresOtp || typeof body?.message === "string")) return challenge;
  if (!signup && requiresOtp) return challenge;
  if (!signup) return { session: sessionFrom(payload) };
  throw new Error("The registration API did not confirm that your account was created.");
}

export async function verifyOtp({ email, otp, challengeId }) {
  const code = String(otp || "").trim();
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the six-digit verification code from your email.");
  const address = String(email || "").trim();
  if (!/^\S+@\S+\.\S+$/.test(address)) throw new Error("Enter a valid email address.");
  const payload = await post(
    endpoints.verify,
    { email: address, otp: code, ...(challengeId ? { challengeId } : {}) },
    "Set VITE_AUTH_VERIFY_OTP_URL to connect email verification.",
    true,
  );
  const body = payload?.data ?? payload;
  const message = typeof body === "string" ? body.trim() : body?.message;
  if (body?.token || body?.accessToken) return { session: sessionFrom(payload), message };
  if (typeof message !== "string" || !message.trim() || body?.success === false) {
    throw new Error("The verification API did not confirm your email. Please try again.");
  }
  // Verification confirms the email, not a login. Request credentials again
  // rather than retaining the signup password or inventing a session.
  return { message: "Email verified. Sign in to continue." };
}

export async function resendOtp({ email, challengeId }) {
  const payload = await post(
    endpoints.resend,
    { email, ...(challengeId ? { challengeId } : {}) },
    "Resending codes is awaiting its API route. Set VITE_AUTH_RESEND_OTP_URL to connect it.",
  );
  const body = payload?.data ?? payload;
  return {
    challengeId: typeof body?.challengeId === "string" ? body.challengeId : challengeId,
    message: typeof body?.message === "string" ? body.message : "Request accepted. Check your email for a new code.",
  };
}

export function saveSession(value) {
  const session = sessionFrom(value);
  store(keys.token, session.token);
  store(keys.user, session.user);
  return session;
}

export function clearSession() {
  store(keys.token, null);
  store(keys.user, null);
}

export function readSession() {
  const token = stored(keys.token);
  const user = stored(keys.user);
  if (!token || !user) return null;
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(encoded));
    if (!Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) throw new Error("Expired session");
    // Restores navigation only. Protected APIs must verify the token and current
    // account permissions on the backend.
    return sessionFrom({ user, token });
  } catch {
    clearSession();
    return null;
  }
}
