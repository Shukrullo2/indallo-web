import { ref } from 'vue'
import type { PostGroupedByChannel } from '../types/post'
import type { Channel } from '../types/channel'
import { apiService } from '../utils/api'
import { useApi } from './useApi'

const summaries = ref<PostGroupedByChannel[]>([])
const selectedDate = ref<string>('')
const selectedChannelId = ref<string | null>(null)
const allSummaries = ref<PostGroupedByChannel[]>([]) // Store all summaries before filtering
const allChannels = ref<Channel[]>([]) // Store all user channels

export function useSummaries() {
  const { loading, error, execute } = useApi()

  const loadSummaries = async (
    telegramId: string,
    date: string
  ): Promise<void> => {
    selectedDate.value = date
    
    // First, load all user channels (to show all channels in filter buttons)
    try {
      const channels = await apiService.getUserChannels(telegramId)
      allChannels.value = channels || []
    } catch (err) {
      console.error('Error loading channels:', err)
      allChannels.value = []
    }
    
    // Calculate date range (last 3 days from selected date)
    // Parse the date string (YYYY-MM-DD) and use local timezone
    const dateParts = date.split('-').map(Number)
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      console.error('Invalid date format:', date)
      return
    }
    const year = dateParts[0]!
    const month = dateParts[1]!
    const day = dateParts[2]!
    // End date is the selected date at end of day (23:59:59)
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999)
    // Start date is 2 days before selected date at start of day
    const startDate = new Date(year, month - 1, day - 2, 0, 0, 0, 0)

    // Format as YYYY-MM-DD using local date
    const formatDate = (d: Date): string => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${dd}`
    }

    const startDateStr = formatDate(startDate)
    const endDateStr = formatDate(endDate)
    
    console.log('Date range for summaries:', { selected: date, startDate: startDateStr, endDate: endDateStr })

    try {
      // If a channel is selected, only fetch that channel's data
      if (selectedChannelId.value) {
        const channel = allChannels.value.find(c => c.telegram_id === selectedChannelId.value)
        if (channel) {
          const posts = await execute(() =>
            apiService.getPostsByChannel(channel.telegram_id, startDateStr, endDateStr)
          )
          
          if (posts && Array.isArray(posts)) {
            // Filter posts to only show those from the selected date (not the entire range)
            const selectedDateStr = date
            const filteredPosts = posts.filter((post) => {
              if (!post.posted_date) return false
              // Extract date part from posted_date (could be ISO string)
              const postDateStr = post.posted_date.split('T')[0]
              return postDateStr === selectedDateStr
            })
            
            if (filteredPosts.length > 0) {
              summaries.value = [{
                channel_id: channel.telegram_id,
                channel_title: channel.title,
                channel_username: channel.username,
                posts: filteredPosts,
              }]
              // Store in allSummaries for consistency
              allSummaries.value = summaries.value
            } else {
              summaries.value = []
              allSummaries.value = []
            }
          } else {
            summaries.value = []
            allSummaries.value = []
          }
        } else {
          summaries.value = []
          allSummaries.value = []
        }
      } else {
        // No channel selected, fetch all channels
        const data = await execute(() =>
          apiService.getUserSummaries(
            telegramId,
            startDateStr,
            endDateStr
          )
        )
        
        if (data && Array.isArray(data)) {
          // Filter posts to only show those from the selected date (not the entire range)
          const selectedDateStr = date
          const filteredData = data.map((group) => ({
            ...group,
            posts: group.posts.filter((post) => {
              if (!post.posted_date) return false
              // Extract date part from posted_date (could be ISO string)
              const postDateStr = post.posted_date.split('T')[0]
              return postDateStr === selectedDateStr
            }),
          })).filter((group) => group.posts.length > 0)
          
          // Store all summaries before filtering
          allSummaries.value = filteredData
          // Apply channel filter (should show all since none selected)
          applyChannelFilter()
        } else {
          allSummaries.value = []
          summaries.value = []
        }
      }
    } catch (err) {
      console.error('Error loading summaries:', err)
      summaries.value = []
      allSummaries.value = []
    }
  }

  const applyChannelFilter = () => {
    if (selectedChannelId.value === null) {
      // Show all channels
      summaries.value = allSummaries.value
    } else {
      // Filter by selected channel
      summaries.value = allSummaries.value.filter(
        (group) => group.channel_id === selectedChannelId.value
      )
    }
  }

  const setSelectedChannel = async (channelId: string | null) => {
    selectedChannelId.value = channelId
    // Reload summaries with the new channel filter
    // This ensures both date and channel filters are applied
    if (selectedDate.value) {
      const telegramId = localStorage.getItem('telegram_id')
      if (telegramId) {
        await loadSummaries(telegramId, selectedDate.value)
      }
    } else {
      // If no date selected, just apply filter to existing data
      applyChannelFilter()
    }
  }

  return {
    summaries,
    allSummaries,
    allChannels,
    selectedDate,
    selectedChannelId,
    loading,
    error,
    loadSummaries,
    setSelectedChannel,
  }
}

