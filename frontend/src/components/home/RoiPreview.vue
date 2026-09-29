<script setup lang="ts">
import { ref, computed } from 'vue'
import AInput from '@components/common/AInput.vue'
import ASlider from '@components/common/ASlider.vue'
import ACountUp from '@components/common/ACountUp.vue'
import { RouterLink } from 'vue-router'
import AButton from '@components/common/AButton.vue'

const employees = ref(20)
const avgSalary = ref(12000) // monthly RMB
const repeatableHours = ref(15) // per week per employee
const customerRequests = ref(500)
const salesLeads = ref(300)

const annualSalary = computed(() => avgSalary.value * employees.value * 12)
const annualHours = computed(() => repeatableHours.value * employees.value * 52)

// Conservative: AI saves 40% of repeatable time, valued at avg hourly cost
const hourlyCost = computed(() => avgSalary.value / 160)
const annualSavings = computed(() => Math.round(annualHours.value * 0.4 * hourlyCost.value))

const automationPotential = computed(() => {
  // simple heuristic: clamp to [20, 70]
  const ratio = (repeatableHours.value / 40) * 100
  return Math.min(70, Math.max(20, Math.round(ratio * 0.7)))
})
</script>

<template>
  <div class="roi">
    <div class="panel inputs">
      <p class="eyebrow">Try it · Simulation</p>
      <h3>What's your work worth?</h3>

      <div class="field">
        <label>Employees <span class="num">{{ employees }}</span></label>
        <ASlider v-model="employees" :min="1" :max="200" />
      </div>
      <div class="field">
        <label>Avg. monthly salary <span class="num">¥{{ avgSalary.toLocaleString() }}</span></label>
        <ASlider v-model="avgSalary" :min="3000" :max="50000" :step="500" />
      </div>
      <div class="field">
        <label>Repeatable hours / week <span class="num">{{ repeatableHours }}h</span></label>
        <ASlider v-model="repeatableHours" :min="1" :max="40" />
      </div>

      <AInput v-model="customerRequests" type="number" prefix-icon="users" placeholder="Customer requests / month" block />
      <AInput v-model="salesLeads" type="number" prefix-icon="trending-up" placeholder="Sales leads / month" block />
    </div>

    <div class="panel results">
      <p class="eyebrow">Estimated impact</p>
      <div class="metric primary">
        <p class="label">Estimated annual saving</p>
        <p class="value">
          ¥<ACountUp :end="annualSavings" />
        </p>
        <p class="sub">Across {{ employees }} employees · based on {{ Math.round(annualHours) }}h/yr of repeatable work</p>
      </div>

      <div class="metric-row">
        <div class="metric">
          <p class="label">Current annual cost</p>
          <p class="value sm">¥<ACountUp :end="annualSalary" /></p>
        </div>
        <div class="metric">
          <p class="label">Automation potential</p>
          <p class="value sm"><ACountUp :end="automationPotential" suffix="%" /></p>
        </div>
      </div>

      <p class="disclaimer">All values are estimates for simulation. Real impact depends on workflow design and adoption.</p>

      <RouterLink to="/roi" class="cta">
        <AButton variant="primary" block>Discover your AI opportunity →</AButton>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.roi {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  align-items: stretch;
}

.panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}

h3 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}

.field label {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.field .num {
  font-family: var(--font-mono);
  color: var(--accent-primary);
  font-weight: 500;
}

.metric .label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 0 var(--space-2) 0;
}
.metric .value {
  font-size: 48px;
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: var(--letter-tight);
  line-height: 1.1;
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.metric .value.sm {
  font-size: 28px;
  color: var(--text-primary);
}
.metric .sub {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: var(--space-2) 0 0 0;
}

.metric.primary {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.metric-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.disclaimer {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.cta {
  margin-top: auto;
  text-decoration: none;
}

@media (max-width: 768px) {
  .roi { grid-template-columns: 1fr; }
  .metric .value { font-size: 36px; }
  .metric-row { grid-template-columns: 1fr; }
}
</style>
