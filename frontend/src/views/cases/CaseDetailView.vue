<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useSEO } from '@composables/useSEO'
import { useJsonLd, SITE_URL } from '@composables/useJsonLd'
import { fetchCaseDetail, adaptCase } from '@api/cases'
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
import { getCase, TYPE_LABEL, getRelatedCases } from '@utils/casesData'
import { renderMarkdownLite } from '@utils/markdown'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Source of truth — fetched from API, falls back to local
const item = ref(getCase(slug.value))
const viewCount = ref(0)
const loading = ref(!item.value)   // only show skeleton if no local fallback
const isOffline = ref(false)
const notFound = ref(false)  // resolved after the fetch attempt

// CaseStudy (local shape) has no client/duration fields, but the API does.
// Track them separately so the hero meta-row can show them when present.
const clientName = ref('')
const duration = ref('')

async function load() {
  const applyApi = (api: Awaited<ReturnType<typeof fetchCaseDetail>>) => {
    item.value = adaptCase(api)
    viewCount.value = api.viewCount ?? 0
    clientName.value = api.client || ''
    duration.value = api.duration || ''
  }

  if (item.value) {
    // already have local copy — still try API for fresh view_count
    try {
      applyApi(await fetchCaseDetail(slug.value))
    } catch {
      isOffline.value = true
    }
    return
  }
  loading.value = true
  try {
    applyApi(await fetchCaseDetail(slug.value))
  } catch {
    const local = getCase(slug.value)
    if (local) {
      item.value = local
      isOffline.value = true
    } else {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, () => load())

const related = computed(() => item.value ? getRelatedCases(slug.value) : [])

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString()
}

useSEO({
  title: item.value ? `${item.value.title} — Cases · Aindgc` : 'Case not found — Aindgc',
  description: item.value?.summary || 'Aindgc case study',
  keywords: 'AI Case Study, ' + (item.value?.technologies.join(', ') || ''),
  ogType: 'article'
})

useJsonLd('case', computed(() => {
  if (!item.value) return null
  const c = item.value
  const url = `${SITE_URL}/cases/${c.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'name': c.title,
      'description': c.summary,
      'image': c.cover ? [c.cover] : undefined,
      'datePublished': c.publishedAt,
      'dateModified': c.publishedAt,
      'author': { '@type': 'Organization', 'name': 'Aindgc' },
      'publisher': { '@type': 'Organization', 'name': 'Aindgc' },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
      'keywords': c.technologies.join(', '),
      'about': 'AI Engineering',
      'genre': TYPE_LABEL[c.type]?.label || c.type
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home',  'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Cases', 'item': `${SITE_URL}/cases` },
        { '@type': 'ListItem', 'position': 3, 'name': c.title, 'item': url }
      ]
    }
  ]
}))

function renderMd(md: string): string {
  return renderMarkdownLite(md)
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
            title="Case not found"
            description="This case study doesn't exist or has been removed."
          >
            <RouterLink to="/cases">
              <AButton variant="primary">Back to cases</AButton>
            </RouterLink>
          </AEmpty>
        </ACard>
      </Container>
    </Section>
  </main>

  <main v-else-if="item">
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
          { label: 'Cases', to: '/cases' },
          { label: item.title }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container size="lg">
        <div class="case-hero">
          <div class="meta-row">
            <ATag tone="primary" size="md">{{ TYPE_LABEL[item.type]?.label || item.type }}</ATag>
            <span class="meta-item">
              <AIcon name="calendar" :size="14" />
              {{ item.publishedAt }}
            </span>
            <span v-if="duration" class="meta-item">
              <AIcon name="clock" :size="14" />
              {{ duration }}
            </span>
            <span v-if="clientName" class="meta-item">
              <AIcon name="user" :size="14" />
              {{ clientName }}
            </span>
            <span v-if="viewCount > 0" class="meta-item" :title="`${viewCount.toLocaleString()} views`">
              <AIcon name="eye" :size="14" />
              {{ formatCount(viewCount) }} views
            </span>
          </div>
          <h1 class="title">{{ item.title }}</h1>
          <p class="summary">{{ item.summary }}</p>
        </div>
      </Container>
    </Section>

    <Section py="md" bg="elevated">
      <Container size="lg">
        <Grid :cols="{ sm: 1, md: 3 }" :gap="4">
          <div v-if="item.technologies.length" class="info-block">
            <h4 class="info-label">Technologies</h4>
            <div class="tag-row">
              <ATag v-for="t in item.technologies" :key="t" tone="neutral" size="sm">{{ t }}</ATag>
            </div>
          </div>
          <div v-if="item.aiModels.length" class="info-block">
            <h4 class="info-label">AI Models</h4>
            <div class="tag-row">
              <ATag v-for="m in item.aiModels" :key="m" tone="primary" size="sm">{{ m }}</ATag>
            </div>
          </div>
          <div v-if="item.repoUrl || item.demoUrl" class="info-block">
            <h4 class="info-label">Links</h4>
            <Stack :gap="2">
              <a v-if="item.repoUrl" :href="item.repoUrl" target="_blank" rel="noopener" class="link">
                <AIcon name="github" :size="14" /> Source code
              </a>
              <a v-if="item.demoUrl" :href="item.demoUrl" target="_blank" rel="noopener" class="link">
                <AIcon name="external-link" :size="14" /> Live demo
              </a>
            </Stack>
          </div>
        </Grid>
      </Container>
    </Section>

    <Section py="md">
      <Container size="md">
        <article class="case-body">
          <section v-if="item.problem">
            <h2>Problem</h2>
            <div v-html="renderMd(item.problem)" />
          </section>
          <section v-if="item.thinking">
            <h2>Context &amp; Thinking</h2>
            <div v-html="renderMd(item.thinking)" />
          </section>
          <section v-if="item.approach">
            <h2>Approach</h2>
            <div v-html="renderMd(item.approach)" />
          </section>
          <section v-if="item.architecture">
            <h2>Architecture</h2>
            <div v-html="renderMd(item.architecture)" />
          </section>
          <section v-if="item.implementation">
            <h2>Implementation</h2>
            <div v-html="renderMd(item.implementation)" />
          </section>
          <section v-if="item.result">
            <h2>Result</h2>
            <div v-html="renderMd(item.result)" />
          </section>
          <section v-if="item.learned">
            <h2>What I Learned</h2>
            <div v-html="renderMd(item.learned)" />
          </section>
        </article>
      </Container>
    </Section>

    <Section v-if="related.length" py="lg" bg="elevated">
      <Container size="lg">
        <header class="rel-head">
          <h2>Related cases</h2>
          <RouterLink to="/cases" class="see-all">
            All cases <AIcon name="arrow-right" :size="14" />
          </RouterLink>
        </header>
        <Grid :cols="{ sm: 1, md: 3 }" :gap="4">
          <RouterLink v-for="r in related" :key="r.slug" :to="`/cases/${r.slug}`" class="rel-card">
            <ATag tone="primary" size="sm">{{ TYPE_LABEL[r.type]?.label || r.type }}</ATag>
            <h3>{{ r.title }}</h3>
            <p>{{ r.summary }}</p>
            <span class="rel-foot">{{ r.publishedAt }}</span>
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

.case-hero {
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

.info-block {
  padding: var(--space-4);
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.info-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 0 var(--space-3) 0;
}
.tag-row { display: flex; gap: 6px; flex-wrap: wrap; }
.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}
.link:hover { color: var(--accent-primary); }

/* Body */
.case-body { color: var(--text-secondary); line-height: var(--lh-relaxed); font-size: var(--fs-body-lg); }
.case-body :deep(p) { margin: 0 0 var(--space-4) 0; }
.case-body :deep(h2) {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: var(--letter-tight);
  margin: var(--space-7) 0 var(--space-3) 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}
.case-body :deep(section:first-of-type h2) {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.case-body :deep(strong) { color: var(--text-primary); font-weight: 600; }
.case-body :deep(ul),
.case-body :deep(ol) { margin: 0 0 var(--space-4) 0; padding-left: var(--space-5); }
.case-body :deep(ul li) { list-style: disc; display: list-item; margin-bottom: var(--space-2); }
.case-body :deep(ol li) { list-style: decimal; display: list-item; margin-bottom: var(--space-2); }
.case-body :deep(code) {
  font-family: var(--font-mono);
  background: var(--surface-1);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--accent-secondary);
  font-size: 0.92em;
}
.case-body :deep(pre) {
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  overflow-x: auto;
  margin: var(--space-4) 0;
}
.case-body :deep(pre code) { background: transparent; padding: 0; color: var(--text-primary); font-size: var(--fs-body-sm); }
.case-body :deep(blockquote) {
  border-left: 3px solid var(--accent-primary);
  padding: 4px 0 4px var(--space-4);
  margin: var(--space-4) 0;
  color: var(--text-primary);
  background: rgba(111, 168, 255, 0.04);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.case-body :deep(blockquote p) { margin: 0; }

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