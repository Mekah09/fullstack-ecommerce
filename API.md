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

The supplied routes are connected through Vite and Vercel proxies. Public endpoint URLs can be overridden through these Vite variables:

| Variable | Default / purpose |
| -------- | ----------------- |
| `VITE_AUTH_SIGN_IN_URL` | `/account-api/signin`, proxied to `https://fullstack-ecommerce2.onrender.com/user/signin` |
| `VITE_AUTH_SIGN_UP_URL` | `/account-api/signup`, proxied to `https://fullstack-ecommerce2.onrender.com/user/signup` |
| `VITE_AUTH_VERIFY_OTP_URL` | `/account-api/verifyOTP`, proxied to `https://fullstack-ecommerce2.onrender.com/user/verifyOTP` |
| `VITE_AUTH_RESEND_OTP_URL` | Empty; optional resend URL |

These are public URL settings. Keep private keys in your backend.

1. Signup posts `{ name, email, password, role }`. The buyer choice maps to backend `user`; the seller choice sends `seller`. The current backend ignores `role` and always stores `user`, so seller signup needs the backend change below. Its `201 { message: "Sign up sucessfully" }` response opens the OTP screen.
2. Verification posts `{ email, otp }` to `/user/verifyOTP`. Its expected success is HTTP 200 with plain text `User verified successfully`. A successful message moves the UI to sign-in without creating a session. If a future verification response includes a valid token and user, the adapter can accept that session.
3. Sign-in posts `{ email, password }` to `/user/signin`. Success returns `{ message, token, user: { id, name, role } }`. This session opens the page matching the backend role: `user` becomes buyer, `seller` opens the seller dashboard, and `admin` opens the admin dashboard. Sign-in does not request another OTP.

OTP success and authentication errors can be JSON or plain text, including the plain messages Express sends with a `text/html` content type. Signup and sign-in success return JSON. Invalid codes and server failures remain visible in the form for retry. Sign-in must return a token and server user; a message-only response cannot authenticate an account. Unverified or inactive sign-in returns HTTP 403 with `{ message: "Account is unverified or disabled" }`.

There are no frontend-generated codes, simulated emails, or fake accounts. No resend route was supplied, so resend remains unavailable. Configuring `VITE_AUTH_RESEND_OTP_URL` enables a real backend request with `{ email, challengeId? }`; an optional returned `challengeId` replaces the previous one.

## Admin access

Use a trusted backend/database operation to set `role: "admin"` on an existing account with `verified: true` and `isActive: true`. Sign in through the normal form, then open [https://nook-pearl-six.vercel.app/admin](https://nook-pearl-six.vercel.app/admin). The returned backend role controls navigation. There is no public admin signup endpoint, and the product API URL does not grant admin access.

Sessions use the backend-issued token and cached user in session storage. On reload, an unexpired JWT restores navigation state; this does not verify its signature, check account status, or detect revocation. The backend must authorize protected requests. Sign-out clears the local session.

## Backend fixes required

Reviewed backend source: `Mekah09/fullstack-ecommerce2`, commit `ed5d74e`.

- `controller/auth.controller.js`, `verifyOTP`: replace `User.findOne({ email })` with `Auth.findOne({ email })`. `User` is undefined, so the current handler returns HTTP 500 before checking the code.
- `signUp`: await `newUser.save()` and `sendEmail(...)` before returning success. Signup and sign-in catch blocks must send an error response so failed requests do not hang.
- `signUp`: validate the requested role against `user` and `seller` instead of hardcoding `user`. Do not accept `admin` from public signup.
- `routes/auth.route.js`: remove the first public `GET /allusers` registration. It currently handles requests before the duplicate route with `protect` and `allowRoles("admin")` can run.

The frontend integration does not modify the backend repository. Live signup verification depends on these backend fixes being deployed.

## Optional integrations and deployment

`VITE_ORDERS_API_URL` and `VITE_NEWSLETTER_API_URL` are empty until final URLs are supplied. Their components make requests inline when configured. Orders must be confirmed by the backend, which determines current prices, availability, and totals. No orders or subscriptions are fabricated locally, and the frontend does not process payments.

Errors should return a non-2xx status with a helpful message. Authentication accepts the current backend's JSON and plain-text responses. Direct browser requests require backend CORS support for the frontend origin and required headers. Vite and Vercel proxy all three supplied authentication routes; other hosts need equivalent rules. An HTML response usually indicates a route/proxy fallback problem.

Unknown frontend routes show a not-found page. A SPA fallback may serve that screen with HTTP 200; the UI does not claim an HTTP 404 response.
