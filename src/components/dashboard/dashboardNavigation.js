import {
  FiGrid,
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiSettings,
} from "react-icons/fi";

export function getNavigation(admin) {
  return [
    { id: "overview", label: "Overview", icon: FiGrid },
    {
      id: "products",
      label: admin ? "All products" : "My products",
      icon: FiPackage,
    },
    ...(admin ? [{ id: "sellers", label: "Sellers", icon: FiUsers }] : []),
    { id: "orders", label: "Orders", icon: FiShoppingBag },
    ...(!admin
      ? [{ id: "settings", label: "Shop settings", icon: FiSettings }]
      : []),
  ];
}

export function getTitles(admin) {
  return {
    overview: admin
      ? "A thoughtful marketplace, growing."
      : "Your shop, at a glance.",
    products: admin
      ? "The marketplace collection."
      : "Good things in your shop.",
    sellers: "The people behind the products.",
    orders: "Every order tells a story.",
    settings: "Make yourself at home.",
  };
}

export const subtitles = {
  overview: "Here’s how things are looking. Let’s make today a good one.",
  products: "Manage your collection and make room for something new.",
  sellers: "Meet, review, and welcome your community of independent sellers.",
  orders: "A clear view of what’s coming in and going out.",
  settings: "A few little details that make your shop yours.",
};
