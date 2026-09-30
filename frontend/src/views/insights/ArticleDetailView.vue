<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useSEO } from '@composables/useSEO'
import { useJsonLd, SITE_URL } from '@composables/useJsonLd'
import {
  fetchArticleDetail, fetchArticleCategories,
  adaptArticle, buildCategoryMap, likeArticle,
  extractEngagement, type ArticleEngagement
} from '@api/articles'
import { useToast } from '@/composables/useToast'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Stack from '@components/layout/Stack.vue'
import Grid from '@components/layout/Grid.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import ACard from '@components/common/ACard.vue'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import ASkeleton from '@components/common/ASkeleton.vue'
import AEmpty from '@components/common/AEmpty.vue'
import { getArticle, getRelatedArticles, ARTICLE_CATEGORIES } from '@utils/articlesData'
import { renderMarkdownLite } from '@utils/markdown'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const article = ref(getArticle(slug.value))
const engagement = ref<ArticleEngagement>({ viewCount: 0, likeCount: 0 })
const loading = ref(!article.value)
const isOffline = ref(false)
const notFound = ref(false)
const liking = ref(false)
const toast = useToast()

// localStorage dedupe key — one like per article per browser
const LIKE_KEY_PREFIX = 'aindgc_liked_'

function hasLiked(s: string): boolean {
  try { return localStorage.getItem(LIKE_KEY_PREFIX + s) === '1' } catch { return false }
}
function markLiked(s: string) {
  try { localStorage.setItem(LIKE_KEY_PREFIX + s, '1') } catch { /* ignore */ }
}

async function load() {
  if (article.value) {
    // local fallback already present — try API silently for fresh data
    try {
      const detail = await fetchArticleDetail(slug.value)
      const cats = await fetchArticleCategories().catch(() => [])
      const catMap = buildCategoryMap(cats || [])
      article.value = adaptArticle(detail.article, detail.tags || [], catMap)
      engagement.value = extractEngagement(detail.article)
    } catch {
      isOffline.value = true
    }
    return
  }
  loading.value = true
  try {
    const detail = await fetchArticleDetail(slug.value)
    const cats = await fetchArticleCategories().catch(() => [])
    const catMap = buildCategoryMap(cats || [])
    article.value = adaptArticle(detail.article, detail.tags || [], catMap)
    engagement.value = extractEngagement(detail.article)
  } catch {
    const local = getArticle(slug.value)
    if (local) {
      article.value = local
      isOffline.value = true
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
}

async function onLike() {
  if (!article.value || liking.value) return
  if (hasLiked(article.value.slug)) {
    toast.info('Already liked — one per browser')
    return
  }
  liking.value = true
  // Optimistic increment
  engagement.value = { ...engagement.value, likeCount: engagement.value.likeCount + 1 }
  try {
    const res = await likeArticle(article.value.slug)
    if (typeof res.likeCount === 'number') {
      engagement.value = { ...engagement.value, likeCount: res.likeCount }
    }
    markLiked(article.value.slug)
    toast.success('Thanks for the like')
  } catch {
    // Roll back optimistic
    engagement.value = { ...engagement.value, likeCount: Math.max(0, engagement.value.likeCount - 1) }
    toast.error('Could not save like — try again later')
  } finally {
    liking.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, () => load())

const related = computed(() => article.value ? getRelatedArticles(slug.value) : [])

useSEO({
  title: article.value ? `${article.value.title} — Insights · Aindgc` : 'Article not found',
  description: article.value?.seoDescription || article.value?.summary,
  keywords: article.value?.tags.join(', '),
  ogType: 'article'
})

useJsonLd('article', computed(() => {
  if (!article.value) return null
  const a = article.value
  const url = `${SITE_URL}/insights/${a.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': a.title,
      'description': a.summary,
      'image': a.cover ? [a.cover] : undefined,
      'datePublished': a.publishedAt,
      'dateModified': a.publishedAt,
      'author': { '@type': 'Person', 'name': a.author || 'Aindgc' },
      'publisher': {
        '@type': 'Organization',
        'name': 'Aindgc',
        'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/favicon.svg` }
      },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
      'keywords': a.tags.join(', '),
      'articleSection': ARTICLE_CATEGORIES.find(c => c.slug === a.category)?.name || a.category,
      'interactionStatistic': [
        { '@type': 'InteractionCounter', 'interactionType': { '@type': 'ViewAction' }, 'userInteractionCount': engagement.value.viewCount },
        { '@type': 'InteractionCounter', 'interactionType': { '@type': 'LikeAction' }, 'userInteractionCount': engagement.value.likeCount }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home',  'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Insights', 'item': `${SITE_URL}/insights` },
        { '@type': 'ListItem', 'position': 3, 'name': a.title,  'item': url }
      ]
    }
  ]
}))

function renderMd(md: string): string {
  return renderMarkdownLite(md)
}

function categoryName(s?: string): string {
  if (!s) return ''
  return ARTICLE_CATEGORIES.find(c => c.slug === s)?.name || s
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString()
}
</script>

<template>
  <main v-if="loading">
    <Section py="xl">
      <Container>
        <ASkeleton height="60px" width="80%" />
        <div style="margin-top: 16px;">
          <ASkeleton :rows="3" />
        </div>
      </Container>
    </Section>
  </main>

  <main v-else-if="notFound">
    <Section py="xl">
      <Container>
        <ACard>
          <AEmpty
            icon-name="search-x"
            title="Article not found"
            description="This article doesn't exist or has been moved."
          >
            <RouterLink to="/insights">
              <AButton variant="primary">Back to insights</AButton>
            </RouterLink>
          </AEmpty>
        </ACard>
      </Container>
    </Section>
  </main>

  <main v-else-if="article">
    <div v-if="isOffline" class="offline-banner">
      <Container>
        <AIcon name="wifi-off" :size="14" />
        <span>Showing cached version — backend unreachable.</span>
      </Container>
    </div>

    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'Insights', to: '/insights' },
          { label: article.title }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container size="lg">
        <div class="article-hero">
          <div class="meta-row">
            <ATag tone="primary" size="md">
              {{ categoryName(article.category) }}
            </ATag>
            <span class="meta-item">
              <AIcon name="calendar" :size="14" />
              {{ article.publishedAt }}
            </span>
            <span class="meta-item">
              <AIcon name="clock" :size="14" />
              {{ article.readMinutes }} min read
            </span>
            <span class="meta-item">
              <AIcon name="user" :size="14" />
              {{ article.author }}
            </span>
          </div>
          <h1 class="title">{{ article.title }}</h1>
          <p class="summary">{{ article.summary }}</p>
          <div v-if="article.tags.length" class="tag-row">
            <ATag v-for="t in article.tags" :key="t" tone="neutral" size="sm">#{{ t }}</ATag>
          </div>
        </div>
      </Container>
    </Section>

    <Section py="md">
      <Container size="md">
        <article class="article-body" v-html="renderMd(article.content)" />

        <footer class="article-foot">
          <div class="engagement-bar">
            <button
              class="like-btn"
              :class="{ liked: hasLiked(article.slug), loading: liking }"
              :disabled="liking"
              type="button"
              @click="onLike"
            >
              <AIcon
                :name="hasLiked(article.slug) ? 'heart-handshake' : 'heart'"
                :size="16"
              />
              <span v-if="hasLiked(article.slug)">Liked</span>
              <span v-else>Like this article</span>
              <span v-if="engagement.likeCount > 0" class="count">{{ formatCount(engagement.likeCount) }}</span>
            </button>

            <div class="stat-row">
              <span class="stat" :title="`${engagement.viewCount.toLocaleString()} views`">
                <AIcon name="eye" :size="14" />
                <span>{{ formatCount(engagement.viewCount) }} views</span>
              </span>
              <span class="stat-sep" aria-hidden="true">·</span>
              <span class="stat">
                <AIcon name="clock" :size="14" />
                <span>{{ article.readMinutes }} min read</span>
              </span>
              <span class="stat-sep" aria-hidden="true">·</span>
              <span class="stat">
                <AIcon name="calendar" :size="14" />
                <span>{{ article.publishedAt }}</span>
              </span>
            </div>
          </div>

          <div v-if="article.tags.length" class="foot-tags">
            <span class="foot-tags-label">Tagged:</span>
            <ATag v-for="t in article.tags" :key="t" tone="neutral" size="sm">#{{ t }}</ATag>
          </div>
        </footer>
      </Container>
    </Section>

    <Section v-if="related.length" py="lg" bg="elevated">
      <Container size="lg">
        <header class="rel-head">
          <h2>Related insights</h2>
          <RouterLink to="/insights" class="see-all">
            All insights <AIcon name="arrow-right" :size="14" />
          </RouterLink>
        </header>
        <Grid :cols="{ sm: 1, md: 3 }" :gap="4">
          <RouterLink v-for="r in related" :key="r.slug" :to="`/insights/${r.slug}`" class="rel-card">
            <ATag tone="primary" size="sm">
              {{ categoryName(r.category) }}
            </ATag>
            <h3>{{ r.title }}</h3>
            <p>{{ r.summary }}</p>
            <span class="rel-foot">
              {{ r.readMinutes }} min · {{ r.publishedAt }}
            </span>
          </RouterLink>
        </Grid>
      </Container>
    </Section>
  </main>
</template>

<style scoped>
main { padding-bottom: var(--space-9); }

.offline-banner {
  background: rgba(255, 184, 80, 0.06);
  border-bottom: 1px solid rgba(255, 184, 80, 0.18);
  padding: 8px 0;
  font-size: 12px;
  color: #ffb850;
}
.offline-banner > * {
  display: flex;
  align-items: center;
  gap: 8px;
}

.article-hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  line-height: var(--lh-tight);
  color: var(--text-primary);
  margin: 0;
}
.summary {
  font-size: var(--fs-body-lg);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  margin: 0;
  max-width: 720px;
}
.tag-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: var(--space-2);
}

/* Article body */
.article-body {
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  font-size: var(--fs-body-lg);
}
.article-body :deep(p) {
  margin: 0 0 var(--space-4) 0;
}
.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  color: var(--text-primary);
  letter-spacing: var(--letter-tight);
  margin: var(--space-7) 0 var(--space-3) 0;
}
.article-body :deep(h1) { font-size: var(--fs-h1); font-weight: 600; }
.article-body :deep(h2) {
  font-size: var(--fs-h2);
  font-weight: 600;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}
.article-body :deep(h3) {
  font-size: var(--fs-h4);
  font-weight: 600;
}
.article-body :deep(strong) { color: var(--text-primary); font-weight: 600; }
.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 0 0 var(--space-4) 0;
  padding-left: var(--space-5);
}
.article-body :deep(ul li) {
  list-style: disc;
  display: list-item;
  margin-bottom: var(--space-2);
}
.article-body :deep(ol li) {
  list-style: decimal;
  display: list-item;
  margin-bottom: var(--space-2);
}
.article-body :deep(code) {
  font-family: var(--font-mono);
  background: var(--surface-1);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--accent-secondary);
  font-size: 0.92em;
}
.article-body :deep(pre) {
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  overflow-x: auto;
  margin: var(--space-4) 0;
}
.article-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--text-primary);
  font-size: var(--fs-body-sm);
}
.article-body :deep(blockquote) {
  border-left: 3px solid var(--accent-primary);
  padding: 4px 0 4px var(--space-4);
  margin: var(--space-4) 0;
  color: var(--text-primary);
  background: rgba(111, 168, 255, 0.04);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.article-body :deep(blockquote p) { margin: 0; }
.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-4) 0;
  font-size: var(--fs-body);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.article-body :deep(th),
.article-body :deep(td) {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
}
.article-body :deep(tr:last-child td) { border-bottom: none; }
.article-body :deep(th) {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  background: var(--surface-1);
}
.article-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: var(--space-7) 0;
}

/* Engagement footer */
.article-foot {
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-subtle);
}
.engagement-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
}
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 118, 118, 0.06);
  border: 1px solid rgba(255, 118, 118, 0.18);
  border-radius: var(--radius-full);
  color: #ff8e8e;
  font-family: var(--font-body);
  font-size: var(--fs-body-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.like-btn:hover {
  background: rgba(255, 118, 118, 0.12);
  border-color: rgba(255, 118, 118, 0.32);
  transform: translateY(-1px);
}
.like-btn:disabled {
  cursor: default;
  opacity: 0.7;
}
.like-btn.liked {
  background: rgba(255, 118, 118, 0.16);
  border-color: rgba(255, 118, 118, 0.45);
  color: #ff7676;
}
.like-btn.loading {
  opacity: 0.6;
}
.like-btn .count {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  padding: 1px 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.stat-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-tertiary);
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.stat-sep {
  opacity: 0.5;
}

.foot-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.foot-tags-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-right: 4px;
}

/* Related */
.rel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
  gap: var(--space-3);
}
.rel-head h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}
.see-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}
.see-all:hover { color: var(--accent-primary); }

.rel-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all var(--duration-base) var(--ease-standard);
}
.rel-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}
.rel-card h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}
.rel-card p {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: var(--lh-relaxed);
  flex: 1;
}
.rel-foot {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
}
</style>