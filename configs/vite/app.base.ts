import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  css: {
    postcss: path.resolve(process.cwd(), '../../postcss.config.js')
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@editor': path.resolve(process.cwd(), '../../packages-shared')
    }
  },
  optimizeDeps: {
    exclude: ['@editor/types']
  }
})
