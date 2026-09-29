<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowStore } from '@stores/workflow'
import AIcon from '@components/common/AIcon.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASelect from '@components/common/ASelect.vue'
import AButton from '@components/common/AButton.vue'
import AEmpty from '@components/common/AEmpty.vue'
import Stack from '@components/layout/Stack.vue'
import { NODE_KINDS, type NodeKind } from '@utils/workflowTypes'

const store = useWorkflowStore()

const node = computed(() => store.selectedNode)
const meta = computed(() => node.value ? NODE_KINDS[node.value.data.kind] : null)
const kind = computed<NodeKind | null>(() => node.value?.data.kind ?? null)

const branchOptions = [
  { label: 'Always',     value: 'always' },
  { label: 'On success', value: 'onSuccess' },
  { label: 'On error',   value: 'onError' }
]

function updateLabel(v: string) {
  if (!node.value) return
  store.updateNode(node.value.id, {
    data: { ...node.value.data, config: { ...node.value.data.config, label: v } }
  })
}

function updateDesc(v: string) {
  if (!node.value) return
  store.updateNode(node.value.id, {
    data: { ...node.value.data, config: { ...node.value.data.config, description: v } }
  })
}

function updatePayload(key: string, value: string) {
  if (!node.value) return
  const payload = { ...(node.value.data.config.payload || {}), [key]: value }
  store.updateNode(node.value.id, {
    data: { ...node.value.data, config: { ...node.value.data.config, payload } }
  })
}

function getPayload(key: string): string {
  const v = node.value?.data.config.payload?.[key]
  return v == null ? '' : String(v)
}

function removeNode() {
  if (!node.value) return
  store.removeNode(node.value.id)
}
</script>

<template>
  <aside class="inspector">
    <header class="ins-head">
      <h3>Inspector</h3>
      <p class="muted">{{ node ? 'Configure the selected node' : 'Select a node to edit' }}</p>
    </header>

    <div class="ins-body">
      <AEmpty
        v-if="!node"
        icon-name="mouse-pointer-click"
        title="Nothing selected"
        description="Click a node on the canvas to edit its properties."
        size="sm"
      />

      <div v-else class="ins-form">
        <header class="ins-node-info">
          <span class="ins-icon" :class="`kind-${kind}`">
            <AIcon v-if="meta" :name="meta.iconName" :size="14" />
          </span>
          <span class="ins-kind">{{ kind }}</span>
        </header>

        <Stack :gap="4">
          <Stack :gap="2">
            <label class="lbl">Label</label>
            <AInput :model-value="node.data.config.label" placeholder="Node label" @update:model-value="updateLabel" />
          </Stack>

          <Stack :gap="2">
            <label class="lbl">Description</label>
            <ATextarea :model-value="node.data.config.description || ''" :rows="3" placeholder="What does this node do?" @update:model-value="updateDesc" />
          </Stack>

          <!-- Per-kind payload editors -->
          <template v-if="kind === 'ai'">
            <Stack :gap="2">
              <label class="lbl">System prompt</label>
              <ATextarea :model-value="getPayload('system')" :rows="4" placeholder="You are an expert in..." @update:model-value="(v: string) => updatePayload('system', v)" />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">User prompt template</label>
              <ATextarea :model-value="getPayload('user')" :rows="3" placeholder="Given the input: {{input}}, produce..." @update:model-value="(v: string) => updatePayload('user', v)" />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">Model</label>
              <ASelect
                :model-value="getPayload('model') || 'claude-sonnet'"
                :options="[
                  { label: 'Claude Sonnet',  value: 'claude-sonnet' },
                  { label: 'Claude Opus',    value: 'claude-opus' },
                  { label: 'GPT-4o',         value: 'gpt-4o' },
                  { label: 'GPT-4o-mini',    value: 'gpt-4o-mini' },
                  { label: 'Gemini Pro',     value: 'gemini-pro' },
                  { label: 'DeepSeek',       value: 'deepseek' }
                ]"
                @update:model-value="(v: string | number | boolean | object) => updatePayload('model', String(v))"
              />
            </Stack>
          </template>

          <template v-else-if="kind === 'condition'">
            <Stack :gap="2">
              <label class="lbl">Expression</label>
              <ATextarea :model-value="getPayload('expr')" :rows="3" placeholder="score > 70" @update:model-value="(v: string) => updatePayload('expr', v)" />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">True label</label>
              <AInput :model-value="getPayload('trueLabel') || 'true'" @update:model-value="(v: string | number) => updatePayload('trueLabel', String(v))" />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">False label</label>
              <AInput :model-value="getPayload('falseLabel') || 'false'" @update:model-value="(v: string | number) => updatePayload('falseLabel', String(v))" />
            </Stack>
          </template>

          <template v-else-if="kind === 'tool'">
            <Stack :gap="2">
              <label class="lbl">Service</label>
              <ASelect
                :model-value="getPayload('service') || 'http'"
                :options="[
                  { label: 'HTTP Request',  value: 'http' },
                  { label: 'Database',      value: 'db' },
                  { label: 'Slack',         value: 'slack' },
                  { label: 'Email',         value: 'email' },
                  { label: 'CRM',           value: 'crm' },
                  { label: 'Custom',        value: 'custom' }
                ]"
                @update:model-value="(v: string | number | boolean | object) => updatePayload('service', String(v))"
              />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">Endpoint / action</label>
              <AInput :model-value="getPayload('endpoint')" placeholder="POST /api/..." @update:model-value="(v: string | number) => updatePayload('endpoint', String(v))" />
            </Stack>
          </template>

          <template v-else-if="kind === 'action'">
            <Stack :gap="2">
              <label class="lbl">Action</label>
              <ASelect
                :model-value="getPayload('action') || 'write'"
                :options="[
                  { label: 'Write to CRM',     value: 'write' },
                  { label: 'Send email',       value: 'email' },
                  { label: 'Send Slack',       value: 'slack' },
                  { label: 'Update DB',        value: 'db' },
                  { label: 'Webhook',          value: 'webhook' }
                ]"
                @update:model-value="(v: string | number | boolean | object) => updatePayload('action', String(v))"
              />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">Payload (JSON)</label>
              <ATextarea :model-value="getPayload('payload')" :rows="4" placeholder='{"to": "...", "body": "..."}' @update:model-value="(v: string) => updatePayload('payload', v)" />
            </Stack>
          </template>

          <template v-else-if="kind === 'trigger'">
            <Stack :gap="2">
              <label class="lbl">Trigger type</label>
              <ASelect
                :model-value="getPayload('type') || 'manual'"
                :options="[
                  { label: 'Manual',          value: 'manual' },
                  { label: 'Webhook',         value: 'webhook' },
                  { label: 'Schedule',        value: 'schedule' },
                  { label: 'New row in DB',   value: 'db-row' },
                  { label: 'Email received',  value: 'email' }
                ]"
                @update:model-value="(v: string | number | boolean | object) => updatePayload('type', String(v))"
              />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">Schedule (cron) <span class="hint">if schedule</span></label>
              <AInput :model-value="getPayload('cron')" placeholder="0 9 * * 1-5" @update:model-value="(v: string | number) => updatePayload('cron', String(v))" />
            </Stack>
          </template>

          <template v-else-if="kind === 'output'">
            <Stack :gap="2">
              <label class="lbl">Format</label>
              <ASelect
                :model-value="getPayload('format') || 'markdown'"
                :options="[
                  { label: 'Markdown',  value: 'markdown' },
                  { label: 'JSON',      value: 'json' },
                  { label: 'Email',     value: 'email' },
                  { label: 'Slack',     value: 'slack' }
                ]"
                @update:model-value="(v: string | number | boolean | object) => updatePayload('format', String(v))"
              />
            </Stack>
            <Stack :gap="2">
              <label class="lbl">Schema name</label>
              <AInput :model-value="getPayload('schema')" placeholder="e.g. LeadScoreResult" @update:model-value="(v: string | number) => updatePayload('schema', String(v))" />
            </Stack>
          </template>

          <div class="ins-actions">
            <AButton variant="ghost" size="sm" @click="removeNode">
              <template #icon><AIcon name="trash-2" /></template>
              Delete node
            </AButton>
          </div>
        </Stack>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.inspector {
  width: 320px;
  background: var(--bg-elevated);
  border-left: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.ins-head {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}
.ins-head h3 {
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

.ins-body {
  padding: var(--space-4);
  flex: 1;
}

.ins-node-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-4);
}
.ins-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
  background: var(--bg-overlay);
}
.kind-trigger   .ins-icon { color: var(--color-warning); }
.kind-ai        .ins-icon { color: var(--accent-primary); }
.kind-condition .ins-icon { color: var(--accent-secondary); }
.kind-tool      .ins-icon { color: var(--accent-warm); }
.kind-action    .ins-icon { color: var(--color-success); }
.kind-output    .ins-icon { color: var(--color-success); }
.ins-kind {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  text-transform: uppercase;
  letter-spacing: var(--letter-wide);
  color: var(--text-secondary);
}

.lbl {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.hint {
  text-transform: none;
  letter-spacing: 0;
  color: var(--text-muted);
  font-size: 11px;
  margin-left: var(--space-2);
}
.ins-actions {
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}
</style>
