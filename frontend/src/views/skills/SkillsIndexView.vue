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
  SKILL_PACKS, SKILL_CATEGORY_LABEL, SKILL_CATEGORY_ICON,
  getSkillBySlug, type SkillPack, type SkillCategory
} from '@utils/skillsMarketplace'
import { renderMarkdownLite } from '@utils/markdown'

useSEO({
  title: 'Skills Marketplace — Aindgc',
  description: 'Curated SKILL.md packs for Claude Code / Codex / Cursor / Gemini CLI. Coding, writing, research, ops, productivity, support — copy and install.',
  keywords: 'Claude Code Skills, Codex Skills, Cursor Skills, SKILL.md, Agent Skills, AI Coding'
})

useJsonLd('skills', computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Aindgc Skills Marketplace',
  'description': 'Curated SKILL.md packs for AI coding agents.',
  'numberOfItems': SKILL_PACKS.length,
  'itemListElement': SKILL_PACKS.map((p, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'item': {
      '@type': 'SoftwareSourceCode',
      'name': p.name,
      'description': p.tagline,
      'url': `${SITE_URL}/skills`,
      'programmingLanguage': 'markdown',
      'creator': { '@type': 'Organization', 'name': p.author },
      'keywords': p.tags.join(', ')
    }
  }))
})))

const toast = useToast()
const query = ref('')
const category = ref<SkillCategory | 'all'>('all')

const categoryOptions = [
  { label: 'All categories', value: 'all' as const },
  ...(Object.keys(SKILL_CATEGORY_LABEL) as SkillCategory[]).map(c => ({
    label: SKILL_CATEGORY_LABEL[c],
    value: c
  }))
]

const filtered = computed(() => {
  return SKILL_PACKS.filter(p => {
    if (category.value !== 'all' && p.category !== category.value) return false
    if (!query.value.trim()) return true
    const q = query.value.toLowerCase()
    return p.name.toLowerCase().includes(q)
      || p.tagline.toLowerCase().includes(q)
      || p.description.toLowerCase().includes(q)
      || p.tags.some(t => t.toLowerCase().includes(q))
  })
})

const preview = ref<SkillPack | null>(null)
const previewMd = computed(() => preview.value ? renderMarkdownLite(preview.value.content) : '')

function openPreview(p: SkillPack) {
  preview.value = p
}

function closePreview() {
  preview.value = null
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  } catch {
    toast.error('Copy failed — select and copy manually')
  }
}

function categoryCount(c: SkillCategory | 'all'): number {
  return c === 'all' ? SKILL_PACKS.length : SKILL_PACKS.filter(p => p.category === c).length
}
</script>

<template>
  <main class="skills-page">
    <Section py="md">
      <Container>
        <PageHero
          eyebrow="Skills Marketplace"
          title="Curated SKILL.md packs"
          subtitle="Hand-crafted agent skills for Claude Code, Codex, Cursor, and Gemini CLI. Browse, preview, copy — drop straight into your AI workflow."
        >
          <template #actions>
            <RouterLink to="/tools/agent-skills-generator">
              <AButton variant="primary">
                <AIcon name="sparkles" :size="14" /> Generate your own
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
            v-for="c in (Object.keys(SKILL_CATEGORY_LABEL) as SkillCategory[])"
            :key="c"
            class="cat-chip"
            :class="{ 'is-active': category === c }"
            @click="category = c"
          >
            <AIcon :name="SKILL_CATEGORY_ICON[c]" :size="14" />
            <span>{{ SKILL_CATEGORY_LABEL[c] }}</span>
            <span class="cat-count">{{ categoryCount(c) }}</span>
          </button>
        </div>
      </Container>
    </Section>

    <!-- Search + filters -->
    <Section py="sm">
      <Container>
        <div class="filters">
          <AInput
            v-model="query"
            placeholder="Search by name, tagline, or tag…"
            clearable
            style="flex: 1; min-width: 240px;"
          />
          <ASelect
            v-model="category"
            :options="categoryOptions"
            style="width: 200px;"
          />
        </div>
      </Container>
    </Section>

    <!-- Skills grid -->
    <Section py="md">
      <Container>
        <div v-if="filtered.length" class="grid">
          <article
            v-for="p in filtered"
            :key="p.id"
            class="skill-card"
            @click="openPreview(p)"
          >
            <header class="skill-head">
              <div class="skill-icon">
                <AIcon :name="SKILL_CATEGORY_ICON[p.category]" :size="18" />
              </div>
              <ATag tone="primary" size="sm">{{ SKILL_CATEGORY_LABEL[p.category] }}</ATag>
              <span v-if="p.featured" class="feat-flag">
                <AIcon name="star" :size="11" /> Featured
              </span>
            </header>

            <h3 class="skill-name">{{ p.name }}</h3>
            <p class="skill-tagline">{{ p.tagline }}</p>

            <div class="skill-meta">
              <span class="meta-row">
                <AIcon name="user" :size="12" />
                <span>{{ p.role }}</span>
              </span>
              <span class="meta-row">
                <AIcon name="package" :size="12" />
                <span>{{ p.targetTools.join(' · ') }}</span>
              </span>
              <span class="meta-row">
                <AIcon name="download" :size="12" />
                <span>{{ p.installs.toLocaleString() }} installs</span>
              </span>
            </div>

            <footer class="skill-foot">
              <div class="skill-tags">
                <span v-for="t in p.tags.slice(0, 3)" :key="t" class="skill-tag">#{{ t }}</span>
              </div>
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
              <h3>No skills match</h3>
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
          <div class="cta-mark"><AIcon name="sparkles" :size="20" /></div>
          <h2>Need a skill we don't have?</h2>
          <p>
            The Agent Skills Generator turns a role + purpose into a complete SKILL.md —
            frontmatter, workflow, tools, constraints, examples. Free, instant, downloadable.
          </p>
          <RouterLink to="/tools/agent-skills-generator">
            <AButton variant="primary" size="lg">
              <AIcon name="sparkles" :size="14" /> Open Agent Skills Generator
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
      :show-close="true"
      @update:model-value="(v: boolean) => !v && closePreview()"
    >
      <div v-if="preview" class="preview">
        <div class="preview-meta">
          <ATag tone="primary" size="sm">{{ SKILL_CATEGORY_LABEL[preview.category] }}</ATag>
          <span class="meta-row">
            <AIcon name="user" :size="12" />
            <span>{{ preview.role }}</span>
          </span>
          <span class="meta-row">
            <AIcon name="package" :size="12" />
            <span>{{ preview.targetTools.join(' · ') }}</span>
          </span>
          <span class="meta-row">
            <AIcon name="download" :size="12" />
            <span>{{ preview.installs.toLocaleString() }} installs</span>
          </span>
        </div>

        <p class="preview-desc">{{ preview.description }}</p>

        <div class="install-row">
          <code class="install-cmd">{{ preview.installHint }}</code>
          <AButton
            variant="ghost"
            size="sm"
            @click="copyToClipboard(preview.installHint, 'Install command')"
          >
            <AIcon name="copy" :size="12" /> Copy
          </AButton>
        </div>

        <header class="preview-head">
          <h4>SKILL.md</h4>
          <AButton
            variant="ghost"
            size="sm"
            @click="copyToClipboard(preview.content, 'SKILL.md')"
          >
            <AIcon name="copy" :size="12" /> Copy full SKILL.md
          </AButton>
        </header>

        <pre class="md-preview"><code>{{ preview.content }}</code></pre>
      </div>

      <template #footer>
        <div class="modal-foot">
          <AButton variant="ghost" @click="closePreview">Close</AButton>
          <AButton
            variant="primary"
            @click="preview && copyToClipboard(preview.content, 'SKILL.md')"
          >
            <AIcon name="download" :size="14" /> Copy and close
          </AButton>
        </div>
      </template>
    </AModal>
  </main>
</template>

<style scoped>
.skills-page { padding-bottom: var(--space-9); }

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
.skill-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}
.skill-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.skill-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.skill-icon {
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

.skill-name {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.005em;
}
.skill-tagline {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.skill-meta {
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

.skill-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.skill-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.skill-tag {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
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

.install-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
}
.install-cmd {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
}

.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}
.preview-head h4 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
  font-family: var(--font-mono);
}
.md-preview {
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
  overflow: auto;
  max-height: 380px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}
.md-preview code {
  font-family: inherit;
  color: inherit;
  background: transparent;
  padding: 0;
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>