const priceFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

const dashboardFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const money = (value) => priceFormatter.format(Number(value) || 0);

export const currency = (value) =>
  dashboardFormatter.format(Number(value) || 0);
