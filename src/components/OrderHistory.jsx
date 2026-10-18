import {
  FiArrowRight,
  FiCheckCircle,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import withShop from "./withShop.jsx";
import { money } from "../utils/format.jsx";

function OrderHistory({ shop }) {
  const { orders, ordersLoading, ordersError } = shop;
  return (
    <section className="buyer-orders">
      <h2>
        <FiPackage /> Your orders <span>{orders.length}</span>
      </h2>
      {ordersLoading ? (
        <p className="muted" role="status">
          Finding your orders…
        </p>
      ) : ordersError ? (
        <p className="form-error" role="alert">
          {ordersError}
        </p>
      ) : orders.length ? (
        orders.map((order) => (
          <article className="buyer-order" key={order.id}>
            <div>
              <b>Order #{String(order.id).slice(-8).toUpperCase()}</b>
              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "Just placed"}{" "}
                · {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <span className="order-status">
              <FiCheckCircle />
              {order.status || "Received"}
            </span>
            <strong>{money(order.total)}</strong>
          </article>
        ))
      ) : (
        <div className="buyer-empty">
          <FiShoppingBag />
          <h3>Your next favorite is waiting.</h3>
          <p>When you place an order, you’ll find it right here.</p>
          <Link className="primary-button" to="/products">
            Find something good <FiArrowRight />
          </Link>
        </div>
      )}
    </section>
  );
}

export default withShop(OrderHistory);
