import { useShop } from "../../hooks/useShop";
import { AuthModal } from "../auth/AuthModal";
import { CartDrawer } from "../cart/CartDrawer";
import { ProductModal } from "../products/ProductModal";
import CheckoutModal from "../checkout/CheckoutModal";
import OrderConfirmation from "../checkout/OrderConfirmation";
import InfoModal from "../ui/InfoModal";
import Toast from "../ui/Toast";

export default function OverlayHost() {
  const shop = useShop();
  const { overlay, closeOverlay } = shop;
  return (
    <>
      {overlay?.type === "auth" && (
        <AuthModal
          initialRole={overlay.role}
          initialMode={overlay.mode}
          isDemo={shop.isDemo}
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
