<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AButton from '@components/common/AButton.vue'

const score = 72

const opportunities = [
  { rank: 1, label: 'Meeting Summary',     impact: 'High' },
  { rank: 2, label: 'Customer Follow-up',  impact: 'High' },
  { rank: 3, label: 'Weekly Report',       impact: 'Medium' },
  { rank: 4, label: 'Knowledge Search',    impact: 'Medium' },
  { rank: 5, label: 'Lead Qualification',  impact: 'High' }
]
</script>

<template>
  <div class="checkup">
    <div class="preview">
      <p class="step">Step 1 of 6</p>
      <p class="step-q">Which industry are you in?</p>
      <ul class="options">
        <li><span class="opt-letter">A</span> Sales & Marketing</li>
        <li><span class="opt-letter">B</span> Customer Service</li>
        <li><span class="opt-letter">C</span> Software Development</li>
        <li><span class="opt-letter">D</span> Operations & HR</li>
      </ul>
    </div>

    <div class="result">
      <p class="eyebrow">Sample result</p>
      <p class="result-label">AI Readiness Score</p>
      <div class="ring">
        <svg viewBox="0 0 120 120" class="ring-svg">
          <circle cx="60" cy="60" r="50" class="ring-track" />
          <circle
            cx="60" cy="60" r="50"
            class="ring-fill"
            :stroke-dasharray="2 * Math.PI * 50"
            :stroke-dashoffset="2 * Math.PI * 50 * (1 - score / 100)"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div class="ring-center">
          <p class="ring-num">{{ score }}</p>
          <p class="ring-suffix">/100</p>
        </div>
      </div>

      <p class="opps-title">Top 5 AI opportunities</p>
      <ol class="opps">
        <li v-for="o in opportunities" :key="o.rank">
          <span class="op-rank">{{ String(o.rank).padStart(2, '0') }}</span>
          <span class="op-label">{{ o.label }}</span>
          <span class="op-impact">{{ o.impact }}</span>
        </li>
      </ol>

      <RouterLink to="/checkup">
        <AButton variant="primary" block>Start your AI Checkup →</AButton>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.checkup {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-5);
  align-items: stretch;
}

.preview, .result {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.step {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}
.step-q {
  font-size: var(--fs-h4);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: var(--letter-tight);
  margin: 0;
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.options li {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: var(--fs-body);
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-standard);
}
.options li:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
  background: var(--surface-2);
}
.opt-letter {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-overlay);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--accent-primary);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}
.result-label {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  margin: 0;
}

.ring {
  position: relative;
  width: 160px;
  height: 160px;
  margin: var(--space-3) auto;
}
.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}
.ring-track {
  fill: none;
  stroke: var(--surface-2);
  stroke-width: 8;
}
.ring-fill {
  fill: none;
  stroke: var(--accent-primary);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset var(--duration-slower) var(--ease-emphasized);
  filter: drop-shadow(0 0 8px rgba(111, 168, 255, 0.4));
}
.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ring-num {
  font-size: 44px;
  font-weight: 600;
  color: var(--accent-primary);
  letter-spacing: var(--letter-tight);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  margin: 0;
}
.ring-suffix {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}

.opps-title {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.opps {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  list-style: none;
}
.opps li {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 12px;
  background: var(--surface-1);
  border-radius: var(--radius-sm);
  font-size: var(--fs-body-sm);
}
.op-rank {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
}
.op-label {
  color: var(--text-primary);
}
.op-impact {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--accent-primary);
  padding: 2px 8px;
  background: rgba(111, 168, 255, 0.08);
  border-radius: var(--radius-full);
}

@media (max-width: 768px) {
  .checkup { grid-template-columns: 1fr; }
}
</style>
