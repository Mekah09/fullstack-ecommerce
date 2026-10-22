// Authentication is the only shared API adapter. Connect these public URLs
// when the final email/OTP routes and responses are available.
const endpoints = {
  signin: (import.meta.env?.VITE_AUTH_SIGN_IN_URL || "/account-api/signin").trim(),
  signup: (import.meta.env?.VITE_AUTH_SIGN_UP_URL || "").trim(),
  verify: (import.meta.env?.VITE_AUTH_VERIFY_OTP_URL || "").trim(),
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

async function post(url, body, missingMessage) {
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
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    if (response.ok) throw new Error("The authentication API returned an invalid JSON response.");
    throw new Error(text || `Authentication failed (${response.status}).`);
  }
  if (!response.ok) {
    const message = payload?.message ?? payload?.error?.message;
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
    { email: address, password, ...(signup ? { name: fullName, role } : {}) },
    signup
      ? "Account registration is awaiting its API route. Set VITE_AUTH_SIGN_UP_URL to connect it."
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
  if (requiresOtp) return challenge;
  if (body?.token || body?.accessToken) {
    const session = sessionFrom(payload);
    // Existing backend-provisioned admins can use the current sign-in route.
    // Buyers and sellers must complete the forthcoming OTP verification step.
    if (!signup && session.user.role === "admin") return { session };
    throw new Error("Email verification is required. The authentication API has not provided an OTP challenge.");
  }
  if (signup && typeof body?.message === "string") return challenge;
  throw new Error("Email verification is required. The authentication API has not provided an OTP challenge.");
}

export async function verifyOtp({ email, otp, challengeId }) {
  const code = String(otp || "").trim();
  if (!code) throw new Error("Enter the verification code from your email.");
  const payload = await post(
    endpoints.verify,
    { email, otp: code, ...(challengeId ? { challengeId } : {}) },
    "Email verification is awaiting its API route. Set VITE_AUTH_VERIFY_OTP_URL to connect it.",
  );
  // A success message alone cannot create a session. The selected UI role is
  // never used to grant permissions; verification must return the server user.
  return sessionFrom(payload);
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
