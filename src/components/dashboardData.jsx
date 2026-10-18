export const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const countsTowardRevenue = (order) =>
  !["cancelled", "canceled", "refunded"].includes(
    String(order.status || "").toLowerCase(),
  );
