<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import {
  listArticles, saveArticle, publishArticle, featureArticle, deleteArticle,
  type AdminArticle, type PageEnvelope
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
const data = ref<PageEnvelope<AdminArticle> | null>(null)
const loading = ref(false)
const filterStatus = ref<string>('all')
const filterQ = ref('')
const page = ref(1)
const pageSize = 20

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' }
]

const editing = ref<Partial<AdminArticle> | null>(null)
const drawerOpen = ref(false)
const saving = ref(false)

const confirmDelete = ref<AdminArticle | null>(null)

const isEdit = computed(() => !!editing.value?.id)

async function load() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, size: pageSize }
    if (filterStatus.value !== 'all') params.status = filterStatus.value
    if (filterQ.value.trim()) params.q = filterQ.value.trim()
    data.value = await listArticles(params)
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
    title: '',
    summary: '',
    content: '',
    cover: '',
    author: '',
    tags: '',
    status: 'DRAFT',
    isFeatured: 0
  }
}

function openCreate() {
  resetForm()
  drawerOpen.value = true
}

function openEdit(a: AdminArticle) {
  editing.value = { ...a }
  drawerOpen.value = true
}

async function onSave() {
  if (!editing.value) return
  if (!editing.value.title?.trim() || !editing.value.slug?.trim()) {
    toast.error('Title and slug are required')
    return
  }
  saving.value = true
  try {
    const saved = await saveArticle(editing.value)
    toast.success(isEdit.value ? 'Updated' : 'Created')
    drawerOpen.value = false
    editing.value = null
    await load()
    return saved
  } catch (e) {
    toast.error((e as Error).message || 'Save failed')
  } finally {
    saving.value = false
  }
}

async function togglePublish(a: AdminArticle) {
  const next = a.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  try {
    await publishArticle(a.id!, next)
    toast.success(next === 'PUBLISHED' ? 'Published' : 'Unpublished')
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Action failed')
  }
}

async function toggleFeature(a: AdminArticle) {
  const next = a.isFeatured !== 1
  try {
    await featureArticle(a.id!, next)
    toast.success(next ? 'Featured' : 'Unfeatured')
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Action failed')
  }
}

function askDelete(a: AdminArticle) {
  confirmDelete.value = a
}

async function doDelete() {
  if (!confirmDelete.value?.id) return
  try {
    await deleteArticle(confirmDelete.value.id)
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

function statusVariant(s?: string): 'success' | 'warning' | 'muted' {
  if (s === 'PUBLISHED') return 'success'
  if (s === 'DRAFT') return 'warning'
  return 'muted'
}

function formatDate(s?: string) {
  if (!s) return '—'
  return s.slice(0, 10)
}
</script>

<template>
  <div class="admin-page">
    <header class="page-head">
      <div>
        <h2 class="page-title">Articles</h2>
        <p class="page-sub">{{ data?.total ?? 0 }} articles in database</p>
      </div>
      <AButton variant="primary" @click="openCreate">
        <AIcon name="plus" :size="14" /> New article
      </AButton>
    </header>

    <!-- Filters -->
    <div class="filters">
      <AInput
        v-model="filterQ"
        placeholder="Search title or summary…"
        clearable
        style="flex: 1; min-width: 200px;"
        @keyup.enter="() => { page = 1; load() }"
      />
      <ASelect v-model="filterStatus" :options="statusOptions" style="width: 160px;" />
      <AButton variant="ghost" size="md" @click="() => { page = 1; load() }">Apply</AButton>
      <AButton variant="ghost" size="md" @click="resetFilters">Reset</AButton>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-title">Title</th>
            <th class="col-status">Status</th>
            <th class="col-feat">Featured</th>
            <th class="col-num">Views</th>
            <th class="col-date">Updated</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody v-if="data?.records?.length">
          <tr v-for="a in data.records" :key="a.id">
            <td class="col-title">
              <div class="title-cell">
                <span class="title-text">{{ a.title }}</span>
                <span class="title-slug">/{{ a.slug }}</span>
              </div>
            </td>
            <td class="col-status">
              <ATag :variant="statusVariant(a.status)">{{ a.status }}</ATag>
            </td>
            <td class="col-feat">
              <AIcon v-if="a.isFeatured === 1" name="star" :size="14" color="#ffb850" />
              <span v-else class="dim">—</span>
            </td>
            <td class="col-num">{{ a.viewCount ?? 0 }}</td>
            <td class="col-date">{{ formatDate(a.updatedAt) }}</td>
            <td class="col-actions">
              <div class="actions">
                <button class="ic-btn" title="Edit" @click="openEdit(a)">
                  <AIcon name="edit-3" :size="14" />
                </button>
                <button class="ic-btn" :title="a.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'" @click="togglePublish(a)">
                  <AIcon :name="a.status === 'PUBLISHED' ? 'eye-off' : 'eye'" :size="14" />
                </button>
                <button class="ic-btn" title="Feature" @click="toggleFeature(a)">
                  <AIcon name="star" :size="14" />
                </button>
                <button class="ic-btn danger" title="Delete" @click="askDelete(a)">
                  <AIcon name="trash-2" :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!data?.records?.length && !loading" class="empty">No articles match your filters.</p>
      <p v-if="loading" class="empty">Loading…</p>
    </div>

    <!-- Pagination -->
    <footer v-if="(data?.total ?? 0) > pageSize" class="pagination">
      <AButton variant="ghost" size="sm" :disabled="page <= 1" @click="() => { page--; load() }">Previous</AButton>
      <span class="page-info">Page {{ page }} · {{ data?.total }} total</span>
      <AButton
        variant="ghost" size="sm"
        :disabled="page * pageSize >= (data?.total ?? 0)"
        @click="() => { page++; load() }"
      >Next</AButton>
    </footer>

    <!-- Edit drawer -->
    <ADrawer
      v-model="drawerOpen"
      :title="isEdit ? 'Edit article' : 'New article'"
      size="600px"
    >
      <div v-if="editing" class="form">
        <div class="field">
          <label class="field-label">Title *</label>
          <AInput v-model="editing.title" placeholder="Article title" />
        </div>
        <div class="field">
          <label class="field-label">Slug *</label>
          <AInput v-model="editing.slug" placeholder="url-friendly-identifier" />
        </div>
        <div class="field">
          <label class="field-label">Summary</label>
          <ATextarea v-model="editing.summary" :rows="3" placeholder="One-line summary for cards" />
        </div>
        <div class="field">
          <label class="field-label">Cover URL</label>
          <AInput v-model="editing.cover" placeholder="https://…" />
        </div>
        <div class="field">
          <label class="field-label">Author</label>
          <AInput v-model="editing.author" placeholder="Author name" />
        </div>
        <div class="field">
          <label class="field-label">Tags (comma-separated)</label>
          <AInput v-model="editing.tags" placeholder="agent, workflow, ai" />
        </div>
        <div class="field">
          <label class="field-label">Content (Markdown)</label>
          <ATextarea v-model="editing.content" :rows="14" placeholder="# Title…" />
        </div>
      </div>

      <template #footer>
        <div class="drawer-foot">
          <AButton variant="ghost" @click="drawerOpen = false">Cancel</AButton>
          <AButton variant="primary" :loading="saving" @click="onSave">
            {{ isEdit ? 'Save changes' : 'Create article' }}
          </AButton>
        </div>
      </template>
    </ADrawer>

    <!-- Confirm delete -->
    <AModal v-model="confirmDelete" :title="`Delete \"${confirmDelete?.title}\"?`" size="sm">
      <p class="confirm-text">This will soft-delete the article. It will no longer appear in public listings but stays in the database for audit.</p>
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
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}
.page-sub {
  color: var(--fg-muted, #8a93a6);
  font-size: 13px;
  margin: 4px 0 0;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

/* ── Table ── */
.table-wrap {
  background: var(--bg-surface, #0b0e13);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  overflow: hidden;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
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

.col-title { min-width: 280px; }
.col-status { width: 110px; }
.col-feat { width: 80px; text-align: center; }
.col-num { width: 70px; font-variant-numeric: tabular-nums; text-align: right; }
.col-date { width: 110px; color: var(--fg-faint, #5b6478); font-variant-numeric: tabular-nums; }
.col-actions { width: 180px; }

.title-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.title-text {
  font-weight: 500;
  color: var(--fg-base, #e8eaf0);
}
.title-slug {
  font-size: 11.5px;
  color: var(--fg-faint, #5b6478);
  font-family: var(--font-mono, monospace);
}

.dim { color: var(--fg-faint, #5b6478); }
.actions {
  display: flex;
  gap: 4px;
}
.ic-btn {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
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
  padding: 32px;
  text-align: center;
  color: var(--fg-faint, #5b6478);
  font-size: 13px;
  margin: 0;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.page-info {
  font-size: 12.5px;
  color: var(--fg-muted, #8a93a6);
  font-variant-numeric: tabular-nums;
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--fg-muted, #8a93a6);
  font-weight: 500;
}

.drawer-foot,
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.confirm-text {
  color: var(--fg-muted, #8a93a6);
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}
</style>