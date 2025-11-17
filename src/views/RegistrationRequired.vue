<template>
  <div class="registration-required">
    <div class="registration-card">
      <div class="icon-container">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 8V12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 16H12.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1 class="title">{{ t('registrationRequired.title') }}</h1>
      <p class="message">{{ t('registrationRequired.message') }}</p>
      <button class="open-bot-button" @click="openBot">
        {{ t('registrationRequired.openBot') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../utils/i18n'
import { BOT_USERNAME } from '../utils/config'

const { t } = useI18n()

const openBot = () => {
  if (BOT_USERNAME) {
    const cleanUsername = BOT_USERNAME.replace('@', '')
    const telegramUrl = `https://t.me/${cleanUsername}`
    window.open(telegramUrl, '_blank')
  } else {
    console.error('Bot username not configured')
  }
}
</script>

<style scoped>
.registration-required {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f0f0f0;
}

.registration-card {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  color: #0088cc;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

.open-bot-button {
  padding: 12px 32px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 136, 204, 0.2);
}

.open-bot-button:hover {
  background: #006ba3;
  box-shadow: 0 4px 8px rgba(0, 136, 204, 0.3);
  transform: translateY(-1px);
}

.open-bot-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 136, 204, 0.2);
}

@media (max-width: 768px) {
  .registration-card {
    padding: 32px 24px;
  }

  .title {
    font-size: 20px;
  }

  .message {
    font-size: 14px;
  }
}
</style>

