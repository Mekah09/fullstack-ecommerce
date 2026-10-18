import * as api from "./api.jsx";

export async function loadAccountData(shop, user) {
  const version = shop.accountVersion;
  const current = () => shop.alive && version === shop.accountVersion;
  if (!user) {
    shop.setState({
      orders: [],
      sellers: [],
      ordersLoading: false,
      sellersLoading: false,
    });
    return;
  }
  shop.setState({
    ordersLoading: true,
    ordersError: "",
    sellersLoading: user.role === "admin",
    sellersError: "",
  });
  api
    .getOrders()
    .then((orders) => {
      if (current()) shop.setState({ orders, ordersLoading: false });
    })
    .catch((error) => {
      if (current())
        shop.setState({
          orders: [],
          ordersLoading: false,
          ordersError: error.message,
        });
    });
  if (user.role !== "admin") {
    shop.setState({ sellers: [], sellersLoading: false });
    return;
  }
  api
    .getSellers()
    .then((sellers) => {
      if (current()) shop.setState({ sellers, sellersLoading: false });
    })
    .catch((error) => {
      if (current())
        shop.setState({
          sellers: [],
          sellersLoading: false,
          sellersError: error.message,
        });
    });
}

export async function restoreSession(shop) {
  const version = shop.accountVersion;
  try {
    const user = await api.getCurrentUser();
    if (shop.alive && version === shop.accountVersion)
      shop.setState({ user, authLoading: false }, () =>
        loadAccountData(shop, user),
      );
  } catch {
    if (shop.alive && version === shop.accountVersion)
      shop.setState({ user: null, authLoading: false });
  }
}

export async function authenticate(shop, data) {
  const version = ++shop.accountVersion;
  const user = await (data.mode === "signup"
    ? api.signUp(data)
    : api.signIn(data));
  if (!shop.alive || version !== shop.accountVersion) return;
  shop.setState(
    { user, authLoading: false, overlay: null, orders: [], sellers: [] },
    () => loadAccountData(shop, user),
  );
  shop.notify(`Welcome ${user.name?.split(" ")[0] || "to Nook"}!`);
  shop.navigate(
    user.role === "seller"
      ? "/seller"
      : user.role === "admin"
        ? "/admin"
        : "/account",
  );
  return user;
}

export async function logout(shop) {
  ++shop.accountVersion;
  await api.signOut();
  if (!shop.alive) return;
  shop.setState({
    user: null,
    orders: [],
    sellers: [],
    ordersLoading: false,
    sellersLoading: false,
    ordersError: "",
    sellersError: "",
  });
  shop.navigate("/");
  shop.notify("You’re signed out. See you around!");
}
