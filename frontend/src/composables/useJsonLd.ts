/**
 * useJsonLd — inject structured-data <script type="application/ld+json">
 * tags into <head>. Each call site is identified by a key so multiple schemas
 * on the same page (e.g. WebSite + BreadcrumbList) coexist.
 *
 * Usage:
 *   useJsonLd('website', computed(() => ({ '@context': 'https://schema.org', '@type': 'WebSite', ... })))
 *   // or for a single payload:
 *   useJsonLd('article', { '@context': 'https://schema.org', '@type': 'Article', ... })
 */
import { watch, type Ref } from 'vue'

const SITE_URL = (typeof window !== 'undefined' && window.location?.origin) || 'https://aindgc.com'

const SCRIPT_ID_PREFIX = 'aindgc-jsonld-'

export function setJsonLd(key: string, data: unknown) {
  if (typeof document === 'undefined') return
  const id = SCRIPT_ID_PREFIX + key

  // Remove existing
  const existing = document.getElementById(id)
  if (existing) existing.remove()

  if (!data) return

  // Normalize: support single object or array of objects
  const payload = Array.isArray(data) ? data : [data]

  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload)
  document.head.appendChild(script)
}

export function clearJsonLd(key: string) {
  if (typeof document === 'undefined') return
  const id = SCRIPT_ID_PREFIX + key
  const existing = document.getElementById(id)
  if (existing) existing.remove()
}

export function useJsonLd(key: string, data: Ref<unknown> | unknown) {
  if (typeof (data as Ref<unknown>).value !== 'undefined' && 'value' in (data as object)) {
    watch(
      () => (data as Ref<unknown>).value,
      (val) => setJsonLd(key, val),
      { immediate: true }
    )
  } else {
    setJsonLd(key, data)
  }
}

export { SITE_URL }