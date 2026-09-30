/**
 * Public cases API
 *
 * Used by CasesIndexView and CaseDetailView. Falls back to local
 * utils/casesData.ts when the backend is unreachable.
 */
import { get } from './request'
import type { CaseStudy as LocalCase, CaseType } from '@utils/casesData'

/* ── Raw backend shapes ── */
export interface ApiCase {
  id: number
  slug: string
  title: string
  summary?: string
  /** Legacy single-blob body. Prefer the per-section fields below. */
  contentMd?: string
  problemMd?: string
  thinkingMd?: string
  approachMd?: string
  architectureMd?: string
  implementationMd?: string
  resultMd?: string
  learnedMd?: string
  type?: CaseType
  categoryId?: number
  industry?: string
  client?: string
  duration?: string
  role?: string
  cover?: string
  repoUrl?: string
  demoUrl?: string
  technologiesJson?: string
  aiModelsJson?: string
  status?: string
  isFeatured?: number
  viewCount?: number
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiCaseCategory {
  id: number
  slug: string
  name: string
  description?: string
  sort?: number
}

export interface ApiPage<T> {
  list: T[]
  total: number
  page: number
  size: number
}

/* ── Endpoints ── */
export function listCases(params: { page?: number; size?: number; category?: string; type?: string } = {}) {
  return get<ApiPage<ApiCase>>('/cases', { params })
}

export function fetchFeaturedCases(limit = 3) {
  return get<ApiCase[]>(`/cases/featured?limit=${limit}`)
}

export function fetchCaseCategories() {
  return get<ApiCaseCategory[]>('/cases/categories')
}

export function fetchCaseDetail(slug: string) {
  return get<ApiCase>(`/cases/${slug}`)
}

/* ── Adapter ── */
// The backend stores each narrative section in its own column (problemMd..learnedMd).
// Older admin-authored rows may still carry a single contentMd blob, so we keep the
// H2-splitting fallback and prefer the dedicated field whenever it is present.
export function adaptCase(c: ApiCase, categoryMap: Map<number, ApiCaseCategory> = new Map()): LocalCase {
  const sections = splitMarkdownSections(c.contentMd || '')
  const cat = c.categoryId != null ? categoryMap.get(c.categoryId) : undefined
  return {
    slug: c.slug,
    title: c.title,
    summary: c.summary || '',
    cover: c.cover,
    type: (c.type || 'CONCEPT') as CaseType,
    category: cat?.slug || 'all',
    technologies: parseJsonArray(c.technologiesJson),
    aiModels: parseJsonArray(c.aiModelsJson),
    repoUrl: c.repoUrl,
    demoUrl: c.demoUrl,
    publishedAt: (c.publishedAt || '').slice(0, 10),
    problem: c.problemMd || sections.problem || sections.intro || '',
    thinking: c.thinkingMd || sections.thinking || sections.context || '',
    approach: c.approachMd || sections.approach || sections.solution || '',
    architecture: c.architectureMd || sections.architecture || sections.design || '',
    implementation: c.implementationMd || sections.implementation || sections.build || '',
    result: c.resultMd || sections.result || sections.outcome || '',
    learned: c.learnedMd || sections.learned || sections.lessons || '',
    featured: c.isFeatured === 1
  }
}

export function buildCaseCategoryMap(cats: ApiCaseCategory[]): Map<number, ApiCaseCategory> {
  return new Map(cats.map(c => [c.id, c]))
}

/* ── helpers ── */
/** Parse a MySQL JSON column into a string array; tolerate a plain CSV value. */
function parseJsonArray(s?: string): string[] {
  if (!s) return []
  try {
    const parsed = JSON.parse(s)
    if (Array.isArray(parsed)) return parsed.map(String)
  } catch { /* not JSON — fall through to CSV */ }
  return s.split(/[,;|]/).map(t => t.trim()).filter(Boolean)
}

/**
 * Split markdown into named sections by H2 headings.
 *
 * Accepts the following heading aliases so admin writers can use any:
 *   problem | intro
 *   thinking | context
 *   approach | solution
 *   architecture | design
 *   implementation | build
 *   result | outcome
 *   learned | lessons
 */
function splitMarkdownSections(md: string): Record<string, string> {
  const result: Record<string, string> = {}
  const blocks = md.split(/^##\s+/m)
  for (const block of blocks) {
    if (!block.trim()) continue
    const newlineIdx = block.indexOf('\n')
    if (newlineIdx === -1) continue
    const heading = block.slice(0, newlineIdx).trim().toLowerCase()
    const body = block.slice(newlineIdx + 1).trim()
    if (body) result[heading] = body
  }
  return result
}