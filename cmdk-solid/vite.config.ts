import solid from '@solidjs/vite-plugin'
import { defineConfig } from 'vite'
import { external } from './scripts/external.mjs'

export default defineConfig({
  plugins: [solid()],
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: true,
    emptyOutDir: false,
    lib: {
      entry: 'src/index.tsx',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: { external },
  },
})
