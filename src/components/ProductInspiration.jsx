import { currency } from "./dashboardData.jsx";

export default function ProductInspiration({ products }) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-title">
        <div>
          <h2>A little inspiration</h2>
          <p>
            Sample finds from other shops. Only your own listings can be edited.
          </p>
        </div>
        <span className="dash-demo-label">Demo · read only</span>
      </div>
      <div className="dash-sample-grid">
        {products.map((product) => (
          <article className="dash-sample-product" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <p>By {product.seller}</p>
              <strong>{currency(product.price)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
