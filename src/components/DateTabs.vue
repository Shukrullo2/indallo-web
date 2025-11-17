<template>
  <div class="date-tabs">
    <!-- Desktop: Show as tabs -->
    <div class="date-tabs-desktop">
      <button
        v-for="tab in tabs"
        :key="tab.date"
        class="date-tab"
        :class="{ active: selectedDate === tab.date }"
        @click="handleSelect(tab.date)"
      >
        {{ tab.label }}
      </button>
    </div>
    <!-- Mobile: Show as dropdown -->
    <select
      class="date-tabs-mobile"
      :value="selectedDate || ''"
      @change="handleSelect(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="tab in tabs"
        :key="tab.date"
        :value="tab.date"
      >
        {{ tab.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../utils/i18n'

interface Props {
  selectedDate: string | undefined
}

defineProps<Props>()
const emit = defineEmits<{
  select: [date: string]
}>()

const { t } = useI18n()

const handleSelect = (date: string) => {
  emit('select', date)
}

// Use a ref to track current date, which will update when component is viewed
const currentDate = ref(new Date())

// Update current date periodically (every minute) to keep it fresh
const updateCurrentDate = () => {
  currentDate.value = new Date()
}

// Update on mount and set interval
onMounted(() => {
  updateCurrentDate()
  // Update every minute to keep dates current
  const interval = setInterval(updateCurrentDate, 60000)
  onUnmounted(() => clearInterval(interval))
})

const tabs = computed(() => {
  // Use local date, not UTC, to get the correct day
  const now = new Date(currentDate.value)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  // Format as YYYY-MM-DD using local date, not UTC
  const formatDate = (d: Date): string => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return [
    {
      date: formatDate(today),
      label: t('summaries.today'),
    },
    {
      date: formatDate(yesterday),
      label: t('summaries.yesterday'),
    },
    {
      date: formatDate(twoDaysAgo),
      label: t('summaries.twoDaysAgo'),
    },
  ]
})
</script>

<style scoped>
.date-tabs {
  flex: 1;
}

.date-tabs-desktop {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;
}

.date-tabs-mobile {
  display: none;
}

.date-tab {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s;
}

.date-tab:hover {
  color: #0088cc;
  background: #f5f5f5;
}

.date-tab.active {
  color: #0088cc;
  border-bottom-color: #0088cc;
  font-weight: 500;
}

@media (max-width: 768px) {
  .date-tabs-desktop {
    display: none;
  }

  .date-tabs-mobile {
    display: block;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  .date-tabs-mobile:focus {
    outline: none;
    border-color: #0088cc;
  }
}
</style>

