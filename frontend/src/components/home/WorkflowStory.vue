<script setup lang="ts">
const steps = [
  { id: 'lead',    label: 'Lead',      sub: '销售线索' },
  { id: 'analyze', label: 'Analyze',   sub: '信息分析' },
  { id: 'judge',   label: 'Judge',     sub: 'AI 判断' },
  { id: 'grade',   label: 'Grade',     sub: '客户分级' },
  { id: 'draft',   label: 'Draft',     sub: '自动生成' },
  { id: 'crm',     label: 'CRM',       sub: '写入系统' }
]
</script>

<template>
  <ol class="story">
    <li v-for="(s, idx) in steps" :key="s.id" class="step">
      <div class="bullet">{{ String(idx + 1).padStart(2, '0') }}</div>
      <div class="text">
        <p class="label">{{ s.label }}</p>
        <p class="sub">{{ s.sub }}</p>
      </div>
      <span v-if="idx < steps.length - 1" class="connector" aria-hidden="true">
        <span class="dot-track" />
        <span class="dot-pulse" />
      </span>
    </li>
  </ol>
</template>

<style scoped>
.story {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow-x: auto;
}

.step {
  position: relative;
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

.bullet {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 16px;
  color: var(--accent-primary);
  letter-spacing: 0.02em;
  transition:
    border-color var(--duration-base) var(--ease-standard),
    background var(--duration-base) var(--ease-standard);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.sub {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 0;
}

.connector {
  position: absolute;
  top: 28px;
  left: 56px;
  right: -8px;
  height: 1px;
  pointer-events: none;
  display: flex;
  align-items: center;
}
.dot-track {
  flex: 1;
  height: 1px;
  background: var(--border-default);
  background-image: linear-gradient(to right, var(--border-default) 50%, transparent 50%);
  background-size: 6px 1px;
  background-repeat: repeat-x;
}
.dot-pulse {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow: 0 0 10px var(--accent-primary);
  left: 0;
  animation: story-flow 2.4s linear infinite;
}

.step:hover .bullet {
  border-color: var(--accent-primary);
  background: rgba(111, 168, 255, 0.06);
}

@keyframes story-flow {
  0%   { left: 0;   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@media (max-width: 768px) {
  .story {
    flex-direction: column;
    gap: var(--space-4);
  }
  .step {
    flex-direction: row;
    align-items: center;
    min-width: 0;
  }
  .connector {
    top: 56px;
    left: 28px;
    right: auto;
    width: 1px;
    height: 24px;
  }
  .dot-track {
    width: 1px;
    height: 100%;
    background: var(--border-default);
    background-image: linear-gradient(to bottom, var(--border-default) 50%, transparent 50%);
    background-size: 1px 6px;
    background-repeat: repeat-y;
  }
  .dot-pulse {
    animation: story-flow-v 2.4s linear infinite;
  }
  @keyframes story-flow-v {
    0%   { top: 0;  left: 50%; opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { top: 100%; left: 50%; opacity: 0; }
  }
}
</style>
