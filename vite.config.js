import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mapping-mbg-bandung/',
  plugins: [react()],
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl'
    }
  },
  define: {
    global: 'window',
  }
})