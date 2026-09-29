<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { listSettings, updateSetting, type SiteConfig } from '@api/admin'
import { useToast } from '@/composables/useToast'
import AButton from '@components/common/AButton.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASelect from '@components/common/ASelect.vue'
import ADrawer from '@components/common/ADrawer.vue'
import ATag from '@components/common/ATag.vue'
import AIcon from '@components/common/AIcon.vue'

const toast = useToast()
const items = ref<SiteConfig[]>([])
const loading = ref(false)
const filterQ = ref('')
const showPublicOnly = ref(false)

const editing = ref<SiteConfig | null>(null)
const drawerOpen = ref(false)
const saving = ref(false)

const typeOptions = [
  { label: 'String',  value: 'STRING' },
  { label: 'Number',  value: 'NUMBER' },
  { label: 'Boolean', value: 'BOOLEAN' },
  { label: 'JSON',    value: 'JSON' }
]

async function load() {
  loading.value = true
  try {
    items.value = await listSettings()
  } catch (e) {
    toast.error((e as Error).message || 'Failed to load')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const filtered = computed(() => {
  let arr = items.value
  if (showPublicOnly.value) {
    arr = arr.filter(c => c.isPublic === 1)
  }
  if (filterQ.value.trim()) {
    const q = filterQ.value.toLowerCase()
    arr = arr.filter(c =>
      c.configKey.toLowerCase().includes(q) ||
      (c.configValue || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    )
  }
  return arr
})

function openEdit(c: SiteConfig) {
  editing.value = { ...c }
  drawerOpen.value = true
}

async function onSave() {
  if (!editing.value) return
  saving.value = true
  try {
    await updateSetting(editing.value.configKey, {
      configValue: editing.value.configValue,
      valueType: editing.value.valueType,
      description: editing.value.description,
      isPublic: editing.value.isPublic
    })
    toast.success('Saved')
    drawerOpen.value = false
    editing.value = null
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Save failed')
  } finally {
    saving.value = false
  }
}

function variant(c: SiteConfig): 'primary' | 'muted' {
  return c.isPublic === 1 ? 'primary' : 'muted'
}

function previewValue(c: SiteConfig): string {
  const v = c.configValue || ''
  if (c.valueType === 'JSON') {
    try { return JSON.stringify(JSON.parse(v), null, 2) } catch { return v }
  }
  return v
}

function formatDate(s?: string) {
  return s ? s.slice(0, 16).replace('T', ' ') : '—'
}
</script>

<template>
  <div class="admin-page">
    <header class="page-head">
      <div>
        <h2 class="page-title">Site settings</h2>
        <p class="page-sub">{{ items.length }} config keys · runtime-editable</p>
      </div>
    </header>

    <div class="filters">
      <AInput
        v-model="filterQ"
        placeholder="Search key, value, description…"
        clearable
        style="flex: 1; min-width: 200px;"
      />
      <label class="toggle">
        <input v-model="showPublicOnly" type="checkbox" />
        <span>Public only</span>
      </label>
    </div>

    <p class="hint">
      <AIcon name="info" :size="13" />
      Public configs are exposed via <code>GET /api/site/config/public</code> for the frontend.
      Private configs (isPublic=0) are only used internally by backend services.
    </p>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-key">Key</th>
            <th class="col-val">Value</th>
            <th class="col-type">Type</th>
            <th class="col-scope">Scope</th>
            <th class="col-date">Updated</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody v-if="filtered.length">
          <tr v-for="c in filtered" :key="c.configKey">
            <td class="col-key">
              <div class="key-cell">
                <code class="key">{{ c.configKey }}</code>
                <span v-if="c.description" class="desc">{{ c.description }}</span>
              </div>
            </td>
            <td class="col-val">
              <code class="val">{{ previewValue(c) }}</code>
            </td>
            <td class="col-type">
              <span class="type-chip">{{ c.valueType || 'STRING' }}</span>
            </td>
            <td class="col-scope">
              <ATag :variant="variant(c)">
                {{ c.isPublic === 1 ? 'public' : 'private' }}
              </ATag>
            </td>
            <td class="col-date">{{ formatDate(c.updatedAt) }}</td>
            <td class="col-actions">
              <button class="ic-btn" title="Edit" @click="openEdit(c)">
                <AIcon name="edit-3" :size="14" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!filtered.length && !loading" class="empty">No settings match your filters.</p>
      <p v-if="loading" class="empty">Loading…</p>
    </div>

    <ADrawer v-model="drawerOpen" :title="`Edit ${editing?.configKey}`" size="560px">
      <div v-if="editing" class="form">
        <div class="field">
          <label class="field-label">Key (read-only)</label>
          <AInput :model-value="editing.configKey" disabled />
        </div>
        <div class="row2">
          <div class="field">
            <label class="field-label">Type</label>
            <ASelect v-model="editing.valueType" :options="typeOptions" />
          </div>
          <div class="field">
            <label class="field-label">Visibility</label>
            <ASelect
              :model-value="String(editing.isPublic ?? 0)"
              :options="[
                { label: 'Public', value: '1' },
                { label: 'Private', value: '0' }
              ]"
              @update:model-value="(v: string | number | boolean | object) => editing && (editing.isPublic = Number(v))"
            />
          </div>
        </div>
        <div class="field">
          <label class="field-label">Description</label>
          <AInput v-model="editing.description" placeholder="What is this config used for?" />
        </div>
        <div class="field">
          <label class="field-label">Value</label>
          <ATextarea
            v-if="editing.valueType === 'JSON' || (editing.configValue || '').includes('\n')"
            v-model="editing.configValue"
            :rows="10"
            placeholder="JSON or multi-line value"
          />
          <AInput
            v-else
            v-model="editing.configValue"
            placeholder="config value"
          />
        </div>
      </div>

      <template #footer>
        <div class="drawer-foot">
          <AButton variant="ghost" @click="drawerOpen = false">Cancel</AButton>
          <AButton variant="primary" :loading="saving" @click="onSave">Save changes</AButton>
        </div>
      </template>
    </ADrawer>
  </div>
</template>

<style scoped>
.admin-page { display: flex; flex-direction: column; gap: 20px; }
.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.page-title { font-size: 22px; font-weight: 600; margin: 0; }
.page-sub { color: var(--fg-muted, #8a93a6); font-size: 13px; margin: 4px 0 0; }

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--fg-muted, #8a93a6);
  cursor: pointer;
}
.toggle input { accent-color: #4a9eff; }

.hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(74, 158, 255, 0.05);
  border: 1px solid rgba(74, 158, 255, 0.15);
  border-radius: 8px;
  font-size: 12.5px;
  color: var(--fg-muted, #8a93a6);
  margin: 0;
}
.hint code {
  font-family: var(--font-mono, monospace);
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11.5px;
}

.table-wrap {
  background: var(--bg-surface, #0b0e13);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  overflow: hidden;
}
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-faint, #5b6478);
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
}
.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.04));
}
.data-table tr:last-child td { border-bottom: 0; }
.data-table tr:hover td { background: rgba(255, 255, 255, 0.02); }

.col-key { min-width: 240px; }
.col-val { min-width: 240px; max-width: 380px; }
.col-type { width: 100px; }
.col-scope { width: 100px; }
.col-date { width: 140px; color: var(--fg-faint, #5b6478); font-variant-numeric: tabular-nums; font-size: 12.5px; }
.col-actions { width: 80px; }

.key-cell { display: flex; flex-direction: column; gap: 4px; }
.key {
  font-family: var(--font-mono, monospace);
  font-size: 12.5px;
  color: var(--fg-base, #e8eaf0);
}
.desc {
  font-size: 11.5px;
  color: var(--fg-faint, #5b6478);
  line-height: 1.4;
}
.val {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--fg-muted, #b8c0d0);
  white-space: pre-wrap;
  word-break: break-all;
  display: block;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.type-chip {
  font-size: 11px;
  letter-spacing: 0.04em;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono, monospace);
  color: var(--fg-muted, #8a93a6);
}

.ic-btn {
  width: 28px; height: 28px;
  display: grid; place-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--fg-muted, #8a93a6);
  transition: all 0.12s ease;
}
.ic-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--fg-base, #e8eaf0);
  border-color: var(--border-subtle, rgba(255, 255, 255, 0.06));
}

.empty {
  padding: 32px; text-align: center;
  color: var(--fg-faint, #5b6478);
  font-size: 13px;
  margin: 0;
}

.form { display: flex; flex-direction: column; gap: 16px; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 12px; letter-spacing: 0.04em;
  color: var(--fg-muted, #8a93a6);
  font-weight: 500;
}
.drawer-foot { display: flex; justify-content: flex-end; gap: 8px; }

@media (max-width: 700px) {
  .row2 { grid-template-columns: 1fr; }
}
</style>