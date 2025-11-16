<template>
  <div class="breaking-news-page">
    <h1 class="page-title">{{ t('breakingNews.title') }}</h1>

    <div v-if="!hasAccess" class="no-access">
      <p>{{ t('breakingNews.noAccess') }}</p>
      <button class="upgrade-button" @click="handleUpgrade">
        {{ t('breakingNews.upgrade') }}
      </button>
    </div>

    <div v-else>
      <DateTabs
        :selected-date="selectedDate"
        @select="handleDateSelect"
      />

      <div v-if="loading" class="loading">
        {{ t('app.loading') }}
      </div>

      <div v-else-if="error" class="error">
        {{ error.message || t('app.error') }}
        <button @click="handleRetry" class="retry-button">
          {{ t('common.retry') }}
        </button>
      </div>

      <div v-else-if="currentNews.length === 0" class="empty">
        {{ t('breakingNews.noNews') }}
      </div>

      <div v-else class="news-list">
        <div
          v-for="post in currentNews"
          :key="post.telegram_id"
          class="news-card"
        >
          <div class="news-header">
            <h3 class="news-title">{{ post.title }}</h3>
            <a
              v-if="post.link"
              :href="post.link"
              target="_blank"
              class="news-link"
              rel="noopener noreferrer"
            >
              ↗
            </a>
          </div>
          <div class="news-source">
            {{ t('breakingNews.channel') }}: {{ post.source_channel }}
          </div>
          <div class="news-summary">{{ post.summary }}</div>
          <div class="news-date">{{ formatDate(post.posted_date) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBreakingNews } from '../composables/useBreakingNews'
import { useI18n } from '../utils/i18n'
import DateTabs from '../components/DateTabs.vue'

const { breakingNews, hasAccess, loading, error, checkAccess, loadBreakingNews } = useBreakingNews()
const { t } = useI18n()
const selectedDate = ref<string>('')

const currentNews = computed(() => {
  if (!selectedDate.value) return []
  return breakingNews.value[selectedDate.value] || []
})

const handleDateSelect = async (date: string) => {
  selectedDate.value = date
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    // Load news for the selected date
    await loadBreakingNews(telegramId, [date])
  }
}

const handleRetry = () => {
  if (selectedDate.value) {
    handleDateSelect(selectedDate.value)
  }
}

const handleUpgrade = () => {
  // Redirect to profile for subscription management
  window.location.href = '/app/profile'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

onMounted(async () => {
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    await checkAccess(telegramId)
    
    if (hasAccess.value) {
      // Load last 3 days
      const today = new Date()
      const dates: string[] = []
      for (let i = 0; i < 3; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        if (dateStr) {
          dates.push(dateStr)
        }
      }
      
      await loadBreakingNews(telegramId, dates)
      
      // Select today by default
      if (dates.length > 0 && dates[0]) {
        selectedDate.value = dates[0]
      }
    }
  }
})
</script>

<style scoped>
.breaking-news-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
}

.no-access {
  background: white;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.no-access p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.upgrade-button {
  padding: 12px 24px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.upgrade-button:hover {
  background: #006ba3;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 48px 20px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background: #006ba3;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.news-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
}

.news-link {
  color: #0088cc;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.2s;
}

.news-link:hover {
  color: #006ba3;
}

.news-source {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.news-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.news-date {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>

