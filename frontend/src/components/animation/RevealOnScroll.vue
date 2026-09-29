<script setup lang="ts">
import { useReveal } from '@composables/useReveal'

interface Props {
  delay?: number
  duration?: number
  y?: number
  once?: boolean
  as?: keyof HTMLElementTagNameMap
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 600,
  y: 16,
  once: true,
  as: 'div'
})

const { elementRef, isVisible } = useReveal()
</script>

<template>
  <component
    :is="as"
    ref="elementRef"
    class="reveal"
    :class="{ visible: isVisible }"
    :style="{
      transitionDelay: `${delay}ms`,
      transitionDuration: `${duration}ms`,
      '--reveal-y': `${y}px`
    }"
  >
    <slot />
  </component>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(var(--reveal-y, 16px));
  transition:
    opacity var(--duration-slow) var(--ease-standard),
    transform var(--duration-slow) var(--ease-standard);
  will-change: opacity, transform;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
