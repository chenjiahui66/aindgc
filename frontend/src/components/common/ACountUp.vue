<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  end: number
  start?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
}

const props = withDefaults(defineProps<Props>(), {
  start: 0,
  duration: 1500,
  decimals: 0,
  separator: ','
})

const display = ref(format(props.start))
const rootRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let hasAnimated = false

function format(n: number): string {
  const fixed = n.toFixed(props.decimals)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
  return parts.join('.')
}

function animate() {
  if (hasAnimated) return
  hasAnimated = true
  const startTs = performance.now()
  const from = props.start
  const to = props.end
  const duration = props.duration

  function tick(now: number) {
    const elapsed = now - startTs
    const t = Math.min(1, elapsed / duration)
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3)
    const current = from + (to - from) * eased
    display.value = format(current)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (!rootRef.value) return
  if (typeof IntersectionObserver === 'undefined') {
    animate()
    return
  }
  observer = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) animate()
  }, { threshold: 0.2 })
  observer.observe(rootRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(() => props.end, () => {
  hasAnimated = false
  animate()
})
</script>

<template>
  <span ref="rootRef" class="a-count-up">
    {{ prefix }}{{ display }}{{ suffix }}
  </span>
</template>

<style scoped>
.a-count-up {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}
</style>
