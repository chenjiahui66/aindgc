<script setup lang="ts">
import AButton from './AButton.vue'
import AIcon from './AIcon.vue'

interface Props {
  title?: string
  description?: string
  iconName?: string
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  iconName: 'inbox',
  size: 'md'
})
</script>

<template>
  <div class="a-empty" :class="[`s-${size}`]">
    <div class="icon-wrap">
      <AIcon :name="iconName" :size="size === 'lg' ? 48 : size === 'sm' ? 24 : 32" />
    </div>
    <h3 v-if="title" class="title">{{ title }}</h3>
    <p v-if="description" class="desc">{{ description }}</p>
    <div v-if="$slots.default" class="action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.a-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-6) var(--space-4);
  color: var(--text-tertiary);
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--text-tertiary);
  margin-bottom: var(--space-4);
}

.s-sm .icon-wrap { width: 48px; height: 48px; margin-bottom: var(--space-3); }
.s-lg .icon-wrap { width: 120px; height: 120px; margin-bottom: var(--space-5); }

.title {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.desc {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0;
}

.action {
  margin-top: var(--space-4);
  display: flex;
  gap: var(--space-3);
}
</style>
