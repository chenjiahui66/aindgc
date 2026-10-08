/**
 * Shared, load-once accessor for the public site config.
 *
 * The footer, the SEO layer and the JSON-LD block all need a few of these
 * keys, and /api/site/config/public is the same response every time. A
 * module-scoped cache means the first component to call load() pays for the
 * request and everyone else reuses it.
 *
 * The promise (not the result) is cached on purpose: without it, N components
 * mounting in the same tick would all see `loading === false` and fire N
 * identical requests.
 */
import { readonly, ref } from 'vue'
import { fetchPublicSiteConfig, type PublicSiteConfig } from '@api/site'

const config = ref<PublicSiteConfig>({})
const loading = ref(false)
/** Set on success AND on failure, so a backend outage does not retry forever. */
const loaded = ref(false)

/** The in-flight request, not its result — see the note above. */
let inflight: Promise<void> | null = null

async function load(): Promise<PublicSiteConfig> {
  if (loaded.value) return config.value

  if (!inflight) {
    loading.value = true
    inflight = fetchPublicSiteConfig()
      .then((res) => {
        // Tolerate null/absent data rather than throwing and breaking every
        // consumer that merely wanted to render a footer.
        if (res && typeof res === 'object') config.value = res
      })
      .catch(() => {
        /* offline or backend down — callers fall back to their defaults */
      })
      .finally(() => {
        loaded.value = true
        loading.value = false
        inflight = null
      })
  }

  await inflight
  return config.value
}

export function useSiteConfig() {
  return {
    config: readonly(config),
    loading: readonly(loading),
    load,
    /** Convenience getter: returns '' when the key is absent. */
    valueOf(key: string): string {
      return config.value[key] ?? ''
    }
  }
}