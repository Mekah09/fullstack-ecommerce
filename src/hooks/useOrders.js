import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";

export function useOrders(userId, authLoading) {
  const key = userId || "guest";
  const [result, setResult] = useState({ key: null, items: [], error: "" });
  useEffect(() => {
    if (authLoading) return;
    let active = true;
    api
      .getOrders()
      .then((items) => {
        if (active) setResult({ key, items, error: "" });
      })
      .catch((error) => {
        if (active) setResult({ key, items: [], error: error.message });
      });
    return () => {
      active = false;
    };
  }, [key, authLoading]);

  const setOrders = useCallback(
    (update) => {
      setResult((current) => ({
        key,
        items:
          typeof update === "function"
            ? update(current.key === key ? current.items : [])
            : update,
        error: "",
      }));
    },
    [key],
  );
  const resolved = !authLoading && result.key === key;
  return {
    orders: resolved ? result.items : [],
    ordersLoading: !resolved,
    ordersError: resolved ? result.error : "",
    setOrders,
  };
}
