export const colorLabel = (color, index) =>
  typeof color === "object"
    ? color.name
    : color.startsWith("#")
      ? `Finish ${index + 1}`
      : color;
