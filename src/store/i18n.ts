import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<string>('uz')

  const setLocale = (newLocale: string) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const initLocale = () => {
    const saved = localStorage.getItem('locale')
    if (saved && ['uz', 'ru', 'en'].includes(saved)) {
      locale.value = saved
    }
  }

  return {
    locale,
    setLocale,
    initLocale,
  }
})

