<template>
  <div class="post-card">
    <div class="post-header">
      <h3 class="post-title">{{ post.title || t('summaries.noPosts') }}</h3>
      <a
        v-if="post.link"
        :href="post.link"
        target="_blank"
        class="post-link"
        rel="noopener noreferrer"
      >
        ↗
      </a>
    </div>
    <div v-if="post.snapshot" class="post-snapshot">
      {{ post.snapshot }}
    </div>
    <div v-if="post.summary" class="post-summary">
      {{ post.summary }}
    </div>
    <div v-if="post.posted_date" class="post-date">
      {{ formatDate(post.posted_date) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '../types/post'
import { useI18n } from '../utils/i18n'

interface Props {
  post: Post
}

defineProps<Props>()

const { t } = useI18n()

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
}

.post-link {
  color: #0088cc;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.2s;
}

.post-link:hover {
  color: #006ba3;
}

.post-snapshot {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.post-summary {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.post-date {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>

