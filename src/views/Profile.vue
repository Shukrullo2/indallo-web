<template>
  <div class="profile-page">
    <h1 class="page-title">{{ t('profile.title') }}</h1>

    <div v-if="loading" class="loading">
      {{ t('app.loading') }}
    </div>

    <div v-else-if="error" class="error">
      {{ error.message || t('app.error') }}
    </div>

    <div v-else-if="user && subscription" class="profile-content">
      <!-- User Information -->
      <section class="profile-section">
        <h2 class="section-title">{{ t('profile.userInfo') }}</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>{{ t('profile.name') }}</label>
            <div>{{ user.name || '-' }}</div>
          </div>
          <div class="info-item">
            <label>{{ t('profile.phoneNumber') }}</label>
            <div>{{ user.phone_number || '-' }}</div>
          </div>
        </div>
      </section>

      <!-- Subscription Information -->
      <section class="profile-section">
        <h2 class="section-title">{{ t('profile.subscription') }}</h2>
        <SubscriptionCard :subscription="subscription" />
      </section>

      <!-- Channels -->
      <section class="profile-section">
        <h2 class="section-title">{{ t('profile.channels') }}</h2>
        <p class="channels-help-text">{{ t('profile.addChannelHelp') }}</p>
        <div v-if="channels.length === 0" class="no-channels">
          {{ t('profile.noChannels') }}
        </div>
        <div v-else class="channels-list">
          <div
            v-for="channel in channels"
            :key="channel.telegram_id"
            class="channel-item"
          >
            <div class="channel-info">
              <h3 class="channel-title">{{ channel.title }}</h3>
              <span v-if="channel.username" class="channel-username">
                @{{ channel.username }}
              </span>
            </div>
            <button
              class="remove-button"
              @click="handleRemoveChannel(channel.telegram_id)"
              :disabled="removingChannel === channel.telegram_id"
            >
              {{ removingChannel === channel.telegram_id ? t('app.loading') : t('profile.remove') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Settings -->
      <section class="profile-section">
        <h2 class="section-title">{{ t('profile.settings') }}</h2>
        <div class="settings">
          <LanguageSwitcher
            :current-locale="pendingLanguage || user.language"
            @update="handleLanguageChange"
          />
          <div class="setting-item">
            <label>{{ t('profile.time') }}</label>
            <input
              type="time"
              :value="pendingTime || user.hour || '19:00'"
              @change="handleTimeChange"
              class="time-input"
            />
          </div>
          <button
            class="save-button"
            @click="handleSaveSettings"
            :disabled="saving || (!hasPendingChanges)"
          >
            {{ saving ? t('app.loading') : t('profile.save') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUser } from '../composables/useUser'
import { useI18n } from '../utils/i18n'
import SubscriptionCard from '../components/SubscriptionCard.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { user, subscription, channels, loading, error, loadUser, loadSubscription, loadChannels, updateLanguage, updateTime, removeChannel } = useUser()
const { t, setLocale } = useI18n()

const pendingLanguage = ref<string | null>(null)
const pendingTime = ref<string | null>(null)
const saving = ref(false)
const removingChannel = ref<string | null>(null)

const hasPendingChanges = computed(() => {
  if (!user.value) return false
  const langChanged = pendingLanguage.value !== null && pendingLanguage.value !== user.value.language
  const timeChanged = pendingTime.value !== null && pendingTime.value !== user.value.hour
  return langChanged || timeChanged
})

onMounted(async () => {
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    await loadUser(telegramId)
    await loadSubscription(telegramId)
    await loadChannels(telegramId)
  }
})

const handleLanguageChange = (language: string) => {
  pendingLanguage.value = language
}

const handleTimeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value) {
    pendingTime.value = target.value
  }
}

const handleSaveSettings = async () => {
  if (!hasPendingChanges.value) return
  
  const telegramId = localStorage.getItem('telegram_id')
  if (!telegramId) return

  saving.value = true
  try {
    if (pendingLanguage.value !== null) {
      await updateLanguage(telegramId, pendingLanguage.value)
      setLocale(pendingLanguage.value)
      pendingLanguage.value = null
    }
    if (pendingTime.value !== null) {
      await updateTime(telegramId, pendingTime.value)
      pendingTime.value = null
    }
  } catch (err) {
    console.error('Error saving settings:', err)
  } finally {
    saving.value = false
  }
}

const handleRemoveChannel = async (channelId: string) => {
  const telegramId = localStorage.getItem('telegram_id')
  if (!telegramId) return

  if (!confirm(t('profile.remove') + '?')) {
    return
  }

  removingChannel.value = channelId
  try {
    await removeChannel(telegramId, channelId)
  } catch (err) {
    console.error('Error removing channel:', err)
  } finally {
    removingChannel.value = null
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
}

.loading,
.error {
  text-align: center;
  padding: 48px 20px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item div {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.channel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: background 0.2s;
}

.channel-item:hover {
  background: #eeeeee;
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.channel-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.channel-username {
  font-size: 14px;
  color: #666;
}

.remove-button {
  padding: 8px 16px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover:not(:disabled) {
  background: #b71c1c;
}

.remove-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.channels-help-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  line-height: 1.5;
}

.no-channels {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.time-input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  max-width: 200px;
}

.time-input:focus {
  outline: none;
  border-color: #0088cc;
}

.save-button {
  padding: 12px 24px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.save-button:hover:not(:disabled) {
  background: #006ba3;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
