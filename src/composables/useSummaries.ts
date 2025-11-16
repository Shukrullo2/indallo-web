import { ref } from 'vue'
import type { PostGroupedByChannel } from '../types/post'
import { apiService } from '../utils/api'
import { useApi } from './useApi'

const summaries = ref<PostGroupedByChannel[]>([])
const selectedDate = ref<string>('')

export function useSummaries() {
  const { loading, error, execute } = useApi()

  const loadSummaries = async (
    telegramId: string,
    date: string
  ): Promise<void> => {
    selectedDate.value = date
    
    // Calculate date range (last 3 days from selected date)
    const selected = new Date(date)
    const endDate = new Date(selected)
    endDate.setHours(23, 59, 59, 999)
    const startDate = new Date(selected)
    startDate.setDate(startDate.getDate() - 2)
    startDate.setHours(0, 0, 0, 0)

    const data = await execute(() =>
      apiService.getUserSummaries(
        telegramId,
        startDate.toISOString(),
        endDate.toISOString()
      )
    )
    
    if (data) {
      // Filter to only show posts from the selected date
      const filtered = data.map((group) => ({
        ...group,
        posts: group.posts.filter((post) => {
          if (!post.posted_date) return false
          const postDate = new Date(post.posted_date)
          return postDate.toDateString() === selected.toDateString()
        }),
      })).filter((group) => group.posts.length > 0)
      
      summaries.value = filtered
    }
  }

  return {
    summaries,
    selectedDate,
    loading,
    error,
    loadSummaries,
  }
}

