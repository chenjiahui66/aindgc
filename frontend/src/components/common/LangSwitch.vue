<script setup lang="ts">
import { useLocaleStore } from '@/stores/locale'
import { LOCALE_LABEL, type Locale } from '@/i18n'
import AIcon from './AIcon.vue'

interface Props {
  /** compact: dropdown trigger with current label */
  variant?: 'compact' | 'inline'
}

withDefaults(defineProps<Props>(), { variant: 'compact' })

const localeStore = useLocaleStore()
</script>

<template>
  <!-- Inline: side-by-side pill buttons (use in footer / sidebar) -->
  <div v-if="variant === 'inline'" class="lang-inline">
    <button
      v-for="loc in localeStore.supported"
      :key="loc"
      class="lang-pill"
      :class="{ 'is-active': localeStore.current === loc }"
      type="button"
      @click="localeStore.switchTo(loc as Locale)"
    >
      {{ LOCALE_LABEL[loc as Locale] }}
    </button>
  </div>

  <!-- Compact: single button toggling zh↔en (use in header) -->
  <button
    v-else
    class="lang-toggle"
    type="button"
    :title="`Switch to ${LOCALE_LABEL[localeStore.current === 'zh' ? 'en' : 'zh']}`"
    @click="localeStore.toggle()"
  >
    <AIcon name="globe" :size="14" />
    <span>{{ localeStore.label }}</span>
  </button>
</template>

<style scoped>
/* ── inline variant ── */
.lang-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
}
.lang-pill {
  padding: 4px 12px;
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.15s ease;
}
.lang-pill:hover { color: var(--text-primary); }
.lang-pill.is-active {
  background: var(--accent-primary);
  color: #06121F;
}

/* ── compact variant ── */
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}
.lang-toggle:hover {
  color: var(--text-primary);
  border-color: var(--accent-primary);
}
</style>