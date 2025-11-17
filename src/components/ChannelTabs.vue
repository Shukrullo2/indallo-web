<template>
  <div class="channel-tabs">
    <button
      class="channel-tab"
      :class="{ active: selectedChannelId === null }"
      @click="handleSelect(null)"
    >
      {{ t('summaries.allChannels') }}
    </button>
    <button
      v-for="channel in allChannels"
      :key="channel.telegram_id"
      class="channel-tab"
      :class="{ active: selectedChannelId === channel.telegram_id }"
      @click="handleSelect(channel.telegram_id)"
    >
      {{ channel.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Channel } from '../types/channel'
import { useI18n } from '../utils/i18n'

interface Props {
  allChannels: Channel[]
  selectedChannelId: string | null
}

defineProps<Props>()
const emit = defineEmits<{
  select: [channelId: string | null]
}>()

const { t } = useI18n()

const handleSelect = (channelId: string | null) => {
  emit('select', channelId)
}
</script>

<style scoped>
.channel-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  overflow-x: auto;
}

.channel-tab {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s;
}

.channel-tab:hover {
  background: #e8f4f8;
  border-color: #0088cc;
  color: #0088cc;
}

.channel-tab.active {
  background: #0088cc;
  border-color: #0088cc;
  color: white;
  font-weight: 500;
}
</style>

