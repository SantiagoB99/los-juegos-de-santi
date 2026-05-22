import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    base: '/los-juegos-de-santi/',
    server: {
      proxy: {
        '/bgg-api': {
          target: 'https://boardgamegeek.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bgg-api/, '/xmlapi2'),
          headers: {
            Authorization: `Bearer ${env.VITE_BGG_TOKEN || ''}`,
          },
        },
      },
    },
  }
})
