import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    // Optional: Forces Vite to use this port and fail if it's already in use
    // strictPort: true, 
  },
})