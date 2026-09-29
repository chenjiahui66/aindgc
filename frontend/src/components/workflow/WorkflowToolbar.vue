<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkflowStore } from '@stores/workflow'
import { useToast } from '@composables/useToast'
import { downloadJSON, downloadMarkdown } from '@utils/download'
import AIcon from '@components/common/AIcon.vue'
import AButton from '@components/common/AButton.vue'
import AInput from '@components/common/AInput.vue'
import ATag from '@components/common/ATag.vue'
import AConfirmStub from './ConfirmStub.vue'

const store = useWorkflowStore()
const router = useRouter()
const toast = useToast()

const editingName = ref(false)
const confirmClear = ref(false)
const confirmNew = ref(false)

function save() {
  store.saveCurrent()
  toast.success('Workflow saved locally')
}

function exportMd() {
  downloadMarkdown(`${(store.current.name || 'workflow').toLowerCase().replace(/\s+/g, '-')}.md`, store.exportMarkdown())
  toast.success('Markdown downloaded')
}

function exportJson() {
  downloadJSON(`${(store.current.name || 'workflow').toLowerCase().replace(/\s+/g, '-')}.json`, store.current)
  toast.success('JSON downloaded')
}

function newWorkflow() {
  if (store.current.nodes.length > 0) {
    confirmNew.value = true
    return
  }
  doNew()
}

function doNew() {
  store.reset()
  confirmNew.value = false
}

function clear() {
  confirmClear.value = true
}

function doClear() {
  store.current.nodes = []
  store.current.edges = []
  store.selectedNodeId = null
  store.touch()
  confirmClear.value = false
  toast.success('Canvas cleared')
}

function goList() {
  router.push('/workflow')
}
</script>

<template>
  <header class="toolbar">
    <div class="left">
      <button class="back" type="button" @click="goList">
        <AIcon name="arrow-left" :size="16" />
        <span>Templates</span>
      </button>
      <span class="sep" />
      <div class="title-wrap">
        <ATag tone="neutral" size="sm">Workflow</ATag>
        <input
          v-if="editingName"
          v-model="store.current.name"
          class="name-input"
          placeholder="Workflow name"
          autofocus
          @blur="editingName = false"
          @keyup.enter="editingName = false"
        />
        <button v-else class="name-display" type="button" @click="editingName = true">
          {{ store.current.name || 'Untitled' }}
          <AIcon name="pencil" :size="12" />
        </button>
      </div>
    </div>

    <div class="right">
      <AButton variant="ghost" size="sm" @click="newWorkflow">
        <template #icon><AIcon name="file-plus" /></template>
        New
      </AButton>
      <AButton variant="ghost" size="sm" @click="clear">
        <template #icon><AIcon name="eraser" /></template>
        Clear
      </AButton>
      <AButton variant="outline" size="sm" @click="exportMd">
        <template #icon><AIcon name="file-text" /></template>
        Markdown
      </AButton>
      <AButton variant="outline" size="sm" @click="exportJson">
        <template #icon><AIcon name="braces" /></template>
        JSON
      </AButton>
      <AButton variant="primary" size="sm" @click="save">
        <template #icon><AIcon name="save" /></template>
        Save
      </AButton>
    </div>

    <AConfirmStub
      v-if="confirmNew"
      title="Discard current workflow?"
      message="Starting a new workflow will discard your current changes (unless you save first)."
      confirm-text="Discard & New"
      @confirm="doNew"
      @cancel="confirmNew = false"
    />
    <AConfirmStub
      v-if="confirmClear"
      title="Clear canvas?"
      message="All nodes and edges will be removed. The workflow itself remains in the list."
      confirm-text="Clear"
      @confirm="doClear"
      @cancel="confirmClear = false"
    />
  </header>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

.left, .right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: var(--fs-body-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.back:hover {
  color: var(--text-primary);
  border-color: var(--border-default);
}

.sep {
  width: 1px;
  height: 24px;
  background: var(--border-subtle);
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.name-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font-family: var(--font-display);
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  cursor: text;
  transition: all var(--duration-fast) var(--ease-standard);
}
.name-display:hover {
  background: var(--surface-1);
  border-color: var(--border-subtle);
}

.name-input {
  font-family: var(--font-display);
  font-size: var(--fs-body-lg);
  font-weight: 600;
  background: var(--surface-1);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  color: var(--text-primary);
  outline: none;
}
</style>
