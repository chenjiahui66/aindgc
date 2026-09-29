import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@api/auth'
import type { User } from '@api/auth'

const TOKEN_KEY = 'aindgc_token'
const REFRESH_KEY = 'aindgc_refresh'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_KEY))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const displayName = computed(() => user.value?.nickname || user.value?.username || '')

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  async function login(username: string, password: string) {
    loading.value = true
    try {
      const res = await authApi.login(username, password)
      setTokens(res.accessToken, res.refreshToken)
      user.value = res.user
      return res.user
    } finally {
      loading.value = false
    }
  }

  async function register(payload: { username: string; email: string; password: string; nickname?: string }) {
    loading.value = true
    try {
      const res = await authApi.register(payload)
      setTokens(res.accessToken, res.refreshToken)
      user.value = res.user
      return res.user
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return null
    try {
      user.value = await authApi.fetchMe()
      return user.value
    } catch {
      // token invalid → silent clear
      clearTokens()
      user.value = null
      return null
    }
  }

  async function logout() {
    try { await authApi.logout() } catch { /* ignore */ }
    clearTokens()
    user.value = null
  }

  function init() {
    if (accessToken.value) {
      fetchMe()
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    isAdmin,
    displayName,
    login,
    register,
    fetchMe,
    logout,
    init
  }
})
