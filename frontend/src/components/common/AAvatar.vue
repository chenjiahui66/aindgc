<script setup lang="ts">
import { computed } from 'vue'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type Shape = 'circle' | 'square'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: Size
  shape?: Shape
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'circle'
})

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

const sizeMap: Record<Size, string> = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '56px',
  xl: '80px',
  '2xl': '120px'
}

const fontMap: Record<Size, string> = {
  xs: '10px',
  sm: '12px',
  md: '14px',
  lg: '18px',
  xl: '24px',
  '2xl': '36px'
}
</script>

<template>
  <span
    class="a-avatar"
    :class="[`s-${size}`, `shape-${shape}`]"
    :style="{ width: sizeMap[size], height: sizeMap[size], fontSize: fontMap[size] }"
    :title="name"
  >
    <img v-if="src" :src="src" :alt="alt || name" class="img" loading="lazy" />
    <span v-else class="initials">{{ initials }}</span>
  </span>
</template>

<style scoped>
.a-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--surface-2), var(--surface-3));
  color: var(--text-primary);
  font-weight: 600;
  font-family: var(--font-sans);
  letter-spacing: 0;
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
  border: 1px solid var(--border-subtle);
}

.shape-circle { border-radius: 50%; }
.shape-square { border-radius: var(--radius-sm); }

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
}
</style>
