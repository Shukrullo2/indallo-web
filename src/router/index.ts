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
    redirect: '/app/summaries',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/registration-required',
    name: 'RegistrationRequired',
    component: () => import('../views/RegistrationRequired.vue'),
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
  // Check for telegram_id in URL params first (from bot redirect)
  const urlParams = new URLSearchParams(window.location.search)
  const telegramIdFromUrl = urlParams.get('telegram_id')
  
  if (telegramIdFromUrl) {
    // Store telegram_id in localStorage immediately
    localStorage.setItem('telegram_id', telegramIdFromUrl)
    
    // Clean URL (remove query params)
    window.history.replaceState({}, '', window.location.pathname)
    
    // Redirect to summaries page - user data will be loaded by App.vue's initAuth()
    next('/app/summaries')
    return
  }
  
  // Check if running in Telegram WebApp
  const isInTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp !== undefined
  if (isInTelegram && window.Telegram) {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user
    if (telegramUser) {
      const telegramId = String(telegramUser.id)
      localStorage.setItem('telegram_id', telegramId)
    }
  }
  
  // Normal auth check
  const telegramId = localStorage.getItem('telegram_id')
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !telegramId) {
    // If not authenticated and trying to access protected route, redirect to login
    next('/login')
  } else if (!requiresAuth && telegramId && (to.path === '/login' || to.path === '/')) {
    // If authenticated but on login page or root, redirect to summaries
    next('/app/summaries')
  } else if (to.path === '/') {
    // Default route redirects to summaries (if not authenticated, will be caught above)
    next('/app/summaries')
  } else {
    next()
  }
})

export default router

