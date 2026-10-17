import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";

export function useCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const refreshProducts = useCallback(async () => {
    const data = await api.getProducts();
    setProducts(data);
    return data;
  }, []);
  const addProduct = useCallback(async (fields) => {
    const product = await api.createProduct(fields);
    setProducts((current) => [product, ...current]);
    return product;
  }, []);
  const updateProduct = useCallback(async (id, fields) => {
    const product = await api.updateProduct(id, fields);
    setProducts((current) =>
      current.map((item) => (item.id === id ? product : item)),
    );
    return product;
  }, []);
  const deleteProduct = useCallback(async (id) => {
    await api.deleteProduct(id);
    setProducts((current) => current.filter((item) => item.id !== id));
  }, []);
  return {
    products,
    loading,
    loadError,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
