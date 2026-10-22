# Backend integration

Catalog requests are made inside `HomePage.jsx`, `ProductsPage.jsx`, `AdminDashboardPage.jsx`, and `SellerDashboardPage.jsx` using `useEffect`, `useState`, and `fetch`. Uploads are submitted inside `components/ProductForm.jsx`. Authentication alone uses the external adapter `services/auth.jsx`.

## Products

`GET https://fullstack-ecommerce2.onrender.com/products` must return either a product array or `{ products: [...] }`. Empty results show an empty state; failed requests show an error without substituting local products.

`VITE_PRODUCTS_API_URL` and `VITE_ADD_PRODUCT_API_URL` optionally override the complete catalog and upload URLs. These requests remain inside their page/form components.

| Backend field | Storefront field |
| ------------- | ---------------- |
| `_id` or `id` | Stable product ID |
| `productName` or `name` | Product name |
| `productPrice` or `price` | Nonnegative numeric price |
| `productCategory` or `category` | Category |
| `productImage` or `image` | Public image URL or backend-relative path |

Optional product details are displayed only when supplied. Missing stock means availability is unknown; zero stock is unavailable. Prices use `en-NG`/NGN formatting with no currency conversion. Missing or failed images show a neutral placeholder.

`POST https://fullstack-ecommerce2.onrender.com/addProduct` receives multipart `FormData` with exactly these fields:

- `productName`: nonempty name.
- `productPrice`: price greater than zero.
- `productCategory`: nonempty category.
- `productImage`: JPG/JPEG, PNG, or WebP file up to 2 MiB.

The browser sets the multipart boundary. A successful response is `{ message, product }`, containing the saved product and its ID. The frontend does not generate product IDs or claim success before the backend response. Upload pages are `/admin/add-product` and `/seller/add-product`, guarded by frontend role checks; the backend must enforce permissions itself.

The current model has no owner ID. Newly uploaded product IDs can be associated with the current signed-in session for immediate seller display. Reliable inventory after reload requires an API owner field such as `sellerId` or an authenticated seller-products endpoint.

## Credentials and email OTP

Configure public endpoint URLs through these Vite variables:

| Variable | Default / purpose |
| -------- | ----------------- |
| `VITE_AUTH_SIGN_IN_URL` | `/account-api/signin`, proxied to `https://fullstack-ecommerce2.onrender.com/user/signin` |
| `VITE_AUTH_SIGN_UP_URL` | Empty; supply the final signup URL |
| `VITE_AUTH_VERIFY_OTP_URL` | Empty; supply the final email OTP verification URL |
| `VITE_AUTH_RESEND_OTP_URL` | Empty; optional resend URL |

These are URL settings, not secret keys. The existing signup/verification routes are not claimed to implement the required flow until the backend confirms their contracts.

1. Signup posts `{ name, email, password, role }`, where role is `buyer` or `seller`. Sign-in posts `{ email, password }`. The server sends the email and returns `{ requiresOtp: true, challengeId? }`.
2. Verification posts `{ email, otp, challengeId? }` to `VITE_AUTH_VERIFY_OTP_URL`.
3. Verification must return `{ token, user: { id, name, email, role } }` before a buyer or seller is authenticated. The server verifies the code, determines the role, and issues the session.

There are no frontend-generated codes, simulated emails, or fake accounts. Buyer/seller token-only credential responses cannot bypass OTP. Existing backend-issued admin credential responses may establish an admin session directly. Resend is shown only when its endpoint is configured; it posts `{ email, challengeId? }` and must send a real email through the backend. A returned `challengeId` replaces the previous one when supplied.

The backend's `user` role maps to frontend `buyer`. The admin page is [https://nook-pearl-six.vercel.app/admin](https://nook-pearl-six.vercel.app/admin), for backend-provisioned `admin` accounts. The public products URL neither grants administrator access nor requires a secret API key.

Sessions use the backend-issued token and cached user in session storage. On reload, an unexpired JWT restores navigation state; this does not verify its signature, check account status, or detect revocation. The backend must authorize protected requests. Sign-out clears the local session.

## Optional integrations and deployment

`VITE_ORDERS_API_URL` and `VITE_NEWSLETTER_API_URL` are empty until final URLs are supplied. Their components make requests inline when configured. Orders must be confirmed by the backend, which determines current prices, availability, and totals. No orders or subscriptions are fabricated locally, and the frontend does not process payments.

Errors should return a non-2xx status and JSON `{ message: "Helpful explanation" }`. Direct browser requests require backend CORS support for the frontend origin and required headers. Vite and Vercel proxy the default sign-in route; other hosts need equivalent rules. An HTML response where JSON is expected usually indicates a route/proxy fallback problem.

Unknown frontend routes show a not-found page. A SPA fallback may serve that screen with HTTP 200; the UI does not claim an HTTP 404 response.
