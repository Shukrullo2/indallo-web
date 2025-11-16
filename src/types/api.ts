export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

export interface ApiError {
  error: string
  status: number
  message?: string
}

