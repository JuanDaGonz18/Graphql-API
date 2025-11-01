import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuración básica para desarrollo
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
