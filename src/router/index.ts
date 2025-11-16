import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/app',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
      },
      {
        path: 'summaries',
        name: 'Summaries',
        component: () => import('../views/Summaries.vue'),
      },
      {
        path: 'breaking-news',
        name: 'BreakingNews',
        component: () => import('../views/BreakingNews.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const telegramId = localStorage.getItem('telegram_id')
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !telegramId) {
    next('/login')
  } else if (!requiresAuth && telegramId && to.path === '/login') {
    next('/app/profile')
  } else {
    next()
  }
})

export default router

