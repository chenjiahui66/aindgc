import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from '@/i18n'

// Design System tokens & reset (must be first)
import '@design/reset.css'
import '@design/tokens.css'
import '@design/typography.css'
import '@design/element-overrides.css'
import '@design/main.css'
import '@components/workflow/nodeTheme.css'

// Element Plus base CSS
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Sync <html lang> with initial locale (for SEO + screen readers)
document.documentElement.lang = i18n.global.locale.value === 'zh' ? 'zh-CN' : 'en'

// Global error handler
app.config.errorHandler = (err, _instance, info) => {
  // eslint-disable-next-line no-console
  console.error('[Global Error]', err, info)
}

app.mount('#app')
