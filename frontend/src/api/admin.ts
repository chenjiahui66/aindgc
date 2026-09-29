/**
 * Admin API client
 *
 * All endpoints require ADMIN role (gated by backend SecurityConfig).
 * Axios interceptor already attaches JWT — just call these.
 */
import { get, post, put, del } from './request'

/* ───────────── Dashboard ───────────── */
export interface DashboardSummary {
  totalArticles: number
  totalCases: number
  totalTools: number
  totalUsers: number
  publishedArticles: number
  draftArticles: number
  publishedTools: number
  featuredArticles: number
  featuredCases: number
  recentArticles: Array<{ id: number; title: string; status: string; updatedAt: string }>
  users7d: Record<string, number>
}

export function fetchDashboardSummary() {
  return get<DashboardSummary>('/admin/dashboard/summary')
}

/* ───────────── Articles ───────────── */
export interface AdminArticle {
  id?: number
  slug: string
  title: string
  summary?: string
  content?: string
  cover?: string
  author?: string
  categoryId?: number
  categoryName?: string
  tags?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured?: number
  viewCount?: number
  likeCount?: number
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface PageEnvelope<T> {
  total: number
  records: T[]
  current: number
  size: number
}

export function listArticles(params: { page?: number; size?: number; status?: string; q?: string } = {}) {
  return get<PageEnvelope<AdminArticle>>('/admin/articles', { params })
}

export function getArticle(id: number) {
  return get<AdminArticle>(`/admin/articles/${id}`)
}

export function saveArticle(a: Partial<AdminArticle>) {
  return post<AdminArticle>('/admin/articles', a)
}

export function publishArticle(id: number, status = 'PUBLISHED') {
  return post<void>(`/admin/articles/${id}/publish`, null, { params: { status } })
}

export function featureArticle(id: number, featured: boolean) {
  return post<void>(`/admin/articles/${id}/feature`, null, { params: { featured } })
}

export function deleteArticle(id: number) {
  return del<void>(`/admin/articles/${id}`)
}

/* ───────────── Cases ───────────── */
export interface AdminCase {
  id?: number
  slug: string
  title: string
  summary?: string
  content?: string
  type?: 'REAL' | 'PROTOTYPE' | 'EXPERIMENT' | 'CONCEPT'
  industry?: string
  client?: string
  duration?: string
  role?: string
  cover?: string
  tags?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured?: number
  viewCount?: number
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export function listCases(params: { page?: number; size?: number; status?: string; type?: string } = {}) {
  return get<PageEnvelope<AdminCase>>('/admin/cases', { params })
}

export function getCase(id: number) {
  return get<AdminCase>(`/admin/cases/${id}`)
}

export function saveCase(c: Partial<AdminCase>) {
  return post<AdminCase>('/admin/cases', c)
}

export function publishCase(id: number, status = 'PUBLISHED') {
  return post<void>(`/admin/cases/${id}/publish`, null, { params: { status } })
}

export function featureCase(id: number, featured: boolean) {
  return post<void>(`/admin/cases/${id}/feature`, null, { params: { featured } })
}

export function deleteCase(id: number) {
  return del<void>(`/admin/cases/${id}`)
}

/* ───────────── Tools ───────────── */
export interface AdminTool {
  id?: number
  slug: string
  name: string
  description?: string
  longDescription?: string
  categoryId?: number
  categoryName?: string
  icon?: string
  cover?: string
  tags?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured?: number
  viewCount?: number
  generateCount?: number
  sort?: number
  createdAt?: string
  updatedAt?: string
}

export function listTools(params: { page?: number; size?: number; status?: string; q?: string } = {}) {
  return get<PageEnvelope<AdminTool>>('/admin/tools', { params })
}

export function getTool(id: number) {
  return get<AdminTool>(`/admin/tools/${id}`)
}

export function saveTool(t: Partial<AdminTool>) {
  return post<AdminTool>('/admin/tools', t)
}

export function publishTool(id: number, status = 'PUBLISHED') {
  return post<void>(`/admin/tools/${id}/publish`, null, { params: { status } })
}

export function featureTool(id: number, featured: boolean) {
  return post<void>(`/admin/tools/${id}/feature`, null, { params: { featured } })
}

export function deleteTool(id: number) {
  return del<void>(`/admin/tools/${id}`)
}

/* ───────────── Users ───────────── */
export interface AdminUserRow {
  id: number
  username: string
  email: string
  nickname: string
  status: number
  lastLoginAt: string
  createdAt: string
  role: 'USER' | 'ADMIN'
}

export function listUsers(params: { page?: number; size?: number; q?: string } = {}) {
  return get<PageEnvelope<AdminUserRow>>('/admin/users', { params })
}

export function setUserStatus(id: number, status: number) {
  return post<void>(`/admin/users/${id}/status`, null, { params: { status } })
}

export function setUserRole(id: number, role: 'ADMIN' | 'USER') {
  return post<void>(`/admin/users/${id}/role`, null, { params: { role } })
}

/* ───────────── Settings ───────────── */
export interface SiteConfig {
  id?: number
  configKey: string
  configValue: string
  valueType?: 'STRING' | 'JSON' | 'NUMBER' | 'BOOLEAN'
  description?: string
  isPublic?: number
  createdAt?: string
  updatedAt?: string
}

export function listSettings() {
  return get<SiteConfig[]>('/admin/settings')
}

export function updateSetting(key: string, body: Partial<SiteConfig>) {
  return put<SiteConfig>(`/admin/settings/${encodeURIComponent(key)}`, body)
}