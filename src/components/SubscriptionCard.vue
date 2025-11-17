<template>
  <div class="subscription-card">
    <div class="subscription-header">
      <div class="plan-info">
        <h3 class="plan-name">{{ planName }}</h3>
        <span
          class="plan-status"
          :class="{ active: isActive, expired: !isActive }"
        >
          {{ isActive ? t('profile.active') : t('profile.expired') }}
        </span>
      </div>
      <button
        v-if="!isActive || subscription.plan?.plan_type === 'free'"
        class="upgrade-button"
        @click="handleUpgrade"
      >
        {{ t('profile.upgrade') }}
      </button>
    </div>

    <div class="subscription-details">
      <div class="detail-item">
        <span class="detail-label">{{ t('profile.channelCount') }}</span>
        <span class="detail-value">
          {{ subscription.current_channel_count || 0 }} /
          {{ subscription.max_channels || 3 }}
        </span>
      </div>
      
      <div v-if="subscription.subscription.subscription_expires_at" class="detail-item">
        <span class="detail-label">{{ t('profile.expiresAt') }}</span>
        <span class="detail-value">
          {{ formatDate(subscription.subscription.subscription_expires_at) }}
        </span>
      </div>
      
      <div v-if="subscription.subscription.trial_expires_at && subscription.subscription.trial_active" class="detail-item">
        <span class="detail-label">{{ t('profile.trialExpiresAt') }}</span>
        <span class="detail-value">
          {{ formatDate(subscription.subscription.trial_expires_at) }}
        </span>
      </div>
    </div>

    <div v-if="subscription.plan" class="plan-features">
      <h4 class="features-title">{{ t('profile.planDetails') }}</h4>
      <div class="features-list">
        <div class="feature-item">
          <span class="feature-label">{{ t('profile.maxChannelsLabel') }}:</span>
          <span class="feature-value">{{ subscription.plan.max_channels }}</span>
        </div>
        <div class="feature-item">
          <span class="feature-label">{{ t('profile.aiChat') }}:</span>
          <span class="feature-value">
            {{ subscription.plan.ai_chat_enabled ? '✓' : '✗' }}
          </span>
        </div>
        <div class="feature-item">
          <span class="feature-label">{{ t('profile.breakingNews') }}:</span>
          <span class="feature-value">
            {{ subscription.plan.breaking_news_enabled ? '✓' : '✗' }}
          </span>
        </div>
        <div v-if="subscription.plan.price_soums > 0" class="feature-item">
          <span class="feature-label">{{ t('profile.price') }}:</span>
          <span class="feature-value">
            {{ subscription.plan.price_soums.toLocaleString() }} so'm
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SubscriptionInfo } from '../types/user'
import { useI18n } from '../utils/i18n'

interface Props {
  subscription: SubscriptionInfo
}

const props = defineProps<Props>()

const { t } = useI18n()

const planName = computed(() => {
  const planType = props.subscription.plan?.plan_type || 'free'
  return t(`profile.${planType}`)
})

const isActive = computed(() => {
  return (
    props.subscription.subscription.subscription_active ||
    props.subscription.subscription.trial_active
  )
})

const handleUpgrade = () => {
  // Redirect to subscription management (could be a modal or separate page)
  const botUsername = import.meta.env.VITE_BOT_USERNAME || ''
  if (botUsername) {
    const cleanUsername = botUsername.replace('@', '')
    window.location.href = `https://t.me/${cleanUsername}`
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<style scoped>
.subscription-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.plan-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  width: fit-content;
}

.plan-status.active {
  background: rgba(255, 255, 255, 0.3);
}

.plan-status.expired {
  background: rgba(255, 255, 255, 0.2);
  opacity: 0.8;
}

.upgrade-button {
  padding: 10px 20px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.upgrade-button:hover {
  transform: translateY(-2px);
}

.subscription-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  opacity: 0.9;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
}

.plan-features {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.features-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.feature-label {
  opacity: 0.9;
}

.feature-value {
  font-weight: 600;
}
</style>
