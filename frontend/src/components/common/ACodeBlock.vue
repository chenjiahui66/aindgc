<script setup lang="ts">
import { ref, watch } from 'vue'
import AIcon from './AIcon.vue'

interface Props {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  copyable?: boolean
  wrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'text',
  showLineNumbers: true,
  copyable: true,
  wrap: false
})

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* fallback */
    const ta = document.createElement('textarea')
    ta.value = props.code
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } catch { /* ignore */ }
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  }
}

const lineCount = ref(0)
watch(() => props.code, () => {
  lineCount.value = props.code.split('\n').length
}, { immediate: true })
</script>

<template>
  <div class="a-code">
    <header v-if="filename || copyable" class="bar">
      <span v-if="filename" class="filename">{{ filename }}</span>
      <span v-else class="lang">{{ language }}</span>
      <button v-if="copyable" class="copy" :class="{ copied }" @click="copy">
        <AIcon :name="copied ? 'check' : 'copy'" :size="14" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </header>
    <div class="pre-wrap" :class="{ wrap }">
      <pre v-if="showLineNumbers" class="pre"><span class="gutter" aria-hidden="true"><span v-for="n in lineCount" :key="n" class="ln">{{ n }}</span></span><code :class="`lang-${language}`">{{ code }}</code></pre>
      <pre v-else class="pre"><code :class="`lang-${language}`">{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.a-code {
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-mono);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--surface-1);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
}

.filename {
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.lang {
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: var(--letter-wide);
}

.copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-family: inherit;
  font-size: var(--fs-caption);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.copy:hover {
  color: var(--text-primary);
  border-color: var(--border-default);
}
.copy.copied {
  color: var(--color-success);
  border-color: rgba(91, 185, 140, 0.32);
}

.pre-wrap {
  overflow-x: auto;
}
.pre-wrap.wrap .pre {
  white-space: pre-wrap;
  word-break: break-all;
}

.pre {
  display: flex;
  margin: 0;
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-primary);
  background: transparent;
}
.gutter {
  display: flex;
  flex-direction: column;
  padding-right: 14px;
  margin-right: 14px;
  border-right: 1px solid var(--border-subtle);
  color: var(--text-muted);
  user-select: none;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.ln {
  display: block;
}

code {
  font-family: var(--font-mono);
  font-size: inherit;
}
</style>
