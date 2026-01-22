import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import baseAppConfig from '../../configs/vite/app.base'

// https://vite.dev/config/
export default defineConfig({
  ...baseAppConfig,
  css: {
    postcss: './postcss.config.js'
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          axios: [['default', 'axios']]
        }
      ],
      resolvers: [ElementPlusResolver()],
      dirs: [path.resolve(__dirname, 'src/utils')],
      dts: 'types/auto-imports.d.ts'
    }),
    Components({
      dirs: ['src/components/*'],
      extensions: ['vue', 'jsx'],
      dts: 'types/components.d.ts',
      deep: false,
      resolvers: [ElementPlusResolver()]
    })
  ]
})
