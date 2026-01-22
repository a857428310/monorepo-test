你现在需要一份可直接落地的核心配置清单，包含**最终目录结构**、**复用基础配置**、**统一Vite模板**、**子包Vite配置**、**批量发版配置**等关键实施项，我会按「可复制、无冗余、聚焦落地」的原则整理，你可直接对照实施。

---

# 一、最终可落地目录结构（精简版，聚焦核心）
```
your-project/
├── apps/                        # 应用总入口
│   ├── pc/                      # PC端总应用
│   └── admin/                   # Admin端总应用
├── packages/                    # 可独立部署业务模块
│   ├── pc-modules/
│   │   ├── pc-home/
│   │   ├── pc-order/
│   │   └── pc-user/
│   └── admin-modules/
│       ├── admin-dashboard/
│       ├── admin-system/
│       └── admin-statistics/
├── packages-shared/             # 全局公共子包（精细化拆分）
│   ├── apis/
│   ├── assets/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── styles/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── types/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── components/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── utils/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── pinia/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── composables/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── validation/
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── configs/                     # 全局复用配置（核心）
│   ├── tsconfig/
│   │   ├── base.json            # TS基础配置（所有子包复用）
│   │   └── vue.json             # Vue项目TS配置
│   └── vite/
│       ├── lib.base.ts          # 公共子包Vite基础配置（库模式）
│       └── app.base.ts          # 应用/业务模块Vite基础配置
├── .github/
│   └── CODEOWNERS               # 子包负责人配置（自动审查）
├── package.json                 # 根依赖+全局脚本
├── pnpm-workspace.yaml          # Monorepo范围
├── turbo.json                   # 增量构建配置
└── .changeset/
    └── config.json              # 版本管理配置
```

---

# 二、核心复用配置（直接复制使用）
## 1. 全局TS基础配置（configs/tsconfig/base.json）
所有公共子包的tsconfig都继承此配置，减少冗余：
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "declaration": true, // 生成类型声明（公共子包必须）
    "declarationDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@your-project/*": ["../../packages-shared/*/src"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

## 2. 公共子包TS配置示例（packages-shared/utils/tsconfig.json）
所有公共子包的tsconfig格式统一，仅需继承基础配置：
```json
{
  "extends": "../../configs/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [{ "path": "../types" }] // 依赖types子包时添加
}
```

## 3. 全局Vite库模式基础配置（configs/vite/lib.base.ts）
所有公共子包（组件/工具/pinia等）的Vite配置都复用此模板：
```typescript
import { defineConfig } from 'vite'
import path from 'path'

// 公共子包通用Vite配置（库模式）
export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'umd'], // 输出ES模块和UMD模块
      fileName: (format) => `[name].${format}.js`
    },
    rollupOptions: {
      // 排除Vue核心依赖（避免打包重复）
      external: ['vue', 'pinia', 'vue-router', '@vueuse/core', 'dayjs', 'element-plus'],
      output: {
        // 全局变量映射（UMD模式）
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
    sourcemap: true, // 生成sourcemap，便于调试
    minify: 'terser' // 压缩产物
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'), // 子包内src别名
      '@your-project': path.resolve(process.cwd(), '../../packages-shared') // 公共子包别名
    }
  },
  optimizeDeps: {
    exclude: ['@your-project/types'] // 排除类型子包，避免预构建
  }
})
```

## 4. 公共子包Vite配置示例（packages-shared/components/vite.config.ts）
所有公共子包的Vite配置仅需修改「入口/名称」，其余复用基础配置：
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // 组件包需添加vue插件
import baseLibConfig from '../../../configs/vite/lib.base.ts'

export default defineConfig({
  ...baseLibConfig,
  plugins: [vue()], // 不同子包按需添加插件（如utils包无需vue插件）
  build: {
    ...baseLibConfig.build,
    lib: {
      ...baseLibConfig.build.lib,
      entry: path.resolve(__dirname, 'src/index.ts'), // 子包入口
      name: 'Components' // 子包全局变量名（大写开头）
    }
  }
})
```

## 5. utils子包Vite配置（packages-shared/utils/vite.config.ts）
非Vue组件类子包（utils/validation/pinia）无需vue插件：
```typescript
import { defineConfig } from 'vite'
import baseLibConfig from '../../../configs/vite/lib.base.ts'

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
```

---

# 三、批量发版/版本管理配置（核心落地项）
## 1. 根package.json（全局脚本+依赖）
```json
{
  "name": "your-project",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    // 公共子包批量操作
    "build:public": "turbo run build --filter=packages-shared/*",
    "lint:public": "turbo run lint --filter=packages-shared/*",
    "changeset:public": "pnpm changeset --filter=packages-shared/*", // 仅标记公共子包变更
    "version:public": "pnpm changeset version --filter=packages-shared/*", // 仅更新公共子包版本
    "publish:public": "pnpm changeset publish --filter=packages-shared/*", // 仅发布公共子包
    // 业务模块操作
    "dev:pc-home": "turbo run dev --filter=pc-home",
    "build:pc-home": "turbo run build --filter=pc-home",
    // 全局校验
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "dependencies": {
    "@vueuse/core": "^13.9.0",
    "dayjs": "^1.11.18",
    "element-plus": "^2.11.5",
    "pinia": "^3.0.3",
    "uuid": "^13.0.0",
    "vue": "^3.5.22",
    "vue-request": "^2.0.4",
    "vue-router": "^4.6.3"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@types/node": "^24.6.0",
    "@vitejs/plugin-vue": "^6.0.1",
    "@vue/tsconfig": "^0.8.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.37.0",
    "eslint-config-prettier": "8.6.0",
    "eslint-plugin-prettier": "^5.1.3",
    "less": "^4.4.2",
    "less-loader": "^12.3.0",
    "postcss": "^8.5.6",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.12",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.9.3",
    "unplugin-auto-import": "^20.2.0",
    "unplugin-vue-components": "^29.1.0",
    "vite": "^7.1.7",
    "vue-tsc": "^3.1.0",
    "turbo": "^2.0.0"
  }
}
```

## 2. .changeset/config.json（版本管理配置）
仅管理公共子包，忽略业务模块：
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false, // 手动提交版本变更，避免自动提交
  "fixed": [],
  "linked": [],
  "access": "restricted", // 私有包（公司内部复用）
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [
    "pc", "admin", "pc-home", "pc-order", "pc-user",
    "admin-dashboard", "admin-system", "admin-statistics"
  ]
}
```

## 3. pnpm-workspace.yaml（Monorepo范围）
```yaml
packages:
  - "apps/*"
  - "packages/**/*"
  - "packages-shared/*"
```

## 4. turbo.json（增量构建核心）
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*"],
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "outputs": ["dist/**"],
      "dependsOn": ["^build"], // 先构建依赖的子包
      "cache": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "outputs": []
    }
  },
  "globalEnv": ["VITE_API_BASE_URL"],
  "remoteCache": {
    "enabled": true // 开启远程缓存（团队共享构建结果）
  }
}
```

## 5. .github/CODEOWNERS（子包负责人配置）
自动触发对应负责人审查，避免漏审：
```
# 公共子包负责人
/packages-shared/assets/ @zhoudong
/packages-shared/styles/ @wushi
/packages-shared/types/ @zhengshi
/packages-shared/components/ @wangshi
/packages-shared/utils/ @fengshi
/packages-shared/pinia/ @chenshi
/packages-shared/composables/ @chushi
/packages-shared/validation/ @weishi

# 业务模块负责人
/packages/pc-modules/ @zhangsan @lisi
/packages/admin-modules/ @zhaoliu @qianba
```

---

# 四、实施注意事项（避坑核心）
## 1. 配置复用注意
- 所有公共子包的 `tsconfig.json` 必须开启 `declaration: true`（生成类型声明，否则业务模块引入会无类型提示）；
- Vite配置中 `external` 必须排除所有核心依赖（Vue/Pinia/ElementPlus等），避免打包重复导致体积过大；
- 子包别名 `@your-project` 必须指向 `packages-shared` 根目录，确保跨子包引用路径正确。

## 2. 批量发版注意
- 首次发版前需执行 `pnpm changeset init` 初始化changesets；
- 仅修改单个公共子包时，执行 `pnpm changeset:public` 仅标记该子包变更，避免全量版本更新；
- 发布前需确保所有子包已构建（`pnpm build:public`），且类型声明文件生成正常。

## 3. 开发调试注意
- 公共子包开发时，执行 `pnpm build:public --watch` 监听构建，业务模块可实时获取最新代码；
- 业务模块引入公共子包时，使用 `workspace:*` 版本（如 `"@your-project/utils": "workspace:*"`），确保引用本地最新代码；
- 避免循环依赖（如utils依赖composables，composables又依赖utils），可将公共逻辑抽离到types子包。

## 4. 构建性能注意
- 开启Turborepo远程缓存（`turbo login` + `turbo link`），团队共享构建结果，首次构建后后续构建耗时降低80%；
- 业务模块构建时，使用 `turbo run build --filter=...[origin/main]` 仅构建变更模块，避免全量构建。

---

# 五、实施步骤（按优先级）
1. 先创建目录结构 + 全局配置（configs/tsconfig + configs/vite）；
2. 初始化根package.json + pnpm-workspace.yaml + turbo.json；
3. 逐个创建公共子包（先做utils/types/components，这三个核心），配置package.json/tsconfig/vite.config；
4. 配置changesets + CODEOWNERS；
5. 迁移业务模块到packages/，配置依赖引用公共子包；
6. 测试批量构建/发版流程，验证跨子包引用是否正常。
