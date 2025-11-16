import { ref, computed } from 'vue'
import type { User } from '../types/user'
import { apiService } from '../utils/api'
import { BOT_REDIRECT_URL } from '../utils/config'

const user = ref<User | null>(null)
const isAuthenticated = computed(() => user.value !== null)
const isLoading = ref(false)

export function useAuth() {
  const loadUser = async (telegramId: string): Promise<void> => {
    try {
      isLoading.value = true
      const userData = await apiService.getUser(telegramId)
      user.value = userData
      localStorage.setItem('telegram_id', telegramId)
    } catch (error) {
      console.error('Failed to load user:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const login = (): void => {
    // Redirect to bot for authentication
    // The bot will handle authentication and redirect back with telegram_id
    if (BOT_REDIRECT_URL) {
      window.location.href = BOT_REDIRECT_URL
    } else {
      console.error('Bot username not configured. Please set VITE_BOT_USERNAME environment variable.')
    }
  }

  const logout = (): void => {
    user.value = null
    localStorage.removeItem('telegram_id')
  }

  const initAuth = (): void => {
    // Check if user is already authenticated
    const telegramId = localStorage.getItem('telegram_id')
    if (telegramId) {
      loadUser(telegramId).catch(() => {
        // If loading fails, clear auth
        logout()
      })
    }
  }

  // Handle authentication callback from URL params
  const handleAuthCallback = (): void => {
    const urlParams = new URLSearchParams(window.location.search)
    const telegramId = urlParams.get('telegram_id')
    
    if (telegramId) {
      // Load user data and store telegram_id
      loadUser(telegramId)
      // Clean URL (remove query params)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    loadUser,
    login,
    logout,
    initAuth,
    handleAuthCallback,
  }
}

