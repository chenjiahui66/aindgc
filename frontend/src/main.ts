import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

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

// Global error handler
app.config.errorHandler = (err, _instance, info) => {
  // eslint-disable-next-line no-console
  console.error('[Global Error]', err, info)
}

app.mount('#app')
