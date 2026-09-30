<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  listTools, saveTool, publishTool, featureTool, deleteTool,
  type AdminTool, type PageEnvelope
} from '@api/admin'
import { useToast } from '@/composables/useToast'
import AButton from '@components/common/AButton.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASelect from '@components/common/ASelect.vue'
import ADrawer from '@components/common/ADrawer.vue'
import AModal from '@components/common/AModal.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'

const toast = useToast()
const data = ref<PageEnvelope<AdminTool> | null>(null)
const loading = ref(false)
const filterStatus = ref<string>('all')
const filterQ = ref('')
const page = ref(1)
const pageSize = 20

const statusOptions = [
  { label: 'All status', value: 'all' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' }
]

const editing = ref<Partial<AdminTool> | null>(null)
const drawerOpen = ref(false)
const saving = ref(false)
const confirmDelete = ref<AdminTool | null>(null)
const isEdit = computed(() => !!editing.value?.id)

async function load() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, size: pageSize }
    if (filterStatus.value !== 'all') params.status = filterStatus.value
    if (filterQ.value.trim()) params.q = filterQ.value.trim()
    data.value = await listTools(params)
  } catch (e) {
    toast.error((e as Error).message || 'Failed to load')
  } finally {
    loading.value = false
  }
}

onMounted(load)

function resetForm() {
  editing.value = {
    slug: '',
    name: '',
    description: '',
    longDescription: '',
    categoryId: undefined,
    icon: '',
    cover: '',
    tags: '',
    status: 'DRAFT',
    featured: 0,
    sort: 0
  }
}

function openCreate() { resetForm(); drawerOpen.value = true }
function openEdit(t: AdminTool) { editing.value = { ...t }; drawerOpen.value = true }

async function onSave() {
  if (!editing.value) return
  if (!editing.value.name?.trim() || !editing.value.slug?.trim()) {
    toast.error('Name and slug are required')
    return
  }
  saving.value = true
  try {
    await saveTool(editing.value)
    toast.success(isEdit.value ? 'Updated' : 'Created')
    drawerOpen.value = false
    editing.value = null
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Save failed')
  } finally {
    saving.value = false
  }
}

async function togglePublish(t: AdminTool) {
  const next = t.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  try {
    await publishTool(t.id!, next)
    toast.success(next === 'PUBLISHED' ? 'Published' : 'Unpublished')
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Action failed')
  }
}

async function toggleFeature(t: AdminTool) {
  const next = t.featured !== 1
  try {
    await featureTool(t.id!, next)
    toast.success(next ? 'Featured' : 'Unfeatured')
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Action failed')
  }
}

function askDelete(t: AdminTool) { confirmDelete.value = t }

// Built in script, not in the template: `\"` inside a :title="..." attribute
// breaks Vue's template expression parser.
const confirmTitle = computed(() =>
  confirmDelete.value ? `Delete "${confirmDelete.value.name}"?` : ''
)

// AModal's v-model is a boolean — v-model="confirmDelete" would feed the whole
// AdminTool object into a boolean prop.
const confirmOpen = computed({
  get: () => confirmDelete.value !== null,
  set: (v: boolean) => { if (!v) confirmDelete.value = null }
})
async function doDelete() {
  if (!confirmDelete.value?.id) return
  try {
    await deleteTool(confirmDelete.value.id)
    toast.success('Deleted')
    confirmDelete.value = null
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Delete failed')
  }
}

function resetFilters() {
  filterStatus.value = 'all'
  filterQ.value = ''
  page.value = 1
  load()
}

// Named handlers — inline arrow bodies with `;` in templates break
// the Vue template expression parser.
function gotoFirstPage() {
  page.value = 1
  load()
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    load()
  }
}

function nextPage() {
  page.value++
  load()
}

function statusVariant(s?: string): 'success' | 'warning' | 'muted' {
  if (s === 'PUBLISHED') return 'success'
  if (s === 'DRAFT') return 'warning'
  return 'muted'
}
function formatDate(s?: string) {
  return s ? s.slice(0, 10) : '—'
}
</script>

<template>
  <div class="admin-page">
    <header class="page-head">
      <div>
        <h2 class="page-title">Tools</h2>
        <p class="page-sub">{{ data?.total ?? 0 }} tools in database</p>
      </div>
      <AButton variant="primary" @click="openCreate">
        <AIcon name="plus" :size="14" /> New tool
      </AButton>
    </header>

    <div class="filters">
      <AInput
        v-model="filterQ"
        placeholder="Search name or description…"
        clearable
        style="flex: 1; min-width: 200px;"
        @keyup.enter="gotoFirstPage"
      />
      <ASelect v-model="filterStatus" :options="statusOptions" style="width: 160px;" />
      <AButton variant="ghost" size="md" @click="gotoFirstPage">Apply</AButton>
      <AButton variant="ghost" size="md" @click="resetFilters">Reset</AButton>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-title">Name</th>
            <th class="col-status">Status</th>
            <th class="col-feat">Featured</th>
            <th class="col-num">Sort</th>
            <th class="col-num">Views</th>
            <th class="col-num">Runs</th>
            <th class="col-date">Updated</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody v-if="data?.records?.length">
          <tr v-for="t in data.records" :key="t.id">
            <td class="col-title">
              <div class="title-cell">
                <span class="title-text">{{ t.name }}</span>
                <span class="title-slug">/{{ t.slug }}</span>
              </div>
            </td>
            <td class="col-status">
              <ATag :variant="statusVariant(t.status)">{{ t.status }}</ATag>
            </td>
            <td class="col-feat">
              <AIcon v-if="t.featured === 1" name="star" :size="14" color="#ffb850" />
              <span v-else class="dim">—</span>
            </td>
            <td class="col-num">{{ t.sort ?? 0 }}</td>
            <td class="col-num">{{ t.viewCount ?? 0 }}</td>
            <td class="col-num">{{ t.generateCount ?? 0 }}</td>
            <td class="col-date">{{ formatDate(t.updatedAt) }}</td>
            <td class="col-actions">
              <div class="actions">
                <button class="ic-btn" title="Edit" @click="openEdit(t)">
                  <AIcon name="edit-3" :size="14" />
                </button>
                <button class="ic-btn" :title="t.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'" @click="togglePublish(t)">
                  <AIcon :name="t.status === 'PUBLISHED' ? 'eye-off' : 'eye'" :size="14" />
                </button>
                <button class="ic-btn" title="Feature" @click="toggleFeature(t)">
                  <AIcon name="star" :size="14" />
                </button>
                <button class="ic-btn danger" title="Delete" @click="askDelete(t)">
                  <AIcon name="trash-2" :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!data?.records?.length && !loading" class="empty">No tools match your filters.</p>
      <p v-if="loading" class="empty">Loading…</p>
    </div>

    <footer v-if="(data?.total ?? 0) > pageSize" class="pagination">
      <AButton variant="ghost" size="sm" :disabled="page <= 1" @click="prevPage">Previous</AButton>
      <span class="page-info">Page {{ page }} · {{ data?.total }} total</span>
      <AButton
        variant="ghost" size="sm"
        :disabled="page * pageSize >= (data?.total ?? 0)"
        @click="nextPage"
      >Next</AButton>
    </footer>

    <ADrawer v-model="drawerOpen" :title="isEdit ? 'Edit tool' : 'New tool'" size="600px">
      <div v-if="editing" class="form">
        <div class="field">
          <label class="field-label">Name *</label>
          <AInput v-model="editing.name" placeholder="Tool name" />
        </div>
        <div class="field">
          <label class="field-label">Slug *</label>
          <AInput v-model="editing.slug" placeholder="url-friendly-identifier" />
        </div>
        <div class="row2">
          <div class="field">
            <label class="field-label">Status</label>
            <ASelect
              v-model="editing.status"
              :options="statusOptions.slice(1)"
              placeholder="Select"
            />
          </div>
          <div class="field">
            <label class="field-label">Sort order</label>
            <AInput v-model.number="editing.sort" type="number" placeholder="0" />
          </div>
        </div>
        <div class="field">
          <label class="field-label">Description (short)</label>
          <ATextarea v-model="editing.description" :rows="3" placeholder="One-line description for cards" />
        </div>
        <div class="field">
          <label class="field-label">Long description</label>
          <ATextarea v-model="editing.longDescription" :rows="6" placeholder="Full description shown on tool page" />
        </div>
        <div class="row2">
          <div class="field">
            <label class="field-label">Icon</label>
            <AInput v-model="editing.icon" placeholder="lucide icon name, e.g. workflow" />
          </div>
          <div class="field">
            <label class="field-label">Cover URL</label>
            <AInput v-model="editing.cover" placeholder="https://…" />
          </div>
        </div>
        <div class="field">
          <label class="field-label">Tags (comma-separated)</label>
          <AInput v-model="editing.tags" placeholder="agent, generator" />
        </div>
      </div>

      <template #footer>
        <div class="drawer-foot">
          <AButton variant="ghost" @click="drawerOpen = false">Cancel</AButton>
          <AButton variant="primary" :loading="saving" @click="onSave">
            {{ isEdit ? 'Save changes' : 'Create tool' }}
          </AButton>
        </div>
      </template>
    </ADrawer>

    <AModal v-model="confirmOpen" :title="confirmTitle" size="sm">
      <p class="confirm-text">This will soft-delete the tool. It will no longer appear in the public tool catalog.</p>
      <template #footer>
        <div class="modal-foot">
          <AButton variant="ghost" @click="confirmDelete = null">Cancel</AButton>
          <AButton variant="danger" @click="doDelete">Delete</AButton>
        </div>
      </template>
    </AModal>
  </div>
</template>

<style scoped>
.admin-page { display: flex; flex-direction: column; gap: 20px; }
.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.page-title { font-size: 22px; font-weight: 600; margin: 0; }
.page-sub { color: var(--fg-muted, #8a93a6); font-size: 13px; margin: 4px 0 0; }

.filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

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

.col-title { min-width: 240px; }
.col-status { width: 110px; }
.col-feat { width: 80px; text-align: center; }
.col-num { width: 80px; font-variant-numeric: tabular-nums; text-align: right; }
.col-date { width: 110px; color: var(--fg-faint, #5b6478); font-variant-numeric: tabular-nums; }
.col-actions { width: 180px; }

.title-cell { display: flex; flex-direction: column; gap: 2px; }
.title-text { font-weight: 500; color: var(--fg-base, #e8eaf0); }
.title-slug { font-size: 11.5px; color: var(--fg-faint, #5b6478); font-family: var(--font-mono, monospace); }

.dim { color: var(--fg-faint, #5b6478); }
.actions { display: flex; gap: 4px; }
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
.ic-btn.danger:hover {
  color: #ff7676;
  background: rgba(255, 118, 118, 0.06);
}

.empty {
  padding: 32px; text-align: center;
  color: var(--fg-faint, #5b6478);
  font-size: 13px;
  margin: 0;
}

.pagination { display: flex; align-items: center; justify-content: center; gap: 16px; }
.page-info {
  font-size: 12.5px; color: var(--fg-muted, #8a93a6);
  font-variant-numeric: tabular-nums;
}

.form { display: flex; flex-direction: column; gap: 16px; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 12px; letter-spacing: 0.04em;
  color: var(--fg-muted, #8a93a6);
  font-weight: 500;
}

.drawer-foot, .modal-foot { display: flex; justify-content: flex-end; gap: 8px; }

.confirm-text { color: var(--fg-muted, #8a93a6); font-size: 14px; margin: 0; line-height: 1.6; }

@media (max-width: 700px) {
  .row2 { grid-template-columns: 1fr; }
}
</style>