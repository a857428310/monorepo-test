import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
  ],
})

export default router