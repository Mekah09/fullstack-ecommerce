export { currency } from "../utils/format.jsx";

export const countsTowardRevenue = (order) =>
  !["cancelled", "canceled", "refunded"].includes(
    String(order.status || "").toLowerCase(),
  );
