<template>
  <div class="date-tabs">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const tabs = computed(() => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const formatDate = (d: Date): string => {
    return d.toISOString().split('T')[0] || ''
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
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;
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
</style>

