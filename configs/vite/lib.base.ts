import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'umd'],
      fileName: (format) => `[name].${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'pinia', 'vue-router', '@vueuse/core', 'dayjs', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'vue-router': 'VueRouter',
          '@vueuse/core': 'VueUse',
          dayjs: 'dayjs',
          'element-plus': 'ElementPlus'
        }
      }
    },
    sourcemap: true,
    minify: 'terser'
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
