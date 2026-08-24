import solid from '@solidjs/vite-plugin'
import { fileRoutes } from 'filesystem-routing/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solid({ start: true, ssr: true }), fileRoutes()],
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true },
})
