import ProductDetails from "./ProductDetails.jsx";

export function ProductModal(props) {
  return props.product ? (
    <ProductDetails key={props.product.id} {...props} />
  ) : null;
}
