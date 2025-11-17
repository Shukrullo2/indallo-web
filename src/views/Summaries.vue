<template>
  <div class="summaries-page">
    <h1 class="page-title">{{ t('summaries.title') }}</h1>

    <div class="date-filter-row">
      <DateTabs
        :selected-date="selectedDate"
        @select="handleDateSelect"
      />
      <button
        class="get-summary-button"
        @click="handleGetSummaryNow"
        :title="t('summaries.getSummaryNow')"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4V10H7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M23 20V14H17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.49 9C20.0173 7.56678 19.1641 6.2854 18.0001 5.27541C16.8362 4.26542 15.403 3.57157 13.8415 3.26376C12.28 2.95596 10.6441 3.04452 9.12008 3.52071C7.59607 3.9969 6.23769 4.84429 5.18064 5.98118C4.12359 7.11807 3.40351 8.50484 3.08664 10C2.76977 11.4952 2.86549 13.0593 3.36524 14.5116C3.86499 15.9638 4.75026 17.2542 5.93219 18.2699C7.11412 19.2857 8.55076 19.9901 10.0866 20.3097C11.6224 20.6293 13.2025 20.5538 14.6999 20.09C16.1973 19.6262 17.5583 18.7892 18.6438 17.6542C19.7293 16.5192 20.5 15.1232 20.8816 13.6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <ChannelTabs
      v-if="allChannels.length > 0"
      :all-channels="allChannels"
      :selected-channel-id="selectedChannelId"
      @select="handleChannelSelect"
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
import ChannelTabs from '../components/ChannelTabs.vue'
import ChannelList from '../components/ChannelList.vue'

const { summaries, allChannels, selectedDate, selectedChannelId, loading, error, loadSummaries, setSelectedChannel } = useSummaries()
const { t } = useI18n()

const handleDateSelect = async (date: string | undefined) => {
  if (!date) return
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    // Don't reset channel filter - keep it and apply both filters
    await loadSummaries(telegramId, date)
  }
}

const handleChannelSelect = async (channelId: string | null) => {
  await setSelectedChannel(channelId)
}

const handleGetSummaryNow = () => {
  // Open Telegram bot with a command to get summary now
  const botUsername = import.meta.env.VITE_BOT_USERNAME || ''
  if (botUsername) {
    // Remove @ if present
    const cleanUsername = botUsername.replace('@', '')
    // Open Telegram with start parameter
    const telegramUrl = `https://t.me/${cleanUsername}?start=hozir_bayonot`
    window.open(telegramUrl, '_blank')
  } else {
    console.error('Bot username not configured')
  }
}

const handleRetry = () => {
  if (selectedDate.value) {
    handleDateSelect(selectedDate.value)
  }
}

onMounted(() => {
  // Load today's summaries by default
  // Use local date, not UTC, to get the correct day
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayStr = `${year}-${month}-${day}`
  if (todayStr) {
    handleDateSelect(todayStr)
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

.date-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.get-summary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 136, 204, 0.2);
  flex-shrink: 0;
}

.get-summary-button:hover {
  background: #006ba3;
  box-shadow: 0 4px 8px rgba(0, 136, 204, 0.3);
  transform: translateY(-1px);
}

.get-summary-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 136, 204, 0.2);
}
</style>

