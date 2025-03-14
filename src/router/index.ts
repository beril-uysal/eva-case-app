import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import store from '../store'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: LoginPage },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
    next('/')
  } else {
    next()
  }
})

export default router
