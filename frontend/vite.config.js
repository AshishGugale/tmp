import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
   },
   server: {
    port: 8080,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
   },
})
