<script setup lang="ts">
import { computed } from 'vue'
import AIcon from './AIcon.vue'

interface Props {
  page: number
  size: number
  total: number
  showSizeChanger?: boolean
  sizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  showSizeChanger: true,
  sizeOptions: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  (e: 'update:page', v: number): void
  (e: 'update:size', v: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.size)))

const visiblePages = computed<(number | '...')[]>(() => {
  const total = totalPages.value
  const cur = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (cur > 4) pages.push('...')
  const start = Math.max(2, cur - 1)
  const end = Math.min(total - 1, cur + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cur < total - 3) pages.push('...')
  pages.push(total)
  return pages
})

function go(p: number) {
  if (p < 1 || p > totalPages.value || p === props.page) return
  emit('update:page', p)
}

function changeSize(e: Event) {
  const v = parseInt((e.target as HTMLSelectElement).value, 10)
  emit('update:size', v)
  emit('update:page', 1)
}
</script>

<template>
  <div class="a-pagination">
    <div class="info">
      <span class="muted">Total</span>
      <span class="num">{{ total }}</span>
    </div>

    <div class="controls">
      <button class="pg-btn" :disabled="page <= 1" aria-label="Previous" @click="go(page - 1)">
        <AIcon name="chevron-left" :size="16" />
      </button>

      <button
        v-for="(p, i) in visiblePages"
        :key="i"
        class="pg-btn"
        :class="{ active: p === page, dots: p === '...' }"
        :disabled="p === '...'"
        @click="go(p as number)"
      >
        {{ p }}
      </button>

      <button class="pg-btn" :disabled="page >= totalPages" aria-label="Next" @click="go(page + 1)">
        <AIcon name="chevron-right" :size="16" />
      </button>
    </div>

    <div v-if="showSizeChanger" class="size">
      <select :value="size" class="size-select" @change="changeSize">
        <option v-for="opt in sizeOptions" :key="opt" :value="opt">{{ opt }} / page</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.a-pagination {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.info {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-size: var(--fs-body-sm);
}
.muted { color: var(--text-tertiary); }
.num { color: var(--text-primary); font-weight: 600; font-variant-numeric: tabular-nums; }

.controls {
  display: flex;
  gap: 4px;
}

.pg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}
.pg-btn:hover:not(:disabled):not(.dots) {
  border-color: var(--border-default);
  color: var(--text-primary);
}
.pg-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pg-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #06121F;
}
.pg-btn.dots {
  border-color: transparent;
  cursor: default;
}

.size-select {
  background: var(--surface-1);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  cursor: pointer;
}
.size-select:focus {
  outline: none;
  border-color: var(--accent-primary);
}
</style>
