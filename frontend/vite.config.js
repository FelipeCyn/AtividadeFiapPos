import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = process.env.DOCKER_ENV === 'true'
  ? 'http://backend:3000'
  : 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
