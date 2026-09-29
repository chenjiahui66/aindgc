<script setup lang="ts">
import { ref } from 'vue'

interface Node {
  id: string
  label: string
  x: number
  y: number
  icon: string
}

const nodes: Node[] = [
  { id: 'input',    label: 'Input',     x:  80, y: 240, icon: 'M' },
  { id: 'reason',   label: 'Reasoning', x: 250, y: 140, icon: '?' },
  { id: 'agent',    label: 'Agent',     x: 250, y: 340, icon: 'A' },
  { id: 'tools',    label: 'Tools',     x: 460, y: 140, icon: 'T' },
  { id: 'workflow', label: 'Workflow',  x: 460, y: 340, icon: 'W' },
  { id: 'result',   label: 'Result',    x: 640, y: 240, icon: 'R' }
]

const hovered = ref<string | null>(null)

function isHighlighted(id: string): boolean {
  if (!hovered.value) return true
  // simple cascade: hover highlights this node and downstream (visual flow)
  const order = ['input', 'reason', 'tools', 'result', 'agent', 'workflow']
  const hovIdx = order.indexOf(hovered.value)
  const idIdx = order.indexOf(id)
  return idIdx <= hovIdx
}
</script>

<template>
  <div class="viz-wrap">
    <svg
      viewBox="0 0 720 480"
      class="viz"
      role="img"
      aria-label="AI workflow visualization"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="var(--accent-primary)" stop-opacity="0.0" />
          <stop offset="40%"  stop-color="var(--accent-primary)" stop-opacity="0.5" />
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0" />
        </linearGradient>
        <linearGradient id="line-grad-sec" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="var(--accent-secondary)" stop-opacity="0.0" />
          <stop offset="40%"  stop-color="var(--accent-secondary)" stop-opacity="0.5" />
          <stop offset="100%" stop-color="var(--accent-secondary)" stop-opacity="0.0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Edges -->
      <g class="edges" :class="{ dimmed: !!hovered }">
        <path
          v-for="(pair, i) in [
            ['input','reason'], ['input','agent'],
            ['reason','tools'], ['agent','workflow'],
            ['tools','result'], ['workflow','result']
          ]"
          :key="i"
          class="edge"
          :d="(() => {
            const a = nodes.find(n => n.id === pair[0])!
            const b = nodes.find(n => n.id === pair[1])!
            const mx = (a.x + b.x) / 2
            return `M ${a.x + 36} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 36} ${b.y}`
          })()"
          :class="{
            active: hovered && pair.includes(hovered)
          }"
        />
      </g>

      <!-- Animated light pulses along edges -->
      <g class="pulses">
        <circle r="3" class="pulse pulse-1">
          <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#path-reason-tools" />
          </animateMotion>
        </circle>
        <path id="path-reason-tools" :d="(() => {
          const a = nodes.find(n => n.id === 'reason')!
          const b = nodes.find(n => n.id === 'tools')!
          const mx = (a.x + b.x) / 2
          return `M ${a.x + 36} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 36} ${b.y}`
        })()" fill="none" stroke="none" />

        <circle r="3" class="pulse pulse-2">
          <animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#path-agent-workflow" />
          </animateMotion>
        </circle>
        <path id="path-agent-workflow" :d="(() => {
          const a = nodes.find(n => n.id === 'agent')!
          const b = nodes.find(n => n.id === 'workflow')!
          const mx = (a.x + b.x) / 2
          return `M ${a.x + 36} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 36} ${b.y}`
        })()" fill="none" stroke="none" />

        <circle r="3" class="pulse pulse-3">
          <animateMotion dur="3.2s" begin="0.8s" repeatCount="indefinite" rotate="auto">
            <mpath href="#path-tools-result" />
          </animateMotion>
        </circle>
        <path id="path-tools-result" :d="(() => {
          const a = nodes.find(n => n.id === 'tools')!
          const b = nodes.find(n => n.id === 'result')!
          const mx = (a.x + b.x) / 2
          return `M ${a.x + 36} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 36} ${b.y}`
        })()" fill="none" stroke="none" />

        <circle r="3" class="pulse pulse-4">
          <animateMotion dur="3.2s" begin="2.4s" repeatCount="indefinite" rotate="auto">
            <mpath href="#path-workflow-result" />
          </animateMotion>
        </circle>
        <path id="path-workflow-result" :d="(() => {
          const a = nodes.find(n => n.id === 'workflow')!
          const b = nodes.find(n => n.id === 'result')!
          const mx = (a.x + b.x) / 2
          return `M ${a.x + 36} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 36} ${b.y}`
        })()" fill="none" stroke="none" />
      </g>

      <!-- Nodes -->
      <g class="nodes">
        <g
          v-for="n in nodes"
          :key="n.id"
          class="node"
          :class="{ hovered: hovered === n.id, dimmed: hovered && hovered !== n.id }"
          :transform="`translate(${n.x}, ${n.y})`"
          @mouseenter="hovered = n.id"
          @mouseleave="hovered = null"
        >
          <circle r="36" class="ring" />
          <circle r="28" class="bg" />
          <text text-anchor="middle" dy="6" class="icon">{{ n.icon }}</text>
          <text text-anchor="middle" dy="58" class="label">{{ n.label }}</text>
        </g>
      </g>
    </svg>

    <p class="hint">interactive · hover any node</p>
  </div>
</template>

<style scoped>
.viz-wrap {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin-inline: auto;
}

.viz {
  width: 100%;
  height: auto;
  display: block;
}

.edges .edge {
  fill: none;
  stroke: var(--border-default);
  stroke-width: 1;
  transition: stroke var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard);
}
.edges.dimmed .edge { opacity: 0.3; }
.edges .edge.active {
  stroke: var(--accent-primary);
  stroke-width: 1.5;
  opacity: 1;
}

.pulse {
  fill: var(--accent-primary);
  filter: url(#glow);
}
.pulse-2, .pulse-4 { fill: var(--accent-secondary); }

.node {
  cursor: pointer;
  transition: transform var(--duration-base) var(--ease-standard);
}
.node .ring {
  fill: none;
  stroke: var(--border-default);
  stroke-width: 1;
  transition: stroke var(--duration-fast) var(--ease-standard), stroke-width var(--duration-fast) var(--ease-standard);
}
.node .bg {
  fill: var(--bg-elevated);
  stroke: var(--border-default);
  stroke-width: 1;
  transition: all var(--duration-fast) var(--ease-standard);
}
.node .icon {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 600;
  fill: var(--text-primary);
}
.node .label {
  font-family: var(--font-mono);
  font-size: 11px;
  fill: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: fill var(--duration-fast) var(--ease-standard);
}

.node.hovered .ring {
  stroke: var(--accent-primary);
  stroke-width: 1.5;
}
.node.hovered .bg {
  stroke: var(--accent-primary);
  fill: rgba(111, 168, 255, 0.06);
}
.node.hovered .label { fill: var(--accent-primary); }
.node.dimmed { opacity: 0.45; }

.hint {
  position: absolute;
  right: 0;
  bottom: -28px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin: 0;
}

@media (max-width: 768px) {
  .hint { right: 50%; transform: translateX(50%); }
}
</style>
