<script setup lang="ts">
interface Props {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rect' | 'circle'
  rows?: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  rows: 1,
  animated: true
})

function toCss(v: string | number | undefined): string {
  if (v == null) return ''
  return typeof v === 'number' ? `${v}px` : v
}
</script>

<template>
  <div class="a-skeleton-wrap">
    <template v-if="variant === 'text'">
      <span
        v-for="i in rows"
        :key="i"
        class="a-skeleton text"
        :class="{ animated }"
        :style="{ width: i === rows && !width ? '70%' : toCss(width) || '100%' }"
      />
    </template>
    <span
      v-else
      class="a-skeleton"
      :class="[variant, { animated }]"
      :style="{ width: toCss(width), height: toCss(height) }"
    />
  </div>
</template>

<style scoped>
.a-skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.a-skeleton {
  display: block;
  background: var(--surface-1);
  border-radius: var(--radius-sm);
}
.text {
  height: 14px;
  border-radius: var(--radius-full);
}
.rect {
  border-radius: var(--radius-md);
}
.circle {
  border-radius: 50%;
}

.animated {
  background: linear-gradient(
    90deg,
    var(--surface-1) 0%,
    var(--surface-2) 50%,
    var(--surface-1) 100%
  );
  background-size: 200% 100%;
  animation: a-skeleton-pulse 1.6s ease-in-out infinite;
}

@keyframes a-skeleton-pulse {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
