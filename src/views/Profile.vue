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
            <label>{{ t('profile.username') }}</label>
            <div>{{ user.username || '-' }}</div>
          </div>
          <div class="info-item">
            <label>{{ t('profile.telegramId') }}</label>
            <div>{{ user.telegram_id }}</div>
          </div>
        </div>
      </section>

      <!-- Subscription Information -->
      <section class="profile-section">
        <h2 class="section-title">{{ t('profile.subscription') }}</h2>
        <SubscriptionCard :subscription="subscription" />
      </section>

      <!-- Settings -->
      <section class="profile-section">
        <h2 class="section-title">{{ t('profile.settings') }}</h2>
        <div class="settings">
          <LanguageSwitcher
            :current-locale="user.language"
            @update="handleLanguageUpdate"
          />
          <div class="setting-item">
            <label>{{ t('profile.time') }}</label>
            <input
              type="time"
              :value="user.hour || '19:00'"
              @change="handleTimeUpdate"
              class="time-input"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '../composables/useUser'
import { useI18n } from '../utils/i18n'
import SubscriptionCard from '../components/SubscriptionCard.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { user, subscription, loading, error, loadUser, loadSubscription, updateLanguage, updateTime } = useUser()
const { t, setLocale } = useI18n()

onMounted(async () => {
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    await loadUser(telegramId)
    await loadSubscription(telegramId)
  }
})

const handleLanguageUpdate = async (language: string) => {
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId) {
    await updateLanguage(telegramId, language)
    setLocale(language)
  }
}

const handleTimeUpdate = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const telegramId = localStorage.getItem('telegram_id')
  if (telegramId && target.value) {
    await updateTime(telegramId, target.value)
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
</style>

