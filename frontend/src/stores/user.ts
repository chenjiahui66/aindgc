import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@api/auth'
import type { User } from '@api/auth'

const TOKEN_KEY = 'aindgc_token'
const REFRESH_KEY = 'aindgc_refresh'
// Persisted so router/index.ts's guard can check the role synchronously on a
// hard reload or a direct URL hit, before Pinia has had a chance to re-fetch
// the profile. Without this the guard always saw `null` and bounced admins
// back to the homepage.
const USER_KEY = 'aindgc_user'

function persistUser(u: User | null) {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
  else localStorage.removeItem(USER_KEY)
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_KEY))
  // Rehydrate synchronously from storage so the first route guard pass can see
  // the role without waiting on fetchMe().
  try {
    const cached = localStorage.getItem(USER_KEY)
    if (cached) user.value = JSON.parse(cached) as User
  } catch {
    localStorage.removeItem(USER_KEY)
  }
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
    // Never leave a stale role behind: the guard trusts this cache, so a
    // leftover ADMIN entry would keep admin routes reachable after the
    // session is gone.
    persistUser(null)
  }

  async function login(username: string, password: string) {
    loading.value = true
    try {
      const res = await authApi.login(username, password)
      setTokens(res.accessToken, res.refreshToken)
      user.value = res.user
      persistUser(res.user)
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
      persistUser(res.user)
      return res.user
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return null
    try {
      user.value = await authApi.fetchMe()
      persistUser(user.value)
      return user.value
    } catch {
      // token invalid → silent clear
      clearTokens()
      user.value = null
      persistUser(null)
      return null
    }
  }

  async function logout() {
    try { await authApi.logout() } catch { /* ignore */ }
    clearTokens()
    user.value = null
    persistUser(null)
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
