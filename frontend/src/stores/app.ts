import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const theme = ref<'dark' | 'light'>('dark')
  const sidebarCollapsed = ref(false)
  const isLoading = ref(false)

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setLoading(v: boolean) {
    isLoading.value = v
  }

  return { theme, sidebarCollapsed, isLoading, toggleTheme, toggleSidebar, setLoading }
})
