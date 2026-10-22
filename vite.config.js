import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  const productsUrl = new URL(
    env.VITE_PRODUCTS_API_URL?.trim() ||
      'https://fullstack-ecommerce2.onrender.com/products',
  )
  const addProductUrl = new URL(
    env.VITE_ADD_PRODUCT_API_URL?.trim() ||
      'https://fullstack-ecommerce2.onrender.com/addProduct',
  )

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/catalog-api/products': {
          target: productsUrl.origin,
          changeOrigin: true,
          rewrite: () => `${productsUrl.pathname}${productsUrl.search}`,
        },
        '/catalog-api/add-product': {
          target: addProductUrl.origin,
          changeOrigin: true,
          rewrite: () => `${addProductUrl.pathname}${addProductUrl.search}`,
        },
        '/account-api/signin': {
          target: 'https://fullstack-ecommerce2.onrender.com',
          changeOrigin: true,
          rewrite: () => '/user/signin',
        },
        '/account-api/signup': {
          target: 'https://fullstack-ecommerce2.onrender.com',
          changeOrigin: true,
          rewrite: () => '/user/signup',
        },
        '/account-api/verifyOTP': {
          target: 'https://fullstack-ecommerce2.onrender.com',
          changeOrigin: true,
          rewrite: () => '/user/verifyOTP',
        },
      },
    },
  }
})
