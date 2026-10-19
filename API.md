# Connecting your backend

Products come exclusively from `https://fullstack-ecommerce2.onrender.com/products`, the default public catalog endpoint. The backend source returns `{ message: "Products fetched successfully", products: [...] }`. The adapter accepts that wrapper or an array directly. Empty arrays and network errors have separate visible states. The frontend never falls back to a local catalog, demo accounts, orders, sellers, or dashboard records.

Set `VITE_PRODUCTS_API_URL` and `VITE_ADD_PRODUCT_API_URL` in an ignored `.env.local` to override the complete catalog and upload URLs. Set `VITE_API_BASE_URL` separately when the remaining account, order, seller, and admin contracts are confirmed; it never overrides the catalog, upload, or sign-in routes. Restart Vite after configuration changes; deployment values must be set before building. These are public browser settings, not secrets. The catalog request sends no bearer token. Use HTTPS in production.

The defaults use same-origin `/catalog-api/products`, `/catalog-api/add-product`, and `/account-api/signin` requests. Vite proxies those paths locally; `vercel.json` rewrites them to the backend on Vercel, before the SPA fallback. The Vercel rewrites target the default endpoints specifically. Custom catalog/upload URLs are proxied by Vite during development and fetched directly in production, so their server must allow the deployed frontend origin through CORS or the deployment must provide its own proxy.

The adapter lives in `src/services/api.jsx`. Components use class lifecycle methods and context consumers; there are no hooks. All API-dependent actions report errors until the relevant backend is available.

## Connected endpoints

These contracts were checked against `Mekah09/fullstack-ecommerce2`; the latest inspected revision is `ed5d74e`, which enables CORS. This is a source inspection, not a live response check from this workspace, whose network policy blocks the backend domain.

| Method | Backend path  | Request / response |
| ------ | ------------- | ------------------ |
| GET    | `/products`   | Returns `{ message, products: [...] }`; a product array directly is also accepted. |
| POST   | `/addProduct` | Multipart `FormData`: `productName`, `productPrice`, `productCategory`, and `productImage` as a file. Returns `{ message, product }`. |
| POST   | `/user/signin` | JSON `{ email, password }`; returns `{ token, user: { id, name, role } }` for a verified, active account. |

The upload defaults to `https://fullstack-ecommerce2.onrender.com/addProduct`. Choose a JPG/JPEG, PNG, or WebP file up to 2 MiB and a price greater than zero. The browser sets the multipart boundary; the adapter does not set a JSON `Content-Type` for uploads. A product appears only after the backend returns it successfully. The form does not send unsupported description, stock, or seller ownership fields.

The current backend's `/user/signup` creates an unverified account without a session token. Its `/user/verifyOTP` implementation references an undefined model, so the frontend does not claim a working signup/OTP integration. These need a confirmed end-to-end backend flow before connecting registration.

## Prepared endpoints

The paths below are integration contracts, not confirmed routes on the current backend. They use `VITE_API_BASE_URL` and remain disconnected until it is configured. Merely setting a base URL does not implement missing backend endpoints.

| Method | Path                 | Request / response                                                                                                 |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| PATCH  | `/products/:id`      | Changed product fields; returns the saved product or `{ product }`.                                                |
| DELETE | `/products/:id`      | Returns 204 or JSON.                                                                                               |
| POST   | `/auth/register`     | `{ name, email, password, role }`; returns `{ user, token }`.                                                      |
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
- `colors` is an optional string array. Prices display in Nigerian naira (NGN) using `en-NG` formatting. This changes formatting only; it does not convert prices from another currency. Ratings and review counts are displayed only when supplied by the API.

The current product model has no owner ID. The seller dashboard includes products with a matching API `sellerId`, plus product IDs returned by successful uploads during the current signed-in session. Those temporary references do not fabricate ownership and are lost on reload/sign-out. To restore a seller's inventory reliably, return the authenticated owner's ID with each product or provide an authenticated seller-inventory endpoint.

## Troubleshooting product requests

A URL opening directly in a browser does not prove that another website may fetch it. The latest inspected backend now has `app.use(cors())`; the frontend also retains same-origin proxies for its default endpoints. In browser developer tools, the catalog request on `https://nook-pearl-six.vercel.app/` should go to `/catalog-api/products` and return JSON with a `products` array. HTML instead of JSON means the catalog proxy rule is missing or is running after the SPA fallback. Ensure the deployed frontend includes the current `vercel.json`.

For custom URLs, confirm that the deployed backend's CORS policy permits the actual frontend origin and the request's required headers. The Vite proxy is a local development feature and does not accompany a static build to another host.

The backend product controller currently logs caught errors without sending a response. If requests hang when the database fails, return a non-2xx JSON response such as `res.status(500).json({ message: "Unable to load products" })` in its catch block, or forward the error to Express error middleware. This is a backend diagnostic, separate from CORS and product field mapping.

## Accounts and orders

Sign-in sends email and password only: the server determines the role. Its `user` role maps to frontend `buyer`; `seller` and `admin` remain unchanged. Existing accounts must be verified and active according to the backend. The admin page is [https://nook-pearl-six.vercel.app/admin](https://nook-pearl-six.vercel.app/admin). Provision an appropriate backend `admin` account to use it; changing a frontend role is not authorization. There is no admin signup or demo account.

The backend-issued token and returned public user object are kept in `sessionStorage` under `nook.token.v1` and `nook.user.v1`; passwords are never stored. The current backend has no `/me` endpoint. On reload, the frontend restores the last sign-in response only while the JWT's expiry has not passed, for navigation. This does not verify the token signature, revalidate account status, or check revocation; protected actions must always be authorized by the backend. Sign-out clears the browser session. A future authenticated current-user endpoint can provide server revalidation.

Shipping addresses use `{ name, email, address, city, postalCode }`. Order requests send only product IDs, quantities, selected colors, and those address fields. They exclude cart display prices, totals, seller data, and client-supplied user IDs. The server must calculate authoritative totals, inventory availability, taxes, and delivery fees. Return orders as `{ id, items, subtotal, shipping, total, status, createdAt }`; `items` must be an array and `createdAt` an ISO date string. IDs may also be `_id`. Checkout confirms success only after a successful backend response. The frontend does not collect card details or process payment.

Sellers use `{ id, name, email, status, joined? }`, with `_id` accepted; `status` may be `Pending` or `Approved`. Inventory, order tables, seller approvals, and chart data use API records. Shop-name edits are explicitly limited to the current view; persisting account settings needs your profile endpoint.

## Browser storage and backend responsibilities

Cart entries and favorites store product IDs, quantities, and selected colors locally. Restored products are resolved against the current API catalog; product records are not read from legacy browser caches. Orders and seller approvals are never persisted as local demo records. Informational homepage photography is decorative and is not a catalog item.

The backend must authenticate requests, enforce seller ownership and administrator permissions, validate inputs, scope order access, and calculate final prices. Frontend role checks are navigation conveniences and do not authorize requests. Signup/OTP, product editing/deletion, orders, and seller approvals still need confirmed backend integrations. No backend files are changed by this frontend repository.
