<template>
  <div class="channel-list">
    <div v-if="loading" class="loading">
      {{ t('app.loading') }}
    </div>
    <div v-else-if="error" class="error">
      {{ error.message || t('app.error') }}
      <button @click="$emit('retry')" class="retry-button">
        {{ t('common.retry') }}
      </button>
    </div>
    <div v-else-if="channels.length === 0" class="empty">
      {{ t('summaries.noSummaries') }}
    </div>
    <div v-else class="channels">
      <div
        v-for="channel in channels"
        :key="channel.channel_id"
        class="channel-group"
      >
        <h2 class="channel-title">
          {{ channel.channel_title }}
          <span class="post-count">({{ channel.posts.length }})</span>
        </h2>
        <div class="posts">
          <PostCard
            v-for="post in channel.posts"
            :key="post.id"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostGroupedByChannel } from '../types/post'
import PostCard from './PostCard.vue'
import { useI18n } from '../utils/i18n'

interface Props {
  channels: PostGroupedByChannel[]
  loading?: boolean
  error?: { message?: string } | null
}

defineProps<Props>()
defineEmits<{
  retry: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.channel-list {
  width: 100%;
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

.channels {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.channel-group {
  margin-bottom: 32px;
}

.channel-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.post-count {
  font-size: 16px;
  font-weight: 400;
  color: #999;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

