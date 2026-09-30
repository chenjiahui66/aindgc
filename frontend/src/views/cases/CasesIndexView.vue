<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSEO } from '@composables/useSEO'
import {
  listCases, fetchCaseCategories, adaptCase, buildCaseCategoryMap
} from '@api/cases'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Stack from '@components/layout/Stack.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import AIcon from '@components/common/AIcon.vue'
import CaseCard from '@components/home/CaseCard.vue'
import ASkeleton from '@components/common/ASkeleton.vue'
import {
  CASES, CASE_CATEGORIES, TYPE_LABEL, type CaseStudy, type CaseType
} from '@utils/casesData'

useSEO({
  title: 'Cases — Aindgc',
  description: 'Aindgc 的 AI 项目案例集:真实项目、原型、实验、概念。Problem / Approach / Architecture / Implementation / Result / What I Learned 全透明。',
  keywords: 'AI Cases, AI Projects, AI Product Portfolio, AI Workflow Case Study'
})

const allCases = ref<CaseStudy[]>([])
const loading = ref(true)
const isOffline = ref(false)

async function load() {
  loading.value = true
  try {
    const [page, cats] = await Promise.all([
      listCases({ page: 1, size: 50 }),
      fetchCaseCategories().catch(() => [])
    ])
    const categoryMap = buildCaseCategoryMap(cats || [])
    allCases.value = page.list.map(r => adaptCase(r, categoryMap))
    isOffline.value = false
  } catch {
    // backend unreachable — fall back to local data
    allCases.value = [...CASES]
    isOffline.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const category = ref<string>('all')
const typeFilter = ref<CaseType | 'all'>('all')

const filtered = computed(() => {
  return allCases.value.filter(c => {
    if (category.value !== 'all' && c.category !== category.value) return false
    if (typeFilter.value !== 'all' && c.type !== typeFilter.value) return false
    return true
  })
})

const featured = computed(() => allCases.value.filter(c => c.featured))

const types: Array<CaseType | 'all'> = ['all', 'REAL', 'PROTOTYPE', 'EXPERIMENT', 'CONCEPT']

function reset() {
  category.value = 'all'
  typeFilter.value = 'all'
}
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'Cases' }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero
          eyebrow="CASES · PORTFOLIO"
          title="Things I've built."
          subtitle="真实项目 · 实验 · 原型 · 概念 — 明确区分,不夸大。每个 case 都有 Problem / Approach / Architecture / Implementation / Result / What I Learned。"
        />
      </Container>
    </Section>

    <div v-if="isOffline" class="offline-banner">
      <Container>
        <AIcon name="wifi-off" :size="14" />
        <span>Showing local snapshot — backend unreachable. Some recent updates may be missing.</span>
      </Container>
    </div>

    <Section v-if="!loading && featured.length" py="md" bg="elevated">
      <Container>
        <header class="block-head">
          <h2>Featured</h2>
          <p class="muted">深度案例,值得读完整。</p>
        </header>
        <Stack :gap="4">
          <CaseCard v-for="c in featured" :key="c.slug" :item="c" :index="0" />
        </Stack>
      </Container>
    </Section>

    <Section v-else-if="loading" py="md" bg="elevated">
      <Container>
        <Stack :gap="4">
          <ASkeleton v-for="i in 2" :key="i" height="280px" />
        </Stack>
      </Container>
    </Section>

    <Section py="md">
      <Container>
        <div class="filter-bar">
          <div class="filter-group">
            <p class="filter-label">Category</p>
            <div class="filter-row">
              <button
                v-for="cat in CASE_CATEGORIES"
                :key="cat.slug"
                class="chip"
                :class="{ active: category === cat.slug }"
                @click="category = cat.slug"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
          <div class="filter-group">
            <p class="filter-label">Type</p>
            <div class="filter-row">
              <button
                v-for="t in types"
                :key="t"
                class="chip"
                :class="{ active: typeFilter === t }"
                @click="typeFilter = t"
              >
                {{ t === 'all' ? 'All Types' : TYPE_LABEL[t].label }}
              </button>
            </div>
          </div>
        </div>

        <p class="result-count">
          <AIcon name="layers" :size="14" />
          {{ filtered.length }} of {{ allCases.length }} cases
        </p>

        <div v-if="loading" class="loading-state">
          <ASkeleton v-for="i in 3" :key="i" height="220px" />
        </div>

        <div v-else-if="filtered.length === 0" class="empty-state">
          <AIcon name="search-x" :size="32" />
          <p>No cases match these filters.</p>
          <button class="reset-btn" type="button" @click="reset">Reset filters</button>
        </div>

        <Stack v-else :gap="4">
          <CaseCard v-for="(c, idx) in filtered" :key="c.slug" :item="c" :index="idx" />
        </Stack>
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
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.filter-group { display: flex; flex-direction: column; gap: var(--space-2); }
.filter-label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}
.filter-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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
.chip:hover {
  color: var(--text-primary);
  border-color: var(--border-default);
}
.chip.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #06121F;
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
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.empty-state {
  text-align: center;
  padding: var(--space-8);
  color: var(--text-tertiary);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
}
.empty-state p { margin: var(--space-3) 0; }
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