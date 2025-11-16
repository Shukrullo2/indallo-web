export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || ''

export const BOT_REDIRECT_URL = BOT_USERNAME ? `https://t.me/${BOT_USERNAME}` : ''

