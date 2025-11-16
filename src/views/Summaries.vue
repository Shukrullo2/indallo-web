<template>
  <div class="summaries-page">
    <h1 class="page-title">{{ t('summaries.title') }}</h1>

    <DateTabs
      :selected-date="selectedDate"
      @select="handleDateSelect"
    />

    <ChannelList
      :channels="summaries"
      :loading="loading"
      :error="error"
      @retry="handleRetry"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSummaries } from '../composables/useSummaries'
import { useI18n } from '../utils/i18n'
import DateTabs from '../components/DateTabs.vue'
import ChannelList from '../components/ChannelList.vue'

const { summaries, selectedDate, loading, error, loadSummaries } = useSummaries()
const { t } = useI18n()

const handleDateSelect = async (date: string | undefined) => {
  if (!date) return
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    await loadSummaries(telegramId, date)
  }
}

const handleRetry = () => {
  if (selectedDate.value) {
    handleDateSelect(selectedDate.value)
  }
}

onMounted(() => {
  // Load today's summaries by default
  const today = new Date().toISOString().split('T')[0]
  if (today) {
    handleDateSelect(today)
  }
})
</script>

<style scoped>
.summaries-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
}
</style>

