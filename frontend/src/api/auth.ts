import { post, get } from './request'

export interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar?: string
  role: 'USER' | 'ADMIN'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

export function login(username: string, password: string) {
  return post<AuthResponse>('/auth/login', { username, password })
}

export function register(payload: { username: string; email: string; password: string; nickname?: string }) {
  return post<AuthResponse>('/auth/register', payload)
}

export function fetchMe() {
  return get<User>('/auth/me')
}

export function logout() {
  return post<void>('/auth/logout')
}

export function refresh(refreshToken: string) {
  return post<AuthResponse>('/auth/refresh', { refreshToken })
}
