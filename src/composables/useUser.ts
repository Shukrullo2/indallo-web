import { ref, computed } from 'vue'
import type { User, SubscriptionInfo } from '../types/user'
import type { Channel } from '../types/channel'
import { apiService } from '../utils/api'
import { useApi } from './useApi'

const user = ref<User | null>(null)
const subscription = ref<SubscriptionInfo | null>(null)
const channels = ref<Channel[]>([])

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

  const loadChannels = async (telegramId: string): Promise<void> => {
    const channelsData = await execute(() =>
      apiService.getUserChannels(telegramId)
    )
    if (channelsData) {
      channels.value = channelsData
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

  const removeChannel = async (telegramId: string, channelId: string): Promise<void> => {
    await execute(() => apiService.removeChannel(telegramId, channelId))
    // Reload channels and subscription to get updated data
    await loadChannels(telegramId)
    await loadSubscription(telegramId)
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
    channels,
    loading,
    error,
    loadUser,
    loadSubscription,
    loadChannels,
    updateLanguage,
    updateTime,
    removeChannel,
    channelCount,
    maxChannels,
  }
}

