# Nook ecommerce website: setup and API guide

Nook is a React frontend for buyers, sellers, and administrators. It displays products from your backend, lets visitors save products and build a shopping bag, and provides separate seller and admin workspaces. Prices are shown in Nigerian naira (NGN).

The frontend repository is [Mekah09/fullstack-ecommerce](https://github.com/Mekah09/fullstack-ecommerce). Your current website is [nook-pearl-six.vercel.app](https://nook-pearl-six.vercel.app/), and the supplied backend is `https://fullstack-ecommerce2.onrender.com`.

If you are not receiving signup codes, start with [Fix missing OTP emails](#3-fix-missing-otp-emails). An OTP is created and emailed by the backend; changing a React API URL alone cannot repair an email delivery failure.

## Contents

1. [What is connected](#1-what-is-connected)
2. [Run the frontend on your computer](#2-run-the-frontend-on-your-computer)
3. [Fix missing OTP emails](#3-fix-missing-otp-emails)
4. [Connect all API URLs](#4-connect-all-api-urls)
5. [Use signup, verification, and sign-in](#5-use-signup-verification-and-sign-in)
6. [Get access to the admin page](#6-get-access-to-the-admin-page)
7. [Understand every page and popup](#7-understand-every-page-and-popup)
8. [Connect products and product uploads](#8-connect-products-and-product-uploads)
9. [Add the remaining integrations](#9-add-the-remaining-integrations)
10. [Deploy the frontend to Vercel](#10-deploy-the-frontend-to-vercel)
11. [Find and change the code](#11-find-and-change-the-code)
12. [Troubleshoot problems](#12-troubleshoot-problems)
13. [Check a complete setup](#13-check-a-complete-setup)

## 1. What is connected

The website uses React, React Router, Tailwind CSS, and React Icons. Application modules are JSX. Styling uses Tailwind utilities inside JSX; `src/index.css` only imports Tailwind. Sections animate into view on scroll, with reduced motion respected.

| Feature | Current connection |
| --- | --- |
| Product collection | Fetches your `/products` API directly from the page components |
| Home product preview | Shows up to four products from the API |
| Full collection | Search, category filters, sorting, and saved-only filtering |
| Product upload | Posts an image and product fields to `/addProduct` |
| Signup | Connected to `/user/signup`; email delivery depends on the backend |
| Signup OTP | Connected to `/user/verifyOTP`; the backend checks the emailed code |
| Sign-in | Connected to `/user/signin`; uses its returned token and account role |
| Shopping bag and favorites | Stored in this browser; product details come from the API |
| Checkout and buyer order history | Prepared for an optional orders API; no URL has been supplied |
| Newsletter | Prepared for an optional subscription API; no URL has been supplied |
| Product editing/deletion, seller approvals | Need backend endpoints before these actions can work |
| Payment processing | Not connected; the website does not collect card details |

No static product collection, demo accounts, invented OTPs, or fake orders are used. Empty dashboard sections do not mean that real orders, revenue, or seller records were fetched.

## 2. Run the frontend on your computer

### Step 1: install the required tools

Install Git and Node.js 24, or Node.js 22.13 or newer. npm comes with Node.js.

### Step 2: get the code

```sh
git clone https://github.com/Mekah09/fullstack-ecommerce.git
cd fullstack-ecommerce
git switch master
git pull origin master
npm ci
```

If the repository is already on your computer, open that folder and update your checkout instead of cloning again. Preserve unfinished changes before pulling.

### Step 3: start development

```sh
npm run dev
```

Open the address Vite prints in the terminal. Keep that terminal running while developing. For a cloud development machine that needs an external host binding, use `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort`.

### Step 4: check your changes

```sh
npm run lint
npm run build
```

The production build goes into `dist/`. `npm run preview` serves that build locally but does not provide the development authentication proxies. To test authentication through preview, configure complete backend authentication URLs with working CORS, or use a host with the supplied Vercel rewrites.

## 3. Fix missing OTP emails

Follow the full [OTP repair and email setup guide](./OTP_SETUP.md). It explains the prepared backend repair, email configuration, deployment, and how to identify the failing step. The repair is provided as [docs/backend-otp.patch](./docs/backend-otp.patch); including it in this frontend repository does not deploy it to Render.

The normal sequence is:

```text
Signup form
  -> POST /user/signup
  -> backend saves the account and creates an OTP
  -> backend asks its email provider to send the code
  -> visitor enters the code
  -> POST /user/verifyOTP
  -> visitor signs in through POST /user/signin
```

### Step 1: check the signup request

Open browser developer tools, select **Network**, submit signup once, and select the `signup` request. Check its status and response. With the default configuration, the browser calls `/account-api/signup` on the frontend host, which forwards to backend `/user/signup`.

A successful HTTP response does not, by itself, prove delivery. The reviewed backend reported signup success without waiting for account saving or email delivery. Check email-provider errors in backend logs.

### Step 2: repair and configure the backend

Apply the repair to the backend repository using [OTP_SETUP.md](./OTP_SETUP.md), configure a sender, and deploy that backend. The repair waits for saving and sending, fixes OTP verification, and adds a resend route. Use an HTTPS email service where your host blocks SMTP. The guide covers the supported email configuration and the existing OTP database index that must be removed.

Keep mail passwords, mail API keys, database credentials, and `JWT_SECRET` in the backend environment. Never add them to frontend `VITE_*` variables or commit their values to GitHub.

### Step 3: distinguish delivery from verification

Missing email is a signup/email delivery problem. An emailed code that produces an error is a verification problem. The reviewed backend used undefined `User.findOne` in `verifyOTP` instead of imported `Auth.findOne`; the prepared patch corrects this too.

### Step 4: deploy, then test with your mailbox

After deploying the corrected backend, sign up with a mailbox you control. Check Inbox and Spam. Enter the received code with the same email address, then sign in. A successful backend/API test without a real delivered email does not establish inbox delivery.

Resend remains disabled by default. After the repair's `/user/resendOTP` route is deployed, set `VITE_AUTH_RESEND_OTP_URL=/account-api/resendOTP` and redeploy the frontend. The **Verify your email** action only reopens code entry; it does not send another email. Do not repeatedly create accounts to request codes.

## 4. Connect all API URLs

### Step 1: understand website URLs and API URLs

Frontend URLs such as `/admin` open screens. Backend URLs such as `/user/signin` receive requests. Opening a backend URL in a browser usually makes a GET request, while signup, OTP verification, and sign-in require POST requests with JSON.

| Action | Method | Supplied backend URL | Default frontend request |
| --- | --- | --- | --- |
| List products | GET | `https://fullstack-ecommerce2.onrender.com/products` | Same complete URL from React pages |
| Upload a product | POST | `https://fullstack-ecommerce2.onrender.com/addProduct` | Same complete URL from `ProductForm.jsx` |
| Create an account | POST | `https://fullstack-ecommerce2.onrender.com/user/signup` | `/account-api/signup` |
| Sign in | POST | `https://fullstack-ecommerce2.onrender.com/user/signin` | `/account-api/signin` |
| Verify signup OTP | POST | `https://fullstack-ecommerce2.onrender.com/user/verifyOTP` | `/account-api/verifyOTP` |

Vite forwards the three authentication paths during development. `vercel.json` forwards them on Vercel. `verifyOTP` uses that exact capitalization. Resend is an additional route supplied by the backend repair, not one of the original deployed URLs.

### Step 2: create local settings if needed

The five supplied APIs already have defaults in the code. To override them, create `.env.local` in the project root, next to `package.json`:

```dotenv
VITE_PRODUCTS_API_URL=https://fullstack-ecommerce2.onrender.com/products
VITE_ADD_PRODUCT_API_URL=https://fullstack-ecommerce2.onrender.com/addProduct
VITE_AUTH_SIGN_UP_URL=/account-api/signup
VITE_AUTH_SIGN_IN_URL=/account-api/signin
VITE_AUTH_VERIFY_OTP_URL=/account-api/verifyOTP

# Enable resend only after the repaired backend is deployed.
VITE_AUTH_RESEND_OTP_URL=
# Leave optional integrations empty until real APIs are available.
VITE_ORDERS_API_URL=
VITE_NEWSLETTER_API_URL=
```

`.env.local` is ignored by Git. All `VITE_*` values become visible in the browser, so these settings must contain public URLs only.

### Step 3: choose proxies or direct authentication URLs

Keep the `/account-api/...` values for the existing Vite/Vercel setup. On another host without those rewrites, create equivalent proxies or use complete `https://.../user/...` URLs in the authentication settings. Direct cross-origin requests require backend CORS support.

If you change the backend domain, update complete API settings and any proxy destinations still in use in both `vite.config.js` and `vercel.json`. An environment override does not rewrite a hardcoded proxy target.

### Step 4: allow your website in backend CORS

The backend must allow the frontend origin for direct product requests and any direct authentication requests. Origins include protocol and hostname, such as `https://nook-pearl-six.vercel.app`; they do not include a page path. Allow your actual development origin too. Support the methods and headers your routes need, including JSON and `Authorization` for protected APIs.

### Step 5: restart or redeploy

Restart Vite after changing local environment settings. In Vercel, add settings under the project's environment variables, select the intended deployment environments, and redeploy. Changing a value does not modify an already-built browser bundle.

## 5. Use signup, verification, and sign-in

### Create and verify an account

1. Open the website and select the account icon.
2. Select **Join Nook** to switch from sign-in to signup, or use **Become a seller** for seller signup.
3. Choose buyer or seller, then enter your name, email, and a password of at least eight characters.
4. Submit. The frontend sends `{ name, email, password, role }`; buyer maps to backend `user`, and seller maps to `seller`.
5. The backend must save the account and send the code. Enter the six-digit emailed code on the OTP screen.
6. Verification sends `{ email, otp }`. The current API's successful message returns you to sign-in with email prefilled and password cleared.
7. Enter your password and sign in. Verification alone does not create a session.

If you signed up but closed the popup, open sign-in, enter the same email, and select **Verify your email** to enter the existing code. This does not register another account or generate another email.

### Sign in and sign out

Sign-in sends `{ email, password }`. The backend must return a token and a user with an ID and role. Backend `user` opens `/account`, `seller` opens `/seller`, and `admin` opens `/admin`. The selected signup role cannot override the role returned by the server.

Unverified or inactive accounts are rejected by the backend. OTP is part of signup, rather than every normal sign-in. Sign out from the account menu to remove this tab's authentication session.

The reviewed signup controller always assigned `user`, even when seller was selected. The prepared backend repair allows only `user` and `seller`; deploy it before expecting new seller registrations to work. Public signup must never accept `admin`.

## 6. Get access to the admin page

The admin page is **[https://nook-pearl-six.vercel.app/admin](https://nook-pearl-six.vercel.app/admin)**. There is no separate admin API key, public admin signup, or built-in admin password.

### Step 1: create your own account

Use normal signup with an email you control. Repair email delivery and OTP verification first, complete verification, and keep the account active.

### Step 2: find that account in your backend database

In MongoDB Atlas, open the database your Render backend actually uses. Open the collection associated with the backend `Auth` model. Mongoose normally calls it `auths`; confirm its actual name. Find your account by email and confirm its ID so you update the correct record.

### Step 3: assign the admin role through a trusted operation

Set that account's `role` to the string `admin`. Confirm `verified` is Boolean `true` and `isActive` is Boolean `true`. Complete real email verification instead of using this step to bypass a broken signup flow. Do not change the stored password hash.

Only you or a trusted backend administrator should make this change. Visitors must not be able to grant themselves admin through signup or browser storage.

### Step 4: sign in again

Sign out if already signed in, then sign in with the same email and password. The backend must return `user.role: "admin"`; the frontend then opens `/admin`. The account menu also provides an admin dashboard link.

### Step 5: check access and backend protection

Open `/admin` and `/admin/add-product`. A buyer or seller should see an access prompt instead of admin content. The backend must independently verify tokens and roles on protected API routes; frontend checks control only the interface.

The reviewed backend registered a public `/allusers` route before its protected duplicate. The prepared backend patch removes the public registration. Keep `protect` and `allowRoles("admin")` when using this API for admin data. Knowing a frontend page URL does not grant backend permissions.

## 7. Understand every page and popup

| Page | Access | What it does |
| --- | --- | --- |
| `/` | Public | Home, introduction, up to four API products, store information, newsletter form |
| `/products` | Public | Complete API collection with search, categories, sorting, and favorites |
| `/products?saved=true` | Public | Same collection filtered to this browser's saved product IDs |
| `/account` | Public page with signed-in account content | Buyer welcome, saved products, optional order history; sign-in prompt when signed out |
| `/seller` | Backend role `seller` | Seller overview, inventory, orders, and shop settings tabs |
| `/seller/add-product` | Backend role `seller` | Dedicated product upload form |
| `/admin` | Backend role `admin` | Admin overview, all products, sellers, and orders tabs |
| `/admin/add-product` | Backend role `admin` | Dedicated product upload form |
| `/404` and unknown paths | Public | Not-found screen with links to home and products |

### Home and products

Home shows a preview from the API; **View all products** opens the collection. Category buttons come from returned products. Search checks name, category, and seller text. Sorting supports recommended, low/high price, and rating; useful ranking requires corresponding API fields.

Filters use URL query parameters, so a collection view can be bookmarked. Loading, failures, no products, and no matches have separate messages. Missing images show a placeholder. NGN formatting does not convert foreign currency into naira; backend values must already represent naira.

### Product details, bag, and checkout

Selecting a product opens a detail popup, not a separate `/products/:id` page. It shows available API details, quantity controls, optional colors, save, and add-to-bag actions. Description/rating/review information depends on the API rather than invented records.

The bag icon opens a drawer for quantity changes, removal, and estimated subtotal. `stock: 0` means unavailable; absent stock means availability is unknown. Browser checks do not replace backend stock validation.

Checkout requires sign-in and collects a delivery address. The backend must calculate shipping and final totals. No payment/card processing is connected. Without `VITE_ORDERS_API_URL`, placing an order shows an explanation and does not create a fake order.

### Buyer account and storage

`/account` shows saved products and, when connected, order history. Cart and favorites live in local storage under `nook_cart` and `nook_favorites`. They are browser-specific, not synchronized to another device. Stored cart references contain product IDs and quantities; current API responses supply names, prices, images, and stock.

Authentication uses tab session storage under `nook.token.v1` and `nook.user.v1`. An unexpired backend-issued JWT and cached user restore navigation. This does not check the signature or current database permissions; protected backend APIs must do that. The frontend does not persist passwords.

### Seller workspace

The seller dashboard offers Overview, My products, Orders, and Shop settings. **Add product** opens `/seller/add-product`; successful saving returns to inventory. Shop-name changes apply only for the session because no profile update API is connected.

Reliable seller inventory requires a product owner ID such as `sellerId` or an authenticated seller-products endpoint. The supplied product model lacks owner IDs. Newly uploaded products can appear during the current signed-in session, but ownership cannot be reliably restored after reload without backend support. Name matching in the interface is not authorization.

### Admin workspace

Admin can view the complete fetched catalog and open its upload page. Seller, order, and revenue panels are prepared for backend data. They are not automatically connected to a users endpoint merely because one exists. Seller approval, deletion, and editing need confirmed endpoints; existing controls do not invent successful changes.

### Other popups and 404

Signup/sign-in/OTP appear in a popup. Store-story and policy links use information popups. Order confirmation appears only after a valid saved-order response. There is no separate authentication URL or standalone cart page in the current router.

Unknown paths show the React not-found screen. A single-page application's host fallback can still return HTTP 200 while the interface says 404.

## 8. Connect products and product uploads

### Product listing

`GET /products` must return a JSON array or `{ "products": [...] }`. Products need unique IDs, names, and nonnegative numeric prices. These existing backend fields are supported:

| Backend field | Used for |
| --- | --- |
| `_id` | Stable identity, bag, favorites |
| `productName` | Product title |
| `productPrice` | Price already expressed in NGN |
| `productImage` | Public image URL or backend-relative path |
| `productCategory` | Category label/filter |

Optional stock must be a nonnegative whole number. Description, seller information, ratings, and colors improve the interface when supplied. See [API.md](./API.md) for alternate field names and request details.

### Product upload, step by step

1. Sign in with a backend seller or admin account.
2. Open the dashboard and select **Add product**.
3. Enter a name, price greater than zero in naira, and category.
4. Select a JPG/JPEG, PNG, or WebP image no larger than 2 MiB.
5. Submit. `ProductForm.jsx` posts multipart `FormData`: `productName`, `productPrice`, `productCategory`, and `productImage` as a file.
6. The backend must return `{ message, product }` containing the saved record and real ID.
7. The frontend returns to inventory and refreshes API data. Failed uploads keep values available for retry.

Do not manually set `Content-Type: application/json` for uploads; the browser supplies the multipart boundary. The backend handles storage and must return an accessible image URL. It must enforce permissions itself. The current upload request does not send a bearer header, so a future protected upload contract also requires adding the signed-in token to that request.

## 9. Add the remaining integrations

| Setting or feature | What must be implemented |
| --- | --- |
| `VITE_AUTH_RESEND_OTP_URL` | Deploy the repair's resend route, then configure the frontend URL |
| `VITE_ORDERS_API_URL` | Authenticated GET for buyer orders and POST for order creation |
| `VITE_NEWSLETTER_API_URL` | POST `{ email }` to save a subscription |
| Product editing/deletion | Protected update/delete endpoints and matching requests |
| Admin seller list/approval | Protected listing/approval endpoints connected to the dashboard |
| Seller ownership | Owner fields and backend filtering/authorization |
| Shop settings | A profile/store update API for persistent changes |
| Payments | A separate payment provider/backend integration |

Order creation sends product IDs, quantities, optional colors, and a shipping address with a bearer token when available. The server determines prices, stock, shipping, and totals, and returns a saved order with an ID, items, and total. A URL alone is insufficient if its API expects a different contract; read [API.md](./API.md) and the requesting component.

The newsletter waits for a backend response before showing success. It does not configure the sender used for account OTPs; those integrations are separate.

## 10. Deploy the frontend to Vercel

1. Push frontend changes to GitHub. The intended production branch is `master`.
2. Open the Vercel project connected to `Mekah09/fullstack-ecommerce`.
3. Confirm the root directory contains this `package.json`, framework is Vite, build command is `npm run build`, and output directory is `dist`.
4. Confirm a compatible Node.js version is selected.
5. Add public API overrides under **Settings → Environment Variables**. Select Production and any other environments that need them. Leave unsupplied optional integrations empty.
6. Keep the tracked `vercel.json` in the deployed repository. Authentication rewrites must run before the final `/(.*)` fallback to `/index.html`.
7. Deploy/redeploy the newest `master` commit. Under **Deployments**, check its source commit and successful build instead of assuming a push is already live.
8. Open production and test products, signup, verification, sign-in, and a direct `/admin` visit.

Vercel hosts this frontend; Render hosts the backend. A frontend deployment does not deploy backend email fixes, update Render secrets, or change database roles. Deploy and verify both sides as required.

## 11. Find and change the code

```text
src/
  App.jsx              Frontend route definitions and base Tailwind styling
  pages/               Home, products, account, dashboard, upload, and 404 pages
  components/          Reusable JSX files directly in one folder
  context/             Shared shop/router context definitions
  services/auth.jsx    Authentication requests and session handling
  utils/               Formatting, storage, and shopping-bag helpers
  data/                Store information/interface text, not product fixtures
  index.css            Tailwind import only
vite.config.js         Vite plugins and development proxies
vercel.json            Production rewrites and frontend route fallback
API.md                 API request/response reference
OTP_SETUP.md           Backend email/OTP repair and deployment steps
```

To see product fetching, open `HomePage.jsx`, `ProductsPage.jsx`, `BuyerAccountPage.jsx`, `SellerDashboardPage.jsx`, or `AdminDashboardPage.jsx`. Each keeps product state and its `fetch` call inside the page using `useState` and `useEffect`, with loading, error, and retry handling. There is no external product API service. The provider shares results with the bag and favorites; it does not fetch the collection.

Change uploads in `components/ProductForm.jsx`, authentication fields/screens in `components/AuthModal.jsx`, and authentication request handling in `services/auth.jsx`. Keep reusable components directly inside `components` and styling in Tailwind utilities.

## 12. Troubleshoot problems

Open developer tools → **Network**, reproduce once, and inspect URL, method, status, and response. Compare backend failures with Render logs. Remove passwords, tokens, and codes before sharing screenshots or logs.

| Symptom | What to check next |
| --- | --- |
| Signup succeeds but no email arrives | Provider settings/logs, awaited sending, hosting SMTP restrictions, spam folder; follow [OTP_SETUP.md](./OTP_SETUP.md) |
| Signup stays busy | Pending request/backend catch that never responds; inspect Network/logs |
| No signup request appears | Browser validation, password length, form error, JavaScript console |
| OTP verification returns 500 | Handler must use imported `Auth`; inspect the real backend exception |
| Invalid OTP | Same signup email, exact six digits, whether a newer code replaced it, expiry/attempt limit |
| Resend unavailable | Deploy the repair and configure its resend URL; reopening verification does not resend |
| Sign-in returns 403 | Account verification/active status; complete verification first |
| Sign-in returns 401 | Correct email/password and backend credential validation |
| Seller signup opens buyer account | Check the actual saved/returned role; deploy the role allowlist fix |
| Admin page shows access prompt | Confirm returned role is `admin`; sign out/in after changing it |
| Authentication returns a web page | Wrong path, missing proxy, or rewrite placed after SPA fallback |
| Products open directly but fail on website | CORS origin, frontend request URL, preflight, deployed values |
| Products show empty | Empty API array or filters hide results; clear search and categories |
| Product images do not load | Image URL/public access/host; fetching JSON is a separate operation |
| Seller products disappear on reload | Missing backend owner fields; session IDs are not permanent ownership |
| Upload fails | File type/2 MiB limit, multipart fields, storage settings, response shape |
| Orders/newsletter/edit/delete unavailable | Missing integration; see section 9 |
| Changes do not appear online | Vercel production source commit, build result, settings, redeploy |
| Direct page refresh fails on another host | Serve `index.html` for frontend routes while preserving API routes |

## 13. Check a complete setup

1. Run `npm run lint` and `npm run build`; fix reported failures.
2. Confirm home shows no more than four real products and `/products` shows the collection.
3. Try category/search/sort, save a product, change a bag quantity, then reload to check persistence.
4. Deploy the backend email repair and configure its sender. Use your mailbox for signup, email receipt, OTP verification, and sign-in.
5. Confirm no session appears before successful sign-in; invalid codes/passwords must show errors.
6. Check a real seller opens `/seller`; buyers must not open seller/admin workspaces.
7. Provision your admin role, sign in again, and open `/admin` and its upload link.
8. Upload only a product you intend to publish; check its returned API record and storefront display.
9. Check a narrow mobile screen and an unknown URL's 404 screen.
10. When optional APIs are connected, test success and failure against their actual contracts.

Local or mocked browser tests establish frontend behavior. Receiving a real OTP needs a successful backend/provider delivery test; a frontend build cannot prove email delivery works.
