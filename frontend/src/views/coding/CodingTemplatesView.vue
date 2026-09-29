<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSEO } from '@composables/useSEO'
import { useJsonLd, SITE_URL } from '@composables/useJsonLd'
import { useToast } from '@/composables/useToast'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import PageHero from '@components/layout/PageHero.vue'
import Grid from '@components/layout/Grid.vue'
import Stack from '@components/layout/Stack.vue'
import AInput from '@components/common/AInput.vue'
import ASelect from '@components/common/ASelect.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import AButton from '@components/common/AButton.vue'
import AModal from '@components/common/AModal.vue'
import ACard from '@components/common/ACard.vue'
import {
  CODING_TEMPLATES, CODING_CATEGORY_LABEL, CODING_CATEGORY_ICON,
  type CodingTemplate
} from '@utils/codingTemplates'

useSEO({
  title: 'Coding Templates — Aindgc',
  description: 'Curated AI coding project starters for Vue / React / Spring Boot / FastAPI / Next.js / Flutter. With AGENTS.md, file tree, key files, install & run.',
  keywords: 'AI Coding Templates, Vue 3 Starter, Spring Boot Starter, FastAPI Template, Next.js Boilerplate, Flutter Starter'
})

useJsonLd('templates', computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Aindgc Coding Templates',
  'description': 'Production-ready AI coding project starters across stacks.',
  'numberOfItems': CODING_TEMPLATES.length,
  'itemListElement': CODING_TEMPLATES.map((t, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'item': {
      '@type': 'SoftwareSourceCode',
      'name': t.name,
      'description': t.tagline,
      'url': `${SITE_URL}/coding`,
      'programmingLanguage': t.language,
      'creator': { '@type': 'Organization', 'name': t.author }
    }
  }))
})))

const toast = useToast()
const query = ref('')
const category = ref<CodingTemplate['category'] | 'all'>('all')

const categoryOptions = [
  { label: 'All categories', value: 'all' as const },
  ...(Object.keys(CODING_CATEGORY_LABEL) as CodingTemplate['category'][]).map(c => ({
    label: CODING_CATEGORY_LABEL[c],
    value: c
  }))
]

const filtered = computed(() => {
  return CODING_TEMPLATES.filter(t => {
    if (category.value !== 'all' && t.category !== category.value) return false
    if (!query.value.trim()) return true
    const q = query.value.toLowerCase()
    return t.name.toLowerCase().includes(q)
      || t.tagline.toLowerCase().includes(q)
      || t.stack.toLowerCase().includes(q)
      || t.description.toLowerCase().includes(q)
  })
})

const preview = ref<CodingTemplate | null>(null)
const activeFileIndex = ref(0)
const activeFile = computed(() =>
  preview.value?.keyFiles[activeFileIndex.value] || null
)

function openPreview(t: CodingTemplate) {
  preview.value = t
  activeFileIndex.value = 0
}
function closePreview() {
  preview.value = null
  activeFileIndex.value = 0
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  } catch {
    toast.error('Copy failed')
  }
}

function categoryCount(c: CodingTemplate['category'] | 'all'): number {
  return c === 'all' ? CODING_TEMPLATES.length : CODING_TEMPLATES.filter(t => t.category === c).length
}

function fileIcon(name: string): string {
  if (name.endsWith('.md')) return 'file-text'
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'file-code'
  if (name.endsWith('.py')) return 'file-code'
  if (name.endsWith('.java')) return 'coffee'
  if (name.endsWith('.dart')) return 'smartphone'
  if (name.endsWith('.json') || name.endsWith('.yml') || name.endsWith('.yaml') || name.endsWith('.conf') || name.endsWith('.sh')) return 'settings'
  if (name === 'nginx.conf') return 'cloud'
  return 'file'
}
</script>

<template>
  <main class="coding-page">
    <Section py="md">
      <Container>
        <PageHero
          eyebrow="Coding Templates"
          title="Production-ready project starters"
          subtitle="Hand-tuned skeletons for the stacks you actually ship with — Vue 3, React, Spring Boot, FastAPI, Next.js, Flutter, Nginx. Includes AGENTS.md so AI agents follow your conventions from day one."
        >
          <template #actions>
            <RouterLink to="/tools/coding-project-starter">
              <AButton variant="primary">
                <AIcon name="terminal" :size="14" /> Generate your own
              </AButton>
            </RouterLink>
          </template>
        </PageHero>
      </Container>
    </Section>

    <!-- Category chips -->
    <Section py="sm">
      <Container>
        <div class="cat-chips">
          <button
            class="cat-chip"
            :class="{ 'is-active': category === 'all' }"
            @click="category = 'all'"
          >
            <AIcon name="layers" :size="14" />
            <span>All</span>
            <span class="cat-count">{{ categoryCount('all') }}</span>
          </button>
          <button
            v-for="c in (Object.keys(CODING_CATEGORY_LABEL) as CodingTemplate['category'][])"
            :key="c"
            class="cat-chip"
            :class="{ 'is-active': category === c }"
            @click="category = c"
          >
            <AIcon :name="CODING_CATEGORY_ICON[c]" :size="14" />
            <span>{{ CODING_CATEGORY_LABEL[c] }}</span>
            <span class="cat-count">{{ categoryCount(c) }}</span>
          </button>
        </div>
      </Container>
    </Section>

    <!-- Search -->
    <Section py="sm">
      <Container>
        <div class="filters">
          <AInput
            v-model="query"
            placeholder="Search by name, stack, or description…"
            clearable
            style="flex: 1; min-width: 240px;"
          />
          <ASelect v-model="category" :options="categoryOptions" style="width: 200px;" />
        </div>
      </Container>
    </Section>

    <!-- Template grid -->
    <Section py="md">
      <Container>
        <div v-if="filtered.length" class="grid">
          <article
            v-for="t in filtered"
            :key="t.id"
            class="tpl-card"
            @click="openPreview(t)"
          >
            <header class="tpl-head">
              <div class="tpl-icon">
                <AIcon :name="CODING_CATEGORY_ICON[t.category]" :size="18" />
              </div>
              <ATag tone="primary" size="sm">{{ CODING_CATEGORY_LABEL[t.category] }}</ATag>
              <span v-if="t.featured" class="feat-flag">
                <AIcon name="star" :size="11" /> Featured
              </span>
            </header>

            <h3 class="tpl-name">{{ t.name }}</h3>
            <p class="tpl-stack">{{ t.stack }}</p>
            <p class="tpl-tagline">{{ t.tagline }}</p>

            <div class="tpl-stats">
              <span class="meta-row">
                <AIcon name="file-code" :size="12" />
                <span>{{ t.fileTree.length }} files</span>
              </span>
              <span class="meta-row">
                <AIcon name="download" :size="12" />
                <span>{{ t.installs.toLocaleString() }} installs</span>
              </span>
            </div>

            <footer class="tpl-foot">
              <code class="run-cmd">{{ t.runCommand }}</code>
              <AButton variant="ghost" size="sm">
                <AIcon name="eye" :size="12" /> Preview
              </AButton>
            </footer>
          </article>
        </div>

        <div v-else class="empty">
          <ACard>
            <Stack :gap="3" align="center">
              <AIcon name="search-x" :size="40" />
              <h3>No templates match</h3>
              <p>Try a different category or clear your search.</p>
              <AButton variant="ghost" @click="() => { query = ''; category = 'all' }">
                Reset filters
              </AButton>
            </Stack>
          </ACard>
        </div>
      </Container>
    </Section>

    <!-- CTA: Generate your own -->
    <Section py="lg" bg="elevated">
      <Container size="md">
        <div class="cta">
          <div class="cta-mark"><AIcon name="terminal" :size="20" /></div>
          <h2>Stack not in the catalog?</h2>
          <p>
            The AI Coding Project Starter generates a multi-file bundle — README.md, AGENTS.md, ARCHITECTURE.md,
            CONTRIBUTING.md — for any stack combination. Free, instant, downloadable as ZIP.
          </p>
          <RouterLink to="/tools/coding-project-starter">
            <AButton variant="primary" size="lg">
              <AIcon name="terminal" :size="14" /> Open Coding Project Starter
            </AButton>
          </RouterLink>
        </div>
      </Container>
    </Section>

    <!-- Preview modal -->
    <AModal
      :model-value="!!preview"
      :title="preview?.name || ''"
      size="xl"
      @update:model-value="(v: boolean) => !v && closePreview()"
    >
      <div v-if="preview" class="preview">
        <div class="preview-meta">
          <ATag tone="primary" size="sm">{{ CODING_CATEGORY_LABEL[preview.category] }}</ATag>
          <span class="meta-row">
            <AIcon name="package" :size="12" />
            <span>{{ preview.stack }}</span>
          </span>
          <span class="meta-row">
            <AIcon name="download" :size="12" />
            <span>{{ preview.installs.toLocaleString() }} installs</span>
          </span>
        </div>

        <p class="preview-desc">{{ preview.description }}</p>

        <div class="feat-grid">
          <div v-for="(f, i) in preview.features" :key="i" class="feat-item">
            <AIcon name="check" :size="13" color="#38d5c4" />
            <span>{{ f }}</span>
          </div>
        </div>

        <div class="cmd-row">
          <div class="cmd-block">
            <span class="cmd-label">Install</span>
            <code class="cmd">{{ preview.installCommand }}</code>
            <button class="cmd-copy" @click="copyToClipboard(preview.installCommand, 'Install command')">
              <AIcon name="copy" :size="12" />
            </button>
          </div>
          <div class="cmd-block">
            <span class="cmd-label">Run</span>
            <code class="cmd">{{ preview.runCommand }}</code>
            <button class="cmd-copy" @click="copyToClipboard(preview.runCommand, 'Run command')">
              <AIcon name="copy" :size="12" />
            </button>
          </div>
        </div>

        <!-- File tree -->
        <div class="ft-block">
          <header class="ft-head">
            <h4>File tree <span class="ft-count">({{ preview.fileTree.length }} files)</span></h4>
          </header>
          <ul class="ft-list">
            <li v-for="f in preview.fileTree" :key="f" class="ft-item">
              <AIcon :name="fileIcon(f)" :size="12" />
              <code>{{ f }}</code>
            </li>
          </ul>
        </div>

        <!-- Key file viewer -->
        <div class="kv-block">
          <header class="kv-head">
            <h4>Key files</h4>
            <div class="kv-tabs">
              <button
                v-for="(f, i) in preview.keyFiles"
                :key="f.name"
                class="kv-tab"
                :class="{ 'is-active': activeFileIndex === i }"
                @click="activeFileIndex = i"
              >
                <AIcon :name="fileIcon(f.name)" :size="11" />
                <span>{{ f.name }}</span>
              </button>
            </div>
          </header>
          <div v-if="activeFile" class="kv-body">
            <button
              class="kv-copy"
              @click="activeFile && copyToClipboard(activeFile.content, activeFile.name)"
            >
              <AIcon name="copy" :size="12" /> Copy
            </button>
            <pre class="kv-pre"><code>{{ activeFile.content }}</code></pre>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-foot">
          <AButton variant="ghost" @click="closePreview">Close</AButton>
          <AButton variant="primary">
            <AIcon name="download" :size="14" /> Download full bundle
          </AButton>
        </div>
      </template>
    </AModal>
  </main>
</template>

<style scoped>
.coding-page { padding-bottom: var(--space-9); }

.cat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}
.cat-chip:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}
.cat-chip.is-active {
  background: rgba(74, 158, 255, 0.1);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
.cat-count {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 1px 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

/* ── Grid ── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.tpl-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
}
.tpl-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.tpl-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tpl-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.15), rgba(56, 213, 196, 0.08));
  border: 1px solid rgba(74, 158, 255, 0.2);
  display: grid;
  place-items: center;
  color: var(--accent-primary);
}
.feat-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #ffb850;
  font-weight: 600;
  text-transform: uppercase;
}

.tpl-name {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.005em;
}
.tpl-stack {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-primary);
  margin: -4px 0 0;
}
.tpl-tagline {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.tpl-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}
.meta-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.tpl-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.run-cmd {
  font-family: var(--font-mono);
  font-size: 12px;
  background: rgba(56, 213, 196, 0.08);
  border: 1px solid rgba(56, 213, 196, 0.2);
  color: #38d5c4;
  padding: 4px 10px;
  border-radius: 6px;
}

.empty {
  padding: var(--space-7) 0;
}

/* ── CTA ── */
.cta {
  text-align: center;
  padding: var(--space-7) var(--space-5);
  background: linear-gradient(180deg, rgba(74, 158, 255, 0.04) 0%, transparent 100%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.cta-mark {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  margin: 0 auto var(--space-3);
  background: linear-gradient(135deg, #4a9eff, #38d5c4);
  display: grid;
  place-items: center;
  color: #07090d;
}
.cta h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}
.cta p {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  margin: 0 auto var(--space-5);
  max-width: 540px;
  line-height: 1.6;
}

/* ── Preview modal ── */
.preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.preview-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
}
.preview-desc {
  color: var(--text-secondary);
  font-size: var(--fs-body);
  margin: 0;
  line-height: 1.6;
}

.feat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
  padding: var(--space-3);
  background: var(--surface-1);
  border-radius: var(--radius-sm);
}
.feat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-secondary);
}

.cmd-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 700px) { .cmd-row { grid-template-columns: 1fr; } }
.cmd-block {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
}
.cmd-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  min-width: 50px;
}
.cmd {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
}
.cmd-copy {
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  color: var(--text-tertiary);
  display: grid;
  place-items: center;
  transition: all 0.12s;
}
.cmd-copy:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

/* File tree */
.ft-block {
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}
.ft-head h4 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
}
.ft-count {
  font-weight: 400;
  font-size: 11px;
  color: var(--text-faint);
}
.ft-list {
  list-style: none;
  margin: 0;
  padding: var(--space-3);
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 4px;
  max-height: 180px;
  overflow-y: auto;
}
.ft-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  padding: 2px 0;
}
.ft-item code { background: transparent; padding: 0; color: inherit; }

/* Key file viewer */
.kv-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.kv-head h4 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
  font-family: var(--font-mono);
}
.kv-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.kv-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-tertiary);
  transition: all 0.12s;
}
.kv-tab:hover {
  color: var(--text-primary);
  border-color: var(--accent-primary);
}
.kv-tab.is-active {
  background: rgba(74, 158, 255, 0.1);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}
.kv-body {
  position: relative;
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.kv-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(11, 14, 19, 0.8);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
  z-index: 2;
  transition: all 0.12s;
}
.kv-copy:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}
.kv-pre {
  margin: 0;
  padding: var(--space-4);
  overflow: auto;
  max-height: 360px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}
.kv-pre code {
  font-family: inherit;
  background: transparent;
  padding: 0;
  color: inherit;
  white-space: pre;
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>