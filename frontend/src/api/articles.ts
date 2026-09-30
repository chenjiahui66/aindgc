/**
 * Public articles API
 *
 * Used by InsightsIndexView and ArticleDetailView. Falls back to local
 * utils/articlesData.ts when the backend is unreachable.
 */
import { get, post } from './request'
import type { Article as LocalArticle } from '@utils/articlesData'

/* ── Raw backend shapes ── */
export interface ApiArticle {
  id: number
  slug: string
  title: string
  summary?: string
  contentMd?: string
  cover?: string
  authorId?: number
  categoryId?: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  status?: string
  isFeatured?: number
  viewCount?: number
  likeCount?: number
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface ArticleEngagement {
  viewCount: number
  likeCount: number
}

export interface ApiArticleTag {
  id: number
  slug: string
  name: string
}

export interface ApiArticleCategory {
  id: number
  slug: string
  name: string
  description?: string
  sort?: number
}

export interface ApiArticleDetail {
  article: ApiArticle
  tags: ApiArticleTag[]
}

export interface ApiPage<T> {
  list: T[]
  total: number
  page: number
  size: number
}

/* ── Endpoints ── */
export function listArticles(params: { page?: number; size?: number; category?: string; tag?: string; q?: string } = {}) {
  return get<ApiPage<ApiArticle>>('/articles', { params })
}

export function fetchFeaturedArticles(limit = 3) {
  return get<ApiArticle[]>(`/articles/featured?limit=${limit}`)
}

export function fetchArticleCategories() {
  return get<ApiArticleCategory[]>('/articles/categories')
}

export function fetchArticleTags() {
  return get<ApiArticleTag[]>('/articles/tags')
}

export function fetchArticleDetail(slug: string) {
  return get<ApiArticleDetail>(`/articles/${slug}`)
}

export function likeArticle(slug: string) {
  return post<{ likeCount: number }>(`/articles/${slug}/like`)
}

/* ── Adapter: API → local Article shape ── */
export function adaptArticle(
  a: ApiArticle,
  tags: ApiArticleTag[] = [],
  categoryMap: Map<number, ApiArticleCategory> = new Map()
): LocalArticle {
  const wordCount = (a.contentMd || '').trim().split(/\s+/).filter(Boolean).length
  const readMinutes = Math.max(1, Math.round(wordCount / 220))
  const cat = a.categoryId != null ? categoryMap.get(a.categoryId) : undefined
  return {
    slug: a.slug,
    title: a.title,
    summary: a.summary || '',
    content: a.contentMd || '',
    category: cat?.slug || 'all',
    tags: tags.map(t => t.name),
    author: 'Aindgc',  // authorId → User lookup not yet exposed via public API
    publishedAt: (a.publishedAt || '').slice(0, 10),
    readMinutes,
    featured: a.isFeatured === 1,
    cover: a.cover,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription || a.summary
  }
}

export function extractEngagement(a: ApiArticle): ArticleEngagement {
  return {
    viewCount: a.viewCount ?? 0,
    likeCount: a.likeCount ?? 0
  }
}

export function adaptArticleFromList(
  a: ApiArticle,
  categoryMap: Map<number, ApiArticleCategory> = new Map()
): LocalArticle {
  return adaptArticle(a, [], categoryMap)
}

export function buildCategoryMap(cats: ApiArticleCategory[]): Map<number, ApiArticleCategory> {
  return new Map(cats.map(c => [c.id, c]))
}