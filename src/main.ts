import { createApp } from 'vue'
import { pinia } from './store'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

// Initialize i18n locale
import { useI18nStore } from './store/i18n'
const i18nStore = useI18nStore()
i18nStore.initLocale()

app.mount('#app')
