# Nook marketplace frontend

A responsive ecommerce frontend built with React, Tailwind CSS, React Icons, React Router, and Vite. It runs independently of a backend with demo accounts, products, and checkout. No real payment or email subscription is created in demo mode.

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

## Pages

| URL         | Page                                                                  |
| ----------- | --------------------------------------------------------------------- |
| `/`         | Home: hero, four featured products, maker story, newsletter           |
| `/products` | Full collection with search, categories, sorting, and saved finds     |
| `/account`  | Buyer order history and saved products; guest orders also appear here |
| `/seller`   | Seller dashboard and inventory management                             |
| `/admin`    | Admin dashboard and marketplace previews                              |

Search and filters are stored in the products URL, for example `/products?category=Furniture`, `/products?q=vase`, or `/products?saved=true`. Links support browser back/forward navigation and direct reloads. Product details and the shopping bag remain reusable overlays available from any page.

Register a buyer or seller demo identity using a sample password of at least eight characters. Passwords are never saved or verified in demo mode. **Explore admin demo** in the account dialog opens the admin workspace. Sellers can create, edit, and delete their own products, using an image URL or an existing `/images/...` path. Cart, favorites, demo inventory, identities, and orders persist in this browser.

Dashboard charts, sample order tables, seller approvals, and shop settings are frontend previews. The newsletter is also a preview. Real authentication, authorization, payments, and live dashboard data need the backend.

## Where the code lives

`src/App.jsx` only defines the routes. Each page composes smaller components; shared shopping state lives in focused hooks rather than page files.

```text
src/
  App.jsx                  # Router and page definitions
  pages/                   # Home, products, buyer, seller, admin, and 404 pages
  components/
    layout/                # Header, footer, app layout, workspace, overlay host
    home/                  # Hero, benefits, featured finds, makers, newsletter
    products/              # Product cards, grids, filters, results, details
    account/               # Buyer order history and saved finds
    auth/                  # Sign-in and signup dialog
    cart/                  # Shopping bag drawer
    checkout/              # Checkout, address form, summary, confirmation
    dashboard/             # Inventory, stats, chart, tables, settings, dialogs
    ui/                    # Shared modal, close button, toast
  context/                 # Shop provider and context
  hooks/                   # Auth, catalog, cart, orders, storage, scroll reveal
  services/api.js          # Backend adapter and local demo implementation
  data/                    # Demo products and site content
  utils/                   # Currency formatting and browser storage
  styles/                  # Shared and feature-specific stylesheets
public/images/             # Local photography and source attribution
```

Feature components keep their own smaller stylesheets. `App.css`, `dashboard.css`, and `commerce-overlays.css` are import manifests.

## Connect your API

Copy `.env.example` to an ignored `.env.local`, then set the public backend base URL:

```dotenv
VITE_API_BASE_URL=https://your-api.example.com/api
```

Restart Vite after changing it. Leave it empty for demo mode. `VITE_*` values are visible to the browser; never put secrets there. See [API.md](./API.md) for endpoints, data shapes, CORS, and backend authorization requirements.

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. When hosting it, configure your server to return `index.html` for frontend routes such as `/products` and `/seller`; this is required for direct links and page reloads with BrowserRouter. API requests should still go to your backend URL.

There is no test runner configured. Browser checks cover the four-product home page, full catalog, URL filters and navigation, buyer checkout and persistence, seller inventory CRUD, admin demo, keyboard dialogs, and mobile layouts.
