import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import baseLibConfig from '../../configs/vite/lib.base'

export default defineConfig({
  ...baseLibConfig,
  plugins: [vue()],
  build: {
    ...baseLibConfig.build,
    lib: {
      ...baseLibConfig.build.lib,
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Components'
    }
  }
})
