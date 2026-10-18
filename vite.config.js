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

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/catalog-api/products': {
          target: productsUrl.origin,
          changeOrigin: true,
          rewrite: () => `${productsUrl.pathname}${productsUrl.search}`,
        },
      },
    },
  }
})
