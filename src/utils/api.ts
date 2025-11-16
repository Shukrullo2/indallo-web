import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiError } from '../types/api'
import type { User, SubscriptionInfo } from '../types/user'
import type { Post, CollectedPost, PostGroupedByChannel } from '../types/post'
import type { Channel } from '../types/channel'
import { API_BASE_URL } from './config'

type AxiosInstance = ReturnType<typeof axios.create>

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const telegramId = localStorage.getItem('telegram_id')
        if (telegramId) {
          // Add telegram_id to request if available
          if (config.method === 'get' && config.params) {
            config.params.telegram_id = telegramId
          } else if (config.data) {
            config.data.telegram_id = telegramId
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          error: error.message || 'An error occurred',
          status: error.response?.status || 500,
          message: (error.response?.data as any)?.error || error.message,
        }
        return Promise.reject(apiError)
      }
    )
  }

  // User endpoints
  async getUser(telegramId: string): Promise<User> {
    const response = await this.client.get(`/api/users/check/${telegramId}/`)
    return response.data
  }

  async updateUserLanguage(telegramId: string, language: string): Promise<void> {
    await this.client.post('/api/users/set_language/', {
      telegram_id: telegramId,
      language_code: language,
    })
  }

  async updateUserTime(telegramId: string, hour: string): Promise<void> {
    await this.client.post('/api/users/update-time/', {
      telegram_id: telegramId,
      hour,
    })
  }

  // Subscription endpoints
  async getUserSubscription(telegramId: string): Promise<SubscriptionInfo> {
    const response = await this.client.get(`/api/users/subscription/user/${telegramId}/`)
    return response.data
  }

  async getSubscriptionPlans(): Promise<any[]> {
    const response = await this.client.get('/api/users/subscription/plans/')
    return response.data
  }

  async checkBreakingNewsAccess(telegramId: string): Promise<boolean> {
    const response = await this.client.post('/api/users/payment/check-breaking-news/', {
      telegram_id: telegramId,
    })
    return response.data.can_access_breaking_news || false
  }

  // Channel endpoints
  async getUserChannels(telegramId: string): Promise<Channel[]> {
    const response = await this.client.get(`/api/channels/user/id/${telegramId}/`)
    return response.data
  }

  // Post/Summary endpoints
  async getPostsByChannel(
    channelId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Post[]> {
    const params: any = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    const response = await this.client.get(`/api/posts/channel/${channelId}/`, { params })
    return response.data
  }

  async getUserSummaries(
    telegramId: string,
    startDate: string,
    endDate: string
  ): Promise<PostGroupedByChannel[]> {
    // Get user's channels first
    const channels = await this.getUserChannels(telegramId)
    
    // Fetch posts for each channel
    const promises = channels.map(async (channel) => {
      const posts = await this.getPostsByChannel(channel.telegram_id, startDate, endDate)
      return {
        channel_id: channel.telegram_id,
        channel_title: channel.title,
        channel_username: channel.username,
        posts,
      }
    })

    const results = await Promise.all(promises)
    return results.filter((group) => group.posts.length > 0)
  }

  // Breaking news endpoints
  async getBreakingNewsByDate(date: string): Promise<CollectedPost[]> {
    const response = await this.client.get('/api/important_collected_posts/', {
      params: { date },
    })
    return response.data
  }

  async getBreakingNewsRange(startDate: string, endDate: string): Promise<CollectedPost[]> {
    // Fetch for each date in range
    const dates = this.getDateRange(startDate, endDate)
    const promises = dates
      .filter((date): date is string => date !== undefined)
      .map((date) => this.getBreakingNewsByDate(date))
    const results = await Promise.all(promises)
    return results.flat().filter((post): post is CollectedPost => post !== null)
  }

  private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      if (dateStr) {
        dates.push(dateStr)
      }
    }
    
    return dates
  }
}

export const apiService = new ApiService()

