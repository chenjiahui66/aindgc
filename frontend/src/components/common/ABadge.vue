<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface Props {
  tone?: Tone
  dot?: boolean
  count?: number | string
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'primary',
  max: 99
})

const displayCount = computed(() => {
  const n = typeof props.count === 'string' ? parseInt(props.count, 10) : props.count
  if (n == null) return null
  return n > props.max ? `${props.max}+` : String(n)
})
</script>

<template>
  <span class="a-badge" :class="`tone-${tone}`">
    <slot>
      <span v-if="dot" class="dot"></span>
      <span v-if="displayCount" class="count">{{ displayCount }}</span>
    </slot>
  </span>
</template>

<style scoped>
.a-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.tone-neutral { background: var(--surface-2); color: var(--text-secondary); }
.tone-primary { background: var(--accent-primary); color: #06121F; }
.tone-success { background: var(--color-success); color: #06180E; }
.tone-warning { background: var(--color-warning); color: #1F1408; }
.tone-danger  { background: var(--color-danger);  color: #1F0606; }

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.count {
  font-variant-numeric: tabular-nums;
}
</style>
