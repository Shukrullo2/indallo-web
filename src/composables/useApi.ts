import { ref } from 'vue'
import type { ApiError } from '../types/api'

export function useApi() {
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const execute = async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await apiCall()
      return result
    } catch (err: any) {
      error.value = {
        error: err.message || 'An error occurred',
        status: err.status || 500,
        message: err.message,
      }
      console.error('API Error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute,
  }
}

