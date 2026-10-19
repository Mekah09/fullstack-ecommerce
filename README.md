# Nook marketplace frontend

A responsive ecommerce frontend built with React, Tailwind CSS, React Icons, React Router, and Vite. The product catalog, image uploads, and sign-in connect to your backend. Other account, order, and admin actions have prepared integration contracts. The frontend contains no static product catalog or demo accounts.

## Run locally

Use Node.js 24, or Node.js 22.13 or newer, and npm.

```sh
npm ci
npm run dev
```

For a cloud workspace:

```sh
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

## Connect your API

The storefront loads products from `https://fullstack-ecommerce2.onrender.com/products` by default. No environment file is needed for that catalog. The backend returns `{ message, products: [...] }`; the adapter also accepts a product array directly. It maps your backend's `productName`, `productPrice`, `productImage`, and `productCategory` fields to the storefront. No local products are substituted when the API is empty or unavailable.

Local development and the Vercel deployment use same-origin proxies for the catalog (`/catalog-api/products`), uploads (`/catalog-api/add-product`), and sign-in (`/account-api/signin`). Vite forwards them during development; `vercel.json` forwards them on Vercel before the frontend route fallback. The latest inspected backend also enables CORS. Deploy the frontend configuration to apply these routes to `https://nook-pearl-six.vercel.app/`.

To override the feed or connect the remaining backend routes, copy `.env.example` to an ignored `.env.local`:

```dotenv
VITE_PRODUCTS_API_URL=https://fullstack-ecommerce2.onrender.com/products
VITE_ADD_PRODUCT_API_URL=https://fullstack-ecommerce2.onrender.com/addProduct
VITE_API_BASE_URL=
```

`VITE_PRODUCTS_API_URL` is a complete public GET URL. `VITE_ADD_PRODUCT_API_URL` is the complete POST URL for image uploads. Both defaults work without an environment file. Sign-in uses the confirmed `/user/signin` backend route through its proxy. `VITE_API_BASE_URL` is the independent base for the remaining prepared routes; leave it empty until those contracts are confirmed. It does not override the catalog, uploads, or sign-in. Restart Vite after changes, or set these values before running `npm run build` for deployment. Custom catalog/upload URLs use the Vite proxy locally, but are fetched directly in production and must allow the frontend origin through CORS. See [API.md](./API.md) for contracts and troubleshooting.

`VITE_*` values are visible to the browser. Do not put API secrets in them. Authentication uses a bearer token returned by your backend and kept in session storage. The public catalog request does not include that token.

## Pages

| URL         | Page                                                               |
| ----------- | ------------------------------------------------------------------ |
| `/`         | Home with up to four featured products from the API                |
| `/products` | Full API catalog with search, categories, sorting, and saved finds |
| `/account`  | Authenticated buyer's order history and saved products             |
| `/seller`   | Seller dashboard and inventory management                          |
| `/admin`    | Admin dashboard and seller approvals                               |
| `/404` and unknown paths | Page not found with navigation back to the store      |

Search and filters are stored in the products URL, for example `/products?q=vase` or `/products?saved=true`. Categories come from the fetched products. Product details and the shopping bag are reusable overlays available across pages. Prices display in Nigerian naira (NGN) using `en-NG` formatting; the frontend does not convert currencies. The not-found screen is a client route; Vercel's SPA fallback still responds with HTTP 200.

Sign in with an existing verified, active backend account. The backend determines the role; its `user` role maps to the buyer page. Seller and admin roles open their respective dashboards. The admin URL is [nook-pearl-six.vercel.app/admin](https://nook-pearl-six.vercel.app/admin); access requires an account provisioned as `admin` in the backend. There is no admin signup or demo login. Signup and OTP verification are not integrated with the current backend flow.

Sellers upload a name, naira price, category, and JPG/PNG/WebP image up to 2 MiB. Successful uploads appear immediately from the backend response. Because the backend does not return a product owner's ID, the seller view can track newly created products only during the current signed-in session; reliable inventory after reload requires backend ownership fields.

The bag and favorites retain product IDs in browser storage. Product details, prices, and stock come from the current API catalog when those IDs are restored. The current backend does not provide stock, so availability is shown as unknown and products can be added to the bag; checkout must validate availability on the backend. Orders are never created or saved as local demo records. Dashboard counts and charts use the available API data, with empty states when there is none.

## Where the code lives

```text
src/
  App.jsx                  # Routes and application composition
  main.jsx                 # Application entry point
  components/              # All reusable components directly here; no subfolders
    ShopProvider.jsx       # Shared marketplace state in a React class
    withShop.jsx           # Context.Consumer wrapper
    SiteHeader.jsx
    FeaturedProducts.jsx
    ProductCard.jsx
    AuthModal.jsx
    CartDrawer.jsx
    Dashboard.jsx
    ...
  pages/                   # Separate home, products, buyer, seller, admin pages
  context/ShopContext.jsx   # Shared context declaration
  services/api.jsx         # Backend requests and response validation
  data/siteContent.jsx     # Informational page copy; no product records
  utils/                   # Formatting and browser storage helpers
  styles/                  # Shared and page styles
public/images/             # Decorative home imagery and source attribution
```

All reusable component files live directly in `src/components`. React class components use lifecycle methods for state, fetching, dialogs, and scroll animations. Stateless components receive props or use `Context.Consumer`; application code uses no React hooks or router hooks. Application JavaScript source modules use `.jsx`; build-tool configuration keeps its standard `.js` filenames. CSS remains in stylesheets.

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. The included `vercel.json` forwards default catalog, upload, and sign-in requests to the API and returns `index.html` for frontend routes such as `/products` and `/seller`. Other hosts need equivalent proxy and frontend route rules, or direct API support. Vite's development proxy is not included in the static build.

There is no test runner configured. Signup/OTP, product editing/deletion, orders, and seller approvals still require confirmed integrations described in [API.md](./API.md). The frontend does not collect payment-card information or implement a payment provider.
