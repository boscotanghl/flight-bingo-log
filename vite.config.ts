import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/flight-bingo-log/',
  plugins: [react()],
  build: {
    outDir: 'docs', // Build to docs instead of dist
    assetsDir: './',
  },
})
