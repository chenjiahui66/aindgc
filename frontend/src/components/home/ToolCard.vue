<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'

interface Tool {
  slug: string
  name: string
  tagline: string
  description: string
  iconName: string
  tags: string[]
  to: string
}

interface Props {
  tool: Tool
  index?: number
}

const props = withDefaults(defineProps<Props>(), { index: 0 })

const accentIndex = computed(() => props.index % 3)
</script>

<template>
  <RouterLink :to="tool.to" class="tool-card" :class="`accent-${accentIndex}`">
    <header class="card-head">
      <div class="icon-wrap">
        <AIcon :name="tool.iconName" :size="22" />
      </div>
      <div class="meta">
        <h3 class="name">{{ tool.name }}</h3>
        <p class="tagline">{{ tool.tagline }}</p>
      </div>
    </header>

    <p class="desc">{{ tool.description }}</p>

    <footer class="card-foot">
      <div class="tags">
        <ATag v-for="t in tool.tags" :key="t" tone="neutral" size="sm">{{ t }}</ATag>
      </div>
      <span class="arrow">
        Open Tool
        <AIcon name="arrow-right" :size="14" />
      </span>
    </footer>
  </RouterLink>
</template>

<style scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition:
    border-color var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard),
    background var(--duration-base) var(--ease-standard);
}
.tool-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, transparent 50%, var(--accent-primary) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-standard);
  pointer-events: none;
}
.tool-card:hover {
  border-color: var(--border-default);
  transform: translateY(-2px);
}
.tool-card:hover::before { opacity: 0.6; }

.card-head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--accent-primary);
  flex-shrink: 0;
}
.accent-1 .icon-wrap { color: var(--accent-secondary); }
.accent-2 .icon-wrap { color: var(--accent-warm); }

.meta { min-width: 0; }
.name {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.tagline {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 0;
}

.desc {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  line-height: var(--lh-relaxed);
  margin: 0;
  flex: 1;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.arrow {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-standard), gap var(--duration-fast) var(--ease-standard);
}
.tool-card:hover .arrow {
  color: var(--accent-primary);
  gap: 8px;
}
</style>
