export interface Post {
  id: string
  created: string
  posted_date: string | null
  link: string
  text: string | null
  title: string | null
  snapshot: string | null
  summary: string | null
  channel_id: string
}

export interface CollectedPost {
  telegram_id: string
  source_channel: string
  title: string
  link: string
  text: string
  summary: string
  category: string
  importance_score: number
  posted_date: string
}

export interface PostGroupedByChannel {
  channel_id: string
  channel_title: string
  channel_username: string | null
  posts: Post[]
}

