# Nook marketplace frontend

A responsive ecommerce frontend built with React, Tailwind CSS, React Icons, and Vite. It includes a home and lifestyle storefront, buyer accounts, seller inventory management, and an admin workspace. Scroll animations use the browser's Intersection Observer and respect reduced-motion preferences.

This project runs independently of a backend with clearly marked demo accounts and checkout. No real accounts, payments, shipping, or email subscriptions are created in demo mode.

## Run locally

Use Node.js 24, or a compatible Node.js 22 release (22.13 or newer), and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To expose the development server in a cloud workspace:

```sh
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

## Explore the frontend

- Browse and search products, filter by category, sort prices and ratings, and save favorites.
- Open a product to choose a finish and quantity, add it to your bag, and place a demo order.
- Register or sign in with a buyer or seller demo identity using a sample password of at least eight characters. Demo passwords are never saved or verified.
- Sellers can create, edit, and delete their own local inventory. Start with an empty shop and add a product with an image URL or an existing `/images/...` path.
- Use **Explore admin demo** in the account dialog to preview the admin workspace. Admin registration is not offered.

Seller and admin charts, order tables, seller applications, approvals, and shop settings are interface previews with sample data or session-only state. Product changes and buyer checkout orders persist locally. The newsletter form is also a frontend preview.

## Connect your API

Create an ignored `.env.local` file in the project root:

```dotenv
VITE_API_BASE_URL=https://your-api.example.com/api
```

Restart Vite after changing it. Leave the variable unset to use demo mode. Vite exposes `VITE_*` values to the browser; use only a public API URL here. The adapter in `src/services/api.js` handles product CRUD, login, registration, current-user lookup, and order creation. See [API.md](./API.md) for request and response contracts and the backend work needed for production.

Connecting the API enables those adapter requests. It does not implement payment processing, dashboard analytics, seller approval endpoints, newsletter subscriptions, or account settings endpoints.

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. There is no test runner configured. Browser verification should cover signup/sign-in, role-specific dashboards, product CRUD, cart quantities and finishes, checkout, responsive navigation, and keyboard access.

## Project structure

| Path                                  | Purpose                                                       |
| ------------------------------------- | ------------------------------------------------------------- |
| `src/App.jsx`                         | Storefront, buyer account, checkout, and shared state         |
| `src/components/CommerceOverlays.jsx` | Account dialog, product details, and cart drawer              |
| `src/components/Dashboard.jsx`        | Seller and admin workspaces                                   |
| `src/data/products.js`                | Initial demo catalog                                          |
| `src/services/api.js`                 | Demo storage and backend request adapter                      |
| `public/images/`                      | Local product and lifestyle photography; attribution included |

Demo catalog, selected identity, cart, favorites, and checkout details are stored in the current browser. Identity selection is a preview, not authentication. Clear this site's browser data to reset demo records. Connected API access tokens are kept in session storage; backend authorization must enforce all account and ownership rules.
