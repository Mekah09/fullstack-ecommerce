import * as api from "./api.jsx";
import { cartRecords, restoreCart } from "../utils/cart.jsx";

export async function refreshProducts(shop) {
  const version = ++shop.catalogVersion;
  const additionVersion = shop.catalogAdditionVersion;
  shop.setState({ loading: true, loadError: "" });
  try {
    const fetched = await api.getProducts();
    if (!shop.alive || version !== shop.catalogVersion) return fetched;
    const fetchedIds = new Set(fetched.map((product) => product.id));
    const additions = [...shop.catalogAdditions.values()]
      .filter(
        (entry) =>
          entry.version > additionVersion && !fetchedIds.has(entry.product.id),
      )
      .map((entry) => entry.product);
    const products = [...additions, ...fetched];
    for (const [id, entry] of shop.catalogAdditions)
      if (entry.version <= additionVersion) shop.catalogAdditions.delete(id);
    const records = shop.state.cart.length
      ? cartRecords(shop.state.cart)
      : shop.savedCartRecords;
    const ids = new Set(products.map((product) => product.id));
    const favorites = (
      shop.state.favorites.length ? shop.state.favorites : shop.savedFavoriteIds
    ).filter((id) => ids.has(id));
    shop.setState(
      {
        products,
        cart: restoreCart(products, records),
        favorites,
        loading: false,
      },
      shop.persistShopping,
    );
    return products;
  } catch (error) {
    if (shop.alive && version === shop.catalogVersion)
      shop.setState({
        products: [],
        cart: [],
        loading: false,
        loadError: error.message,
      });
    throw error;
  }
}

export async function addProduct(shop, fields) {
  const accountId = shop.state.user?.id;
  const product = await api.createProduct(fields);
  if (shop.alive) {
    shop.catalogAdditions.set(product.id, {
      product,
      version: ++shop.catalogAdditionVersion,
    });
    shop.setState((current) => ({
      products: [
        product,
        ...current.products.filter((item) => item.id !== product.id),
      ],
      createdProductIds:
        accountId && current.user?.id === accountId
          ? [...new Set([...current.createdProductIds, product.id])]
          : current.createdProductIds,
      loading: false,
      loadError: "",
    }));
  }
  shop.notify("Your new product is live.");
  return product;
}

export async function updateProduct(shop, id, fields) {
  const product = await api.updateProduct(id, fields);
  if (shop.alive)
    shop.setState((current) => {
      const products = current.products.map((item) =>
        item.id === id ? product : item,
      );
      return {
        products,
        cart: restoreCart(products, cartRecords(current.cart)),
      };
    }, shop.persistShopping);
  shop.notify("Product updated.");
  return product;
}

export async function deleteProduct(shop, id) {
  await api.deleteProduct(id);
  if (shop.alive)
    shop.setState(
      (current) => ({
        products: current.products.filter((item) => item.id !== id),
        cart: current.cart.filter((item) => item.id !== id),
        favorites: current.favorites.filter((item) => item !== id),
      }),
      shop.persistShopping,
    );
  shop.notify("Product removed from your shop.");
}
