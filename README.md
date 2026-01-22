# Ais Monorepo

基于 pnpm + Turborepo 的 Vue 3 工程，包含 PC 端应用与公共共享包，支持统一构建、类型检查与增量构建。

## 目录结构

```
.
├── apps
│   ├── pc            # PC 端应用
│   └── admin         # 管理端应用（占位）
├── packages
│   ├── pc-modules    # 业务模块（占位）
│   └── admin-modules # 业务模块（占位）
├── packages-shared   # 公共共享包
│   ├── components
│   ├── utils
│   ├── types
│   ├── assets
│   ├── styles
│   ├── pinia
│   ├── composables
│   └── validation
├── configs           # 复用配置（tsconfig/vite 等）
└── turbo.json        # Turborepo 任务配置
```

## 技术栈

- Vue 3 + Vite + TypeScript
- Pinia / Vue Router / Element Plus
- Tailwind CSS
- Turborepo + pnpm workspace

## 环境要求

- Node >= 22.14.0
- pnpm >= 10.8.0

## 快速开始

```bash
pnpm install
pnpm dev:pc
```

PC 端默认端口：`9527`。

## 常用脚本

- `pnpm dev:pc` 启动 PC 端开发
- `pnpm build:pc` 构建 PC 端
- `pnpm build:public` 构建所有共享包（packages-shared/*）
- `pnpm lint` 全量 lint
- `pnpm type-check` 全量类型检查

## 共享包说明

- `packages-shared/components`：Vue 组件库
- `packages-shared/utils`：通用工具
- `packages-shared/types`：共享类型定义

## 配置与环境变量

- Vite 全局环境变量：`VITE_API_BASE_URL`
- 变体环境文件可使用 `.env.*`（由 Turborepo 追踪）

## 备注

- `apps/admin` 与 `packages/*-modules` 目前为占位目录，可按需补充业务模块。
- 共享包构建依赖各自的 `tsconfig.json` 与 `vite.config.ts` 配置。

