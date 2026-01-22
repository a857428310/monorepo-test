import { defineConfig } from 'vite'
import path from 'path'
import baseLibConfig from '../../configs/vite/lib.base'

export default defineConfig({
  ...baseLibConfig,
  build: {
    ...baseLibConfig.build,
    lib: {
      ...baseLibConfig.build.lib,
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Utils'
    }
  }
})
