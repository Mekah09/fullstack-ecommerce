import { Component } from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";
import withShop from "./withShop.jsx";
import Modal from "./Modal.jsx";
import ShippingAddressForm from "./ShippingAddressForm.jsx";
import OrderSummary from "./OrderSummary.jsx";

class CheckoutModal extends Component {
  state = { error: "" };

  submit = async (event) => {
    event.preventDefault();
    const { cart, placeOrder, checkoutBusy } = this.props.shop;
    if (checkoutBusy) return;
    this.setState({ error: "" });
    const shippingAddress = Object.fromEntries(
      new FormData(event.currentTarget),
    );
    try {
      await placeOrder({
        items: cart,
        shippingAddress,
      });
    } catch (err) {
      this.setState({
        error: err.message || "We couldn’t place your order. Please try again.",
      });
    }
  };

  render() {
    const { cart, user, closeOverlay, checkoutBusy } = this.props.shop;
    const { error } = this.state;
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return (
      <Modal
        className="checkout-modal"
        titleId="checkout-heading"
        onClose={closeOverlay}
        closeLabel="Close checkout"
        busy={checkoutBusy}
      >
        <span className="eyebrow">ONE STEP CLOSER TO A GOOD FIND</span>
        <h2 id="checkout-heading">Make it yours.</h2>
        <p className="demo-note">
          <FiShield />
          Review your order and delivery details. The store confirms final
          prices and delivery fees.
        </p>
        <form onSubmit={this.submit}>
          <ShippingAddressForm user={user} />
          <OrderSummary items={cart} subtotal={subtotal} />
          {error && (
            <p className="form-error text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary-button checkout-submit"
            disabled={checkoutBusy || cart.length === 0}
            type="submit"
          >
            {checkoutBusy ? "Placing your order…" : "Place order"}
            <FiArrowRight />
          </button>
        </form>
      </Modal>
    );
  }
}

export default withShop(CheckoutModal);
