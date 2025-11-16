<template>
  <div class="language-switcher">
    <label class="switcher-label">{{ t('profile.language') }}</label>
    <div class="switcher-options">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="lang-button"
        :class="{ active: currentLocale === lang.code }"
        @click="handleSelect(lang.code)"
      >
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../utils/i18n'

interface Props {
  currentLocale: string
}

defineProps<Props>()

const emit = defineEmits<{
  update: [locale: string]
}>()

const { t } = useI18n()

const languages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
]

const handleSelect = (code: string) => {
  emit('update', code)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.switcher-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.switcher-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.lang-button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.lang-button:hover {
  border-color: #0088cc;
  color: #0088cc;
}

.lang-button.active {
  background: #0088cc;
  border-color: #0088cc;
  color: white;
}
</style>

