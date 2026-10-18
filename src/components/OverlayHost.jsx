import withShop from "./withShop.jsx";
import { AuthModal } from "./AuthModal.jsx";
import { CartDrawer } from "./CartDrawer.jsx";
import { ProductModal } from "./ProductModal.jsx";
import CheckoutModal from "./CheckoutModal.jsx";
import OrderConfirmation from "./OrderConfirmation.jsx";
import InfoModal from "./InfoModal.jsx";
import Toast from "./Toast.jsx";

function OverlayHost({ shop }) {
  const { overlay, closeOverlay } = shop;
  return (
    <>
      {overlay?.type === "auth" && (
        <AuthModal
          initialRole={overlay.role}
          initialMode={overlay.mode}
          onClose={closeOverlay}
          onSubmit={shop.authenticate}
        />
      )}
      {overlay?.type === "cart" && (
        <CartDrawer
          items={shop.cart}
          onClose={closeOverlay}
          onUpdateQuantity={shop.updateQuantity}
          onRemove={shop.removeFromCart}
          onCheckout={shop.openCheckout}
          checkoutBusy={shop.checkoutBusy}
        />
      )}
      {overlay?.type === "product" && (
        <ProductModal
          product={overlay.product}
          isWishlisted={shop.favorites.includes(overlay.product.id)}
          onToggleWishlist={shop.toggleFavorite}
          onAddToCart={shop.addToCart}
          onClose={closeOverlay}
        />
      )}
      {overlay?.type === "checkout" && <CheckoutModal />}
      {overlay?.type === "success" && <OrderConfirmation />}
      {shop.info && <InfoModal info={shop.info} onClose={shop.closeInfo} />}
      {shop.toast && (
        <Toast message={shop.toast} onDismiss={shop.dismissToast} />
      )}
    </>
  );
}

export default withShop(OverlayHost);
