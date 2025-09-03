import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          icons: ['react-icons'],
          ui: ['react-avatar'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps in production
  },
  server: {
    port: 3000,
  },
})
