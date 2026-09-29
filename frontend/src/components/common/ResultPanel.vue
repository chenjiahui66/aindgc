<script setup lang="ts">
import { ref, computed } from 'vue'
import AButton from './AButton.vue'
import AIcon from './AIcon.vue'
import ACodeBlock from './ACodeBlock.vue'
import { useToast } from '@composables/useToast'
import { downloadText, downloadJSON, downloadMarkdown, downloadZip } from '@utils/download'
import { encodeShare, copyShareLink } from '@utils/share'
import { renderMarkdownLite } from '@utils/markdown'

interface Props {
  /** Output as Markdown text */
  markdown?: string
  /** Output as JSON object (rendered as a tab) */
  json?: unknown
  /** Optional extra files for ZIP export: { name, content } */
  files?: { name: string; content: string }[]
  /** Suggested filename (without extension) */
  filename?: string
  /** Whether to show Markdown preview tab */
  showMarkdownPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMarkdownPreview: true
})

const toast = useToast()
const tab = ref<'preview' | 'markdown' | 'json'>('preview')
const shared = ref(false)

const jsonString = computed(() => props.json ? JSON.stringify(props.json, null, 2) : '')
const hasJson = computed(() => props.json !== undefined && props.json !== null)
const hasFiles = computed(() => !!props.files?.length)

function copyToClipboard(text: string, label = 'Copied') {
  navigator.clipboard.writeText(text).then(
    () => toast.success(label),
    () => toast.error('Copy failed')
  )
}

function copyMarkdown() {
  if (props.markdown) copyToClipboard(props.markdown, 'Markdown copied')
}

function copyJSON() {
  if (jsonString.value) copyToClipboard(jsonString.value, 'JSON copied')
}

function downloadMd() {
  if (!props.markdown) return
  downloadMarkdown(`${props.filename || 'output'}.md`, props.markdown)
  toast.success('Markdown downloaded')
}

function downloadJson() {
  if (!hasJson.value) return
  downloadJSON(`${props.filename || 'output'}.json`, props.json)
  toast.success('JSON downloaded')
}

function downloadAllAsZip() {
  if (hasFiles.value && props.files) {
    downloadZip(`${props.filename || 'output'}.zip`, props.files)
  } else {
    const entries: { name: string; content: string }[] = []
    if (props.markdown) entries.push({ name: `${props.filename || 'output'}.md`, content: props.markdown })
    if (hasJson.value) entries.push({ name: `${props.filename || 'output'}.json`, content: jsonString.value })
    if (!entries.length) return
    downloadZip(`${props.filename || 'output'}.zip`, entries)
  }
  toast.success('ZIP downloaded')
}

async function share() {
  const payload: Record<string, unknown> = {}
  if (props.markdown) payload.markdown = props.markdown
  if (hasJson.value) payload.json = props.json
  const token = encodeShare(payload)
  if (!token) {
    toast.error('Share failed')
    return
  }
  const ok = await copyShareLink(token)
  if (ok) {
    shared.value = true
    setTimeout(() => (shared.value = false), 1800)
    toast.success('Share link copied')
  } else {
    toast.error('Clipboard unavailable')
  }
}

const renderedHtml = computed(() => props.markdown ? renderMarkdownLite(props.markdown) : '')
</script>

<template>
  <div class="result-panel">
    <header class="bar">
      <div class="tabs">
        <button
          v-if="showMarkdownPreview && markdown"
          class="tab"
          :class="{ active: tab === 'preview' }"
          @click="tab = 'preview'"
        >
          <AIcon name="eye" :size="14" /> Preview
        </button>
        <button
          v-if="markdown"
          class="tab"
          :class="{ active: tab === 'markdown' }"
          @click="tab = 'markdown'"
        >
          <AIcon name="file-text" :size="14" /> Markdown
        </button>
        <button
          v-if="hasJson"
          class="tab"
          :class="{ active: tab === 'json' }"
          @click="tab = 'json'"
        >
          <AIcon name="braces" :size="14" /> JSON
        </button>
      </div>

      <div class="actions">
        <button v-if="markdown" class="icon-btn" title="Copy Markdown" @click="copyMarkdown">
          <AIcon name="copy" :size="14" />
        </button>
        <button v-if="markdown" class="icon-btn" title="Download Markdown" @click="downloadMd">
          <AIcon name="download" :size="14" />
        </button>
        <button v-if="hasJson" class="icon-btn" title="Download JSON" @click="downloadJson">
          <AIcon name="file-json" :size="14" />
        </button>
        <button class="icon-btn primary" title="Download ZIP" @click="downloadAllAsZip">
          <AIcon name="package" :size="14" />
          <span>ZIP</span>
        </button>
        <button class="icon-btn" :class="{ active: shared }" title="Copy share link" @click="share">
          <AIcon :name="shared ? 'check' : 'share-2'" :size="14" />
        </button>
      </div>
    </header>

    <div class="content">
      <div v-if="tab === 'preview' && showMarkdownPreview && markdown" class="preview" v-html="renderedHtml" />
      <ACodeBlock v-else-if="tab === 'markdown' && markdown" :code="markdown" language="markdown" />
      <ACodeBlock v-else-if="tab === 'json' && hasJson" :code="jsonString" language="json" />
      <div v-else class="empty">
        <AIcon name="zap" :size="20" />
        <p>Fill in the inputs and click Generate.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 480px;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-1);
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tabs {
  display: flex;
  gap: 4px;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.tab:hover {
  color: var(--text-primary);
  background: var(--surface-2);
}
.tab.active {
  color: var(--accent-primary);
  background: rgba(111, 168, 255, 0.08);
  border-color: rgba(111, 168, 255, 0.20);
}

.actions {
  display: flex;
  gap: 4px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.icon-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-default);
}
.icon-btn.active {
  color: var(--color-success);
  border-color: rgba(91, 185, 140, 0.32);
}
.icon-btn.primary {
  background: rgba(111, 168, 255, 0.08);
  color: var(--accent-primary);
  border-color: rgba(111, 168, 255, 0.24);
}
.icon-btn.primary:hover {
  background: rgba(111, 168, 255, 0.14);
}

.content {
  flex: 1;
  overflow: auto;
  padding: var(--space-5);
}

.preview {
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
}
.preview :deep(.md-h) {
  color: var(--text-primary);
  margin: var(--space-5) 0 var(--space-3) 0;
  letter-spacing: var(--letter-tight);
}
.preview :deep(.md-h1) { font-size: var(--fs-h2); font-weight: 600; }
.preview :deep(.md-h2) { font-size: var(--fs-h3); font-weight: 600; }
.preview :deep(.md-h3) { font-size: var(--fs-h4); font-weight: 600; }
.preview :deep(.md-p) { margin: 0 0 var(--space-3) 0; }
.preview :deep(.md-ul) {
  margin: 0 0 var(--space-3) 0;
  padding-left: var(--space-5);
  list-style: disc;
}
.preview :deep(.md-ul li) {
  margin-bottom: var(--space-1);
  display: list-item;
}
.preview :deep(.md-code) {
  background: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  overflow-x: auto;
  margin: var(--space-3) 0;
}
.preview :deep(.md-inline-code) {
  background: var(--surface-1);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: 0.92em;
  color: var(--accent-secondary);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  min-height: 320px;
  color: var(--text-tertiary);
  gap: var(--space-2);
}
.empty p { margin: 0; font-size: var(--fs-body-sm); }
</style>
