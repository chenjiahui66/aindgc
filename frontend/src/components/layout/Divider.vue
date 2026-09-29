<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal'
})
</script>

<template>
  <div class="divider" :class="[`ori-${orientation}`]" role="separator">
    <span v-if="label" class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
}
.ori-horizontal {
  width: 100%;
  height: 1px;
  margin-block: var(--space-4);
}
.ori-vertical {
  width: 1px;
  height: 100%;
  margin-inline: var(--space-3);
  align-self: stretch;
}

.ori-horizontal::before,
.ori-horizontal::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}
.ori-horizontal .label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  padding-inline: var(--space-3);
}
</style>
