import { ShopContext } from "../context/ShopContext.jsx";

export default function withShop(WrappedComponent) {
  function ShopConnected(props) {
    return (
      <ShopContext.Consumer>
        {(shop) => {
          if (!shop)
            throw new Error(
              "Shop components must be rendered inside ShopProvider.",
            );
          return <WrappedComponent {...props} shop={shop} />;
        }}
      </ShopContext.Consumer>
    );
  }
  ShopConnected.displayName = `withShop(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return ShopConnected;
}
