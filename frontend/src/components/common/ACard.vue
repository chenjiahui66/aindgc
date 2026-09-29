<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'elevated' | 'bordered' | 'ghost' | 'glow'
type Pad = 'none' | 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  pad?: Pad
  hover?: boolean
  interactive?: boolean
  as?: keyof HTMLElementTagNameMap
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  pad: 'md',
  as: 'div'
})

const classes = computed(() => [
  'a-card',
  `v-${props.variant}`,
  `pad-${props.pad}`,
  {
    hover: props.hover,
    interactive: props.interactive
  }
])
</script>

<template>
  <component :is="as" :class="classes">
    <header v-if="$slots.header || $slots.eyebrow" class="card-header">
      <p v-if="$slots.eyebrow" class="eyebrow"><slot name="eyebrow" /></p>
      <slot name="header" />
    </header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style scoped>
.a-card {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard),
    background-color var(--duration-base) var(--ease-standard);
}

.v-default  { border: 1px solid var(--border-subtle); }
.v-elevated { border: 1px solid var(--border-subtle); box-shadow: var(--shadow-md); }
.v-bordered { border: 1px solid var(--border-default); }
.v-ghost    { background: transparent; border: 1px solid var(--border-subtle); }
.v-glow     {
  border: 1px solid rgba(111, 168, 255, 0.18);
  background: linear-gradient(180deg, rgba(111, 168, 255, 0.04), transparent 60%), var(--bg-elevated);
}

.pad-none { padding: 0; }
.pad-sm   { padding: var(--space-3); }
.pad-md   { padding: var(--space-5); }
.pad-lg   { padding: var(--space-6); }

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

/* Hover & Interactive */
.hover:hover {
  border-color: var(--border-default);
}
.interactive {
  cursor: pointer;
}
.interactive:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}
</style>
