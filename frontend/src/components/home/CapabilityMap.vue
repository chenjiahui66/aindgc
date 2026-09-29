<script setup lang="ts">
import { ref } from 'vue'

interface Cap {
  id: string
  label: string
  description: string
  to: string
  angle: number // degrees, 0 = top
}

const caps: Cap[] = [
  { id: 'chat',      label: 'AI Chat',         description: '与你对话的 AI',         to: '/tools/context-builder',          angle: -90 },
  { id: 'agent',     label: 'AI Agent',        description: '能执行任务的 Agent',     to: '/tools/agent-workflow-generator', angle: -30 },
  { id: 'workflow',  label: 'AI Workflow',     description: '可视化构建 AI 工作流',   to: '/workflow',                       angle:  30 },
  { id: 'coding',    label: 'AI Coding',       description: 'Claude Code / Codex 项目', to: '/coding',                       angle:  90 },
  { id: 'automate',  label: 'AI Automation',   description: '把重复工作交给 AI',      to: '/roi',                            angle: 150 },
  { id: 'business',  label: 'AI Business',     description: 'AI 在企业里的真实场景',  to: '/cases',                          angle: 210 }
]

const center = { x: 200, y: 200 }
const radius = 150
const nodeR = 36

const hovered = ref<string | null>(null)

function position(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: center.x + radius * Math.cos(rad),
    y: center.y + radius * Math.sin(rad)
  }
}
</script>

<template>
  <div class="cap-wrap">
    <svg viewBox="0 0 400 400" class="cap-svg" role="img" aria-label="Aindgc capabilities">
      <defs>
        <linearGradient id="cap-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="var(--accent-primary)" stop-opacity="0.0" />
          <stop offset="50%"  stop-color="var(--accent-primary)" stop-opacity="0.35" />
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Connection lines (dashed) -->
      <g class="lines">
        <line
          v-for="c in caps"
          :key="`l-${c.id}`"
          :x1="center.x"
          :y1="center.y"
          :x2="position(c.angle).x"
          :y2="position(c.angle).y"
          :class="{ active: hovered === c.id }"
        />
      </g>

      <!-- Center -->
      <g class="center">
        <circle :cx="center.x" :cy="center.y" r="50" class="ring" />
        <circle :cx="center.x" :cy="center.y" r="40" class="ring inner" />
        <text :x="center.x" :y="center.y + 5" text-anchor="middle" class="center-label">Aindgc</text>
      </g>

      <!-- Cap nodes -->
      <g class="caps">
        <g
          v-for="c in caps"
          :key="c.id"
          :class="{ active: hovered === c.id }"
          @mouseenter="hovered = c.id"
          @mouseleave="hovered = null"
        >
          <line
            :x1="position(c.angle).x"
            :y1="position(c.angle).y"
            :x2="position(c.angle).x + (position(c.angle).x - center.x) * 0.4"
            :y2="position(c.angle).y + (position(c.angle).y - center.y) * 0.4"
            class="stem"
            :class="{ active: hovered === c.id }"
          />
          <circle
            :cx="position(c.angle).x + (position(c.angle).x - center.x) * 0.4"
            :cy="position(c.angle).y + (position(c.angle).y - center.y) * 0.4"
            :r="nodeR / 2"
            class="dot"
            :class="{ active: hovered === c.id }"
          />
          <text
            :x="position(c.angle).x + (position(c.angle).x - center.x) * 0.4"
            :y="position(c.angle).y + (position(c.angle).y - center.y) * 0.4 + 4"
            text-anchor="middle"
            class="dot-label"
          >
            {{ c.label }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Detail tooltip on hover -->
    <Transition name="fade">
      <div v-if="hovered" class="detail" :key="hovered">
        <p class="detail-label">
          {{ caps.find(c => c.id === hovered)?.label }}
        </p>
        <p class="detail-desc">
          {{ caps.find(c => c.id === hovered)?.description }}
        </p>
        <router-link :to="caps.find(c => c.id === hovered)?.to || '/'" class="detail-link">
          Explore →
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cap-wrap {
  position: relative;
  width: 100%;
  max-width: 540px;
  margin-inline: auto;
  aspect-ratio: 1;
}
.cap-svg {
  width: 100%;
  height: auto;
  display: block;
}

.lines line {
  stroke: var(--border-default);
  stroke-width: 1;
  stroke-dasharray: 3 5;
  transition: stroke var(--duration-fast) var(--ease-standard), stroke-width var(--duration-fast) var(--ease-standard);
}
.lines line.active {
  stroke: var(--accent-primary);
  stroke-width: 1.5;
}

.center .ring {
  fill: none;
  stroke: var(--border-default);
}
.center .ring.inner {
  stroke: var(--accent-primary);
  stroke-opacity: 0.4;
}
.center .center-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 18px;
  fill: var(--text-primary);
  letter-spacing: -0.01em;
}

.stem {
  stroke: var(--border-default);
  stroke-width: 1;
  transition: stroke var(--duration-fast) var(--ease-standard);
}
.stem.active { stroke: var(--accent-primary); }

.dot {
  fill: var(--bg-elevated);
  stroke: var(--border-default);
  stroke-width: 1.2;
  transition: all var(--duration-fast) var(--ease-standard);
}
.dot.active {
  fill: rgba(111, 168, 255, 0.1);
  stroke: var(--accent-primary);
}
.dot-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  fill: var(--text-tertiary);
  transition: fill var(--duration-fast) var(--ease-standard);
  pointer-events: none;
}
g.active .dot-label { fill: var(--accent-primary); }

.detail {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-md);
  min-width: 220px;
  text-align: center;
  z-index: 2;
}
.detail-label {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.detail-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 4px 0 var(--space-2) 0;
}
.detail-link {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--accent-primary);
  letter-spacing: 0.04em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 4px);
}
</style>
