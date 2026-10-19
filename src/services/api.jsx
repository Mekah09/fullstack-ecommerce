export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");
export const API_CONFIGURED = Boolean(API_BASE_URL);
const DEFAULT_PRODUCTS_API_URL =
  "https://fullstack-ecommerce2.onrender.com/products";
export const PRODUCTS_API_URL =
  (import.meta.env?.VITE_PRODUCTS_API_URL || "").trim() ||
  DEFAULT_PRODUCTS_API_URL;
// Vite and Vercel forward this same-origin route to the public catalog.
const PRODUCTS_REQUEST_URL =
  import.meta.env?.DEV || PRODUCTS_API_URL === DEFAULT_PRODUCTS_API_URL
    ? "/catalog-api/products"
    : PRODUCTS_API_URL;
const DEFAULT_ADD_PRODUCT_API_URL =
  "https://fullstack-ecommerce2.onrender.com/addProduct";
export const ADD_PRODUCT_API_URL =
  (import.meta.env?.VITE_ADD_PRODUCT_API_URL || "").trim() ||
  DEFAULT_ADD_PRODUCT_API_URL;
const ADD_PRODUCT_REQUEST_URL =
  import.meta.env?.DEV || ADD_PRODUCT_API_URL === DEFAULT_ADD_PRODUCT_API_URL
    ? "/catalog-api/add-product"
    : ADD_PRODUCT_API_URL;

const sessionKeys = { user: "nook.user.v1", token: "nook.token.v1" };
const sessionMemory = new Map();

function readSession(key) {
  try {
    const value = window.sessionStorage.getItem(key);
    return value === null
      ? (sessionMemory.get(key) ?? null)
      : JSON.parse(value);
  } catch {
    return sessionMemory.get(key) ?? null;
  }
}

function writeSession(key, value) {
  if (value === null) sessionMemory.delete(key);
  else sessionMemory.set(key, value);
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A browser that blocks storage keeps the session in this tab's memory.
  }
}

async function request(path, options = {}) {
  if (!API_CONFIGURED) {
    throw new Error(
      "This action needs your account and order API. Set VITE_API_BASE_URL to connect it.",
    );
  }
  return requestUrl(`${API_BASE_URL}${path}`, options, true);
}

async function requestUrl(url, options = {}, authenticated = false) {
  const token = authenticated ? readSession(sessionKeys.token) : null;
  const multipart = options.body instanceof FormData;
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body && !multipart
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to reach the store. Check your connection and the API's CORS settings, then try again.",
    );
  }

  let payload = null;
  if (response.status !== 204) {
    const body = await response.text();
    if (body) {
      try {
        payload = JSON.parse(body);
      } catch {
        if (response.ok) {
          throw new Error(
            "The API returned invalid JSON. Check the backend response.",
          );
        }
      }
    }
  }
  if (!response.ok) {
    const message = payload?.message || payload?.error?.message;
    throw new Error(
      typeof message === "string"
        ? message
        : `The request failed (${response.status}). Please try again.`,
    );
  }
  return payload;
}

function extract(payload, property) {
  return (
    payload?.[property] ?? payload?.data?.[property] ?? payload?.data ?? payload
  );
}

function identifier(value, kind) {
  if (
    !["string", "number"].includes(typeof value) ||
    !String(value).trim() ||
    (typeof value === "number" && !Number.isFinite(value))
  ) {
    throw new Error(`The API returned a ${kind} without a valid ID.`);
  }
  return String(value);
}

function nonnegativeNumber(value, field, optional = false) {
  if (optional && (value === undefined || value === null || value === ""))
    return undefined;
  const number = Number(value);
  if (
    !["string", "number"].includes(typeof value) ||
    !String(value).trim() ||
    !Number.isFinite(number) ||
    number < 0
  ) {
    throw new Error(`The API returned an invalid product ${field}.`);
  }
  return number;
}

function productImage(value, sourceUrl) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const base = new URL(sourceUrl, window.location.origin);
    const url = new URL(value.trim(), base);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function normalizeProduct(product, sourceUrl = PRODUCTS_API_URL) {
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    throw new Error("The API returned an invalid product.");
  }
  const name = product.productName ?? product.name ?? product.title;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("The API returned a product without a name.");
  }
  const stock = nonnegativeNumber(product.stock, "stock", true) ?? null;
  if (stock !== null && !Number.isSafeInteger(stock))
    throw new Error("The API returned invalid product stock.");
  const category =
    typeof (product.productCategory ?? product.category) === "string"
      ? (product.productCategory ?? product.category)
      : product.category?.name;
  const seller =
    typeof product.seller === "string" ? product.seller : product.seller?.name;
  const sellerId =
    product.sellerId ?? product.seller?.id ?? product.seller?._id;
  const normalized = {
    ...product,
    id: identifier(product.id ?? product._id, "product"),
    name: name.trim(),
    category: typeof category === "string" ? category : "",
    seller: typeof seller === "string" ? seller : "",
    image: productImage(product.productImage ?? product.image, sourceUrl),
    description:
      typeof product.description === "string" ? product.description : "",
    badge: typeof product.badge === "string" ? product.badge : "",
    price: nonnegativeNumber(product.productPrice ?? product.price, "price"),
    stock,
    colors: Array.isArray(product.colors)
      ? product.colors.filter((color) => typeof color === "string")
      : [],
  };
  if (sellerId !== undefined && sellerId !== null)
    normalized.sellerId = String(sellerId);
  for (const field of ["rating", "reviews", "originalPrice"]) {
    const value = nonnegativeNumber(product[field], field, true);
    if (value === undefined) delete normalized[field];
    else normalized[field] = value;
  }
  return normalized;
}

function publicUser(user) {
  const role = user?.role === "user" ? "buyer" : user?.role;
  if (!user || !["buyer", "seller", "admin"].includes(role)) {
    throw new Error(
      "The server returned an invalid account. Please sign in again.",
    );
  }
  return {
    id: identifier(user.id ?? user._id, "user"),
    name: typeof user.name === "string" ? user.name : "",
    email: typeof user.email === "string" ? user.email : "",
    role,
  };
}

function saveAuth(payload) {
  const user = publicUser(extract(payload, "user"));
  const token =
    payload?.token ??
    payload?.accessToken ??
    payload?.data?.token ??
    payload?.data?.accessToken;
  if (typeof token !== "string" || !token.trim()) {
    throw new Error(
      "The server did not return an access token. Check the authentication API.",
    );
  }
  writeSession(sessionKeys.token, token);
  writeSession(sessionKeys.user, user);
  return user;
}

function validateCredentials({ email, password }, minimumLength = 6) {
  if (!/^\S+@\S+\.\S+$/.test(email || ""))
    throw new Error("Please enter a valid email address.");
  if (!password || password.length < minimumLength)
    throw new Error(
      minimumLength === 1
        ? "Please enter your password."
        : `Please use a password with at least ${minimumLength} characters.`,
    );
}

function normalizeOrder(order) {
  if (!order || typeof order !== "object" || !Array.isArray(order.items)) {
    throw new Error("The API returned an invalid order.");
  }
  const total = Number(order.total);
  if (
    !["number", "string"].includes(typeof order.total) ||
    !String(order.total).trim() ||
    !Number.isFinite(total) ||
    total < 0
  ) {
    throw new Error("The API returned an order without a valid total.");
  }
  return { ...order, id: identifier(order.id ?? order._id, "order"), total };
}

function orderPayload(input) {
  if (!input.items?.length)
    throw new Error("Add something to your bag before checking out.");
  const items = input.items.map((item) => {
    const productId = item.productId ?? item.id ?? item.product?.id;
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error(
        "Please choose a valid product and quantity for each item.",
      );
    }
    return {
      productId: String(productId),
      quantity,
      ...(item.selectedColor ? { selectedColor: item.selectedColor } : {}),
    };
  });
  const addressFields = ["name", "email", "address", "city", "postalCode"];
  const shippingAddress = Object.fromEntries(
    addressFields
      .filter((field) => input.shippingAddress?.[field] !== undefined)
      .map((field) => [field, input.shippingAddress[field]]),
  );
  return { items, shippingAddress };
}

export async function getProducts() {
  const payload = await requestUrl(PRODUCTS_REQUEST_URL);
  const products = Array.isArray(payload) ? payload : payload?.products;
  if (!Array.isArray(products)) {
    throw new Error(
      "The products API must return an array or an object containing a products array.",
    );
  }
  const normalized = products.map((product) => normalizeProduct(product));
  if (
    new Set(normalized.map((product) => product.id)).size !== normalized.length
  ) {
    throw new Error("The products API returned duplicate product IDs.");
  }
  return normalized;
}

export async function createProduct(input) {
  const name = input.name?.trim();
  const category = input.category?.trim();
  const price = Number(input.price);
  if (!name || !category || !Number.isFinite(price) || price <= 0) {
    throw new Error("Enter a product name, category, and price greater than zero.");
  }
  const image = input.image;
  if (!(image instanceof File) || image.size === 0)
    throw new Error("Choose a product image file to upload.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(image.type))
    throw new Error("Choose a JPG, PNG, or WebP product image.");
  if (image.size > 2 * 1024 * 1024)
    throw new Error("Choose an image no larger than 2 MB.");
  const body = new FormData();
  body.append("productName", name);
  body.append("productPrice", String(price));
  body.append("productCategory", category);
  body.append("productImage", image);
  return normalizeProduct(
    extract(
      await requestUrl(ADD_PRODUCT_REQUEST_URL, {
        method: "POST",
        body,
      }),
      "product",
    ),
    ADD_PRODUCT_API_URL,
  );
}

export async function updateProduct(id, updates) {
  return normalizeProduct(
    extract(
      await request(`/products/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
      "product",
    ),
    `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
  );
}

export async function deleteProduct(id) {
  await request(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
  return { id: String(id) };
}

export async function signIn({ email, password }) {
  validateCredentials({ email, password }, 1);
  const payload = await requestUrl("/account-api/signin", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const user = saveAuth(payload);
  const account = { ...user, email: user.email || email.trim() };
  writeSession(sessionKeys.user, account);
  return account;
}

export async function signUp({ name, email, password, role = "buyer" }) {
  validateCredentials({ email, password });
  if (!name?.trim()) throw new Error("Please enter your name.");
  if (!["buyer", "seller"].includes(role))
    throw new Error("You can register as a buyer or a seller.");
  return saveAuth(
    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      }),
    }),
  );
}

export async function getCurrentUser() {
  const token = readSession(sessionKeys.token);
  if (!token) return null;
  // The backend has no /me route. Restore its last sign-in response for
  // navigation only; the server must authorize every protected API action.
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(encoded));
    if (!Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now())
      throw new Error("Session expired");
    return publicUser(readSession(sessionKeys.user));
  } catch {
    writeSession(sessionKeys.token, null);
    writeSession(sessionKeys.user, null);
    return null;
  }
}

export async function signOut() {
  writeSession(sessionKeys.user, null);
  writeSession(sessionKeys.token, null);
}

export async function getOrders() {
  if (!readSession(sessionKeys.token)) return [];
  const orders = extract(await request("/orders"), "orders");
  if (!Array.isArray(orders))
    throw new Error("The orders API must return an array.");
  return orders.map(normalizeOrder);
}

export async function createOrder(input) {
  return normalizeOrder(
    extract(
      await request("/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload(input)),
      }),
      "order",
    ),
  );
}

export async function getSellers() {
  const sellers = extract(await request("/admin/sellers"), "sellers");
  if (!Array.isArray(sellers))
    throw new Error("The sellers API must return an array.");
  return sellers.map((seller) => ({
    ...seller,
    id: identifier(seller.id ?? seller._id, "seller"),
  }));
}

export async function approveSeller(id) {
  const seller = extract(
    await request(`/admin/sellers/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Approved" }),
    }),
    "seller",
  );
  if (!seller || typeof seller !== "object")
    throw new Error("The API returned an invalid seller.");
  return { ...seller, id: identifier(seller.id ?? seller._id, "seller") };
}

export async function subscribeNewsletter(email) {
  if (!/^\S+@\S+\.\S+$/.test(email || ""))
    throw new Error("Please enter a valid email address.");
  return request("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email: email.trim() }),
  });
}
