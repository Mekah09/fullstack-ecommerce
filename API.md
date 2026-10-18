# Connecting your backend

Products come exclusively from `https://fullstack-ecommerce2.onrender.com/products`, the default public catalog endpoint. The backend source returns `{ message: "Products fetched successfully", products: [...] }`. The adapter accepts that wrapper or an array directly. Empty arrays and network errors have separate visible states. The frontend never falls back to a local catalog, demo accounts, orders, sellers, or dashboard records.

Set `VITE_PRODUCTS_API_URL` in an ignored `.env.local` to override the complete catalog URL. Set `VITE_API_BASE_URL` separately when the account, order, seller, and admin APIs are confirmed; it never overrides the catalog URL. Restart Vite after configuration changes; deployment values must be set before building. These are public browser settings, not secrets. The catalog request sends no bearer token. Use HTTPS in production.

The default feed is requested through `/catalog-api/products` on the frontend's origin. Vite proxies that path locally; `vercel.json` rewrites it to the backend on Vercel, before the SPA fallback. This avoids browser CORS restrictions without changing the backend. The Vercel rewrite targets the default feed specifically. A custom products URL is proxied by Vite during development and fetched directly in production, so its server must allow the deployed frontend origin through CORS or the deployment must provide its own proxy.

The adapter lives in `src/services/api.jsx`. Components use class lifecycle methods and context consumers; there are no hooks. All API-dependent actions report errors until the relevant backend is available.

## Prepared endpoints

The catalog wrapper and field names below were checked against `Mekah09/fullstack-ecommerce2` at commit `197b1f4`. This is a source inspection, not a live response check from this workspace, whose network policy blocks the backend domain. The remaining paths below are prepared integration contracts; adjust the adapter when your backend's routes and responses are confirmed. They use `VITE_API_BASE_URL` and remain disconnected until it is configured.

| Method | Path                 | Request / response                                                                                                 |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| GET    | `/products`          | Returns `{ message, products: [...] }`; a product array directly is also accepted.                                 |
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

The current backend model provides `_id`, `productName`, `productPrice`, `productImage`, and `productCategory`. The adapter normalizes these to `id`, `name`, `price`, `image`, and `category`. Standard storefront field names remain supported. Optional fields are `stock`, `description`, `seller`, `sellerId`, `rating`, `reviews`, `originalPrice`, `badge`, `colors`, and `featured`.

- IDs must be nonempty strings or numbers; the adapter normalizes them to strings and never generates them.
- `name`, `title`, or `productName` is required.
- `price` or `productPrice` must be a finite nonnegative number; numeric strings are accepted.
- When supplied, `stock` must be a nonnegative integer. Missing stock is unknown, not zero. These products can be added to the bag without claiming an available quantity; checkout must verify inventory on the backend. Explicit zero stock remains unavailable.
- `productCategory` is a string; the standard `category` field may be a string or `{ name }`. Category filters are derived from API records.
- `seller` may be a display string or an object with `name` and `id`/`_id`. Return the owner's user ID as `sellerId` so the seller dashboard can filter inventory reliably.
- `image` or `productImage` is a public HTTP(S) image URL or a path relative to the upstream products endpoint, even when the request uses a frontend proxy. For example, `/uploads/photo.jpg` resolves to the API origin. Missing or failed images show a neutral placeholder icon. The frontend has no bundled product photographs or fallback product records.
- `colors` is an optional string array. Prices display in USD. Ratings and review counts are displayed only when supplied by the API.

## Troubleshooting product requests

A URL opening directly in a browser does not prove that another website may fetch it. The inspected backend `server.js` has no CORS middleware. The included Vercel rewrite fixes the default feed for `https://nook-pearl-six.vercel.app/` once the updated frontend is deployed. In browser developer tools, the request should go to `/catalog-api/products` on that frontend origin and return JSON with a `products` array. HTML instead of JSON means the catalog proxy rule is missing or is running after the SPA fallback.

If you choose to fetch the API directly, enable CORS in the backend and redeploy it. For this deployment, install `cors` with `npm install cors`, then place this before route registration in `server.js`:

```js
const cors = require("cors");

app.use(cors({
  origin: ["http://localhost:5173", "https://nook-pearl-six.vercel.app"],
}));

// Register app.use("/", productRoutes) after the CORS middleware.
```

Add any other actual frontend origins to that list. This backend change is an alternative to the default catalog proxy; no backend files are changed in this frontend repository. Direct authenticated integrations must also permit their required `Authorization` and `Content-Type` headers.

The backend product controller currently logs caught errors without sending a response. If requests hang when the database fails, return a non-2xx JSON response such as `res.status(500).json({ message: "Unable to load products" })` in its catch block, or forward the error to Express error middleware. This is a backend diagnostic, separate from CORS and product field mapping.

## Accounts and orders

Users use `{ id, name, email, role }`, with `_id` also accepted. Roles must be `buyer`, `seller`, or `admin`. Login sends email and password only: the server determines the role. Signup permits buyer and seller roles only. Session tokens and the public user object are kept in `sessionStorage` under `nook.token.v1` and `nook.user.v1`; passwords are never stored. With no token, current-user and order reads return `null` and `[]` without an API request. With a token, the user is revalidated through `/auth/me`. Sign-out clears the browser session; add your backend's revocation endpoint if required.

Shipping addresses use `{ name, email, address, city, postalCode }`. Order requests send only product IDs, quantities, selected colors, and those address fields. They exclude cart display prices, totals, seller data, and client-supplied user IDs. The server must calculate authoritative totals, inventory availability, taxes, and delivery fees. Return orders as `{ id, items, subtotal, shipping, total, status, createdAt }`; `items` must be an array and `createdAt` an ISO date string. IDs may also be `_id`. Checkout confirms success only after a successful backend response. The frontend does not collect card details or process payment.

Sellers use `{ id, name, email, status, joined? }`, with `_id` accepted; `status` may be `Pending` or `Approved`. Inventory, order tables, seller approvals, and chart data use API records. Shop-name edits are explicitly limited to the current view; persisting account settings needs your profile endpoint.

## Browser storage and backend responsibilities

Cart entries and favorites store product IDs, quantities, and selected colors locally. Restored products are resolved against the current API catalog; product records are not read from legacy browser caches. Orders and seller approvals are never persisted as local demo records. Informational homepage photography is decorative and is not a catalog item.

The backend must authenticate requests, enforce seller ownership and administrator permissions, validate inputs, scope order access, and calculate final prices. Frontend role checks are navigation conveniences and do not authorize requests. Live validation of the account, order, seller, and admin integrations remains pending their final endpoint contracts.
