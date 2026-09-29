<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSEO } from '@composables/useSEO'
import { useJsonLd, SITE_URL } from '@composables/useJsonLd'
import { listTools, adaptTool } from '@api/tools'
import Container from '@components/layout/Container.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import Grid from '@components/layout/Grid.vue'
import ATag from '@components/common/ATag.vue'
import AIcon from '@components/common/AIcon.vue'
import ASkeleton from '@components/common/ASkeleton.vue'
import { TOOL_CATALOG, type ToolMeta } from '@utils/toolCatalog'

useSEO({
  title: 'AI Tools — Aindgc',
  description: '把 AI 真正变成可以执行的工作。AI 工作流生成器、Agent Skills 生成器、Context Builder、AI Coding 启动器、Prompt 结构化工具、Output Schema 生成器。',
  keywords: 'AI Tools, Agent Workflow Generator, Agent Skills, Context Builder, AI Coding Starter, Prompt Builder, Output Schema'
})

// JSON-LD: ItemList of all 6 tools
useJsonLd('tools', computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Aindgc AI Tools',
  'description': 'Six AI productivity generators: Agent Workflow, Agent Skills, Context Builder, Coding Starter, Prompt Builder, Output Schema.',
  'numberOfItems': allTools.value.length || TOOL_CATALOG.length,
  'itemListElement': (allTools.value.length ? allTools.value : TOOL_CATALOG).map((t, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'item': {
      '@type': 'SoftwareApplication',
      'name': t.name,
      'description': t.tagline,
      'url': `${SITE_URL}${t.to}`,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Any',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' }
    }
  }))
})))

const query = ref('')
const category = ref<string>('all')

const allTools = ref<ToolMeta[]>([])
const loading = ref(true)
const isOffline = ref(false)

async function load() {
  loading.value = true
  try {
    const remote = await listTools()
    allTools.value = remote.map(t => adaptTool(t))
    isOffline.value = false
  } catch {
    allTools.value = [...TOOL_CATALOG]
    isOffline.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const categories = [
  { code: 'all',      label: 'All',      icon: 'layers' },
  { code: 'workflow', label: 'Workflow', icon: 'workflow' },
  { code: 'skill',    label: 'Skill',    icon: 'sparkles' },
  { code: 'context',  label: 'Context',  icon: 'box' },
  { code: 'coding',   label: 'Coding',   icon: 'terminal' },
  { code: 'prompt',   label: 'Prompt',   icon: 'message-square' },
  { code: 'schema',   label: 'Schema',   icon: 'database' }
]

const filtered = computed(() => {
  return allTools.value.filter(t => {
    if (category.value !== 'all' && t.category !== category.value) return false
    if (!query.value.trim()) return true
    const q = query.value.toLowerCase()
    return t.name.toLowerCase().includes(q)
      || t.tagline.toLowerCase().includes(q)
      || t.description.toLowerCase().includes(q)
  })
})
</script>

<template>
  <main class="tools-page">
    <Container>
      <ABreadcrumb
        :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'Tools' }
        ]"
      />
    </Container>

    <div v-if="isOffline" class="offline-banner">
      <Container>
        <AIcon name="wifi-off" :size="14" />
        <span>Showing local catalog — backend unreachable.</span>
      </Container>
    </div>

    <Container>
      <PageHero
        eyebrow="AI TOOLS · 6 generators"
        title="Tools that ship work."
        subtitle="所有工具都基于规则引擎,生成可执行的结构化产出。无需登录,完全免费。"
      />

      <div class="filter-bar">
        <div class="search">
          <AIcon name="search" :size="16" />
          <input v-model="query" placeholder="Search tools…" />
        </div>
        <div class="cat-row">
          <button
            v-for="c in categories"
            :key="c.code"
            class="cat"
            :class="{ active: category === c.code }"
            @click="category = c.code"
          >
            <AIcon :name="c.icon" :size="14" />
            <span>{{ c.label }}</span>
          </button>
        </div>
      </div>
    </Container>

    <Container>
      <p class="result-count">
        {{ filtered.length }} of {{ allTools.length || TOOL_CATALOG.length }} tools
      </p>

      <div v-if="loading" class="loading-state">
        <Grid :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
          <ASkeleton v-for="i in 6" :key="i" height="280px" />
        </Grid>
      </div>
      <Grid v-else :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
        <RouterLink
          v-for="t in filtered"
          :key="t.slug"
          :to="t.to"
          class="tool-tile"
        >
          <div class="tile-head">
            <div class="tile-icon">
              <AIcon :name="t.iconName" :size="22" />
            </div>
            <ATag tone="neutral" size="sm">{{ t.category }}</ATag>
          </div>
          <h3>{{ t.name }}</h3>
          <p class="tile-tagline">{{ t.tagline }}</p>
          <p class="tile-desc">{{ t.description }}</p>
          <div class="tile-foot">
            <div class="formats">
              <span v-for="f in t.outputFormats" :key="f" class="format">.{{ f }}</span>
            </div>
            <span class="open">
              Open <AIcon name="arrow-up-right" :size="14" />
            </span>
          </div>
        </RouterLink>
      </Grid>
    </Container>
  </main>
</template>

<style scoped>
.tools-page {
  padding-bottom: var(--space-9);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-6);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.search {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 12px;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  min-width: 240px;
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

.cat-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.cat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
.cat:hover {
  color: var(--text-primary);
  border-color: var(--border-default);
}
.cat.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #06121F;
}

.result-count {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
  margin: 0 0 var(--space-4) 0;
}

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

.loading-state {
  margin-top: var(--space-2);
}

.tool-tile {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}
.tool-tile:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}
.tool-tile:hover .open {
  color: var(--accent-primary);
}

.tile-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.tile-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--accent-primary);
}

.tool-tile h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}

.tile-tagline {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}
.tile-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  line-height: var(--lh-relaxed);
  margin: 0;
  flex: 1;
}

.tile-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}
.formats {
  display: flex;
  gap: 4px;
}
.format {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 8px;
  background: var(--surface-1);
  border-radius: var(--radius-xs);
  color: var(--text-tertiary);
}
.open {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color var(--duration-fast) var(--ease-standard);
}
</style>
