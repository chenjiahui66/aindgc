<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchDashboardSummary, type DashboardSummary } from '@api/admin'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'

const summary = ref<DashboardSummary | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    summary.value = await fetchDashboardSummary()
  } catch (e) {
    error.value = (e as Error).message || 'Failed to load'
  } finally {
    loading.value = false
  }
}

onMounted(load)

const trendDays = computed(() => {
  const m = summary.value?.users7d
  if (!m) return [] as Array<{ label: string; value: number; date: string }>
  return Object.entries(m).map(([date, value]) => ({
    date,
    label: date.slice(5),  // MM-DD
    value
  }))
})

const trendMax = computed(() => {
  const v = Math.max(1, ...trendDays.value.map(d => d.value))
  return v + Math.ceil(v * 0.2)
})

function statusVariant(status: string): 'success' | 'warning' | 'muted' {
  if (status === 'PUBLISHED') return 'success'
  if (status === 'DRAFT') return 'warning'
  return 'muted'
}

function formatDate(s?: string) {
  if (!s) return '—'
  // trim to YYYY-MM-DD HH:mm
  return s.slice(0, 16).replace('T', ' ')
}
</script>

<template>
  <div class="dashboard">
    <header class="page-head">
      <div>
        <h2 class="page-title">Overview</h2>
        <p class="page-sub">Live counts from the database.</p>
      </div>
      <AButton variant="ghost" size="sm" :loading="loading" @click="load">
        <AIcon name="refresh-cw" :size="14" /> Refresh
      </AButton>
    </header>

    <p v-if="error" class="err">{{ error }}</p>

    <!-- KPI grid -->
    <section class="kpi-grid">
      <div class="kpi">
        <span class="kpi-label">Articles</span>
        <span class="kpi-value">{{ summary?.totalArticles ?? '—' }}</span>
        <span class="kpi-sub">
          <em class="dot dot-success" />{{ summary?.publishedArticles ?? 0 }} published ·
          {{ summary?.draftArticles ?? 0 }} draft
        </span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Case Projects</span>
        <span class="kpi-value">{{ summary?.totalCases ?? '—' }}</span>
        <span class="kpi-sub">
          <em class="dot dot-primary" />{{ summary?.featuredCases ?? 0 }} featured
        </span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Tools</span>
        <span class="kpi-value">{{ summary?.totalTools ?? '—' }}</span>
        <span class="kpi-sub">
          <em class="dot dot-success" />{{ summary?.publishedTools ?? 0 }} published
        </span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Users</span>
        <span class="kpi-value">{{ summary?.totalUsers ?? '—' }}</span>
        <span class="kpi-sub">
          <em class="dot dot-primary" />{{ summary?.users7d ? Object.values(summary.users7d).reduce((a, b) => a + b, 0) : 0 }} new in 7 days
        </span>
      </div>
    </section>

    <!-- 7-day trend -->
    <section class="trend-card">
      <header class="trend-head">
        <div>
          <h3 class="card-title">User signups · last 7 days</h3>
          <p class="card-sub">Local timezone · all zero on a fresh database</p>
        </div>
      </header>
      <div class="trend-chart">
        <div
          v-for="d in trendDays"
          :key="d.date"
          class="trend-col"
        >
          <div class="trend-bar-wrap">
            <div
              class="trend-bar"
              :style="{ height: `${(d.value / trendMax) * 100}%` }"
            >
              <span v-if="d.value > 0" class="trend-bar-val">{{ d.value }}</span>
            </div>
          </div>
          <span class="trend-label">{{ d.label }}</span>
        </div>
      </div>
    </section>

    <!-- Recent + Featured -->
    <section class="row">
      <div class="card">
        <header class="card-head">
          <h3 class="card-title">Recently updated articles</h3>
        </header>
        <ul v-if="summary?.recentArticles?.length" class="recent-list">
          <li v-for="a in summary.recentArticles" :key="a.id" class="recent-item">
            <div class="recent-meta">
              <span class="badge" :class="`badge-${statusVariant(a.status)}`">{{ a.status }}</span>
              <span class="recent-date">{{ formatDate(a.updatedAt) }}</span>
            </div>
            <span class="recent-title">{{ a.title }}</span>
          </li>
        </ul>
        <p v-else class="empty">No articles yet.</p>
      </div>

      <div class="card">
        <header class="card-head">
          <h3 class="card-title">Featured counts</h3>
        </header>
        <ul class="feat-list">
          <li class="feat-row">
            <span class="feat-label">Featured articles</span>
            <span class="feat-value">{{ summary?.featuredArticles ?? 0 }}</span>
          </li>
          <li class="feat-row">
            <span class="feat-label">Featured cases</span>
            <span class="feat-value">{{ summary?.featuredCases ?? 0 }}</span>
          </li>
          <li class="feat-row">
            <span class="feat-label">Published tools</span>
            <span class="feat-value">{{ summary?.publishedTools ?? 0 }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  letter-spacing: 0.005em;
}
.page-sub {
  color: var(--fg-muted, #8a93a6);
  font-size: 13px;
  margin: 4px 0 0;
}

.err {
  color: #ff7676;
  background: rgba(255, 118, 118, 0.08);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

/* ── KPI grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.kpi {
  background: var(--bg-surface, #0b0e13);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.kpi-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-faint, #5b6478);
}
.kpi-value {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}
.kpi-sub {
  font-size: 12.5px;
  color: var(--fg-muted, #8a93a6);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.dot-success { background: #38d5c4; }
.dot-primary { background: #4a9eff; }

/* ── Trend ── */
.trend-card {
  background: var(--bg-surface, #0b0e13);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  padding: 24px;
}
.trend-head {
  margin-bottom: 24px;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.005em;
}
.card-sub {
  font-size: 12px;
  color: var(--fg-faint, #5b6478);
  margin: 4px 0 0;
}
.trend-chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  height: 180px;
  align-items: end;
}
.trend-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
}
.trend-bar-wrap {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}
.trend-bar {
  width: 60%;
  min-height: 2px;
  background: linear-gradient(180deg, #4a9eff 0%, #38d5c4 100%);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s ease;
}
.trend-bar-val {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--fg-muted, #8a93a6);
  font-variant-numeric: tabular-nums;
}
.trend-label {
  font-size: 11px;
  color: var(--fg-faint, #5b6478);
  font-variant-numeric: tabular-nums;
}

/* ── Row (recent + featured) ── */
.row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}
@media (max-width: 880px) {
  .row { grid-template-columns: 1fr; }
}
.card {
  background: var(--bg-surface, #0b0e13);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  padding: 20px;
}
.card-head {
  margin-bottom: 16px;
}
.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.04));
}
.recent-item:last-child { border-bottom: 0; }
.recent-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
}
.recent-date {
  font-size: 11.5px;
  color: var(--fg-faint, #5b6478);
  font-variant-numeric: tabular-nums;
}
.recent-title {
  font-size: 13.5px;
  color: var(--fg-base, #e8eaf0);
}
.badge {
  font-size: 10px;
  letter-spacing: 0.08em;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
}
.badge-success { background: rgba(56, 213, 196, 0.12); color: #38d5c4; }
.badge-warning { background: rgba(255, 184, 80, 0.12); color: #ffb850; }
.badge-muted   { background: rgba(255, 255, 255, 0.06); color: #8a93a6; }

.feat-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.feat-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.04));
  font-size: 13.5px;
}
.feat-row:last-child { border-bottom: 0; }
.feat-value {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.empty {
  font-size: 13px;
  color: var(--fg-faint, #5b6478);
  margin: 0;
}
</style>