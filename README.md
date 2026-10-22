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

Dashboard and upload links require the appropriate signed-in role. The admin URL is [https://nook-pearl-six.vercel.app/admin](https://nook-pearl-six.vercel.app/admin); use an account provisioned with the `admin` role by your backend. A products API URL is not an admin credential. There is no admin signup or demo login. The not-found screen is a client route; a host's SPA fallback may still return HTTP 200.

## API connection

Products load from `https://fullstack-ecommerce2.onrender.com/products`. A raw array or `{ products: [...] }` is accepted. Product uploads go to `https://fullstack-ecommerce2.onrender.com/addProduct` with a name, price, category, and JPG/PNG/WebP file up to 2 MiB. Override these complete URLs with `VITE_PRODUCTS_API_URL` and `VITE_ADD_PRODUCT_API_URL` if needed. Loading, empty, and failed-request states are separate. See [API.md](./API.md) for fields and request contracts.

The current backend has no product owner ID. The seller view can include products created during the current signed-in session; reliable ownership filtering after reload requires backend owner fields. Cart and favorites retain product references; checkout availability and prices must be validated by the backend.

## Email OTP configuration

Create an ignored `.env.local` using the settings below. Sign-in defaults to `/account-api/signin`, proxied by Vite and Vercel to the existing backend `/user/signin` route. Configure the final signup and OTP routes when your backend provides them:

```dotenv
VITE_AUTH_SIGN_IN_URL=/account-api/signin
# Fill empty values with the final backend URLs when supplied.
VITE_AUTH_SIGN_UP_URL=
VITE_AUTH_VERIFY_OTP_URL=
VITE_AUTH_RESEND_OTP_URL=
VITE_ORDERS_API_URL=
VITE_NEWSLETTER_API_URL=
```

Buyer and seller credentials must start a real email OTP challenge. Only a successful verification response containing a token and user authenticates them. The existing backend's token-only sign-in response is insufficient for buyer/seller OTP login; update that backend flow and configure its verification URL. Existing backend-issued admin sessions may sign in directly. Resend is available only when its URL is configured. Unconfigured routes show an explanatory error; no emails or codes are simulated.

Restart Vite after changing environment variables, and set deployment values before building. `VITE_*` values are public browser configuration, not secret API keys. No API key is needed for the public catalog; private keys stay in the backend. Optional order and newsletter URLs remain disconnected until supplied. The frontend does not collect payment-card details or process payments.

Session storage restores an unexpired backend-issued JWT and cached user for navigation. Backend authorization must enforce every protected action; local role checks do not verify token signatures, account status, or revocation. The backend's `user` role maps to `buyer`.

The included `vercel.json` supplies the sign-in proxy and frontend route fallback. Other hosts need equivalent rules. Direct cross-origin API requests require the backend to allow the deployed frontend origin through CORS.
