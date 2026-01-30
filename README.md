# Ais Monorepo

基于 **pnpm + Turborepo** 的 Vue 3 Monorepo 工程，包含 PC 端应用、管理端应用、业务模块包和公共共享包，支持统一构建、类型检查与增量构建。

## 📁 目录结构

```
.
├── apps/                      # 应用层（路由和页面）
│   └── web/                   # PC 端应用
│       ├── src/
│       │   ├── layouts/       # 布局组件
│       │   ├── views/         # 页面组件（商品、用户、仪表盘等）
│       │   ├── router/        # ⭐ 路由配置（统一管理所有路由）
│       │   └── main.ts        # 应用入口
│       └── package.json
│
├── packages/                  # 包层
│   ├── router/                # 共享路由模块（@ais/router）
│   │   └── src/index.ts       # 路由工厂函数、全局守卫、基础路由
│   │
│   └── web-modules/           # PC 端业务模块（纯业务逻辑）
│       ├── login/            # 登录模块（@ais/web-login）
│       │   ├── src/
│       │   │   ├── views/     # 登录页面组件
│       │   │   ├── api/       # 登录 API
│       │   │   └── types.ts   # 登录类型定义
│       │   └── package.json
│       │
│       └── goods/             # 商品模块（@ais/web-goods）
│           ├── src/
│           │   ├── views/     # 商品组件（表单对话框等）
│           │   ├── api/       # 商品 API
│           │   └── types.ts   # 商品类型定义
│           └── package.json
│
├── packages-shared/           # 公共共享包
│   ├── components/            # 通用组件（@ais/components）
│   ├── utils/                 # 通用工具（@ais/utils）
│   ├── types/                 # 共享类型（@ais/types）
│   ├── tailwind/              # Tailwind 配置（@ais/tailwind）
│   ├── pinia/                 # 全局状态（@ais/pinia）
│   ├── composables/           # 通用组合式函数
│   ├── validation/            # 通用校验规则
│   └── styles/                # 全局样式
│
├── configs/                   # 全局配置
│   ├── tsconfig/              # TypeScript 基础配置
│   └── vite/                  # Vite 基础配置
│
├── turbo.json                 # Turborepo 任务配置
├── pnpm-workspace.yaml        # pnpm workspace 配置
└── package.json               # 根包配置
```

## 🛠 技术栈

- **框架**: Vue 3 + Vite + TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI 库**: Element Plus
- **样式**: Tailwind CSS + Less
- **包管理**: pnpm workspace
- **任务编排**: Turborepo

## 🚀 快速开始

### 环境要求

- Node >= 22.14.0
- pnpm >= 10.8.0

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动 PC 端应用（端口 9527）
pnpm dev:web

# 启动管理端应用
pnpm dev:admin

# 启动所有应用
pnpm dev
```

### 构建

```bash
# 构建 PC 端
pnpm build:web

# 构建管理端
pnpm build:admin

# 构建所有应用和包
pnpm build:all
```

## 📦 核心设计理念

### ⭐ 关键原则：路由在应用层，业务逻辑在模块层

```
┌─────────────────────────────────────────────┐
│  应用层 (apps/web)                            │
│  ├── router/          ← 所有路由统一管理      │
│  ├── views/           ← 应用专属页面          │
│  └── layouts/         ← 布局组件             │
└─────────────────────────────────────────────┘
                    ↓ 依赖
┌─────────────────────────────────────────────┐
│  业务模块层 (packages/web-modules/*)          │
│  ├── views/           ← 页面组件              │
│  ├── api/             ← 业务 API             │
│  └── types.ts         ← 类型定义             │
│  ❌ 不包含路由配置                             │
└─────────────────────────────────────────────┘
                    ↓ 依赖
┌─────────────────────────────────────────────┐
│  共享包层 (packages-shared/*)                 │
│  ├── components/      ← 通用组件              │
│  ├── utils/           ← 工具函数              │
│  └── types/           ← 基础类型              │
└─────────────────────────────────────────────┘
```

### 1. 路由统一管理（应用层职责）

**✅ 推荐：所有路由在应用层统一配置**

```typescript
// apps/web/src/router/index.ts
const appRoutes = [
  {
    path: '/login',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: 'index',
        component: () => import('@ais/web-login/src/views/Login/index.vue')
      }
    ]
  }
]
```

**❌ 避免：业务模块包导出路由配置**

```typescript
// ❌ 不要在业务模块包中这样做
// packages/web-modules/login/src/router/index.ts
export const loginRoutes = [...] // ❌ 业务模块不应该包含路由
```

### 2. 业务模块包职责（纯业务逻辑）

业务模块包应该只包含：
- ✅ **页面组件**：可复用的 Vue 组件
- ✅ **业务 API**：与后端交互的接口函数
- ✅ **类型定义**：业务相关的 TypeScript 类型
- ❌ **路由配置**：由应用层负责
- ❌ **布局组件**：由应用层负责

**示例：商品模块包**

```typescript
// packages/web-modules/goods/src/index.ts
/**
 * @ais/web-goods
 * 只提供页面组件、API 和类型定义
 */

// 导出 API
export * from './api'

// 导出类型
export * from './types'

// 导出页面组件
export { default as GoodsFormDialog } from './views/FormDialog.vue'
```

### 3. 应用层如何使用业务模块

```vue
<!-- apps/web/src/views/Goods/List.vue -->
<script setup lang="ts">
// 从业务模块包导入 API、类型和组件
import { getGoodsListApi, deleteGoodsApi } from '@ais/web-goods/api'
import type { GoodsItem, GoodsListQuery } from '@ais/web-goods/types'
import { GoodsCategoryText } from '@ais/web-goods/types'
import { GoodsFormDialog } from '@ais/web-goods'

// 使用业务模块提供的功能
const fetchGoodsList = async () => {
  const res = await getGoodsListApi(searchForm)
  goodsList.value = res.records
}
</script>

<template>
  <GoodsFormDialog v-model="dialogVisible" @success="fetchGoodsList" />
</template>
```

### 4. 包命名规范

- **共享包**: `@ais/components`、`@ais/utils`、`@ais/types`、`@ais/router`
- **业务模块**: `@ais/web-login`、`@ais/web-goods`、`@ais/web-user`

### 5. 包引用方式

```typescript
// ✅ 推荐：使用包名引用
import { getGoodsListApi } from '@ais/web-goods/api'
import { GoodsFormDialog } from '@ais/web-goods'

// ❌ 避免：使用相对路径引用
import { getGoodsListApi } from '../../../packages/web-modules/goods/src/api'
```

## 🔧 新增业务模块

### 步骤 1: 创建业务模块包

```bash
mkdir -p packages/web-modules/user/src/{views,api,types}
```

### 步骤 2: 配置 package.json

```json
{
  "name": "@ais/web-user",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

### 步骤 3: 编写业务代码（不包含路由）

```typescript
// packages/web-modules/user/src/api/index.ts
export const getUserListApi = async (query: UserListQuery) => {
  // API 实现
}

// packages/web-modules/user/src/types.ts
export interface UserItem {
  id: string
  name: string
}

// packages/web-modules/user/src/index.ts
export * from './api'
export * from './types'
export { default as UserFormDialog } from './views/FormDialog.vue'
```

### 步骤 4: 在应用层配置路由

```typescript
// apps/web/src/router/index.ts
import { getUserListApi } from '@ais/web-user/api'

const appRoutes = [
  {
    path: '/user',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/User/List.vue')
      }
    ]
  }
]
```

## 📝 Turborepo 任务配置

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
```

## 🔍 常见问题

### 1. 业务模块包可以包含什么？

**答**：业务模块包可以包含：
- ✅ 页面组件（如商品表单对话框）
- ✅ 业务 API（如获取商品列表）
- ✅ 类型定义（如商品类型）
- ✅ 业务 hooks（如 useGoodsList）
- ❌ 路由配置（由应用层负责）
- ❌ 布局组件（由应用层负责）

### 2. Vite 无法识别 Monorepo 包？

确保应用端的 `package.json` 中正确声明依赖：

```json
{
  "dependencies": {
    "@ais/web-login": "workspace:*",
    "@ais/components": "workspace:*",
    "@ais/utils": "workspace:*"
  }
}
```

### 3. 修改共享包后应用端没有热更？

Vite 开发模式下应该会自动热更。如果没有，请检查：
- `vite.config.ts` 中是否正确配置了 `optimizeDeps.exclude`
- 共享包是否在 `pnpm-workspace.yaml` 中正确声明

## 📚 参考文档

- [pnpm workspace](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)
- [Vite](https://vitejs.dev/)
- [Vue 3](https://vuejs.org/)







# 前端代码规范
## 📋 一、基础编码规范
### 1. JavaScript/ES6 基础规范

- 变量声明：**禁止使用 `var`**，优先使用 `const`（不重新赋值的变量），仅在需要重新赋值时使用 `let`
- 函数定义：优先使用**箭头函数**（回调/短函数），复杂业务函数使用 `function` 声明（提升可读性）

- 对象/数组：优先使用**解构赋值**（获取对象属性/数组元素，减少临时变量）
  ```typescript
  // ✅ 推荐
  const { name, age } = user;
  const [first, second] = arr;
  // ❌ 避免
  const name = user.name;
  const first = arr[0];
  ```

- 对象字面量：使用**简洁语法**（属性名与变量名相同时省略值，方法省略 `function` 关键字）
  ```typescript
  // ✅ 推荐
  const obj = { name, age, sayHi() { console.log('hi'); } };
  // ❌ 避免
  const obj = { name: name, age: age, sayHi: function() { console.log('hi'); } };
  ```

- 数组操作：**禁止使用原始 for 循环**，优先使用数组方法（`map/filter/reduce/forEach`），纯遍历推荐 `for...of`

- 空值判断：使用**可选链（`?.`）**和**空值合并（`??`）**替代多层 `if` 判断，避免 `Cannot read property of undefined`
  ```typescript
  // ✅ 推荐
  const userName = user?.info?.name ?? '未知用户';
  // ❌ 避免
  const userName = user && user.info && user.info.name ? user.info.name : '未知用户';
  ```

- 逻辑处理：禁止多层嵌套 `if-else`，优先使用 `switch` 或逻辑扁平化（如提前 return 排除异常情况）

### 2. 命名规范（全工程统一，区分大小写/前缀）
#### 通用命名原则
- 语义化：命名需清晰表达用途，**禁止使用拼音/拼音首字母/无意义字符**（如 `data1/foo/bar/userList1`）
- 一致性：同一业务概念的命名全工程统一（如用户列表统一为 `userList`，而非 `userArr/userData`）如果要与后端对接，可以考虑前后端命名规范一致。
- 无歧义：避免缩写（通用缩写除外，如 `info`/`api`/`btn`），保证新成员能直接理解命名含义

#### 各类型命名规则
| 类型         | 命名方式       | 示例                     | 备注                     |
|--------------|----------------|--------------------------|--------------------------|
| 变量/常量    | 小驼峰         | `userList`/`totalPrice`  | 常量全大写+下划线（`const MAX_SIZE = 10`） |
| 函数/方法    | 小驼峰         | `getLoginInfo`/`formatTime` | 动宾结构，清晰表达行为   |
| 类/接口      | 大驼峰         | `UserService`/`GoodsItem` | TypeScript 专用          |
| 组件         | 大驼峰         | `Login`/`GoodsFormDialog` | Vue 组件，与文件名一致   |
| 路由名称     | 大驼峰         | `Login`/`UserDetail` | 与组件名对应，便于查找   |
| 包/模块      | 短横线命名     | `@ais/web-utils`/`@ais/components` | 与现有规范保持一致       |
| 文件名/目录名| 大驼峰（组件）/小驼峰（其他） | `OrderList.vue`/`api/index.ts` | 组件文件必须大驼峰       |
| Pinia 仓库   | 小驼峰+`Store` 后缀 | `userStore`/`cartStore` | 与 `defineStore` 名称一致 |
| 环境变量     | 全大写+下划线   | `VITE_API_BASE_URL`/`VITE_APP_ENV` | Vite 环境变量需以 `VITE_` 开头 |
| 事件方法     | 小驼峰+`handle` 前缀 | `handleLoginClick`/`handleFormSubmit` | 区分普通方法与事件处理   |

## 🎯 二、Vue 3 开发规范（Setup 语法糖优先）
工程统一使用 **`<script setup lang="ts">`** 语法糖（Vue 3 推荐写法），禁止使用 Options API，与 Composition API 保持一致，所有规范贴合工程现有 Monorepo 组件分层逻辑。

### 1. 单文件组件（SFC）规范
#### 文件结构（固定顺序，不可打乱）
```vue
<template>
  <!-- 模板内容，仅包含 UI 结构，无业务逻辑 -->
</template>

<script setup lang="ts">
  // 脚本内容，业务逻辑/数据处理/依赖导入
</script>

<style scoped lang="less">
  // 样式内容，组件专属样式
</style>
```

- 模板（`<template>`）：**仅保留纯 UI 结构**，禁止写入复杂表达式、循环/条件判断逻辑，复杂逻辑抽离到脚本层的计算属性/方法
- 样式（`<style>`）：
  - 必须添加 `scoped`（防止样式污染，全局样式统一放在 `packages-shared/styles/`）
  - 优先使用 Less 语法（工程已集成），`/deep/`/`:deep()` 仅在修改第三方组件样式时使用，且需添加注释说明使用原因
  - 全局样式变量统一引入自 `packages-shared/styles/variables.less`，禁止组件内单独定义通用变量

#### 模板语法规范
- 指令使用：
  - 绑定属性优先使用**简写**（`:src` 替代 `v-bind:src`，`@click` 替代 `v-on:click`，`#default` 替代 `v-slot:default`）
  - 条件渲染：互斥条件使用 `v-if/v-else-if/v-else`，频繁切换显示的内容使用 `v-show`
  - 列表渲染：`v-for` 必须绑定**唯一 `key`**，优先使用数据的唯一业务 ID，**禁止使用索引 `index`** 作为 key
    ```vue
    <!-- ✅ 推荐 -->
    <div v-for="item in userList" :key="item.id">{{ item.username }}</div>
    <!-- ❌ 避免 -->
    <div v-for="(item, index) in userList" :key="index">{{ item.username }}</div>
    ```

- 事件处理：
  - 内联事件仅写方法名，禁止写入任何逻辑（如 `@click="handleClick"`，而非 `@click="num++"`）
  - 事件传参清晰化，禁止在模板中做参数处理，复杂参数处理抽离到脚本层方法
- 模板内容：尽可能减少使用或不用多个根节点（Vue 3 支持但不推荐），统一使用单个根容器（如 `<div>`/`<section>`）包裹，提升结构一致性

### 2. Setup 脚本层规范
#### 导入/导出规则
- 导入顺序：**按类别严格排序**（外部依赖 → 第三方 UI 库 → 共享包 → 业务模块 → 本地组件/工具 → 样式），同类别按字母序排列，禁止无序导入
  ```typescript
  // ✅ 推荐导入顺序
  import { ref, computed, onMounted } from 'vue'; // 外部依赖
  import { ElMessage, ElTable } from 'element-plus'; // 第三方 UI 库
  import { formatTime, deepClone } from '@ais/utils'; // 共享包
  import { getLoginInfoApi } from '@ais/web-login/api'; // 业务模块
  import BasicLayout from '@/layouts/BasicLayout.vue'; // 本地组件
  import '@/styles/login.less'; // 本地样式
  ```

- 导出规则：`<script setup>` 中无需手动导出，通过**变量/方法直接暴露**给模板，禁止使用 `export default`/`export const`（特殊公共组件导出除外）
- 变量声明：脚本层变量按**功能分组**声明（响应式数据 → 计算属性 → 方法 → 生命周期钩子），禁止零散声明，提升代码可读性
### 脚本层变量按功能分组声明（示例）
严格遵循「响应式数据 → 计算属性 → 方法 → 生命周期钩子」的分组顺序，同组内按业务逻辑关联性排列，禁止零散穿插声明，以下是 Vue 3 `<script setup lang="ts">` 完整合规示例：
```vue
<template>
  <div class="goods-list">
    <!-- 模板仅使用脚本层暴露的变量/方法 -->
    <el-input v-model="searchKeyword" placeholder="请输入商品名称搜索" @change="fetchGoodsList" />
    <el-table :data="filterGoodsList" border stripe>
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="price" label="商品价格" :formatter="formatPrice" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
// 第一步：导入依赖（按规范顺序，此处省略，仅展示变量分组核心）
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGoodsListApi } from '@ais/web-goods/api'
import type { GoodsItem } from '@ais/web-goods/types'

// 👉 第一组：响应式数据（ref/reative，按「基础值 → 复杂对象 → 数组」排列）
// 基础类型响应式
const searchKeyword = ref('')
const loading = ref(false)
// 复杂对象响应式
const pageConfig = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
// 数组类型响应式
const rawGoodsList = ref<GoodsItem[]>([])

// 👉 第二组：计算属性（派生状态，无副作用，按「使用频率 → 依赖层级」排列）
// 基础派生：根据搜索关键词过滤商品
const filterGoodsList = computed(() => {
  if (!searchKeyword.value) return rawGoodsList.value
  return rawGoodsList.value.filter(item => item.name.includes(searchKeyword.value))
})
// 依赖其他计算属性：过滤后的商品总数
const filterGoodsTotal = computed(() => filterGoodsList.value.length)

// 👉 第三组：方法/函数（按「业务主逻辑 → 辅助工具 → 事件处理」排列，动宾结构命名）
// 业务主逻辑：获取商品列表（核心异步方法）
const fetchGoodsList = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getGoodsListApi({
      keyword: searchKeyword.value,
      pageNum: pageConfig.pageNum,
      pageSize: pageConfig.pageSize
    })
    rawGoodsList.value = res.records
    pageConfig.total = res.total
  } catch (err) {
    ElMessage.error('获取商品列表失败，请稍后重试')
    console.error('商品列表请求异常：', err)
  } finally {
    loading.value = false
  }
}

// 辅助工具方法：格式化商品价格（纯工具，无业务耦合）
const formatPrice = (row: GoodsItem) => {
  return `¥ ${row.price.toFixed(2)}`
}

// 事件处理方法：重置搜索条件（配合重置按钮使用，此处仅示例）
const resetSearch = () => {
  searchKeyword.value = ''
  pageConfig.pageNum = 1
  fetchGoodsList()
}

// 👉 第四组：生命周期钩子（按 Vue 3 执行顺序排列：onMounted → onUpdated → onUnmounted 等）
// 挂载时执行：初始化加载商品列表
onMounted(() => {
  console.log('商品列表组件挂载')
  fetchGoodsList()
})

// 卸载时执行：清理副作用（如定时器、事件监听，此处仅示例）
onUnmounted(() => {
  console.log('商品列表组件卸载')
  rawGoodsList.value = [] // 清理响应式数据，避免内存泄漏
})
</script>
```

### 核心分组说明
1. **响应式数据组**：集中存放所有 `ref`/`reactive` 声明的响应式变量，同类型内按「业务关联性」排列（如搜索相关、分页相关、数据列表相关各自归类），便于快速查找和维护所有可响应状态；
2. **计算属性组**：仅存放 `computed` 派生状态，保证无任何副作用（不发起请求、不修改原数据），按「使用频率高低」或「依赖层级」排列（基础计算属性在前，依赖其他计算属性的在后）；
3. **方法组**：所有自定义函数/方法集中存放，按「业务重要性」分类（核心业务逻辑在前，辅助工具/事件处理在后），保持动宾结构命名规范，便于快速定位业务处理逻辑；
4. **生命周期钩子组**：严格按 Vue 3 原生执行顺序排列（`onMounted` → `onUpdated` → `onBeforeUnmount` → `onUnmounted` 等），钩子内仅做「初始化执行」或「副作用清理」，复杂逻辑调用外部方法，保证钩子代码简洁。

### 反例（禁止零散声明）
以下是**错误示范**，变量零散穿插声明，可读性极差，禁止使用：
```typescript
// ❌ 错误：响应式数据和方法穿插
const searchKeyword = ref('')
const fetchGoodsList = async () => { /* ... */ } // 方法插在响应式数据中间
const loading = ref(false)
// ❌ 错误：计算属性插在方法中间
const filterGoodsList = computed(() => { /* ... */ })
const formatPrice = (row: GoodsItem) => { /* ... */ }
// ❌ 错误：生命周期钩子插在计算属性和方法之间
onMounted(() => { fetchGoodsList() })
const pageConfig = reactive({ pageNum: 1, pageSize: 10 })
```


#### 响应式开发规范
- 优先使用**组合式响应式 API**：基础类型/简单独立对象使用 `ref`，复杂状态集/关联对象使用 `reactive`，派生状态统一使用 `computed`
- 禁止混合使用 Vue 2 风格响应式 API，彻底摒弃 `data`/`props` 选项式写法
- `computed` 使用严格原则：
  - 仅用于**无副作用的派生状态**（基于现有响应式数据计算，不修改原数据、不发起请求）
  - 充分利用缓存特性，替代模板中重复的表达式和组件中多次调用的无参方法
  - 只读计算属性优先使用简写，需双向修改的派生状态使用完整 `get/set` 写法
    ```typescript
    // ✅ 推荐：只读计算属性
    const totalAmount = computed(() => cartList.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
    // ✅ 推荐：可写计算属性
    const fullName = computed({
      get: () => `${firstName.value} ${lastName.value}`,
      set: (val) => {
        const [first, last] = val.split(' ');
        firstName.value = first;
        lastName.value = last;
      }
    });
    ```

- 响应式解构：解构 `reactive` 定义的对象时，必须使用 `toRefs`/`toRef` 保持响应式，禁止直接解构
  ```typescript
  // ✅ 推荐
  const user = reactive({ name: '张三', age: 20 });
  const { name, age } = toRefs(user); // 多属性解构
  const name = toRef(user, 'name'); // 单个属性解构
  // ❌ 避免：直接解构失去响应式
  const { name, age } = user;
  ```

- 生命周期钩子：按 Vue 3 执行顺序调用，钩子内逻辑单一，复杂初始化逻辑抽离为独立方法调用

### 3. 组件开发规范
#### 组件设计核心原则
- 单一职责：一个组件仅负责**一个核心功能**（如 `Login` 仅负责登录表单展示与基础操作，`GoodsFormDialog` 仅负责商品表单的编辑与提交）
- 可复用性：`packages/web-modules/*/src/views/` 下的业务组件需保证**低耦合、无应用层依赖**，可在多个页面复用
- 单向数据流：严格遵循 props 单向传递规则，子组件**禁止直接修改 props**，需通过 `emit` 触发事件通知父组件修改
- 依赖分层：组件仅依赖自身层级及下层包（应用层组件依赖业务模块组件，业务模块组件依赖共享包组件），禁止跨层/反向依赖

#### 组件通信优先级
严格遵循以下优先级，禁止使用事件总线（如 `mitt`），减少全局状态滥用：
`props + emit`（父子组件）→ `provide + inject`（跨层级组件，如布局与页面、表单与子项）→ Pinia（全局共享状态）→ 路由参数（页面间通信）

#### Props/Emits 严格规范
- Props：必须**显式声明类型**，非必传属性必须添加默认值，必要时添加自定义校验，使用 `camelCase` 命名（模板中自动转为 `kebab-case`，无需手动修改），添加清晰的描述注释
  ```typescript
  // ✅ 推荐
  const props = defineProps({
    username: {
      type: String,
      required: true,
      description: '用户名'
    },
    pageSize: {
      type: Number,
      default: 10,
      description: '分页每页展示条数'
    },
    status: {
      type: [String, Number],
      default: 'all',
      validator: (val: string | number) => ['all', 'active', 'inactive', 0, 1].includes(val),
      description: '用户筛选状态：all-全部，active-活跃，inactive-非活跃，0/1-兼容数字类型'
    }
  });
  ```

- Emits：必须**显式声明**（使用 `defineEmits` 泛型写法），明确指定事件参数类型，事件名使用**kebab-case**（与模板调用保持一致），禁止隐式触发事件
  ```typescript
  // ✅ 推荐
  const emit = defineEmits<{
    (e: 'login-success', token: string): void;
    (e: 'page-change', pageNum: number, pageSize: number): void;
    (e: 'search', query: Record<string, any>): void;
  }>();
  // 触发事件
  emit('login-success', props.token);
  ```

- 插槽（Slot）：使用具名插槽替代匿名插槽，复杂组件插槽添加默认内容，插槽作用域属性使用 `camelCase` 命名

#### 组件复用与抽象规范
- 通用基础组件：无业务关联的通用组件（如按钮、输入框、空状态、分页）统一抽离到 `packages-shared/components/`，供全工程复用
- 业务通用组件：与具体业务相关但可复用的组件（如 `UserCard`/`GoodsCard`）抽离到对应业务模块包，仅在业务内复用
- 复杂复用逻辑：优先使用**组合式函数（Composables）**抽离（统一放在 `packages-shared/composables/`），禁止使用高阶组件（Vue 3 官方推荐组合式函数替代）
  ```typescript
  // 示例：通用分页组合式函数（packages-shared/composables/usePagination.ts）
  export const usePagination = (defaultPage = 1, defaultSize = 10) => {
    const pageNum = ref(defaultPage);
    const pageSize = ref(defaultSize);
    const total = ref(0);

    // 重置分页
    const resetPagination = () => {
      pageNum.value = defaultPage;
      pageSize.value = defaultSize;
      total.value = 0;
    };

    // 分页变化回调
    const onPageChange = (p: number, s: number) => {
      pageNum.value = p;
      pageSize.value = s;
    };

    return { pageNum, pageSize, total, resetPagination, onPageChange };
  };

  // 组件中快速使用
  const { pageNum, pageSize, total, resetPagination, onPageChange } = usePagination();
  ```

### 4. Pinia 状态管理规范（@ais/pinia）
基于工程现有 `@ais/pinia` 共享包，统一状态管理规范，避免状态混乱和滥用。
- 仓库划分原则：按**业务域垂直划分**（如 `userStore`/`loginStore`/`cartStore`/`goodsStore`），禁止单仓库管理所有业务状态，单个仓库状态不超过20个
- 仓库存放位置：
  - 全局共享状态（如用户信息、全局配置、登录状态）：统一放在 `packages-shared/pinia/`
  - 业务专属状态（如用户信息筛选条件、商品详情缓存）：放在对应业务模块包（如 `@ais/web-login/src/store/`）
- 状态操作严格规则：
  - 禁止组件直接修改 Pinia 仓库状态，**所有状态修改必须通过仓库的 actions 方法**（统一状态修改入口，便于调试、日志记录和权限控制）
  - 所有异步逻辑（如 API 请求、定时器）必须放在仓库的 `actions` 中，组件仅调用 actions，不处理任何异步操作和异常捕获
  - 派生状态统一使用仓库的 `getters`（与组件 `computed` 一致，具备缓存特性，基于仓库状态派生）
  - 同步 actions 负责纯状态修改，异步 actions 负责业务逻辑（请求+状态更新），禁止混合编写
- 仓库定义标准示例：
  ```typescript
  // packages-shared/pinia/src/userStore.ts
  import { defineStore } from 'pinia';
  import { getUserInfoApi, loginApi } from '@ais/web-user/api';
  import type { IUserInfo, ILoginForm } from '@ais/web-user/types';
  import { ElMessage, ElMessageBox } from 'element-plus';

  export const useUserStore = defineStore('user', {
    state: () => ({
      info: null as IUserInfo | null,
      token: localStorage.getItem('token') || '',
      isLoading: false, // 全局请求加载状态
      permissions: [] as string[] // 用户权限列表
    }),
    getters: {
      // 派生状态：是否登录
      isLogin: (state) => !!state.token && !!state.info,
      // 派生状态：用户名
      userName: (state) => state.info?.nickname || state.info?.username || '未知用户',
      // 派生状态：是否拥有某权限
      hasPermission: (state) => (perm: string) => state.permissions.includes(perm)
    },
    actions: {
      // 同步action：设置token并持久化
      setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
      },
      // 异步action：用户登录
      async login(form: ILoginForm) {
        this.isLoading = true;
        try {
          const res = await loginApi(form);
          this.setToken(res.data.token);
          ElMessage.success('登录成功');
          return true;
        } catch (err) {
          ElMessage.error('登录失败：账号或密码错误');
          console.error('登录接口异常：', err);
          return false;
        } finally {
          this.isLoading = false;
        }
      },
      // 异步action：获取用户信息和权限
      async fetchUserInfo() {
        if (!this.token) return;
        this.isLoading = true;
        try {
          const res = await getUserInfoApi();
          this.info = res.data.user;
          this.permissions = res.data.permissions;
        } catch (err) {
          ElMessage.error('获取用户信息失败，请重新登录');
          this.logout(); // 信息获取失败，强制登出
          console.error('用户信息接口异常：', err);
        } finally {
          this.isLoading = false;
        }
      },
      // 同步action：用户登出
      async logout() {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'question' });
        this.token = '';
        this.info = null;
        this.permissions = [];
        localStorage.removeItem('token');
        ElMessage.success('退出登录成功');
      }
    }
  });
  ```

- 组件使用仓库规范：组件中仅做仓库实例化和 actions 调用，不做任何状态修改和业务逻辑处理
  ```typescript
  // 组件中使用
  const userStore = useUserStore();
  // 调用异步action
  const handleLogin = async () => await userStore.login(loginForm);
  // 调用同步action
  const handleLogout = () => userStore.logout();
  // 使用getters派生状态
  const isLogin = computed(() => userStore.isLogin);
  ```

## 🔷 三、TypeScript 规范（全工程强制使用）
工程为纯 TypeScript 工程，**所有代码必须添加完整类型注解**，禁止随意使用 `any` 类型（特殊场景需添加详细注释说明），充分利用 TypeScript 静态类型校验能力，减少运行时错误，提升代码可维护性。

### 1. 基础类型使用规范
- 核心原则：**禁止使用 `any` 类型**（`any` 会完全失去 TypeScript 类型校验的意义，是类型规范的红线），替代方案：
  - 未知类型使用 `unknown`（需通过类型断言/类型守卫校验后再使用）
  - 函数无返回值明确声明为 `void`（而非 `any`/不声明）
  - 空值场景使用 `null/undefined`（工程 `tsconfig.json` 必须开启 `strictNullChecks` 严格空值检查）
  - 任意对象类型使用 `Record<string, any>`（仅在特殊场景，且需注释）
- 基础类型：优先使用 TypeScript 原生小写类型（`string/number/boolean/symbol`），**禁止使用 JavaScript 包装类型**（`String/Number/Boolean`）
- 数组类型：优先使用**泛型简写形式**（`string[]`/`IUserItem[]`），复杂嵌套场景可使用 `Array<T>`
- 元组类型：固定长度、固定类型的数组必须使用元组类型（`[string, number, boolean]`），并添加清晰的类型注解，禁止使用普通数组替代
- 枚举类型：业务中固定值集合（如登录状态、商品分类、接口返回码）必须使用 `enum` 定义，提升代码可读性和可维护性，禁止使用魔法值
  ```typescript
  // ✅ 推荐：使用枚举定义固定状态
  export enum LoginStatus {
    SUCCESS = 'success', // 登录成功
    FAILED = 'failed',   // 登录失败
    PENDING = 'pending', // 待验证
    LOCKED = 'locked'    // 账户锁定
  }
  // 使用枚举
  const currentStatus: LoginStatus = LoginStatus.SUCCESS;
  // ❌ 避免：使用魔法值
  const currentStatus = 'success';
  ```

- 字面量类型：单一固定值使用字面量类型（`type ButtonType = 'primary' | 'success' | 'warning'`），替代无意义的枚举

### 2. 接口/类型别名使用规范
- 接口（`interface`）：**专门用于定义对象结构**（如业务实体、API 请求/响应参数、组件 Props 结构），支持 `extends` 扩展和自动合并，适合需要持续扩展的对象类型
- 类型别名（`type`）：用于**基础类型组合、联合类型、元组类型、字面量类型**，不支持自动合并，适合一次性定义的复合类型
- 命名规则：
  - 接口：以**`I` 为前缀**（如 `IUserInfo`/`ILoginItem`/`IBaseResponse`）
  - 类型别名：以**`T` 为前缀**（如 `TLoginQuery`/`TButtonType`/`TPagination`）
  - 枚举：首字母大写，驼峰命名（如 `LoginStatus`/`GoodsCategory`）
- 存放位置：
  - 业务相关的接口/类型：放在对应业务模块包的 `types.ts` 文件中（如 `@ais/web-login/src/types.ts`）
  - 基础通用的接口/类型：放在 `packages-shared/types/` 中（如 `IBaseResponse`/`TPagination`）
- 基础通用接口封装：封装全工程通用的基础接口，减少重复定义（如 API 响应通用结构）
  ```typescript
  // packages-shared/types/src/base.ts 基础通用接口
  export interface IBaseResponse<T = any> {
    code: number;
    message: string;
    data: T;
    total?: number; // 分页总数
    success: boolean;
  }

  // @ais/web-login/src/types.ts 业务接口（继承基础接口）
  import { IBaseResponse } from '@ais/types';
  import { LoginStatus } from './enum';

  // 登录项接口
  export interface ILoginItem {
    id: string;
    username: string;
    password: string;
    status: LoginStatus;
    lastLoginTime: string;
    loginIp: string;
  }
  // 登录查询参数类型
  export type TLoginQuery = {
    keyword?: string;
    status?: LoginStatus | 'all';
    pageNum: number;
    pageSize: number;
    startTime?: string;
    endTime?: string;
  };
  // 登录响应接口（继承基础接口）
  export type ILoginResponse = IBaseResponse<{
    records: ILoginItem[];
    total: number;
  }>;
  ```

### 3. 函数类型规范
- 函数参数：**所有参数必须显式添加类型注解**，可选参数放在参数列表最后，添加默认值的参数自动为可选，禁止无类型注解的参数
- 函数返回值：**必须显式声明返回值类型**，无返回值声明为 `void`，异步函数必须声明为 `Promise<T>` 泛型类型，禁止依赖 TypeScript 自动推导
- 箭头函数规范：单个参数可省略括号，多个参数/无参数必须加括号，复杂函数（超过3行）显式声明返回值类型
- 函数命名：动宾结构，清晰表达函数行为（如 `getLoginInfo`/`formatTime`/`validateForm`），禁止无意义的命名（如 `handleData`/`processInfo`）
- 标准示例：
  ```typescript
  // ✅ 推荐：同步函数，显式声明参数和返回值
  const formatTime = (time: string | number): string => {
    // 实现逻辑
    return new Date(time).toLocaleString();
  };

  // ✅ 推荐：异步函数，返回Promise<T>
  const getLoginInfo = async (query: TLoginQuery): Promise<ILoginResponse> => {
    const res = await axios.get('/api/login/info', { params: query });
    return res.data;
  };

  // ✅ 推荐：可选参数+默认值
  const calculateSum = (a: number, b: number, c: number = 0): number => a + b + c;

  // ✅ 推荐：无返回值函数
  const showMessage = (text: string): void => {
    ElMessage.info(text);
  };
  ```

- 函数重载：仅在特殊复杂场景使用，普通场景使用联合类型替代，避免重载过多导致可读性下降

### 4. 类型断言/类型守卫规范
- 类型断言：仅在**开发人员明确知道变量具体类型**的场景下使用，禁止滥用类型断言绕过类型校验，推荐使用 `as` 关键字（与 JSX 语法兼容），禁止使用尖括号 `<T>` 形式
  ```typescript
  // ✅ 推荐：明确类型时的断言
  const res = await getUserInfoApi();
  const userInfo = res.data as IUserInfo;
  // ❌ 避免：滥用断言绕过校验
  const data = anyData as ILoginItem;
  ```

- 类型守卫：处理 `unknown` 类型时，**必须使用类型守卫缩小类型范围**，替代类型断言，提升代码安全性
  ```typescript
  // ✅ 推荐：自定义类型守卫
  const isString = (val: unknown): val is string => {
    return typeof val === 'string' && val.length > 0;
  };

  const isLoginItem = (val: unknown): val is ILoginItem => {
    return typeof val === 'object' && val !== null && 'id' in val && 'username' in val;
  };

  // 使用类型守卫
  const handleData = (data: unknown) => {
    if (isString(data)) {
      console.log(data.length); // 此时data被推断为string类型
    }
    if (isLoginItem(data)) {
      console.log(data.username); // 此时data被推断为ILoginItem类型
    }
  };
  ```

- 非空断言：仅在明确变量非 `null/undefined` 时使用 `!` 非空断言，禁止滥用（如 `data!.username`）

### 5. TSConfig 配置规范
- 配置分层：根目录 `configs/tsconfig/` 维护**基础 TS 配置**（`base.json`），所有应用/包通过 `extends` 继承基础配置，避免重复配置，保证全工程校验规则一致
- 严格模式：**必须开启严格模式**（`"strict": true`），该配置包含 `strictNullChecks`/`noImplicitAny`/`strictFunctionTypes`/`strictBindCallApply` 等核心严格校验规则，是 TypeScript 规范的基础
- 子包配置：应用层（`apps/*`）和包层（`packages/*/packages-shared/*`）的 `tsconfig.json` 仅配置**专属项**（如 `rootDir`/`outDir`/`baseUrl`/`paths`），基础规则全部继承自根配置
- 路径别名：每个应用/包的 `tsconfig.json` 中配置自身的路径别名（如 `@/*` 映射 `src/*`），与 Vite 配置的别名保持一致，避免路径错误
- 标准继承配置示例：
  ```json
  // apps/web/tsconfig.json
  {
    "extends": "../../configs/tsconfig/base.json",
    "compilerOptions": {
      "rootDir": "src",
      "outDir": "dist",
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"] // 与Vite配置一致
      },
      "lib": ["ES2021", "DOM", "DOM.Iterable"]
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist", "**/*.test.ts"]
  }
  ```

- 禁止子包修改基础严格规则：所有子包不得覆盖 `base.json` 中的严格模式配置，保证全工程类型校验的一致性

## 📦 四、Monorepo 工程化规范
基于工程现有 `pnpm + Turborepo` 架构，规范包管理、依赖管理、任务执行、路由管理，保障多模块协作的一致性、高效性，严格遵循“路由在应用层，业务逻辑在模块层”的核心设计理念。

### 1. 包管理规范（pnpm 专属）
- 包管理工具：**统一使用 pnpm** 管理所有依赖，**禁止使用 npm/yarn**，避免依赖树不一致、锁文件冲突、安装速度慢等问题
- 依赖安装入口：所有依赖必须在**根目录执行 `pnpm install`** 统一安装，**禁止在任何子包（apps/packages/*）单独执行 `pnpm install`**
- 依赖分层安装规则：
  - 全局公共依赖（如 Vue/TypeScript/Vite/Element Plus/Pinia）：安装在**根目录 `package.json`**（使用 `-w` 标记，`pnpm add -D vue typescript vite -w`）
  - 子包专属依赖（如某应用的特殊插件、业务模块的专属工具）：安装在**对应子包的 `package.json`**，两种安装方式：
    1. 进入子包目录执行：`pnpm add xxx`
    2. 根目录执行过滤命令：`pnpm add xxx --filter @ais/web-login`
- 依赖版本管理：所有包使用**统一的依赖版本**，根目录锁定核心依赖版本，子包继承，**禁止子包单独指定不同版本的核心依赖**（如 Vue/TypeScript），避免版本冲突和类型错误
- 依赖更新：核心依赖的更新必须在根目录统一执行（`pnpm update xxx -w`），更新后需全工程测试，禁止子包单独更新
- 无用依赖清理：定期在根目录执行 `pnpm prune` 清理无用依赖，保持依赖树简洁

### 2. 包引用与导出规范
- 包引用原则：**必须使用包名别名引用**（如 `@ais/web-login`/`@ais/utils`/`@ais/components`），**禁止使用任何相对路径引用子包**（如 `../../../packages/web-modules/login`），确保引用路径统一、可维护
- 包导出规范：每个子包（`packages/*/packages-shared/*`）必须在 `package.json` 中配置 `main`（主入口）和 `types`（类型入口），且入口文件（如 `src/index.ts`）必须**统一导出**所有公共 API/组件/类型，禁止直接引用子包内部文件
  ```json
  // @ais/web-goods package.json 出口配置示例
  {
    "name": "@ais/web-goods",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "main": "src/index.ts", // 主入口文件
    "types": "src/index.ts" // 类型入口文件（与主入口一致）
  }
  ```

  ```typescript
  // @ais/web-goods src/index.ts 统一导出示例
  // 导出所有API
  export * from './api';
  // 导出所有类型/枚举
  export * from './types';
  export * from './enum';
  // 导出所有公共组件
  export { default as GoodsFormDialog } from './views/FormDialog.vue';
  export { default as GoodsList } from './views/List.vue';
  export { default as GoodsCard } from './views/Card.vue';
  ```

- 引用路径规范：
  - 共享包：`import { formatTime } from '@ais/utils'`
  - 业务模块包：`import { getGoodsListApi } from '@ais/web-goods/api'`
  - 业务模块组件：`import { GoodsFormDialog } from '@ais/web-goods'`
  - 应用层内部：`import BasicLayout from '@/layouts/BasicLayout.vue'`（使用 `@/*` 别名）
- 依赖层级规则：严格遵循**应用层 → 业务模块层 → 共享包层**的单向依赖顺序，**禁止任何反向引用和跨层引用**（如共享包依赖业务模块包、业务模块包依赖应用层、A业务模块依赖B业务模块）

### 3. 路由强化规范（与现有架构保持一致，补充细节）
- 核心原则：**所有路由配置必须统一放在应用层**（`apps/*/src/router/`），业务模块包（`packages/web-modules/*`）**禁止包含任何路由代码、路由配置、路由守卫**，严格遵守“路由在应用层，业务逻辑在模块层”的设计理念
- 路由懒加载：**所有路由组件必须使用懒加载**（`() => import(...)`），减少应用首屏加载体积，提升启动速度，禁止直接导入组件
- 路由命名规范：
  - 路由 `name`：必须**唯一**，使用大驼峰命名，与对应组件名完全一致（如 `Login` 路由对应 `Login` 组件）
  - 路由 `path`：使用**短横线命名（kebab-case）**，与业务模块对应，层级清晰（如 `/login/index`/`/goods/detail/:id`/`/user/info`），禁止使用驼峰/下划线
- 路由元信息：所有路由必须添加 `meta` 字段，包含页面标题、是否需要登录、权限标识等基础信息，便于全局守卫统一处理
- 路由参数：动态路由参数使用有意义的命名（如 `/:id`/`/:username`），禁止使用无意义的参数名（如 `/:param`），可选参数通过查询参数（`query`）传递
- 路由守卫：全局守卫（登录校验、权限校验、页面标题设置）统一放在应用层路由入口文件，业务模块不做任何路由相关的权限控制
- **路由跳转规范**：模板中进行路由跳转时，**必须使用 `<router-link>` 组件**，禁止使用 `<a>` 标签或编程式导航（`router.push`），以充分利用 Vue Router 的导航性能优化和特性
  ```vue
  <!-- ✅ 推荐：使用 router-link 进行路由跳转 -->
  <template>
    <!-- 基础用法：使用 path 跳转 -->
    <router-link to="/login/index">登录</router-link>

    <!-- 推荐：使用命名路由跳转（更灵活，路由修改时无需改代码） -->
    <router-link :to="{ name: 'Login' }">登录</router-link>

    <!-- 带查询参数跳转 -->
    <router-link :to="{ name: 'GoodsDetail', params: { id: goods.id } }">
      查看商品详情
    </router-link>

    <!-- 带查询参数跳转 -->
    <router-link :to="{ path: '/login/index', query: { redirect: '/dashboard' } }">
      登录后跳转
    </router-link>

    <!-- 动态绑定跳转 -->
    <router-link :to="item.path">{{ item.title }}</router-link>

    <!-- 自定义标签名（默认为 <a>） -->
    <router-link to="/dashboard" custom v-slot="{ navigate }">
      <button @click="navigate">跳转到控制台</button>
    </router-link>
  </template>

  <!-- ❌ 避免：使用 a 标签进行路由跳转（会导致页面刷新，丢失应用状态） -->
  <template>
    <a href="/login/index">登录</a> <!-- ❌ 页面会刷新 -->
    <div @click="() => router.push('/login/index')">登录</div> <!-- ❌ 无法享受 router-link 的优化 -->
  </template>
  ```

  **为什么必须使用 `<router-link>`？**
  - **性能优化**：自动处理点击事件，触发客户端路由跳转，避免页面完全刷新
  - **SEO 友好**：渲染为 `<a>` 标签，搜索引擎可正常爬取
  - **可访问性**：支持键盘导航（Tab 键聚焦、Enter 键激活）、屏幕阅读器等辅助技术
  - **类型安全**：在 TypeScript 中提供完整的类型提示和校验

  **编程式导航使用场景**（仅在以下场景使用 `router.push`）：
  - 需要在跳转前执行业务逻辑（如表单校验、数据保存）
  - 需要根据异步请求结果决定跳转目标
  - 需要在跳转时传递复杂状态（`router.push({ path: '/target', state: { data } })`）
  ```typescript
  // ✅ 推荐：需要业务逻辑时使用编程式导航
  const handleSaveAndJump = async () => {
    const valid = await formRef.value?.validate()
    if (!valid) return

    await loginApi(formData)
    ElMessage.success('登录成功')
    router.push({ name: 'Dashboard' })
  }
  ```


- 标准路由配置示例：
  ```typescript
  // apps/web/src/router/index.ts
  import { createRouter, createWebHistory } from '@ais/router'; // 共享路由工厂函数
  import BasicLayout from '@/layouts/BasicLayout.vue';
  import Login from '@/views/Login/index.vue';
  import { useUserStore } from '@ais/pinia'; // 全局状态

  // 应用路由配置
  const routes = [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { title: '系统登录', requiresAuth: false, keepAlive: false }
    },
    {
      path: '/',
      component: BasicLayout,
      meta: { requiresAuth: true, keepAlive: false },
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard/index.vue'),
          meta: { title: '控制台', requiresAuth: true, permission: 'dashboard:view' }
        },
        {
          path: 'login/index',
          name: 'Login',
          component: () => import('@ais/web-login/src/views/Login/index.vue'),
          meta: { title: '登录', requiresAuth: true, permission: 'login:view', keepAlive: true }
        },
        {
          path: 'goods/detail/:id',
          name: 'GoodsDetail',
          component: () => import('@ais/web-goods/src/views/Detail/index.vue'),
          meta: { title: '商品详情', requiresAuth: true, permission: 'goods:detail' }
        },
        {
          path: 'user/info',
          name: 'UserInfo',
          component: () => import('@ais/web-user/src/views/Info/index.vue'),
          meta: { title: '个人中心', requiresAuth: true, permission: 'user:info' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/404/index.vue'),
      meta: { title: '页面不存在', requiresAuth: false }
    }
  ];

  // 创建路由实例
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: (to, from, savedPosition) => {
      // 路由切换滚动到顶部
      return savedPosition || { top: 0 };
    }
  });

  // 全局前置守卫：登录校验 + 权限校验 + 页面标题
  router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - Ais 管理系统`;
    }

    const userStore = useUserStore();
    // 无需登录的路由，直接放行
    if (!to.meta.requiresAuth) {
      next();
      return;
    }

    // 未登录，跳转到登录页
    if (!userStore.isLogin) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }

    // 已登录，权限校验（无权限标识的路由直接放行）
    if (!to.meta.permission || userStore.hasPermission(to.meta.permission as string)) {
      next();
    } else {
      // 无权限，跳转到403页面
      next({ name: 'Forbidden' });
    }
  });

  export default router;
  ```

### 4. Turborepo 任务执行规范
- 任务执行入口：**统一使用 Turborepo 执行所有工程任务**（`dev/build/type-check`），**禁止在任何子包单独执行 `vite dev`/`vite build`/`tsc`**，确保 Turborepo 的增量构建、依赖顺序、缓存机制生效
- 任务命令：所有任务通过**根目录 `package.json` 中的脚本命令**统一执行，禁止自定义命令，保持团队操作一致
  ```bash
  # 开发环境
  pnpm dev:web # 仅启动PC端应用（增量构建，仅编译相关依赖）
  pnpm dev:admin # 仅启动管理端应用
  pnpm dev # 启动所有应用
  # 构建打包
  pnpm build:web # 仅构建PC端应用
  pnpm build:admin # 仅构建管理端应用
  pnpm build:all # 构建所有应用和包（按依赖顺序执行）
  # 类型校验
  pnpm type-check # 全工程类型校验（依赖已构建的包）
  ```

- 增量构建与缓存：充分利用 Turborepo 的**增量构建**和**缓存机制**，修改某个子包后，仅重新编译该子包及其依赖的包，大幅提升构建速度，**禁止手动删除 `node_modules/.turbo` 缓存目录**（除非缓存异常）
- 子包任务配置：新增子包后，必须在子包的 `package.json` 中配置与工程一致的脚本命令（`dev/build/type-check`），确保 Turborepo 能识别并执行该子包的任务
  ```json
  // 任意子包 package.json 脚本配置示例
  {
    "scripts": {
      "dev": "vite", // 开发服务
      "build": "vite build", // 构建打包
      "type-check": "tsc --noEmit" // 类型校验（不生成编译文件）
    }
  }
  ```

- 任务依赖：遵循 Turborepo 任务依赖规则，`build`/`type-check` 任务依赖上游包的同名任务（`^build`/`^type-check`），确保构建/校验顺序正确
- 构建产物：所有应用/包的构建产物统一输出到自身的 `dist` 目录，禁止修改输出目录，便于部署和管理
