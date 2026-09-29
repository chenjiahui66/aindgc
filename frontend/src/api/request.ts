import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  traceId?: string
}

const TOKEN_KEY = 'aindgc_token'
const REFRESH_KEY = 'aindgc_refresh'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: attach JWT
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: unwrap response + auto-refresh on 401
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const data = response.data
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 200) {
        return data as unknown as AxiosResponse
      }
      if (data.code === 401) {
        // 401 from a non-refresh, non-auth endpoint → try refresh
        const url = response.config?.url || ''
        const isAuthEndpoint =
          url.includes('/auth/login') ||
          url.includes('/auth/register') ||
          url.includes('/auth/refresh')
        if (!isAuthEndpoint) {
          return handleUnauthorized(response.config).then(() => {
            // After successful refresh, retry the original request
            // Note: the original request's authorization header is now stale
            // (will be reattached by the request interceptor on retry)
            return request.request(response.config!)
          })
        }
      }
      const err = new Error(data.message || 'Request failed') as Error & { code?: number }
      err.code = data.code
      return Promise.reject(err)
    }
    return response
  },
  (error) => {
    // Network-level error or rejected refresh
    // eslint-disable-next-line no-console
    if (error?.code !== 'ERR_CANCELED') {
      console.error('[Request Error]', error?.message || error)
    }
    return Promise.reject(error)
  }
)

/* ──── Token refresh logic ──── */
let refreshInFlight: Promise<string | null> | null = null

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Dedupes concurrent refresh calls — multiple 401s share one refresh.
 *
 * Returns the new access token on success, or null on failure.
 */
function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight

  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) {
    forceLogout()
    return Promise.resolve(null)
  }

  refreshInFlight = axios
    .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${import.meta.env.VITE_API_BASE || '/api'}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    )
    .then((resp) => {
      if (resp.data.code === 200 && resp.data.data?.accessToken) {
        const { accessToken, refreshToken: newRefresh } = resp.data.data
        localStorage.setItem(TOKEN_KEY, accessToken)
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh)
        return accessToken
      }
      forceLogout()
      return null
    })
    .catch((err) => {
      console.warn('[Token Refresh] failed:', err?.message)
      forceLogout()
      return null
    })
    .finally(() => {
      refreshInFlight = null
    })

  return refreshInFlight
}

async function handleUnauthorized(originalConfig?: InternalAxiosRequestConfig): Promise<void> {
  const newToken = await refreshAccessToken()
  if (!newToken) return
  // The retry is handled by the caller (interceptor above) — they re-issue
  // the original request, which picks up the new token from the request interceptor.
}

function forceLogout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  if (typeof window !== 'undefined') {
    // Avoid redirect loop if already on /login
    const path = window.location.pathname
    const isAuthPage = path === '/login' || path === '/register'
    if (!isAuthPage) {
      // Use replace to avoid leaving the failed page in history
      window.location.replace(`/login?redirect=${encodeURIComponent(path)}`)
    }
  }
}

export function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get<unknown, T>(url, config)
}

export function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request.post<unknown, T>(url, data, config)
}

export function put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request.put<unknown, T>(url, data, config)
}

export function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete<unknown, T>(url, config)
}

export default request