/**
 * Web 应用路由配置
 * 所有路由都在主项目中统一管理，业务模块只提供页面组件和 API
 */

import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

// ========== 应用专属路由 ==========

const appRoutes: RouteRecordRaw[] = [
  // 首页/仪表盘
  {
    path: "/",
    name: "layout",
    component: () => import("@/layouts/basic.vue"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/error/404.vue"),
  },
];

// ========== 创建路由实例 ==========
const router = createRouter({
  history: createWebHistory(),
  routes: appRoutes,
});

export default router;
