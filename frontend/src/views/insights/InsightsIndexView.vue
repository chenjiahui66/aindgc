<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSEO } from '@composables/useSEO'
import {
  listArticles, fetchArticleCategories, fetchArticleTags,
  adaptArticleFromList, buildCategoryMap,
  type ApiArticleTag
} from '@api/articles'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Grid from '@components/layout/Grid.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import AEmpty from '@components/common/AEmpty.vue'
import ASkeleton from '@components/common/ASkeleton.vue'
import ArticleCard from '@components/home/ArticleCard.vue'
import {
  ARTICLES, ARTICLE_CATEGORIES, ALL_TAGS, type Article
} from '@utils/articlesData'

useSEO({
  title: 'Insights — Aindgc',
  description: 'AI 行业观察、思考、实验笔记。Agent、Workflow、Coding、Business、Productivity。',
  keywords: 'AI Insights, AI Blog, AI Agent, AI Workflow, AI Coding, AI Business'
})

// Remote data
const allArticles = ref<Article[]>([])
const tagList = ref<ApiArticleTag[]>([])
const loading = ref(true)
const isOffline = ref(false)
const queryDebounce = ref<ReturnType<typeof setTimeout> | null>(null)

async function load() {
  loading.value = true
  try {
    const [page, cats, tags] = await Promise.all([
      listArticles({ page: 1, size: 50 }),
      fetchArticleCategories().catch(() => []),
      fetchArticleTags().catch(() => [])
    ])
    const categoryMap = buildCategoryMap(cats || [])
    allArticles.value = page.list.map(r => adaptArticleFromList(r, categoryMap))
    tagList.value = tags || []
    isOffline.value = false
  } catch {
    allArticles.value = [...ARTICLES]
    isOffline.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const category = ref<string>('all')
const tag = ref<string>('')
const query = ref('')
const debouncedQuery = ref('')

watch(query, (v) => {
  if (queryDebounce.value) clearTimeout(queryDebounce.value)
  queryDebounce.value = setTimeout(() => {
    debouncedQuery.value = v
  }, 200)
})

const filtered = computed(() => {
  return allArticles.value.filter(a => {
    if (category.value !== 'all' && a.category !== category.value) return false
    if (tag.value && !a.tags.includes(tag.value)) return false
    if (debouncedQuery.value.trim()) {
      const q = debouncedQuery.value.toLowerCase()
      return a.title.toLowerCase().includes(q)
        || a.summary.toLowerCase().includes(q)
        || a.tags.some(t => t.toLowerCase().includes(q))
    }
    return true
  })
})

const featured = computed(() => allArticles.value.find(a => a.featured))

// Display tag list: API tags (preferred), fallback to local ALL_TAGS
const visibleTags = computed(() => {
  if (tagList.value.length) {
    return tagList.value.map(t => t.name)
  }
  return ALL_TAGS
})

function pickTag(t: string) {
  tag.value = tag.value === t ? '' : t
}

function reset() {
  category.value = 'all'
  tag.value = ''
  query.value = ''
}

function categoryName(slug: string): string {
  return ARTICLE_CATEGORIES.find(c => c.slug === slug)?.name || slug
}
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'Insights' }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero
          eyebrow="INSIGHTS · AI 观察"
          title="What I'm learning."
          subtitle="AI Agent · AI Workflow · AI Coding · AI Business · Productivity — 来自真实项目的笔记和思考。"
        />
      </Container>
    </Section>

    <div v-if="isOffline" class="offline-banner">
      <Container>
        <AIcon name="wifi-off" :size="14" />
        <span>Showing local snapshot — backend unreachable. Some recent updates may be missing.</span>
      </Container>
    </div>

    <Section v-if="!loading && featured" py="md" bg="elevated">
      <Container>
        <header class="block-head">
          <h2>Featured</h2>
          <p class="muted">本周精选。</p>
        </header>
        <ArticleCard
          :article="{
            slug: featured.slug,
            title: featured.title,
            summary: featured.summary,
            category: categoryName(featured.category),
            readMinutes: featured.readMinutes,
            publishedAt: featured.publishedAt
          }"
          variant="feature"
        />
      </Container>
    </Section>

    <Section v-else-if="loading" py="md" bg="elevated">
      <Container>
        <ASkeleton height="380px" />
      </Container>
    </Section>

    <Section py="md">
      <Container>
        <div class="filter-bar">
          <div class="search">
            <AIcon name="search" :size="16" />
            <input v-model="query" placeholder="Search articles…" />
          </div>
          <div class="cat-row">
            <button
              v-for="cat in ARTICLE_CATEGORIES"
              :key="cat.slug"
              class="chip"
              :class="{ active: category === cat.slug }"
              @click="category = cat.slug"
            >
              {{ cat.name }}
            </button>
          </div>
          <div class="tag-row">
            <span class="tag-label">Tags:</span>
            <button
              v-for="t in visibleTags"
              :key="t"
              class="tag-chip"
              :class="{ active: tag === t }"
              @click="pickTag(t)"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <p class="result-count">
          <AIcon name="file-text" :size="14" />
          {{ filtered.length }} of {{ allArticles.length }} articles
        </p>

        <div v-if="loading" class="loading-state">
          <Grid :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
            <ASkeleton v-for="i in 6" :key="i" height="200px" />
          </Grid>
        </div>

        <AEmpty
          v-else-if="filtered.length === 0"
          icon-name="search-x"
          title="No matching articles"
          description="Try clearing filters."
          size="sm"
        >
          <button class="reset-btn" type="button" @click="reset">Reset</button>
        </AEmpty>

        <Grid v-else :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
          <div v-for="a in filtered" :key="a.slug" class="article-wrap">
            <ArticleCard
              :article="{
                slug: a.slug,
                title: a.title,
                summary: a.summary,
                category: categoryName(a.category),
                readMinutes: a.readMinutes,
                publishedAt: a.publishedAt
              }"
            />
            <div class="article-tags">
              <ATag v-for="t in a.tags.slice(0, 3)" :key="t" tone="neutral" size="sm">{{ t }}</ATag>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  </main>
</template>

<style scoped>
main { padding-bottom: var(--space-9); }

.block-head { margin-bottom: var(--space-5); }
.block-head h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.muted { font-size: var(--fs-body-sm); color: var(--text-tertiary); margin: 0; }

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

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.search {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 12px;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-tertiary);
}
.search input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: var(--fs-body-sm);
  width: 100%;
}
.search input::placeholder { color: var(--text-muted); }

.cat-row, .tag-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}
.tag-label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  margin-right: 4px;
}

.chip {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.chip:hover { color: var(--text-primary); border-color: var(--border-default); }
.chip.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #06121F;
}

.tag-chip {
  padding: 4px 10px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.tag-chip:hover { color: var(--text-primary); border-color: var(--border-default); }
.tag-chip.active {
  background: rgba(111, 168, 255, 0.10);
  color: var(--accent-primary);
  border-color: rgba(111, 168, 255, 0.24);
}

.result-count {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 var(--space-4) 0;
}

.loading-state {
  margin-top: var(--space-2);
}

.article-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.article-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  padding: 0 var(--space-1);
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: var(--fs-body-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.reset-btn:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
</style>