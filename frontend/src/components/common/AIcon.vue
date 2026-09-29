<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
  strokeWidth: 1.75
})

const iconComponent = computed(() => {
  const pascal = props.name
    .split(/[-_\s]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  return (LucideIcons as Record<string, unknown>)[pascal] || (LucideIcons as Record<string, unknown>).Circle
})

const sizeVal = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <component
    :is="iconComponent"
    :size="sizeVal"
    :stroke-width="strokeWidth"
    :color="color"
    class="a-icon"
    aria-hidden="true"
  />
</template>

<style scoped>
.a-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
