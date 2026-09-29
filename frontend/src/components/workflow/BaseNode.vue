<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import AIcon from '@components/common/AIcon.vue'
import { NODE_KINDS, type WorkflowNodeData, type NodeKind } from '@utils/workflowTypes'

interface Props extends NodeProps {
  data: WorkflowNodeData
  selected?: boolean
}

const props = defineProps<Props>()

const kind = computed<NodeKind>(() => props.data.kind)
const meta = computed(() => NODE_KINDS[kind.value])
const label = computed(() => props.data.config.label || meta.value.label)
const description = computed(() => props.data.config.description || meta.value.description)

const showSource = computed(() => kind.value !== 'trigger')
const showTarget = computed(() => kind.value !== 'output')
</script>

<template>
  <div
    class="wf-node"
    :class="[`kind-${kind}`, { selected }]"
  >
    <Handle v-if="showTarget" type="target" :position="Position.Left" :is-connectable="true" />

    <header class="wf-node-head">
      <span class="wf-node-icon">
        <AIcon :name="meta.iconName" :size="14" />
      </span>
      <span class="wf-node-name">{{ label }}</span>
      <span class="wf-node-kind">{{ kind }}</span>
    </header>

    <div v-if="description" class="wf-node-body">
      <p class="wf-node-desc">{{ description }}</p>
    </div>

    <Handle v-if="showSource" type="source" :position="Position.Right" :is-connectable="true" />
  </div>
</template>
