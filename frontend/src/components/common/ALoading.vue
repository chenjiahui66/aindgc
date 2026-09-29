<script setup lang="ts">
interface Props {
  size?: number
  text?: string
  variant?: 'spinner' | 'dots' | 'pulse'
  block?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 18,
  variant: 'spinner'
})
</script>

<template>
  <div class="a-loading" :class="{ block }" role="status" :aria-label="text || 'Loading'">
    <span v-if="variant === 'spinner'" class="spinner" :style="{ width: `${size}px`, height: `${size}px` }" />
    <span v-else-if="variant === 'dots'" class="dots" :style="{ '--dot-size': `${size}px` }">
      <span class="dot" />
      <span class="dot" />
      <span class="dot" />
    </span>
    <span v-else class="pulse" :style="{ width: `${size}px`, height: `${size}px` }" />
    <span v-if="text" class="text">{{ text }}</span>
  </div>
</template>

<style scoped>
.a-loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
}
.block {
  display: flex;
  width: 100%;
  justify-content: center;
  padding-block: var(--space-6);
}

.spinner {
  border: 2px solid var(--border-default);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: a-loading-spin 0.7s linear infinite;
}

.dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.dot {
  width: var(--dot-size, 6px);
  height: var(--dot-size, 6px);
  background: var(--accent-primary);
  border-radius: 50%;
  animation: a-loading-dot 1.2s ease-in-out infinite;
}
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

.pulse {
  background: var(--accent-primary);
  border-radius: 50%;
  animation: a-loading-pulse 1.2s ease-in-out infinite;
}

.text {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
}

@keyframes a-loading-spin {
  to { transform: rotate(360deg); }
}
@keyframes a-loading-dot {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes a-loading-pulse {
  0%, 100% { transform: scale(0.7); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
}
</style>
