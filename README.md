# Nook marketplace frontend

React, Tailwind CSS, React Icons, and React Router ecommerce frontend with separate buyer, seller, and admin pages. Products come from your API; there are no static products, demo users, or fake OTP codes. Prices display in Nigerian naira (NGN), without currency conversion.

## Run and build

Use Node.js 24 or Node.js 22.13+ and npm.

```sh
npm ci
npm run dev
npm run lint
npm run build
```

For a cloud preview, run `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort`. Production files are written to `dist/`.

## Code structure

- `src/pages/HomePage.jsx`, `ProductsPage.jsx`, `AdminDashboardPage.jsx`, and `SellerDashboardPage.jsx` each fetch products directly with `fetch`, `useState`, and `useEffect`. There is no external product API service.
- `src/components/ProductForm.jsx` submits product uploads directly with `fetch` and `FormData`.
- `src/services/auth.jsx` is the authentication adapter for credentials, email OTP verification, and session storage.
- All reusable components are `.jsx` files directly in `src/components`, without nested folders. Pages remain in `src/pages`.
- Styling uses Tailwind utilities in JSX. `src/index.css` contains only `@import "tailwindcss";`; there are no custom stylesheets.

## Pages

| URL | Purpose |
| --- | ------- |
| `/` | Home with up to four API products |
| `/products` | Full catalog with search, filters, and sorting |
| `/account` | Buyer account and saved products |
| `/seller` | Seller dashboard |
| `/seller/add-product` | Seller product upload page |
| `/admin` | Admin dashboard |
| `/admin/add-product` | Admin product upload page |
| `/404` and unknown paths | Page not found |

Dashboard and upload links require the appropriate signed-in role. To access [the admin page](https://nook-pearl-six.vercel.app/admin), use a trusted backend/database operation to assign `role: "admin"` to an existing account with `verified: true` and `isActive: true`, then sign in normally. The frontend opens `/admin` from the role returned by sign-in. There is no public admin signup or demo login. A products API URL does not grant admin access. The not-found screen is a client route; a host's SPA fallback may still return HTTP 200.

## API connection

Products load from `https://fullstack-ecommerce2.onrender.com/products`. A raw array or `{ products: [...] }` is accepted. Product uploads go to `https://fullstack-ecommerce2.onrender.com/addProduct` with a name, price, category, and JPG/PNG/WebP file up to 2 MiB. Override these complete URLs with `VITE_PRODUCTS_API_URL` and `VITE_ADD_PRODUCT_API_URL` if needed. Loading, empty, and failed-request states are separate. See [API.md](./API.md) for fields and request contracts.

The current backend has no product owner ID. The seller view can include products created during the current signed-in session; reliable ownership filtering after reload requires backend owner fields. Cart and favorites retain product references; checkout availability and prices must be validated by the backend.

## Signup, email OTP, and sign-in

The supplied authentication routes are connected by default. Vite and Vercel proxy `/account-api/signup`, `/account-api/signin`, and `/account-api/verifyOTP` to the matching `/user/...` routes at `https://fullstack-ecommerce2.onrender.com`.

1. Create an account as a buyer or seller. Signup submits the form to `/user/signup` and opens the email-code screen after a successful response.
2. Enter the emailed code. `/user/verifyOTP` receives `{ email, otp }`; its successful message returns you to sign-in.
3. Sign in with your email and password. `/user/signin` returns the token and account role used to open your buyer, seller, or admin page. OTP is required during signup, rather than every sign-in.

The backend currently creates every signup with the `user` role, even when seller is selected. Seller registration requires the backend role fix below; the frontend uses the actual role returned by sign-in. No emails, codes, or accounts are simulated.

These optional overrides can go in an ignored `.env.local`; the three supplied URLs are already the defaults:

```dotenv
VITE_AUTH_SIGN_UP_URL=/account-api/signup
VITE_AUTH_SIGN_IN_URL=/account-api/signin
VITE_AUTH_VERIFY_OTP_URL=/account-api/verifyOTP
# No resend route has been supplied.
VITE_AUTH_RESEND_OTP_URL=
VITE_ORDERS_API_URL=
VITE_NEWSLETTER_API_URL=
```

Resend remains unavailable until its backend URL is provided. Verification can also accept a future backend response containing a token and user; a message alone never creates a local session.

Restart Vite after changing environment variables, and set deployment values before building. `VITE_*` values are public browser configuration, not secret API keys. No API key is needed for the public catalog; private keys stay in the backend. Optional order and newsletter URLs remain disconnected until supplied. The frontend does not collect payment-card details or process payments.

Session storage restores an unexpired backend-issued JWT and cached user for navigation. Backend authorization must enforce every protected action; local role checks do not verify token signatures, account status, or revocation. The backend's `user` role maps to `buyer`.

The included `vercel.json` supplies all three authentication proxies and the frontend route fallback. Other hosts need equivalent rules. Direct cross-origin API requests require the backend to allow the deployed frontend origin through CORS.

## Backend fixes required

The frontend is wired to the supplied endpoints, but the reviewed backend needs these changes for reliable registration:

- In `controller/auth.controller.js`, replace undefined `User.findOne` with `Auth.findOne` inside `verifyOTP`; the current reference causes verification to return HTTP 500.
- Await account saving and email delivery before signup reports success, and return an error response from the signup/sign-in catch blocks.
- Accept signup roles from an allowlist of `user` and `seller`; the frontend sends `user` for buyers and `seller` for sellers. Keep admin provisioning outside public signup.
- Remove the public `/allusers` route registered before the protected duplicate. Keep `protect` and `allowRoles("admin")` on the admin route.

See [API.md](./API.md) for request and response details. These fixes belong to the backend repository.
