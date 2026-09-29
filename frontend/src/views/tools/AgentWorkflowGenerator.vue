<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSEO } from '@composables/useSEO'
import Container from '@components/layout/Container.vue'
import PageHero from '@components/layout/PageHero.vue'
import Section from '@components/layout/Section.vue'
import Grid from '@components/layout/Grid.vue'
import Stack from '@components/layout/Stack.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import AButton from '@components/common/AButton.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASelect from '@components/common/ASelect.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import ACard from '@components/common/ACard.vue'
import ResultPanel from '@components/common/ResultPanel.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { RouterLink } from 'vue-router'
import { generateAgentWorkflow, type WorkflowStep, type WorkflowInput } from '@utils/generators/agentWorkflow'
import { getTool } from '@utils/toolCatalog'
import { useToast } from '@composables/useToast'

const toast = useToast()
const meta = getTool('agent-workflow-generator')!

useSEO({
  title: 'AI Agent Workflow Generator — Aindgc',
  description: meta.description,
  keywords: 'AI Workflow Generator, Agent Workflow, AI Automation, Claude Code Workflow, Codex Workflow',
  ogTitle: 'Agent Workflow Generator',
  ogDescription: meta.tagline
})

const name = ref('Sales Lead Triage')
const goal = ref('从销售线索中自动识别高价值客户,并触发分级跟进。')
const audience = ref('B2B SaaS 销售团队')
const triggers = ref('新线索进入 CRM\n每日上午 9 点批量处理前一天的新增线索')
const stepName = ref('')
const stepDesc = ref('')
const stepType = ref<WorkflowStep['type']>('ai')
const steps = ref<WorkflowStep[]>([
  { id: 's1', name: '读取线索',   description: '从 CRM API 拉取过去 24 小时新增线索。', type: 'trigger' },
  { id: 's2', name: 'AI 评分',   description: '使用 GPT 对线索做 ICP 评分(0-100)。',   type: 'ai' },
  { id: 's3', name: '分级',      description: '>70 分进入 A 级,40-70 进入 B 级,<40 进入培育序列。', type: 'condition' },
  { id: 's4', name: '写回 CRM',  description: '更新线索状态 + 通知销售。',            type: 'action' }
])
const tools = ref('CRM API\nEmail Service\nSlack Webhook\nGPT-4')
const success = ref('所有新增线索 24h 内被处理\nA 级线索 1h 内通知销售\n完整审计日志')
const outputFormat = ref('{\n  "decision": "A | B | nurture",\n  "score": 0,\n  "reason": "string"\n}')

function addStep() {
  if (!stepName.value.trim()) {
    toast.warning('Step name is required')
    return
  }
  steps.value.push({
    id: `s${Date.now()}`,
    name: stepName.value,
    description: stepDesc.value,
    type: stepType.value
  })
  stepName.value = ''
  stepDesc.value = ''
}

function removeStep(idx: number) {
  steps.value.splice(idx, 1)
}

function parseLines(s: string): string[] {
  return s.split('\n').map(l => l.trim()).filter(Boolean)
}

const generated = computed(() => {
  if (!name.value.trim() && !goal.value.trim()) return null
  const input: WorkflowInput = {
    name: name.value,
    goal: goal.value,
    audience: audience.value,
    triggers: parseLines(triggers.value),
    steps: steps.value,
    tools: parseLines(tools.value),
    successCriteria: parseLines(success.value),
    outputFormat: outputFormat.value
  }
  return generateAgentWorkflow(input)
})
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb
          :items="[
            { label: 'Home', to: '/', iconName: 'home' },
            { label: 'Tools', to: '/tools' },
            { label: meta.name }
          ]"
        />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero
          :eyebrow="`${meta.category.toUpperCase()} · ${meta.complexity}`"
          :title="meta.name"
          :subtitle="meta.tagline"
        />
      </Container>
    </Section>

    <Section py="md">
      <Container>
        <Grid :cols="{ sm: 1, lg: 2 }" :gap="5">
          <!-- Input form -->
          <ACard variant="default">
            <Stack :gap="5">
              <Stack :gap="2">
                <label class="lbl">Workflow name</label>
                <AInput v-model="name" placeholder="e.g. Sales Lead Triage" />
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Goal</label>
                <ATextarea v-model="goal" :rows="3" placeholder="What is this workflow trying to accomplish?" />
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Audience</label>
                <AInput v-model="audience" placeholder="Who runs / consumes this?" />
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Triggers <span class="hint">one per line</span></label>
                <ATextarea v-model="triggers" :rows="3" />
              </Stack>

              <Stack :gap="3">
                <label class="lbl">Steps <span class="hint">{{ steps.length }} step{{ steps.length === 1 ? '' : 's' }}</span></label>
                <ul class="steps">
                  <li v-for="(s, idx) in steps" :key="s.id" class="step">
                    <ATag :tone="stepTone(s.type)" size="sm">{{ s.type }}</ATag>
                    <div class="step-text">
                      <p class="step-name">{{ s.name }}</p>
                      <p class="step-desc">{{ s.description }}</p>
                    </div>
                    <button class="step-rm" type="button" aria-label="Remove" @click="removeStep(idx)">
                      <AIcon name="x" :size="14" />
                    </button>
                  </li>
                </ul>

                <div class="step-add">
                  <ASelect v-model="stepType" :options="[
                    { label: 'Trigger',  value: 'trigger' },
                    { label: 'AI',       value: 'ai' },
                    { label: 'Condition',value: 'condition' },
                    { label: 'Tool',     value: 'tool' },
                    { label: 'Action',   value: 'action' },
                    { label: 'Output',   value: 'output' }
                  ]" />
                  <AInput v-model="stepName" placeholder="Step name" />
                  <AInput v-model="stepDesc" placeholder="What does it do?" />
                  <AButton variant="subtle" size="sm" @click="addStep">
                    <template #icon><AIcon name="plus" /></template>
                    Add
                  </AButton>
                </div>
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Tools <span class="hint">one per line</span></label>
                <ATextarea v-model="tools" :rows="3" />
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Success criteria <span class="hint">one per line</span></label>
                <ATextarea v-model="success" :rows="3" />
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Output format <span class="hint">JSON sample</span></label>
                <ATextarea v-model="outputFormat" :rows="5" />
              </Stack>
            </Stack>
          </ACard>

          <!-- Result -->
          <div>
            <ResultPanel
              v-if="generated"
              :markdown="generated.markdown"
              :json="generated.json"
              :filename="name ? name.toLowerCase().replace(/\s+/g, '-') : 'workflow'"
            />
            <ResultPanel v-else />
          </div>
        </Grid>
      </Container>
    </Section>

    <!-- FAQ + Related -->
    <Section py="lg" bg="elevated">
      <Container size="md">
        <RevealOnScroll>
          <header class="sec-head">
            <h2>FAQ</h2>
          </header>
          <Stack :gap="3">
            <details v-for="(f, i) in meta.faqs" :key="i" class="faq">
              <summary>{{ f.q }}</summary>
              <p>{{ f.a }}</p>
            </details>
          </Stack>
        </RevealOnScroll>
      </Container>
    </Section>
  </main>
</template>

<script lang="ts">
function stepTone(t: string) {
  const map: Record<string, 'primary' | 'secondary' | 'warning' | 'neutral'> = {
    trigger: 'primary',
    ai: 'secondary',
    condition: 'warning',
    tool: 'neutral',
    action: 'neutral',
    output: 'primary'
  }
  return map[t] || 'neutral'
}
</script>

<style scoped>
.lbl {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.hint {
  text-transform: none;
  letter-spacing: 0;
  color: var(--text-muted);
  font-size: 11px;
  margin-left: var(--space-2);
}
.steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.step {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
}
.step-text { flex: 1; min-width: 0; }
.step-name {
  font-size: var(--fs-body-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.step-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}
.step-rm {
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
  flex-shrink: 0;
}
.step-rm:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}
.step-add {
  display: grid;
  grid-template-columns: 130px 1fr 1.5fr auto;
  gap: var(--space-2);
  align-items: center;
}
@media (max-width: 768px) {
  .step-add { grid-template-columns: 1fr; }
}

.sec-head h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  margin: 0 0 var(--space-5) 0;
}

.faq {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}
.faq summary {
  cursor: pointer;
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--text-primary);
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq summary::after {
  content: '+';
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}
.faq[open] summary::after { content: '−'; }
.faq p {
  margin: var(--space-3) 0 0 0;
  color: var(--text-secondary);
  font-size: var(--fs-body-sm);
  line-height: var(--lh-relaxed);
}
</style>
