# TorchvEditor - 协同富文本编辑器

一个基于 Vue 3 和 Tiptap 构建的现代化富文本编辑器，支持实时协同编辑、虚拟滚动等高级特性。

## 技术架构

### 核心技术栈

- **前端框架**: Vue 3.5+ (Composition API + `<script setup>`)
- **类型系统**: TypeScript 5.9+
- **构建工具**: Vite 7.1+
- **富文本引擎**: Tiptap 3.7+ (基于 ProseMirror)
- **协同编辑**: Yjs + y-prosemirror
- **状态管理**: Pinia 3.0+
- **路由管理**: Vue Router 4.6+

### UI 框架与样式

- **组件库**: Ant Design Vue 4.2+
  - 自定义主题配置 (主色: #7090bd, 圆角: 16px)
  - 国际化支持 (中文/英文)
  - 组件前缀自定义 (torchv)
- **原子化 CSS**: Tailwind CSS 3.4+
  - 自定义色彩系统 (primary, blue, gray)
  - 响应式断点 (mobile < 767px)
  - 自定义网格系统
- **预处理器**: Less 4.4+
- **CSS 工具**: PostCSS + Autoprefixer

### 工具库

- **响应式工具**: @vueuse/core 13.9+
- **日期处理**: Day.js 1.11+
- **HTTP 请求**: Vue-request 2.0+
- **唯一标识**: UUID 13.0+

### 开发工具链

- **自动导入**: unplugin-auto-import
  - 自动导入 Vue/Router/Pinia/VueUse API
  - 自动导入 src/utils 工具函数
- **组件自动注册**: unplugin-vue-components
  - 自动注册 src/components 组件
- **代码规范**: 
  - ESLint 9.37+ (代码检查)
  - Prettier 3.5+ (代码格式化)
  - prettier-plugin-tailwindcss (Tailwind 类名排序)
- **类型检查**: vue-tsc 3.1+

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

浏览器将自动打开 `http://localhost:5173`

### 生产构建

```bash
pnpm build
```

### 预览构建产物

```bash
pnpm preview
```

## 技术亮点

### 1. 自动化开发体验

- ✅ API 自动导入，无需手动 import
- ✅ 组件自动注册，开箱即用
- ✅ TypeScript 类型自动生成

### 2. 现代化构建配置

- ⚡️ Vite 极速热更新
- 📦 按需加载优化
- 🔧 自定义别名配置

### 3. 完善的类型支持

- 🎯 全量 TypeScript 覆盖
- 📝 自动生成类型声明文件
- 🔍 智能代码提示

### 4. 灵活的主题系统

- 🎨 基于 Tailwind 的设计系统
- 🌈 可定制的色彩方案
- 📱 响应式设计适配

## 项目规范

- **代码风格**: 遵循 ESLint + Prettier 规范
- **命名规范**: 
  - 组件使用 PascalCase
  - 文件名使用 camelCase
  - 常量使用 UPPER_SNAKE_CASE
- **提交规范**: 建议使用 Conventional Commits

## License

Private
