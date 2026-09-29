/**
 * Locale store — bridges Pinia state and vue-i18n.
 *
 * The store mirrors the current i18n locale so any component can
 * `storeToRefs` and react to changes; setLocale() updates both.
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { setLocale, getLocale, SUPPORTED_LOCALES, LOCALE_LABEL, type Locale } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const current = ref<Locale>(getLocale())

  // Sync from external setLocale() calls (e.g. on app boot)
  watch(current, (v) => setLocale(v), { flush: 'post' })

  function switchTo(loc: Locale) {
    current.value = loc
  }

  function toggle() {
    current.value = current.value === 'zh' ? 'en' : 'zh'
  }

  const label = computed(() => LOCALE_LABEL[current.value])
  const supported = computed(() => SUPPORTED_LOCALES)

  return {
    current,
    label,
    supported,
    switchTo,
    toggle
  }
})