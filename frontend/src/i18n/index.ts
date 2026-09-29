/**
 * vue-i18n setup
 *
 * - Default locale: zh
 * - Auto-detect from localStorage → browser → fallback zh
 * - Update <html lang> on locale change for SEO + a11y
 *
 * Note: Editorial content (articles, cases, tools, skills, coding templates)
 * is NOT translated — those live in source files in their original language.
 * To localize content in the future, swap data source to backend CMS.
 */
import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

export type Locale = 'zh' | 'en'
export const SUPPORTED_LOCALES: Locale[] = ['zh', 'en']

const LOCALE_STORAGE_KEY = 'aindgc_locale'

/**
 * Resolve initial locale:
 *   1. localStorage (user explicit choice)
 *   2. browser navigator language
 *   3. fallback to 'zh'
 */
function detectInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  } catch { /* ignore */ }

  if (typeof navigator !== 'undefined') {
    const lang = (navigator.language || '').toLowerCase()
    if (lang.startsWith('en')) return 'en'
  }
  return 'zh'
}

const initial = detectInitialLocale()

export const i18n = createI18n<false>({
  legacy: false,           // Vue 3 Composition API style
  globalInjection: true,   // enable $t in templates
  locale: initial,
  fallbackLocale: 'zh',
  messages: { zh, en }
})

/**
 * Switch locale at runtime. Persists + updates <html lang>.
 */
export function setLocale(loc: Locale) {
  if (!SUPPORTED_LOCALES.includes(loc)) return
  i18n.global.locale.value = loc
  try { localStorage.setItem(LOCALE_STORAGE_KEY, loc) } catch { /* ignore */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = loc === 'zh' ? 'zh-CN' : 'en'
  }
}

/**
 * Get current locale.
 */
export function getLocale(): Locale {
  return i18n.global.locale.value as Locale
}

/**
 * Locale display label for switchers.
 */
export const LOCALE_LABEL: Record<Locale, string> = {
  zh: '中文',
  en: 'English'
}

export default i18n