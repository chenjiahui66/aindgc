<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  VueFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  useVueFlow,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import BaseNode from './BaseNode.vue'
import { useWorkflowStore } from '@stores/workflow'
import type { WorkflowNodeData, NodeKind, WorkflowEdgeData } from '@utils/workflowTypes'

const store = useWorkflowStore()
const { onPaneReady } = useVueFlow()

const nodeTypes = { trigger: BaseNode, ai: BaseNode, condition: BaseNode, tool: BaseNode, action: BaseNode, output: BaseNode }

// Convert store graph to Vue Flow nodes/edges (add a stable id-keyed wrapper)
const flowNodes = ref<Node<WorkflowNodeData>[]>([])
const flowEdges = ref<Edge<WorkflowEdgeData>[]>([])

function syncFromStore() {
  // The explicit intermediate type keeps TS from infinitely instantiating
  // Node<WorkflowNodeData> against Pinia's deeply-unwrapped store type
  // (TS2589: "Type instantiation is excessively deep").
  const nodes: Node<WorkflowNodeData>[] = store.current.nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data
  }))
  const edges: Edge<WorkflowEdgeData>[] = store.current.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    data: e.data
  }))
  flowNodes.value = nodes
  flowEdges.value = edges
}

watch(() => store.current, () => syncFromStore(), { deep: true, immediate: true })

function onNodesChange(changes: NodeChange[]) {
  for (const c of changes) {
    if (c.type === 'position' && c.position) {
      store.updateNode(c.id, { position: c.position })
    } else if (c.type === 'remove') {
      store.removeNode(c.id)
    } else if (c.type === 'select') {
      if (c.selected) store.selectedNodeId = c.id
      else if (store.selectedNodeId === c.id) store.selectedNodeId = null
    }
  }
}

function onEdgesChange(changes: EdgeChange[]) {
  for (const c of changes) {
    if (c.type === 'remove') store.removeEdge(c.id)
  }
}

function onConnect(c: Connection) {
  if (!c.source || !c.target) return
  const id = `e-${Date.now().toString(36)}`
  store.current.edges.push({
    id,
    source: c.source,
    target: c.target,
    sourceHandle: c.sourceHandle ?? undefined,
    targetHandle: c.targetHandle ?? undefined,
    data: { branch: 'always' }
  })
  store.touch()
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const kind = e.dataTransfer?.getData('application/wf-node-kind') as NodeKind | undefined
  if (!kind) return
  const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const position = {
    x: e.clientX - bounds.left - 100,
    y: e.clientY - bounds.top - 30
  }
  store.addNode(kind, position)
}

function onPaneClick() {
  store.selectedNodeId = null
}
</script>

<template>
  <div class="workflow-canvas" @dragover="onDragOver" @drop="onDrop">
    <VueFlow
      :nodes="flowNodes"
      :edges="flowEdges"
      :node-types="nodeTypes"
      :default-edge-options="{ type: 'smoothstep', style: { strokeWidth: 1.5 } }"
      :connection-line-style="{ stroke: 'var(--accent-primary)', strokeWidth: 2 }"
      fit-view-on-init
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
      @connect="onConnect"
      @pane-click="onPaneClick"
    >
      <Background pattern-color="rgba(255,255,255,0.04)" :gap="20" />
      <Controls position="bottom-left" />
      <MiniMap
        pannable
        zoomable
        position="bottom-right"
        mask-color="rgba(11, 14, 19, 0.6)"
      />
    </VueFlow>
  </div>
</template>

<style scoped>
.workflow-canvas {
  width: 100%;
  height: 100%;
  min-height: 600px;
}
</style>
