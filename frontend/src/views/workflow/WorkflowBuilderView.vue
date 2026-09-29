<script setup lang="ts">
import { computed } from 'vue'
import { useSEO } from '@composables/useSEO'
import WorkflowToolbar from '@components/workflow/WorkflowToolbar.vue'
import NodePalette from '@components/workflow/NodePalette.vue'
import NodeInspector from '@components/workflow/NodeInspector.vue'
import WorkflowCanvas from '@components/workflow/WorkflowCanvas.vue'
import { useWorkflowStore } from '@stores/workflow'
import type { NodeKind } from '@utils/workflowTypes'

const store = useWorkflowStore()

useSEO({
  title: 'Workflow Builder — Aindgc',
  description: 'Visual AI workflow builder with drag-and-drop nodes, JSON / Markdown export.',
  noindex: true
})

function addFromPalette(kind: NodeKind) {
  // Spawn at center of current view
  store.addNode(kind, { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 })
}

const stats = computed(() => ({
  nodes: store.current.nodes.length,
  edges: store.current.edges.length
}))
</script>

<template>
  <div class="builder">
    <WorkflowToolbar />

    <div class="builder-body">
      <NodePalette :on-add="addFromPalette" />

      <main class="canvas-wrap">
        <WorkflowCanvas />
        <div v-if="store.current.nodes.length === 0" class="canvas-hint">
          <div class="hint-card">
            <h3>Start building</h3>
            <p>Drag a node from the left, or click any item in the palette.</p>
            <p class="hint-meta">Nodes: {{ stats.nodes }} · Edges: {{ stats.edges }}</p>
          </div>
        </div>
      </main>

      <NodeInspector />
    </div>
  </div>
</template>

<style scoped>
.builder {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-h) - 1px);
}

.builder-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.canvas-wrap {
  flex: 1;
  position: relative;
  background: var(--bg-overlay);
  min-width: 0;
}

.canvas-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.hint-card {
  background: var(--bg-elevated);
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-7);
  text-align: center;
  max-width: 360px;
  pointer-events: auto;
}
.hint-card h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}
.hint-card p {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-3) 0;
}
.hint-meta {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
}

@media (max-width: 1024px) {
  .builder-body { flex-direction: column; }
  .builder { height: auto; min-height: calc(100vh - var(--header-h) - 1px); }
  .canvas-wrap { min-height: 70vh; }
}
</style>
