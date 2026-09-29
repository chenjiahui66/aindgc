<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
type Size = 'sm' | 'md'

interface Props {
  tone?: Tone
  size?: Size
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'neutral',
  size: 'md'
})

const emit = defineEmits<{ (e: 'close'): void }>()

const classes = computed(() => ['a-tag', `tone-${props.tone}`, `s-${props.size}`])
</script>

<template>
  <span :class="classes">
    <span v-if="$slots.icon" class="icon"><slot name="icon" /></span>
    <slot />
    <button
      v-if="closable"
      type="button"
      class="close"
      aria-label="Close"
      @click.stop="emit('close')"
    >
      <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M3 3l10 10M13 3L3 13"/>
      </svg>
    </button>
  </span>
</template>

<style scoped>
.a-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: inherit;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.s-sm {
  font-size: 11px;
  padding: 2px 10px;
  line-height: 1.4;
}
.s-md {
  font-size: var(--fs-body-sm);
  padding: 4px 12px;
  line-height: 1.5;
}

.tone-neutral   { background: var(--surface-1); color: var(--text-secondary); border-color: var(--border-subtle); }
.tone-primary   { background: rgba(111, 168, 255, 0.12); color: var(--accent-primary); border-color: rgba(111, 168, 255, 0.24); }
.tone-secondary { background: rgba(143, 227, 213, 0.10); color: var(--accent-secondary); border-color: rgba(143, 227, 213, 0.20); }
.tone-success   { background: rgba(91, 185, 140, 0.12); color: var(--color-success); border-color: rgba(91, 185, 140, 0.24); }
.tone-warning   { background: rgba(229, 178, 93, 0.12); color: var(--color-warning); border-color: rgba(229, 178, 93, 0.24); }
.tone-danger    { background: rgba(226, 107, 107, 0.12); color: var(--color-danger); border-color: rgba(226, 107, 107, 0.24); }
.tone-info      { background: rgba(111, 168, 255, 0.10); color: var(--color-info); border-color: rgba(111, 168, 255, 0.20); }

.icon {
  display: inline-flex;
  align-items: center;
  width: 1em;
  height: 1em;
}

.close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0;
  margin-left: 2px;
  transition: opacity var(--duration-fast) var(--ease-standard);
}
.close:hover {
  opacity: 1;
}
</style>
