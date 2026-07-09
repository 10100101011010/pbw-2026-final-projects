import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the Campus Information Portal CMS
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
