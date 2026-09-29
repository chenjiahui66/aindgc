<script setup lang="ts">
import AIcon from '@components/common/AIcon.vue'
import { NODE_KINDS, type NodeKind } from '@utils/workflowTypes'

interface Props {
  /** Optional: provide node creation callback instead of drag-and-drop */
  onAdd?: (kind: NodeKind) => void
}

defineProps<Props>()

const kinds: NodeKind[] = ['trigger', 'ai', 'condition', 'tool', 'action', 'output']

function onDragStart(e: DragEvent, kind: NodeKind) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData('application/wf-node-kind', kind)
  e.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <aside class="palette">
    <header class="palette-head">
      <h3>Nodes</h3>
      <p class="muted">Drag onto canvas</p>
    </header>
    <ul class="palette-list">
      <li
        v-for="k in kinds"
        :key="k"
        class="palette-item"
        :class="`kind-${k}`"
        draggable="true"
        @dragstart="(e) => onDragStart(e, k)"
        @click="onAdd?.(k)"
      >
        <span class="palette-icon">
          <AIcon :name="NODE_KINDS[k].iconName" :size="14" />
        </span>
        <div class="palette-text">
          <p class="palette-label">{{ NODE_KINDS[k].label }}</p>
          <p class="palette-desc">{{ NODE_KINDS[k].description }}</p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.palette {
  width: 240px;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-3);
  overflow-y: auto;
}

.palette-head h3 {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 500;
  margin: 0 0 4px 0;
}
.muted {
  font-size: var(--fs-caption);
  color: var(--text-muted);
  margin: 0;
}

.palette-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.palette-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: 10px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  cursor: grab;
  transition: all var(--duration-fast) var(--ease-standard);
  user-select: none;
}
.palette-item:hover {
  border-color: var(--border-default);
  background: var(--surface-2);
}
.palette-item:active {
  cursor: grabbing;
}

.palette-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
  background: var(--bg-overlay);
  flex-shrink: 0;
}
.kind-trigger   .palette-icon { color: var(--color-warning); }
.kind-ai        .palette-icon { color: var(--accent-primary); }
.kind-condition .palette-icon { color: var(--accent-secondary); }
.kind-tool      .palette-icon { color: var(--accent-warm); }
.kind-action    .palette-icon { color: var(--color-success); }
.kind-output    .palette-icon { color: var(--color-success); }

.palette-text { min-width: 0; }
.palette-label {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.palette-desc {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 2px 0 0 0;
  line-height: 1.4;
}
</style>
