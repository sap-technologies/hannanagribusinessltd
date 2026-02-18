import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2340,
    proxy: {
      '/api': {
        target: 'http://localhost:1230',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:1230',
        changeOrigin: true,
      }
    }
  }
})
