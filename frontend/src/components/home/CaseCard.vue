<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'

type CaseType = 'REAL' | 'PROTOTYPE' | 'EXPERIMENT' | 'CONCEPT'

interface CaseItem {
  slug: string
  title: string
  summary: string
  type: CaseType
  technologies: string[]
  cover?: string
  repoUrl?: string
}

interface Props {
  item: CaseItem
  index?: number
}

const props = withDefaults(defineProps<Props>(), { index: 0 })

const typeMap: Record<CaseType, { label: string; tone: 'primary' | 'secondary' | 'warning' | 'neutral' }> = {
  REAL:       { label: 'Real Project',   tone: 'primary'   },
  PROTOTYPE:  { label: 'Prototype',      tone: 'secondary' },
  EXPERIMENT: { label: 'Experiment',     tone: 'warning'   },
  CONCEPT:    { label: 'Concept',        tone: 'neutral'   }
}

const meta = computed(() => typeMap[props.item.type])
</script>

<template>
  <RouterLink :to="`/cases/${item.slug}`" class="case-card" :class="`accent-${index % 3}`">
    <div class="cover" :style="{ background: gradient(index) }">
      <div class="cover-mark">
        <AIcon name="layers" :size="22" />
      </div>
      <ATag :tone="meta.tone" size="sm">{{ meta.label }}</ATag>
    </div>

    <div class="body">
      <header class="head">
        <h3>{{ item.title }}</h3>
        <AIcon name="arrow-up-right" :size="18" class="head-arrow" />
      </header>
      <p class="summary">{{ item.summary }}</p>
      <div class="tags">
        <ATag v-for="t in item.technologies" :key="t" tone="neutral" size="sm">{{ t }}</ATag>
      </div>
    </div>
  </RouterLink>
</template>

<script lang="ts">
function gradient(i: number): string {
  const grads = [
    'linear-gradient(135deg, rgba(111, 168, 255, 0.18) 0%, rgba(143, 227, 213, 0.10) 100%)',
    'linear-gradient(135deg, rgba(143, 227, 213, 0.16) 0%, rgba(242, 193, 141, 0.10) 100%)',
    'linear-gradient(135deg, rgba(242, 193, 141, 0.16) 0%, rgba(111, 168, 255, 0.10) 100%)'
  ]
  return grads[i % grads.length]
}
</script>

<style scoped>
.case-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-5);
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
.case-card:hover {
  border-color: var(--border-default);
  transform: translateY(-2px);
}
.case-card:hover .head-arrow {
  color: var(--accent-primary);
  transform: translate(2px, -2px);
}

.cover {
  position: relative;
  aspect-ratio: 1.4 / 1;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: var(--space-3);
}
.cover-mark {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(11, 14, 19, 0.6);
  backdrop-filter: blur(6px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
}
.head h3 {
  font-size: var(--fs-h4);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}
.head-arrow {
  color: var(--text-tertiary);
  flex-shrink: 0;
  margin-top: 4px;
  transition: color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}

.summary {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  margin: 0;
  flex: 1;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .case-card { grid-template-columns: 1fr; }
}
</style>
