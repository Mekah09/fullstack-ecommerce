# Nook marketplace frontend

A responsive ecommerce frontend built with React, Tailwind CSS, React Icons, React Router, and Vite. Products, authentication, inventory changes, orders, and seller approvals use your backend. The frontend contains no static product catalog or demo accounts.

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

Copy `.env.example` to an ignored `.env.local` and set your public backend base URL:

```dotenv
VITE_API_BASE_URL=https://your-api.example.com/api
```

Restart Vite after changing it. For a deployed build, set this value before running `npm run build`. The catalog requests `GET /products` and expects **an array of product objects**. Until the URL is supplied, the storefront shows a connection message and no products; it does not request a placeholder API or substitute products. Empty arrays and failed API requests have separate empty/error states. See [API.md](./API.md) for the endpoint contract.

`VITE_*` values are visible to the browser. Do not put API secrets in them. Authentication uses a bearer token returned by your backend and kept in session storage.

## Pages

| URL         | Page                                                               |
| ----------- | ------------------------------------------------------------------ |
| `/`         | Home with up to four featured products from the API                |
| `/products` | Full API catalog with search, categories, sorting, and saved finds |
| `/account`  | Authenticated buyer's order history and saved products             |
| `/seller`   | Seller dashboard and inventory management                          |
| `/admin`    | Admin dashboard and seller approvals                               |

Search and filters are stored in the products URL, for example `/products?q=vase` or `/products?saved=true`. Categories come from the fetched products. Product details and the shopping bag are reusable overlays available across pages. Buyer and seller registration require the backend; the backend determines the role at login. There is no admin signup or demo login.

The bag and favorites retain product IDs in browser storage. Product details, prices, and stock come from the current API catalog when those IDs are restored. Orders are never created or saved as local demo records. Dashboard counts and charts use the available API data, with empty states when there is none.

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

The production build is written to `dist/`. Configure your host to return `index.html` for frontend routes such as `/products` and `/seller` so direct links and reloads work. API requests go to the configured backend URL.

There is no test runner configured. Live integration with your backend requires its URL and the endpoint responses described in [API.md](./API.md). The frontend does not collect payment-card information or implement a payment provider.
