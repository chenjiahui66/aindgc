<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  listUsers, setUserStatus, setUserRole,
  type AdminUserRow, type PageEnvelope
} from '@api/admin'
import { useToast } from '@/composables/useToast'
import AButton from '@components/common/AButton.vue'
import AInput from '@components/common/AInput.vue'
import ASelect from '@components/common/ASelect.vue'
import AAvatar from '@components/common/AAvatar.vue'
import ATag from '@components/common/ATag.vue'
import AIcon from '@components/common/AIcon.vue'

const toast = useToast()
const data = ref<PageEnvelope<AdminUserRow> | null>(null)
const loading = ref(false)
const filterQ = ref('')
const page = ref(1)
const pageSize = 20

const statusFilter = ref<string>('all')
const statusOptions = [
  { label: 'All status', value: 'all' },
  { label: 'Active', value: '1' },
  { label: 'Disabled', value: '0' }
]

async function load() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, size: pageSize }
    if (filterQ.value.trim()) params.q = filterQ.value.trim()
    data.value = await listUsers(params)
  } catch (e) {
    toast.error((e as Error).message || 'Failed to load')
  } finally {
    loading.value = false
  }
}

onMounted(load)

function resetFilters() {
  filterQ.value = ''
  statusFilter.value = 'all'
  page.value = 1
  load()
}

async function toggleStatus(u: AdminUserRow) {
  const next = u.status === 1 ? 0 : 1
  try {
    await setUserStatus(u.id, next)
    toast.success(next === 1 ? 'Enabled' : 'Disabled')
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Action failed')
  }
}

async function toggleRole(u: AdminUserRow) {
  const next = u.role === 'ADMIN' ? 'USER' : 'ADMIN'
  try {
    await setUserRole(u.id, next as 'ADMIN' | 'USER')
    toast.success(`Role set to ${next}`)
    await load()
  } catch (e) {
    toast.error((e as Error).message || 'Action failed')
  }
}

function userInitial(u: AdminUserRow): string {
  const s = u.nickname || u.username || u.email || 'U'
  return s.charAt(0).toUpperCase()
}

function formatDate(s?: string) {
  return s ? s.slice(0, 16).replace('T', ' ') : '—'
}

function statusVariant(s: number): 'success' | 'muted' {
  return s === 1 ? 'success' : 'muted'
}
function roleVariant(r: string): 'primary' | 'muted' {
  return r === 'ADMIN' ? 'primary' : 'muted'
}
</script>

<template>
  <div class="admin-page">
    <header class="page-head">
      <div>
        <h2 class="page-title">Users</h2>
        <p class="page-sub">{{ data?.total ?? 0 }} registered users</p>
      </div>
    </header>

    <div class="filters">
      <AInput
        v-model="filterQ"
        placeholder="Search username / email / nickname…"
        clearable
        style="flex: 1; min-width: 200px;"
        @keyup.enter="() => { page = 1; load() }"
      />
      <ASelect v-model="statusFilter" :options="statusOptions" style="width: 140px;" disabled />
      <AButton variant="ghost" size="md" @click="() => { page = 1; load() }">Apply</AButton>
      <AButton variant="ghost" size="md" @click="resetFilters">Reset</AButton>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-user">User</th>
            <th class="col-email">Email</th>
            <th class="col-role">Role</th>
            <th class="col-status">Status</th>
            <th class="col-date">Last login</th>
            <th class="col-date">Joined</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody v-if="data?.records?.length">
          <tr v-for="u in data.records" :key="u.id">
            <td class="col-user">
              <div class="user-cell">
                <AAvatar :initial="userInitial(u)" :size="32" />
                <div class="user-meta">
                  <span class="user-name">{{ u.nickname || u.username }}</span>
                  <span class="user-handle">@{{ u.username }}</span>
                </div>
              </div>
            </td>
            <td class="col-email">{{ u.email }}</td>
            <td class="col-role">
              <ATag :variant="roleVariant(u.role)">{{ u.role }}</ATag>
            </td>
            <td class="col-status">
              <ATag :variant="statusVariant(u.status)">
                {{ u.status === 1 ? 'active' : 'disabled' }}
              </ATag>
            </td>
            <td class="col-date">{{ formatDate(u.lastLoginAt) }}</td>
            <td class="col-date">{{ formatDate(u.createdAt) }}</td>
            <td class="col-actions">
              <div class="actions">
                <button class="ic-btn" :title="u.status === 1 ? 'Disable' : 'Enable'" @click="toggleStatus(u)">
                  <AIcon :name="u.status === 1 ? 'user-x' : 'user-check'" :size="14" />
                </button>
                <button
                  class="ic-btn"
                  :title="u.role === 'ADMIN' ? 'Demote to USER' : 'Promote to ADMIN'"
                  @click="toggleRole(u)"
                >
                  <AIcon :name="u.role === 'ADMIN' ? 'shield-off' : 'shield'" :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!data?.records?.length && !loading" class="empty">No users match your filters.</p>
      <p v-if="loading" class="empty">Loading…</p>
    </div>

    <footer v-if="(data?.total ?? 0) > pageSize" class="pagination">
      <AButton variant="ghost" size="sm" :disabled="page <= 1" @click="() => { page--; load() }">Previous</AButton>
      <span class="page-info">Page {{ page }} · {{ data?.total }} total</span>
      <AButton
        variant="ghost" size="sm"
        :disabled="page * pageSize >= (data?.total ?? 0)"
        @click="() => { page++; load() }"
      >Next</AButton>
    </footer>
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

.col-user { min-width: 220px; }
.col-email { min-width: 200px; }
.col-role, .col-status { width: 110px; }
.col-date { width: 140px; color: var(--fg-faint, #5b6478); font-variant-numeric: tabular-nums; font-size: 12.5px; }
.col-actions { width: 130px; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-meta { display: flex; flex-direction: column; line-height: 1.25; }
.user-name { font-weight: 500; color: var(--fg-base, #e8eaf0); }
.user-handle {
  font-size: 11.5px; color: var(--fg-faint, #5b6478);
  font-family: var(--font-mono, monospace);
}

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
</style>