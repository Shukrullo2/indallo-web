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
      {{ formatText(post.snapshot) }}
    </div>
    <div v-if="post.summary" class="summary-section">
      <button
        class="summary-toggle"
        @click="toggleSummary"
        :aria-expanded="isSummaryExpanded"
      >
        <span class="summary-toggle-text">{{ t('summaries.more') }}</span>
        <svg
          class="summary-arrow"
          :class="{ expanded: isSummaryExpanded }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div
        v-if="isSummaryExpanded"
        class="post-summary"
      >
        {{ formatText(post.summary) }}
      </div>
    </div>
    <div v-if="post.posted_date" class="post-date">
      {{ formatDate(post.posted_date) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '../types/post'
import { useI18n } from '../utils/i18n'

interface Props {
  post: Post
}

defineProps<Props>()

const { t } = useI18n()
const isSummaryExpanded = ref(false)

const toggleSummary = () => {
  isSummaryExpanded.value = !isSummaryExpanded.value
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

const formatText = (text: string | null): string => {
  if (!text) return ''
  
  // Replace bullet points followed by space with newline + bullet
  // Handles patterns like "• point1 • point2" or "• point1\n• point2"
  let formatted = text
    // Replace " • " (space bullet space) with newline + bullet
    .replace(/ • /g, '\n• ')
    // Replace " - " (space dash space) with newline + dash
    .replace(/ - /g, '\n- ')
    // Replace " * " (space asterisk space) with newline + asterisk
    .replace(/ \* /g, '\n* ')
    // Ensure bullet points at start of line are properly formatted
    .replace(/^•/gm, '•')
    .replace(/^-/gm, '-')
    .replace(/^\*/gm, '*')
  
  return formatted
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
  text-align: left;
}

.summary-section {
  margin-bottom: 12px;
}

.summary-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #0088cc;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
}

.summary-toggle:hover {
  color: #006ba3;
}

.summary-toggle-text {
  user-select: none;
}

.summary-arrow {
  transition: transform 0.3s ease;
  color: #0088cc;
}

.summary-arrow.expanded {
  transform: rotate(180deg);
}

.post-summary {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  white-space: pre-wrap;
  text-align: left;
}

.post-date {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>

