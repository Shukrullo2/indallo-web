import { computed } from 'vue'
import { useI18nStore } from '../store/i18n'
import uz from '../locales/uz.json'
import ru from '../locales/ru.json'
import en from '../locales/en.json'

const translations: Record<string, any> = {
  uz,
  ru,
  en,
}

export function useI18n() {
  const store = useI18nStore()

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[store.locale]

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        // Fallback to Uzbek if translation not found
        value = translations.uz
        for (const k2 of keys) {
          value = value?.[k2]
        }
        break
      }
    }

    return value || key
  }

  const currentLocale = computed(() => store.locale)

  return {
    t,
    locale: currentLocale,
    setLocale: store.setLocale,
  }
}

