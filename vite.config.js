// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/los-juegos-de-santi/',
  server: {
    proxy: {
      '/bgg-api': {
        target: 'https://boardgamegeek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bgg-api/, '/xmlapi2'),
      },
    },
  },
})
