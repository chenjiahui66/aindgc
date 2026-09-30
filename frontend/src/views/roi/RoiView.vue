<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSEO } from '@composables/useSEO'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Grid from '@components/layout/Grid.vue'
import Stack from '@components/layout/Stack.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import ACard from '@components/common/ACard.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASlider from '@components/common/ASlider.vue'
import ASelect from '@components/common/ASelect.vue'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import ACountUp from '@components/common/ACountUp.vue'
import AEmpty from '@components/common/AEmpty.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { calculateRoi, formatCurrency, formatNumber } from '@utils/generators/roiCalculator'
import { useToast } from '@composables/useToast'
import { useLocalStorage } from '@composables/useLocalStorage'
import { downloadJSON } from '@utils/download'
import { encodeShare, decodeShare, copyShareLink } from '@utils/share'

const toast = useToast()

useSEO({
  title: 'AI ROI Calculator — Aindgc',
  description: '免费 AI ROI 计算器:输入员工数、工资、重复工作时间,得到估算的 AI 自动化潜力与年度节省。所有结果标注 Simulation。',
  keywords: 'AI ROI Calculator, AI Automation, ROI Estimation, AI Cost Saving',
  ogTitle: 'AI ROI Calculator — Estimate your AI opportunity',
  ogDescription: '基于员工数、工资、重复工作时间,得到保守的 AI ROI 估算。'
})

const employees = ref(20)
const avgSalary = ref(12000)
const repeatableHours = ref(15)
const customerRequests = ref(500)
const salesLeads = ref(300)
const automationRate = ref(40)

const result = computed(() =>
  calculateRoi({
    employees: employees.value,
    avgMonthlySalary: avgSalary.value,
    repeatableHoursPerWeek: repeatableHours.value,
    customerRequestsPerMonth: customerRequests.value,
    salesLeadsPerMonth: salesLeads.value,
    automationRate: automationRate.value / 100
  })
)

interface SavedRecord {
  id: string
  label: string
  inputs: typeof result.value.inputs
  metrics: typeof result.value.metrics
  createdAt: number
}

const history = useLocalStorage<SavedRecord[]>('aindgc_roi_history', [])
const showHistory = ref(false)

function save() {
  const record: SavedRecord = {
    id: `roi-${Date.now().toString(36)}`,
    label: `${employees.value} 员工 / ¥${avgSalary.value.toLocaleString()} 月薪`,
    inputs: result.value.inputs,
    metrics: result.value.metrics,
    createdAt: Date.now()
  }
  history.value.unshift(record)
  toast.success('Saved to history')
}

function loadRecord(r: SavedRecord) {
  employees.value = r.inputs.employees
  avgSalary.value = r.inputs.avgMonthlySalary
  repeatableHours.value = r.inputs.repeatableHoursPerWeek
  customerRequests.value = r.inputs.customerRequestsPerMonth
  salesLeads.value = r.inputs.salesLeadsPerMonth
  if (r.inputs.automationRate !== undefined) {
    automationRate.value = Math.round(r.inputs.automationRate * 100)
  }
  showHistory.value = false
  toast.info('Loaded')
}

function deleteRecord(id: string) {
  if (!confirm('Delete this record?')) return
  history.value = history.value.filter(r => r.id !== id)
}

function reset() {
  employees.value = 20
  avgSalary.value = 12000
  repeatableHours.value = 15
  customerRequests.value = 500
  salesLeads.value = 300
  automationRate.value = 40
}

async function share() {
  const token = encodeShare({
    employees: employees.value,
    avgMonthlySalary: avgSalary.value,
    repeatableHoursPerWeek: repeatableHours.value,
    customerRequestsPerMonth: customerRequests.value,
    salesLeadsPerMonth: salesLeads.value,
    automationRate: automationRate.value
  })
  const ok = await copyShareLink(token)
  if (ok) toast.success('Share link copied')
  else toast.error('Copy failed')
}

function downloadJson() {
  downloadJSON('aindgc-roi.json', result.value)
  toast.success('JSON downloaded')
}

onMounted(() => {
  // Decode share link if present
  const hash = location.hash
  const match = hash.match(/share=([A-Za-z0-9_-]+)/)
  if (match) {
    const decoded = decodeShare<{
      employees: number; avgMonthlySalary: number; repeatableHoursPerWeek: number
      customerRequestsPerMonth: number; salesLeadsPerMonth: number; automationRate: number
    }>(match[1])
    if (decoded) {
      employees.value = decoded.employees
      avgSalary.value = decoded.avgMonthlySalary
      repeatableHours.value = decoded.repeatableHoursPerWeek
      customerRequests.value = decoded.customerRequestsPerMonth
      salesLeads.value = decoded.salesLeadsPerMonth
      automationRate.value = decoded.automationRate
      toast.success('Loaded from share link')
      // Clean URL — use window.history because a local `history` ref
      // (the saved-calculations list) shadows the global here.
      window.history.replaceState(null, '', window.location.pathname)
    }
  }
})

watch([employees, avgSalary, repeatableHours, customerRequests, salesLeads, automationRate], () => {
  // update hash silently so refreshes don't lose state (optional)
}, { deep: true })

const industryOptions = [
  { label: 'Sales & Marketing', value: 'sales' },
  { label: 'Customer Service', value: 'support' },
  { label: 'Software / Tech', value: 'tech' },
  { label: 'Operations / HR', value: 'ops' },
  { label: 'Manufacturing', value: 'mfg' },
  { label: 'Other', value: 'other' }
]
const industry = ref<string>('')
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'ROI Calculator' }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero
          eyebrow="FREE · NO SIGNUP"
          title="AI ROI Calculator."
          subtitle="输入数据,得到保守的 AI 自动化潜力估算。所有结果标注为 Simulation — 用来讨论,不用来承诺。"
        >
          <AButton variant="ghost" @click="showHistory = true">
            <template #icon><AIcon name="history" /></template>
            History ({{ history.length }})
          </AButton>
          <AButton variant="outline" @click="share">
            <template #icon><AIcon name="share-2" /></template>
            Share
          </AButton>
          <AButton variant="primary" @click="save">
            <template #icon><AIcon name="bookmark" /></template>
            Save
          </AButton>
        </PageHero>
      </Container>
    </Section>

    <Section py="md">
      <Container>
        <Grid :cols="{ sm: 1, lg: 5 }" :gap="5">
          <!-- Inputs (2 cols on desktop) -->
          <div class="col-input">
            <ACard>
              <Stack :gap="5">
                <header class="card-head">
                  <h3>Your inputs</h3>
                  <p class="muted">All fields editable in real-time.</p>
                </header>

                <Stack :gap="2">
                  <label class="lbl">Industry</label>
                  <ASelect v-model="industry" :options="industryOptions" placeholder="Choose (optional)" />
                </Stack>

                <Stack :gap="2">
                  <label class="lbl">Employees <span class="num">{{ employees }}</span></label>
                  <ASlider v-model="employees" :min="1" :max="500" />
                </Stack>

                <Stack :gap="2">
                  <label class="lbl">Avg. monthly salary <span class="num">{{ formatCurrency(avgSalary) }}</span></label>
                  <ASlider v-model="avgSalary" :min="3000" :max="50000" :step="500" />
                </Stack>

                <Stack :gap="2">
                  <label class="lbl">Repeatable hours / week <span class="num">{{ repeatableHours }}h</span></label>
                  <ASlider v-model="repeatableHours" :min="1" :max="40" />
                </Stack>

                <Grid :cols="2" :gap="3">
                  <Stack :gap="2">
                    <label class="lbl">Customer requests / month</label>
                    <AInput v-model="customerRequests" type="number" prefix-icon="users" />
                  </Stack>
                  <Stack :gap="2">
                    <label class="lbl">Sales leads / month</label>
                    <AInput v-model="salesLeads" type="number" prefix-icon="trending-up" />
                  </Stack>
                </Grid>

                <Stack :gap="2">
                  <label class="lbl">
                    AI automation rate
                    <span class="num">{{ automationRate }}%</span>
                    <span class="hint">conservative default 40%</span>
                  </label>
                  <ASlider v-model="automationRate" :min="10" :max="80" :step="5" />
                </Stack>

                <AButton variant="ghost" size="sm" @click="reset">
                  <template #icon><AIcon name="rotate-ccw" /></template>
                  Reset to defaults
                </AButton>
              </Stack>
            </ACard>
          </div>

          <!-- Results (3 cols on desktop) -->
          <div class="col-result">
            <Stack :gap="4">
              <RevealOnScroll>
                <ACard variant="glow">
                  <header class="result-head">
                    <p class="eyebrow">ESTIMATED ANNUAL SAVING</p>
                    <ATag tone="primary" size="sm">Simulation</ATag>
                  </header>
                  <p class="big-num">
                    <ACountUp :end="result.metrics.potentialAnnualSavings" />
                  </p>
                  <p class="big-sub">
                    Across {{ employees }} employees · based on {{ formatNumber(result.metrics.annualRepeatableHours) }}h/yr of repeatable work.
                  </p>
                </ACard>
              </RevealOnScroll>

              <Grid :cols="{ sm: 2, lg: 3 }" :gap="3">
                <ACard>
                  <p class="m-label">Current annual cost</p>
                  <p class="m-value sm">
                    <ACountUp :end="result.metrics.annualSalaryCost" />
                  </p>
                  <p class="m-sub">salary across {{ employees }} employees</p>
                </ACard>
                <ACard>
                  <p class="m-label">Repeatable cost / yr</p>
                  <p class="m-value sm">
                    <ACountUp :end="result.metrics.currentAnnualRepeatableCost" />
                  </p>
                  <p class="m-sub">{{ formatNumber(result.metrics.annualRepeatableHours) }}h × ¥{{ Math.round(result.assumptions.monthlyHourlyCost) }}/h</p>
                </ACard>
                <ACard>
                  <p class="m-label">Automation potential</p>
                  <p class="m-value sm">
                    <ACountUp :end="result.metrics.aiAutomationPotentialPct" suffix="%" />
                  </p>
                  <p class="m-sub">typical ceiling for repeatable tasks</p>
                </ACard>
              </Grid>

              <Grid :cols="{ sm: 1, md: 2 }" :gap="3">
                <ACard>
                  <p class="m-label">Customer request handling</p>
                  <p class="m-value sm">
                    <ACountUp :end="result.metrics.customerRequestHoursPerMonth" /> <span class="unit">h / month</span>
                  </p>
                  <p class="m-sub">{{ formatNumber(customerRequests) }} requests × {{ result.assumptions.avgHandlingTimePerRequestMin }} min</p>
                </ACard>
                <ACard>
                  <p class="m-label">Sales lead handling</p>
                  <p class="m-value sm">
                    <ACountUp :end="result.metrics.salesLeadHoursPerMonth" /> <span class="unit">h / month</span>
                  </p>
                  <p class="m-sub">{{ formatNumber(salesLeads) }} leads × 15 min</p>
                </ACard>
              </Grid>

              <ACard variant="bordered">
                <Stack :gap="3">
                  <p class="m-label">Assumptions used</p>
                  <ul class="assumption-list">
                    <li>Working hours per year: <strong>{{ result.assumptions.workHoursPerYear }}h</strong> (40h × 52w)</li>
                    <li>Hourly cost: <strong>¥{{ Math.round(result.assumptions.monthlyHourlyCost) }}</strong> (salary / 160h)</li>
                    <li>Avg customer request handling: <strong>{{ result.assumptions.avgHandlingTimePerRequestMin }} min</strong></li>
                    <li>AI automation rate applied: <strong>{{ Math.round(result.assumptions.automationRate * 100) }}%</strong></li>
                  </ul>
                  <p class="disclaimer">
                    <AIcon name="alert-triangle" :size="14" />
                    {{ result.disclaimer }}
                  </p>
                </Stack>
              </ACard>

              <div class="cta-row">
                <AButton variant="outline" block @click="downloadJson">
                  <template #icon><AIcon name="download" /></template>
                  Download report (JSON)
                </AButton>
                <AButton variant="primary" block @click="share">
                  <template #icon><AIcon name="share-2" /></template>
                  Share this result
                </AButton>
              </div>
            </Stack>
          </div>
        </Grid>
      </Container>
    </Section>

    <!-- History drawer (using simple inline modal alternative) -->
    <div v-if="showHistory" class="history-overlay" @click.self="showHistory = false">
      <aside class="history-panel">
        <header class="hp-head">
          <h3>History</h3>
          <button class="close" type="button" @click="showHistory = false">
            <AIcon name="x" :size="18" />
          </button>
        </header>
        <div class="hp-body">
          <AEmpty
            v-if="history.length === 0"
            icon-name="bookmark"
            title="No saved records"
            description="Click Save in the toolbar to store your current calculation."
            size="sm"
          />
          <ul v-else class="hist-list">
            <li v-for="r in history" :key="r.id" class="hist-item">
              <div>
                <p class="hist-label">{{ r.label }}</p>
                <p class="hist-meta">
                  {{ new Date(r.createdAt).toLocaleString() }}
                  · Saving ¥{{ Math.round(r.metrics.potentialAnnualSavings).toLocaleString() }} / yr
                </p>
              </div>
              <div class="hist-actions">
                <AButton variant="ghost" size="sm" @click="loadRecord(r)">
                  <template #icon><AIcon name="upload" /></template>
                  Load
                </AButton>
                <AButton variant="ghost" size="sm" @click="deleteRecord(r.id)">
                  <template #icon><AIcon name="trash-2" /></template>
                </AButton>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
main {
  padding-bottom: var(--space-9);
}

.col-input { grid-column: span 1; }
.col-result { grid-column: span 4; }
@media (max-width: 1024px) {
  .col-input, .col-result { grid-column: span 1; }
}

@media (min-width: 1024px) {
  :deep(.col-input) { grid-column: span 2; }
  :deep(.col-result) { grid-column: span 3; }
}

.card-head h3 {
  font-size: var(--fs-h4);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.muted { font-size: var(--fs-caption); color: var(--text-tertiary); margin: 0; }

.lbl {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.num {
  font-family: var(--font-mono);
  color: var(--accent-primary);
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}
.hint {
  font-family: var(--font-mono);
  text-transform: none;
  letter-spacing: 0;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 400;
}

.result-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}

.big-num {
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: var(--letter-tight);
  line-height: 1;
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.big-sub {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  margin: var(--space-3) 0 0 0;
}

.m-label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}
.m-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: var(--letter-tight);
  margin: var(--space-2) 0 0 0;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.m-value.sm { font-size: 24px; }
.m-value .unit {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  font-weight: 400;
}
.m-sub {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}

.assumption-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  padding: 0;
}
.assumption-list li {
  display: list-item;
  list-style: disc inside;
}
.assumption-list strong { color: var(--text-primary); font-family: var(--font-mono); }

.disclaimer {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--color-warning);
  letter-spacing: 0.02em;
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.cta-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
@media (max-width: 640px) {
  .cta-row { grid-template-columns: 1fr; }
}

/* History panel */
.history-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 9, 13, 0.7);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}
.history-panel {
  width: 480px;
  max-width: 100%;
  background: var(--bg-elevated);
  border-left: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
}
.hp-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}
.hp-head h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  margin: 0;
}
.close {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.close:hover { color: var(--text-primary); border-color: var(--border-default); }

.hp-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

.hist-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.hist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
}
.hist-label {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.hist-meta {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}
.hist-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
</style>
