# Connecting your backend

The frontend runs with local demo data when `VITE_API_BASE_URL` is unset. Demo products, cart, orders, and the selected preview identity persist in this browser. No demo passwords are stored or verified. Demo buyer, seller, and admin identities exist only to preview the interface; registration offers buyer and seller roles. Demo identity IDs use role and email so returning to the same identity can restore its orders. This is a preview convenience, not authentication.

Set `VITE_API_BASE_URL=https://your-api.example.com/api` in an ignored `.env.local`, then restart Vite. The value is public browser configuration, so never put secrets in it. `src/services/api.jsx` contains the request adapter. The API must allow the frontend origin through CORS. Use HTTPS in production.

## Endpoints

| Method | Path             | Request / response                                                                                                 |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| GET    | `/products`      | Returns a product array or `{ products: [...] }`.                                                                  |
| POST   | `/products`      | Product fields; returns the saved product or `{ product }`.                                                        |
| PATCH  | `/products/:id`  | Changed product fields; returns the saved product or `{ product }`.                                                |
| DELETE | `/products/:id`  | Returns 204 or JSON.                                                                                               |
| POST   | `/auth/login`    | `{ email, password }`; returns `{ user, token }`.                                                                  |
| POST   | `/auth/register` | `{ name, email, password, role }`; returns `{ user, token }`.                                                      |
| GET    | `/auth/me`       | Returns the authenticated user or `{ user }`.                                                                      |
| GET    | `/orders`        | Returns only orders the authenticated user may access, as an array or `{ orders }`.                                |
| POST   | `/orders`        | `{ items: [{ productId, quantity, selectedColor? }], shippingAddress }`; returns the created order or `{ order }`. |

The adapter also accepts responses wrapped in `{ data: ... }` and auth tokens named `accessToken`. Errors should use a non-2xx HTTP status and `{ message: "Helpful explanation" }`.

Products use `{ id, name, category, price, rating, reviews, image, description, seller, stock }`, with optional `originalPrice`, `badge`, `colors`, `featured`, and `sellerId`. Return the owning seller's user ID as `sellerId` so the seller interface can filter its inventory reliably; `seller` is a display name. IDs are strings; prices and stock are numbers. Categories are `Furniture`, `Lighting`, `Decor`, `Kitchen`, and `Lifestyle`. Prices are displayed in USD. Users use `{ id, name, email, role }`, where role is `buyer`, `seller`, or `admin`.

Shipping addresses use `{ name, email, address, city, postalCode }`. The order adapter sends only product IDs, quantities, selected colors, and these address fields. It drops cart display prices, computed totals, seller information, and client-supplied user IDs. The server must determine ownership from the access token and return authoritative totals. Return orders as `{ id, items, subtotal, shipping, total, status, createdAt }`; `items` must be an array and `createdAt` an ISO date string. The demo uses $8 shipping, free at $100, and checks combined stock across all selected finishes. It preserves finishes as separate order lines. A production backend should return its own delivery, tax, and pricing policy.

Cart contents are browser-local through `getCart()` and `saveCart(items)`, using the same `nook_cart` key as the storefront. Favorites use `nook_favorites`. Demo catalog, user, and order records use `nook.*.v1` keys. Demo order reads are scoped to the selected identity, or to guest checkout when signed out. Local browser storage is not an access-control boundary; use sample details in this preview.

Auth requests use a bearer token kept in session storage. Sign-out clears the local session; add your backend's token revocation/logout endpoint if it requires one. Login sends only email and password: the server determines the user's role. Registration permits buyer and seller roles. The local admin demo entry is hidden when an API URL is configured.

Seller/admin revenue charts, dashboard order tables, seller applications, approval actions, and shop settings are still labeled frontend previews. Their live endpoints and payment/newsletter integrations are not implemented by setting the API URL.

The backend must authenticate requests and enforce seller ownership and admin permissions. Never trust a role supplied by the client, expose admin registration, or rely on frontend route checks for authorization. The backend must also validate inputs, calculate final prices/taxes/shipping, check inventory, scope order access, and integrate payments. The demo checkout records an order only; it never collects card details or charges money.
