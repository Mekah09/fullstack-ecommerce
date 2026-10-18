export const cartKey = (item) =>
  item.cartId || `${item.id}:${item.selectedColor || "default"}`;

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
    const product = products.find(
      (item) => item.id === String(record.productId || record.id),
    );
    if (!product || product.stock <= 0) return [];
    const remaining = product.stock - (usedStock.get(product.id) || 0);
    const quantity = Math.min(Math.floor(Number(record.quantity)), remaining);
    if (!Number.isFinite(quantity) || quantity < 1) return [];
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
  const key = cartKey(product);
  const existing = cart.find((item) => cartKey(item) === key);
  return existing
    ? cart.map((item) =>
        cartKey(item) === key
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...cart, { ...product, cartId: key, quantity }];
}

export function changeCartQuantity(cart, key, quantity) {
  if (quantity < 1) return cart.filter((item) => cartKey(item) !== key);
  return cart.map((item) => {
    if (cartKey(item) !== key) return item;
    const others = cart
      .filter((other) => other.id === item.id && cartKey(other) !== key)
      .reduce((sum, other) => sum + other.quantity, 0);
    return {
      ...item,
      quantity: Math.min(
        Math.max(1, Math.floor(quantity)),
        item.stock - others,
      ),
    };
  });
}
