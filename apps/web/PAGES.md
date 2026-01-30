# Web 应用页面说明

## 已创建的页面

### 1. 仪表盘（Dashboard）
**路径**: `/`
**文件**: [apps/web/src/views/Dashboard/index.vue](apps/web/src/views/Dashboard/index.vue)

**功能**:
- 📊 数据统计卡片（总订单数、用户总数、商品总数、总收入）
- 📈 订单趋势图（支持周/月/年切换）
- 🍰 商品分类占比图
- 🔥 热门商品榜单
- 📋 最新订单列表

### 2. 商品管理

#### 2.1 商品列表
**路径**: `/goods/list`
**文件**: [apps/web/src/views/Goods/List.vue](apps/web/src/views/Goods/List.vue)

**功能**:
- 🔍 搜索过滤（商品名称、分类、状态）
- 📊 商品列表展示（支持分页）
- ➕ 新增商品
- ✏️ 编辑商品
- 🗑️ 删除商品

**表格字段**: ID、商品名称、分类、价格、库存、状态、创建时间

#### 2.2 商品详情
**路径**: `/goods/detail/:id`
**文件**: [apps/web/src/views/Goods/Detail.vue](apps/web/src/views/Goods/Detail.vue)

**功能**:
- 📝 商品详细信息展示
- ✏️ 编辑商品
- 🗑️ 删除商品

**详情字段**: 商品ID、名称、分类、价格、库存、状态、描述、创建时间

### 3. 用户管理

#### 3.1 用户列表
**路径**: `/user/list`
**文件**: [apps/web/src/views/User/List.vue](apps/web/src/views/User/List.vue)

**功能**:
- 🔍 搜索过滤（用户名、手机号、状态）
- 📊 用户列表展示（支持分页）
- 👁️ 查看用户详情
- ✏️ 编辑用户
- 🔄 启用/禁用账号

**表格字段**: ID、用户名、昵称、手机号、邮箱、角色、状态、注册时间

#### 3.2 用户详情
**路径**: `/user/detail/:id`
**文件**: [apps/web/src/views/User/Detail.vue](apps/web/src/views/User/Detail.vue)

**功能**:
- 👤 基本信息展示（头像、昵称、角色、状态）
- 📱 详细信息（手机号、邮箱、性别、生日、简介）
- 🔑 账号操作（编辑信息、重置密码、启用/禁用）
- 📊 最近登录记录（IP地址、登录地点、设备）

### 4. 订单管理
**路径**: `/order/list`
**来源**: [@ais/web-order](packages/web-modules/order) 业务模块包

**功能**:
- 🔍 搜索过滤（订单号、状态、时间范围）
- 📊 订单列表展示（支持分页）
- 👁️ 查看订单详情
- 🗑️ 删除订单

**订单状态**: 待付款、已付款、已发货、已完成、已取消

## 路由结构

```typescript
/                          → 仪表盘（Dashboard）
/goods/list                → 商品列表
/goods/detail/:id          → 商品详情
/user/list                 → 用户列表
/user/detail/:id           → 用户详情
/order/list                → 订单列表（来自业务模块）
/order/detail/:id          → 订单详情（来自业务模块）
/login                     → 登录页
/403                       → 无权限页
/404                       → 404页
```

## 导航菜单

顶部导航栏包含以下菜单项：
- 🏠 **首页** - 跳转到仪表盘
- 📦 **商品管理** - 跳转到商品列表
- 📋 **订单管理** - 跳转到订单列表
- 👥 **用户管理** - 跳转到用户列表

## 技术栈

- **UI 组件**: Element Plus
- **图表**: ECharts 5
- **图标**: @element-plus/icons-vue
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **语言**: TypeScript

## 新增依赖

```json
{
  "echarts": "^5.5.0",
  "@element-plus/icons-vue": "^2.3.1"
}
```

## 页面特点

1. **统一样式**: 所有页面使用相同的卡片式布局
2. **响应式设计**: 支持不同屏幕尺寸
3. **权限控制**: 用户管理页面需要登录权限
4. **加载状态**: 所有异步操作都有 loading 状态
5. **错误处理**: 完善的错误提示和处理
6. **分页支持**: 列表页面都支持分页

## 下一步

可以继续添加的页面：
- 系统设置
- 角色权限管理
- 数据统计报表
- 消息通知
- 文件管理
