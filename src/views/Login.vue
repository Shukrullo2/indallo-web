<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">{{ t('app.title') }}</h1>
      <p class="login-subtitle">{{ t('app.login') }}</p>
      <button class="login-button" @click="handleLogin" :disabled="loading">
        <span v-if="loading">{{ t('app.loading') }}</span>
        <span v-else>{{ t('app.login') }}</span>
      </button>
      <p class="login-hint">
        {{ t('app.login') }} uchun Telegram botga o'ting
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useI18n } from '../utils/i18n'

const { login } = useAuth()
const { t } = useI18n()
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  login()
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.login-button {
  width: 100%;
  padding: 14px 24px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #006ba3;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-hint {
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}
</style>

