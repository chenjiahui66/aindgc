<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

withDefaults(defineProps<Props>(), {
  align: 'left'
})
</script>

<template>
  <header class="page-hero" :class="[`align-${align}`]">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h1 class="title">{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    <div v-if="$slots.default" class="actions">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.page-hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-block: var(--space-8) var(--space-6);
}
.align-center {
  align-items: center;
  text-align: center;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}

.title {
  font-size: var(--fs-h1);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  line-height: var(--lh-tight);
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  font-size: var(--fs-body-lg);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  max-width: 720px;
  margin: 0;
}

.align-center .subtitle {
  margin-inline: auto;
}

.actions {
  margin-top: var(--space-3);
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.align-center .actions {
  justify-content: center;
}
</style>
