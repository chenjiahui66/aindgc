import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useReveal(options?: IntersectionObserverInit) {
  const elementRef: Ref<HTMLElement | null> = ref(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return
    if (typeof IntersectionObserver === 'undefined') {
      isVisible.value = true
      return
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options })
    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { elementRef, isVisible }
}
