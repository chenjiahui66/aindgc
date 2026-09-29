<script setup lang="ts">
interface Props {
  id?: string
  py?: 'sm' | 'md' | 'lg' | 'xl'
  bg?: 'base' | 'elevated' | 'overlay'
}

withDefaults(defineProps<Props>(), {
  py: 'lg',
  bg: 'base'
})
</script>

<template>
  <section :id="id" class="section" :class="[`py-${py}`, `bg-${bg}`]">
    <slot />
  </section>
</template>

<style scoped>
.section {
  position: relative;
}
.bg-base     { background: var(--bg-base); }
.bg-elevated { background: var(--bg-elevated); }
.bg-overlay  { background: var(--bg-overlay); }

.py-sm { padding-block: var(--space-6); }
.py-md { padding-block: var(--space-8); }
.py-lg { padding-block: var(--space-9); }
.py-xl { padding-block: var(--space-10); }

@media (max-width: 768px) {
  .py-md { padding-block: var(--space-6); }
  .py-lg { padding-block: var(--space-7); }
  .py-xl { padding-block: var(--space-8); }
}
</style>
