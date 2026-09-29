/**
 * Public tools API
 *
 * Used by ToolsIndexView and any other public tool-listing UI.
 * Falls back to local utils/toolCatalog.ts when backend is unreachable.
 */
import { get } from './request'
import type { ToolMeta } from '@utils/toolCatalog'

/* ── Raw backend shapes ── */
export interface ApiTool {
  id: number
  slug: string
  name: string
  description?: string
  longDescription?: string
  categoryId?: number
  icon?: string
  cover?: string
  tags?: string
  status?: string
  featured?: number
  viewCount?: number
  generateCount?: number
  sort?: number
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiToolCategory {
  id: number
  slug: string
  name: string
  description?: string
  sort?: number
}

/* ── Endpoints ── */
export function listTools() {
  return get<ApiTool[]>('/tools')
}

export function fetchFeaturedTools(limit = 6) {
  return get<ApiTool[]>(`/tools/featured?limit=${limit}`)
}

export function fetchToolCategories() {
  return get<ApiToolCategory[]>('/tools/categories')
}

export function fetchToolDetail(slug: string) {
  return get<ApiTool>(`/tools/${slug}`)
}

/* ── Adapter: API → local ToolMeta shape ── */
const CATEGORY_TO_TOOLMETA: Record<string, ToolMeta['category']> = {
  workflow: 'workflow',
  skill:    'skill',
  context:  'context',
  coding:   'coding',
  prompt:   'prompt',
  schema:   'schema'
}

export function adaptTool(
  t: ApiTool,
  categoryMap: Map<number, ApiToolCategory> = new Map()
): ToolMeta {
  const cat = t.categoryId != null ? categoryMap.get(t.categoryId) : undefined
  const category = (cat?.slug as ToolMeta['category']) || 'workflow'
  return {
    slug: t.slug,
    name: t.name,
    tagline: t.description || '',
    description: t.longDescription || t.description || '',
    iconName: t.icon || 'tool',
    category: CATEGORY_TO_TOOLMETA[category] || 'workflow',
    outputFormats: ['md', 'json'],
    complexity: 'beginner',
    to: `/tools/${t.slug}`,
    faqs: [],
    related: []
  }
}

export function buildToolCategoryMap(cats: ApiToolCategory[]): Map<number, ApiToolCategory> {
  return new Map(cats.map(c => [c.id, c]))
}