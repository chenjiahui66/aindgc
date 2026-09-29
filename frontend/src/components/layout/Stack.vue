<script setup lang="ts">
interface Props {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  direction?: 'row' | 'column' | 'row-wrap'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  as?: keyof HTMLElementTagNameMap
}

withDefaults(defineProps<Props>(), {
  gap: 4,
  direction: 'column',
  align: 'stretch',
  justify: 'start',
  as: 'div'
})
</script>

<template>
  <component
    :is="as"
    class="stack"
    :class="[`dir-${direction}`, `align-${align}`, `justify-${justify}`, `gap-${gap}`]"
  >
    <slot />
  </component>
</template>

<style scoped>
.stack {
  display: flex;
}
.dir-row       { flex-direction: row; }
.dir-column    { flex-direction: column; }
.dir-row-wrap  { flex-direction: row; flex-wrap: wrap; }

.align-start    { align-items: flex-start; }
.align-center   { align-items: center; }
.align-end      { align-items: flex-end; }
.align-stretch  { align-items: stretch; }
.align-baseline { align-items: baseline; }

.justify-start   { justify-content: flex-start; }
.justify-center  { justify-content: center; }
.justify-end     { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around  { justify-content: space-around; }

.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-5 { gap: var(--space-5); }
.gap-6 { gap: var(--space-6); }
.gap-7 { gap: var(--space-7); }
.gap-8 { gap: var(--space-8); }
</style>
