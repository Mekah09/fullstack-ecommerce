# Connecting your backend

Products come exclusively from your API. The confirmed catalog response is an **array of objects**. No URL has been supplied yet; without one the storefront shows a connection message and no products. It never falls back to a local catalog, demo accounts, orders, sellers, or dashboard records.

Set `VITE_API_BASE_URL=https://your-api.example.com/api` in an ignored `.env.local`, then restart Vite. `GET /products` will request `https://your-api.example.com/api/products`. The value is public browser configuration; do not put secrets in it. The API must allow the frontend origin and its `Authorization`/`Content-Type` headers through CORS. Use HTTPS in production.

The adapter lives in `src/services/api.jsx`. Components use class lifecycle methods and context consumers; there are no hooks. All API-dependent actions report errors until the relevant backend is available.

## Prepared endpoints

Only the catalog's array shape is confirmed. The remaining paths below are prepared integration contracts; adjust the adapter when your backend's routes and responses are available.

| Method | Path                 | Request / response                                                                                                 |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| GET    | `/products`          | Returns an array of product objects directly. Wrappers such as `{ products: [...] }` are rejected.                 |
| POST   | `/products`          | Product fields; returns the saved product or `{ product }`.                                                        |
| PATCH  | `/products/:id`      | Changed product fields; returns the saved product or `{ product }`.                                                |
| DELETE | `/products/:id`      | Returns 204 or JSON.                                                                                               |
| POST   | `/auth/login`        | `{ email, password }`; returns `{ user, token }`.                                                                  |
| POST   | `/auth/register`     | `{ name, email, password, role }`; returns `{ user, token }`.                                                      |
| GET    | `/auth/me`           | Returns the authenticated user or `{ user }`.                                                                      |
| GET    | `/orders`            | Returns only orders visible to the authenticated user, as an array or `{ orders }`.                                |
| POST   | `/orders`            | `{ items: [{ productId, quantity, selectedColor? }], shippingAddress }`; returns the created order or `{ order }`. |
| GET    | `/admin/sellers`     | Returns an array of sellers or `{ sellers }`. Admin authorization required.                                        |
| PATCH  | `/admin/sellers/:id` | `{ status: "Approved" }`; returns the updated seller or `{ seller }`. Admin authorization required.                |
| POST   | `/newsletter`        | `{ email }`; returns a successful 2xx JSON response or 204 only after subscribing the address.                     |

Responses other than the product listing may also use `{ data: ... }`. Authentication tokens may be named `accessToken`. Errors should use a non-2xx status and `{ message: "Helpful explanation" }`. Invalid successful JSON responses and invalid catalog shapes produce visible errors rather than fabricated content.

## Product fields

Return `id` (or `_id`), `name`, `category`, `price`, `stock`, `image`, `description`, `seller`, and `sellerId`. Optional fields are `rating`, `reviews`, `originalPrice`, `badge`, `colors`, and `featured`.

- IDs must be nonempty strings or numbers; the adapter normalizes them to strings and never generates them.
- `name` is required; `title` is accepted as an alternative.
- `price` must be a finite nonnegative number; numeric strings are accepted.
- `stock` must be a nonnegative integer. Missing stock is treated as zero so an unknown quantity cannot be added to the bag.
- `category` may be a string or `{ name }`. Category filters are derived from API records.
- `seller` may be a display string or an object with `name` and `id`/`_id`. Return the owner's user ID as `sellerId` so the seller dashboard can filter inventory reliably.
- `image` is a public image URL or a site-local image path. The frontend has no bundled product photographs or fallback product records.
- `colors` is an optional string array. Prices display in USD. Ratings and review counts are displayed only when supplied by the API.

## Accounts and orders

Users use `{ id, name, email, role }`, with `_id` also accepted. Roles must be `buyer`, `seller`, or `admin`. Login sends email and password only: the server determines the role. Signup permits buyer and seller roles only. Session tokens and the public user object are kept in `sessionStorage` under `nook.token.v1` and `nook.user.v1`; passwords are never stored. With no token, current-user and order reads return `null` and `[]` without an API request. With a token, the user is revalidated through `/auth/me`. Sign-out clears the browser session; add your backend's revocation endpoint if required.

Shipping addresses use `{ name, email, address, city, postalCode }`. Order requests send only product IDs, quantities, selected colors, and those address fields. They exclude cart display prices, totals, seller data, and client-supplied user IDs. The server must calculate authoritative totals, inventory availability, taxes, and delivery fees. Return orders as `{ id, items, subtotal, shipping, total, status, createdAt }`; `items` must be an array and `createdAt` an ISO date string. IDs may also be `_id`. Checkout confirms success only after a successful backend response. The frontend does not collect card details or process payment.

Sellers use `{ id, name, email, status, joined? }`, with `_id` accepted; `status` may be `Pending` or `Approved`. Inventory, order tables, seller approvals, and chart data use API records. Shop-name edits are explicitly limited to the current view; persisting account settings needs your profile endpoint.

## Browser storage and backend responsibilities

Cart entries and favorites store product IDs, quantities, and selected colors locally. Restored products are resolved against the current API catalog; product records are not read from legacy browser caches. Orders and seller approvals are never persisted as local demo records. Informational homepage photography is decorative and is not a catalog item.

The backend must authenticate requests, enforce seller ownership and administrator permissions, validate inputs, scope order access, and calculate final prices. Frontend role checks are navigation conveniences and do not authorize requests. Live validation of these integrations remains pending your API URL and final endpoint contract.
