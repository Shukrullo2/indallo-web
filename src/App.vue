<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { isTelegramWebApp, getTelegramUser, initTelegramWebApp } from './utils/telegramWebApp'
import { apiService } from './utils/api'

const { initAuth, loadUser } = useAuth()
const router = useRouter()

onMounted(async () => {
  // Initialize Telegram WebApp if running inside Telegram
  if (isTelegramWebApp()) {
    initTelegramWebApp()
    
    // Get user from Telegram WebApp
    const telegramUser = getTelegramUser()
    if (telegramUser) {
      const telegramId = String(telegramUser.id)
      
      // Check if user is registered in the backend
      try {
        const userExists = await apiService.checkUserExists(telegramId)
        
        if (userExists) {
          // User is registered - auto-login
          localStorage.setItem('telegram_id', telegramId)
          
          // Load user data
          await loadUser(telegramId)
          
          // If we're on login or registration-required page, redirect to summaries
          const currentPath = router.currentRoute.value.path
          if (currentPath === '/login' || currentPath === '/registration-required') {
            router.push('/app/summaries')
          }
        } else {
          // User is not registered - show registration required message
          localStorage.removeItem('telegram_id') // Clear any stale data
          
          // Redirect to registration required page
          if (router.currentRoute.value.path !== '/registration-required') {
            router.push('/registration-required')
          }
        }
      } catch (error) {
        console.error('Failed to check user registration:', error)
        // On error, show registration required page to be safe
        if (router.currentRoute.value.path !== '/registration-required') {
          router.push('/registration-required')
        }
      }
    } else {
      // No Telegram user data - show registration required
      if (router.currentRoute.value.path !== '/registration-required') {
        router.push('/registration-required')
      }
    }
  } else {
    // Not in Telegram, use normal auth flow
    // Only init auth if telegram_id is already in localStorage
    // URL callback is handled by router guard
    initAuth()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f0f0f0;
  color: #000;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
}
</style>
