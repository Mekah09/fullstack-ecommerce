import { initialProducts } from "../data/products.jsx";

export const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

const keys = {
  products: "nook.products.v1",
  user: "nook.user.v1",
  token: "nook.token.v1",
  cart: "nook_cart",
  orders: "nook.orders.v1",
};
const memory = new Map();

function read(key, fallback, session = false) {
  try {
    const storage = session ? window.sessionStorage : window.localStorage;
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return memory.has(key) ? memory.get(key) : fallback;
  }
}

function write(key, value, session = false) {
  memory.set(key, value);
  try {
    const storage = session ? window.sessionStorage : window.localStorage;
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsers may deny storage. The current tab still works in memory.
  }
}

function makeId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;
}

async function request(path, options = {}) {
  const token = read(keys.token, null, true);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to reach the store. Please check your connection and try again.",
    );
  }
  const payload =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error?.message ||
        `The request failed (${response.status}). Please try again.`,
    );
  }
  return payload;
}

function extract(payload, property) {
  return (
    payload?.[property] ?? payload?.data?.[property] ?? payload?.data ?? payload
  );
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function saveAuth(payload) {
  const user = extract(payload, "user");
  if (!user?.id || !user?.role)
    throw new Error(
      "The server returned an invalid account. Please try signing in again.",
    );
  const token =
    payload?.token ??
    payload?.accessToken ??
    payload?.data?.token ??
    payload?.data?.accessToken;
  if (!token)
    throw new Error(
      "The server did not return an access token. Please check the authentication API.",
    );
  const safeUser = publicUser(user);
  write(keys.token, token, true);
  write(keys.user, safeUser, true);
  return safeUser;
}

function validateCredentials({ email, password }) {
  if (!/^\S+@\S+\.\S+$/.test(email || ""))
    throw new Error("Please enter a valid email address.");
  if (!password || password.length < 6)
    throw new Error("Please use a password with at least 6 characters.");
}

function demoUserId(email, role) {
  return `demo-${role}-${encodeURIComponent(email.trim().toLowerCase())}`;
}

function orderPayload(input) {
  if (!input.items?.length)
    throw new Error("Add something to your bag before checking out.");
  const items = input.items.map((item) => {
    const productId = item.productId || item.id || item.product?.id;
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1)
      throw new Error(
        "Please choose a valid product and quantity for each item.",
      );
    return {
      productId,
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
  if (API_BASE_URL) return extract(await request("/products"), "products");
  return read(keys.products, initialProducts).map((product) => ({
    ...product,
  }));
}

export async function createProduct(input) {
  if (API_BASE_URL)
    return extract(
      await request("/products", {
        method: "POST",
        body: JSON.stringify(input),
      }),
      "product",
    );
  const product = {
    rating: 0,
    reviews: 0,
    ...input,
    id: makeId("product"),
    sellerId: read(keys.user, null)?.id,
    price: Number(input.price),
    stock: Number(input.stock || 0),
  };
  const products = await getProducts();
  write(keys.products, [product, ...products]);
  return product;
}

export async function updateProduct(id, updates) {
  if (API_BASE_URL)
    return extract(
      await request(`/products/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
      "product",
    );
  const products = await getProducts();
  const current = products.find((product) => product.id === id);
  if (!current) throw new Error("This product is no longer available.");
  const product = { ...current, ...updates, id };
  write(
    keys.products,
    products.map((item) => (item.id === id ? product : item)),
  );
  return product;
}

export async function deleteProduct(id) {
  if (API_BASE_URL) {
    await request(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
  } else {
    write(
      keys.products,
      (await getProducts()).filter((product) => product.id !== id),
    );
  }
  return { id };
}

export async function signIn({ email, password, role = "buyer" }) {
  validateCredentials({ email, password });
  if (API_BASE_URL)
    return saveAuth(
      await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    );
  if (!["buyer", "seller", "admin"].includes(role))
    throw new Error("Please select a valid account type.");
  // These are local preview identities, not authenticated accounts.
  const user = {
    id: demoUserId(email, role),
    name: email.split("@")[0].replace(/[._-]/g, " "),
    email,
    role,
  };
  write(keys.user, user);
  return user;
}

export async function signUp({ name, email, password, role = "buyer" }) {
  validateCredentials({ email, password });
  if (!name?.trim()) throw new Error("Please enter your name.");
  if (!["buyer", "seller"].includes(role))
    throw new Error("You can register as a buyer or a seller.");
  if (API_BASE_URL)
    return saveAuth(
      await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email, password, role }),
      }),
    );
  const user = { id: demoUserId(email, role), name: name.trim(), email, role };
  write(keys.user, user);
  return user;
}

export async function getCurrentUser() {
  if (!API_BASE_URL) return read(keys.user, null);
  if (!read(keys.token, null, true)) return null;
  const user = extract(await request("/auth/me"), "user");
  const safeUser = publicUser(user);
  write(keys.user, safeUser, true);
  return safeUser;
}

export async function signOut() {
  write(keys.user, null);
  write(keys.user, null, true);
  write(keys.token, null, true);
}

export async function getCart() {
  return read(keys.cart, []);
}

export async function saveCart(items) {
  write(keys.cart, items);
  return items;
}

export async function getOrders() {
  if (API_BASE_URL)
    return read(keys.token, null, true)
      ? extract(await request("/orders"), "orders")
      : [];
  const userId = read(keys.user, null)?.id || "guest";
  return read(keys.orders, []).filter((order) => order.userId === userId);
}

export async function createOrder(input) {
  const payload = orderPayload(input);
  if (API_BASE_URL)
    return extract(
      await request("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
      "order",
    );
  const products = await getProducts();
  const quantities = new Map();
  const variants = new Map();
  payload.items.forEach((item, index) => {
    const id = item.productId;
    const key = JSON.stringify([id, item.selectedColor || ""]);
    quantities.set(id, (quantities.get(id) || 0) + item.quantity);
    const existing = variants.get(key);
    variants.set(key, {
      ...item,
      quantity: (existing?.quantity || 0) + item.quantity,
      ...(input.items[index].selectedFinish
        ? { selectedFinish: input.items[index].selectedFinish }
        : {}),
    });
  });
  const items = [...variants.values()].map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product || quantities.get(item.productId) > product.stock) {
      throw new Error(
        `Please check the available quantity for ${product?.name || "this product"}.`,
      );
    }
    return {
      ...item,
      name: product.name,
      image: product.image,
      price: product.price,
    };
  });
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 100 ? 0 : 8;
  const order = {
    id: makeId("order"),
    userId: read(keys.user, null)?.id || "guest",
    shippingAddress: payload.shippingAddress,
    items,
    subtotal,
    shipping,
    total: Number((subtotal + shipping).toFixed(2)),
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };
  write(keys.orders, [order, ...read(keys.orders, [])]);
  write(
    keys.products,
    products.map((product) => ({
      ...product,
      stock:
        product.stock -
        items
          .filter((item) => item.productId === product.id)
          .reduce((quantity, item) => quantity + item.quantity, 0),
    })),
  );
  return order;
}
