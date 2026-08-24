import solid from '@solidjs/vite-plugin'
import { fileRoutes } from 'filesystem-routing/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solid({ start: true, ssr: false }), fileRoutes()],
  resolve: {
    alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
