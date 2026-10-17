export const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
export const categories = [
  "Furniture",
  "Lighting",
  "Decor",
  "Kitchen",
  "Lifestyle",
];
export const demoOrders = [
  {
    id: "#NK-1048",
    customer: "Olivia Martin",
    product: "Everyday essentials",
    date: "Today, 10:24 AM",
    total: 128,
    status: "Processing",
  },
  {
    id: "#NK-1047",
    customer: "James Wilson",
    product: "A little home refresh",
    date: "Yesterday",
    total: 245,
    status: "Shipped",
  },
  {
    id: "#NK-1046",
    customer: "Sofia Davis",
    product: "Thoughtfully chosen",
    date: "Yesterday",
    total: 89,
    status: "Delivered",
  },
  {
    id: "#NK-1045",
    customer: "Noah Williams",
    product: "Something special",
    date: "Jun 15, 2026",
    total: 156,
    status: "Delivered",
  },
];
export const initialSellers = [
  {
    id: 1,
    name: "Form & Field",
    initials: "FF",
    category: "Furniture & living",
    products: 24,
    status: "Approved",
    color: "sage",
  },
  {
    id: 2,
    name: "Clay House",
    initials: "CH",
    category: "Ceramics & homewares",
    products: 18,
    status: "Approved",
    color: "sand",
  },
  {
    id: 3,
    name: "The Good Light",
    initials: "GL",
    category: "Lighting & decor",
    products: 12,
    status: "Pending",
    color: "lavender",
  },
  {
    id: 4,
    name: "Gather Studio",
    initials: "GS",
    category: "Everyday essentials",
    products: 9,
    status: "Pending",
    color: "rose",
  },
];
