import { usePersistedState } from "./usePersistedState";

export function useCart(notify) {
  const [cart, setCart] = usePersistedState("nook_cart", []);
  function addToCart(product, quantity = 1) {
    const inCart = cart
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);
    if (!product.stock || inCart >= product.stock) {
      notify(
        product.stock
          ? "You have all the available stock in your bag."
          : "This find is currently out of stock.",
      );
      return;
    }
    const amount = Math.min(
      Math.max(1, Math.floor(quantity)),
      product.stock - inCart,
    );
    const cartId = `${product.id}:${product.selectedColor || "default"}`;
    setCart((current) => {
      const existing = current.find((item) => item.cartId === cartId);
      return existing
        ? current.map((item) =>
            item.cartId === cartId
              ? { ...item, quantity: item.quantity + amount }
              : item,
          )
        : [...current, { ...product, cartId, quantity: amount }];
    });
    notify(`${product.name} added to your bag`);
  }
  function updateQuantity(cartId, quantity) {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => (item.cartId || item.id) !== cartId)
        : current.map((item) => {
            if ((item.cartId || item.id) !== cartId) return item;
            const others = current
              .filter(
                (other) =>
                  other.id === item.id && (other.cartId || other.id) !== cartId,
              )
              .reduce((sum, other) => sum + other.quantity, 0);
            return {
              ...item,
              quantity: Math.min(quantity, Math.max(1, item.stock - others)),
            };
          }),
    );
  }
  function removeFromCart(cartId) {
    setCart((current) =>
      current.filter((item) => (item.cartId || item.id) !== cartId),
    );
  }
  function removeProductFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }
  function clearCart() {
    setCart([]);
  }
  return {
    cart,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    updateQuantity,
    removeFromCart,
    removeProductFromCart,
    clearCart,
  };
}
