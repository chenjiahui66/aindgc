<script setup lang="ts">
interface Props {
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number }
  gap?: 2 | 3 | 4 | 5 | 6
  as?: keyof HTMLElementTagNameMap
}

const props = withDefaults(defineProps<Props>(), {
  cols: 3,
  gap: 4,
  as: 'div'
})

function gridTemplate(cols: Props['cols']): string {
  if (typeof cols === 'number') return `repeat(${cols}, minmax(0, 1fr))`
  const xs = cols.sm || 1
  const md = cols.md || Math.min(2, xs + 1)
  const lg = cols.lg || Math.min(3, md + 1)
  const xl = cols.xl || lg
  return `repeat(${xl}, minmax(0, 1fr))`
}
</script>

<template>
  <component
    :is="as"
    class="grid"
    :style="{
      gridTemplateColumns: gridTemplate(props.cols),
      gap: `var(--space-${props.gap})`
    }"
  >
    <slot />
  </component>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
}

@media (max-width: 1024px) {
  .grid :slotted(*) {
    grid-column: span 1 !important;
  }
}
</style>
