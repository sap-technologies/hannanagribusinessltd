import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration that adapts to both development and production
// Uses environment variables when available, sensible defaults otherwise
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'http://localhost:1230'

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 2340,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  })
}

