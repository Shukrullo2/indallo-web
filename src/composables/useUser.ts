import { ref, computed } from 'vue'
import type { User, SubscriptionInfo } from '../types/user'
import { apiService } from '../utils/api'
import { useApi } from './useApi'

const user = ref<User | null>(null)
const subscription = ref<SubscriptionInfo | null>(null)

export function useUser() {
  const { loading, error, execute } = useApi()

  const loadUser = async (telegramId: string): Promise<void> => {
    const userData = await execute(() => apiService.getUser(telegramId))
    if (userData) {
      user.value = userData
    }
  }

  const loadSubscription = async (telegramId: string): Promise<void> => {
    const subscriptionData = await execute(() =>
      apiService.getUserSubscription(telegramId)
    )
    if (subscriptionData) {
      subscription.value = subscriptionData
    }
  }

  const updateLanguage = async (telegramId: string, language: string): Promise<void> => {
    await execute(() => apiService.updateUserLanguage(telegramId, language))
    if (user.value) {
      user.value.language = language
    }
  }

  const updateTime = async (telegramId: string, hour: string): Promise<void> => {
    await execute(() => apiService.updateUserTime(telegramId, hour))
    if (user.value) {
      user.value.hour = hour
    }
  }

  const channelCount = computed(() => {
    return subscription.value?.current_channel_count || 0
  })

  const maxChannels = computed(() => {
    return subscription.value?.max_channels || 3
  })

  return {
    user,
    subscription,
    loading,
    error,
    loadUser,
    loadSubscription,
    updateLanguage,
    updateTime,
    channelCount,
    maxChannels,
  }
}

