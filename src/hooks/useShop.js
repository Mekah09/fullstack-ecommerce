import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop must be used inside ShopProvider.");
  return shop;
}
