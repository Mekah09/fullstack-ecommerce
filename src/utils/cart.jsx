export const cartKey = (item) =>
  item.cartId || `${item.id}:${item.selectedColor || "default"}`;

export const hasStockLimit = (stock) =>
  Number.isSafeInteger(stock) && stock >= 0;

function positiveQuantity(value) {
  const quantity = Math.floor(Number(value));
  return Number.isSafeInteger(quantity) && quantity > 0 ? quantity : null;
}

export function cartRecords(cart) {
  return cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    selectedColor: item.selectedColor,
    selectedFinish: item.selectedFinish,
  }));
}

// Persist product references only; names, prices, images and stock always come
// from the latest API response, never from an old local catalog or cart snapshot.
export function restoreCart(products, records) {
  if (!Array.isArray(records)) return [];
  const usedStock = new Map();
  return records.flatMap((record) => {
    if (!record || typeof record !== "object") return [];
    const product = products.find(
      (item) => item.id === String(record.productId || record.id),
    );
    const requested = positiveQuantity(record.quantity);
    if (!product || !requested || product.stock === 0) return [];
    const used = usedStock.get(product.id) || 0;
    const remaining = hasStockLimit(product.stock)
      ? product.stock - used
      : Number.MAX_SAFE_INTEGER - used;
    const quantity = Math.min(requested, remaining);
    if (quantity < 1) return [];
    usedStock.set(product.id, (usedStock.get(product.id) || 0) + quantity);
    const item = {
      ...product,
      quantity,
      selectedColor: record.selectedColor,
      selectedFinish: record.selectedFinish,
    };
    return [{ ...item, cartId: cartKey(item) }];
  });
}

export function increaseCart(cart, product, quantity) {
  const requested = positiveQuantity(quantity);
  if (!requested) return cart;
  const used = cart
    .filter((item) => item.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const remaining = hasStockLimit(product.stock)
    ? product.stock - used
    : Number.MAX_SAFE_INTEGER - used;
  const addition = Math.min(requested, remaining);
  if (addition < 1) return cart;
  const key = cartKey(product);
  const existing = cart.find((item) => cartKey(item) === key);
  return existing
    ? cart.map((item) =>
        cartKey(item) === key
          ? { ...item, quantity: item.quantity + addition }
          : item,
      )
    : [...cart, { ...product, cartId: key, quantity: addition }];
}

export function changeCartQuantity(cart, key, quantity) {
  const requested = Math.floor(Number(quantity));
  if (!Number.isSafeInteger(requested)) return cart;
  if (requested < 1) return cart.filter((item) => cartKey(item) !== key);
  return cart.flatMap((item) => {
    if (cartKey(item) !== key) return [item];
    const others = cart
      .filter((other) => other.id === item.id && cartKey(other) !== key)
      .reduce((sum, other) => sum + other.quantity, 0);
    const remaining = hasStockLimit(item.stock)
      ? item.stock - others
      : Number.MAX_SAFE_INTEGER - others;
    if (remaining < 1) return [];
    return [
      {
        ...item,
        quantity: Math.min(requested, remaining),
      },
    ];
  });
}
