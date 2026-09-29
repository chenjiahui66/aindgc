<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'ghost' | 'outline' | 'link' | 'danger' | 'subtle'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  size?: Size
  block?: boolean
  loading?: boolean
  disabled?: boolean
  iconOnly?: boolean
  type?: 'button' | 'submit' | 'reset'
  tag?: 'button' | 'a' | 'span'
  href?: string
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  tag: 'button'
})

defineEmits<{ (e: 'click', evt: MouseEvent): void }>()

const classes = computed(() => [
  'a-btn',
  `v-${props.variant}`,
  `s-${props.size}`,
  {
    block: props.block,
    loading: props.loading,
    'icon-only': props.iconOnly
  }
])
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :target="tag === 'a' ? target : undefined"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    @click="(e) => $emit('click', e)"
  >
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <span v-else-if="$slots.icon" class="icon"><slot name="icon" /></span>
    <span class="label"><slot /></span>
  </component>
</template>

<style scoped>
.a-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: inherit;
  font-weight: 500;
  letter-spacing: var(--letter-normal);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    opacity var(--duration-fast) var(--ease-standard);
}

.a-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.a-btn:disabled,
.a-btn.loading {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.s-sm { padding: 6px 12px; font-size: var(--fs-body-sm); }
.s-md { padding: 10px 18px; font-size: var(--fs-body); }
.s-lg { padding: 14px 24px; font-size: var(--fs-body-lg); }

.icon-only.s-sm { padding: 6px; width: 32px; height: 32px; }
.icon-only.s-md { padding: 8px; width: 40px; height: 40px; }
.icon-only.s-lg { padding: 10px; width: 48px; height: 48px; }

.block {
  display: flex;
  width: 100%;
}

/* Primary */
.v-primary {
  background: var(--accent-primary);
  color: #06121F;
  border-color: var(--accent-primary);
}
.v-primary:hover:not(:disabled) {
  background: #88B8FF;
  border-color: #88B8FF;
}

/* Ghost */
.v-ghost {
  background: transparent;
  color: var(--text-primary);
  border-color: transparent;
}
.v-ghost:hover:not(:disabled) {
  background: var(--surface-1);
}

/* Outline */
.v-outline {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-default);
}
.v-outline:hover:not(:disabled) {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Link */
.v-link {
  background: transparent;
  color: var(--accent-primary);
  padding-inline: var(--space-1);
  border: none;
}
.v-link:hover:not(:disabled) {
  color: var(--accent-secondary);
}

/* Danger */
.v-danger {
  background: var(--color-danger);
  color: #1A0606;
  border-color: var(--color-danger);
}
.v-danger:hover:not(:disabled) {
  background: #EC8585;
}

/* Subtle */
.v-subtle {
  background: var(--surface-1);
  color: var(--text-primary);
  border-color: var(--border-subtle);
}
.v-subtle:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--border-default);
}

.icon, .spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.spinner {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: a-btn-spin 0.7s linear infinite;
}

@keyframes a-btn-spin {
  to { transform: rotate(360deg); }
}
</style>
