import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = (() => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw == null ? defaultValue : (JSON.parse(raw) as T)
    } catch {
      return defaultValue
    }
  })()

  const state = ref(stored) as Ref<T>

  watch(state, (val) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch {
      /* ignore quota / serialization errors */
    }
  }, { deep: true })

  return state
}
