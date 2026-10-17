import ProductDetails from "./ProductDetails";

export function ProductModal(props) {
  return props.product ? (
    <ProductDetails key={props.product.id} {...props} />
  ) : null;
}
