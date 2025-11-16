import { ref } from 'vue'
import type { CollectedPost } from '../types/post'
import { apiService } from '../utils/api'
import { useApi } from './useApi'

const breakingNews = ref<Record<string, CollectedPost[]>>({})
const hasAccess = ref<boolean>(false)

export function useBreakingNews() {
  const { loading, error, execute } = useApi()

  const checkAccess = async (telegramId: string): Promise<boolean> => {
    const access = await execute(() =>
      apiService.checkBreakingNewsAccess(telegramId)
    )
    hasAccess.value = access || false
    return hasAccess.value
  }

  const loadBreakingNews = async (
    telegramId: string,
    dates: string[]
  ): Promise<void> => {
    if (!hasAccess.value) {
      await checkAccess(telegramId)
    }

    if (!hasAccess.value) {
      return
    }

    const newsByDate: Record<string, CollectedPost[]> = {}
    
    for (const date of dates) {
      const news = await execute(() => apiService.getBreakingNewsByDate(date))
      if (news) {
        newsByDate[date] = news
      }
    }

    breakingNews.value = newsByDate
  }

  return {
    breakingNews,
    hasAccess,
    loading,
    error,
    checkAccess,
    loadBreakingNews,
  }
}

