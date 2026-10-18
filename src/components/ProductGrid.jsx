import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  return (
    <div className="product-grid grid grid-cols-2 min-[651px]:grid-cols-3 min-[901px]:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
