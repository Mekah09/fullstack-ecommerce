import * as api from "./api.jsx";

export async function placeOrder(shop, data) {
  shop.setState({ checkoutBusy: true });
  try {
    const order = await api.createOrder(data);
    if (!shop.alive) return order;
    shop.savedCartRecords = [];
    shop.setState(
      (current) => ({
        orders: [order, ...current.orders],
        lastOrder: order,
        cart: [],
        overlay: { type: "success" },
      }),
      shop.persistShopping,
    );
    shop.refreshProducts().catch(() => {});
    return order;
  } finally {
    if (shop.alive) shop.setState({ checkoutBusy: false });
  }
}

export async function approveSeller(shop, id) {
  const seller = await api.approveSeller(id);
  if (shop.alive)
    shop.setState((current) => ({
      sellers: current.sellers.map((item) =>
        item.id === String(id) ? seller : item,
      ),
    }));
  shop.notify("Seller approval saved.");
  return seller;
}
