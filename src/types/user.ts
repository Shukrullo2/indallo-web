export interface User {
  id: string
  telegram_id: string
  username: string | null
  name: string | null
  phone_number: string | null
  language: string
  hour: string | null
  date_joined: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  plan_type: 'free' | 'trial' | 'basic' | 'premium'
  price_soums: number
  max_channels: number
  ai_chat_enabled: boolean
  breaking_news_enabled: boolean
  description_uz: string
  description_ru: string
  is_active: boolean
}

export interface UserSubscription {
  telegram_id: string
  subscription_plan_id: string | null
  subscription_active: boolean
  subscription_expires_at: string | null
  subscription_started_at: string | null
  trial_active: boolean
  trial_expires_at: string | null
  trial_started_at: string | null
  plan: SubscriptionPlan | null
}

export interface SubscriptionInfo {
  subscription: UserSubscription
  plan: SubscriptionPlan | null
  can_access_breaking_news: boolean
  can_use_ai_chat: boolean
  can_add_channels: boolean
  current_channel_count: number
  max_channels: number
}

