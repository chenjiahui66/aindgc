<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSEO } from '@composables/useSEO'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Stack from '@components/layout/Stack.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import ACard from '@components/common/ACard.vue'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import ACountUp from '@components/common/ACountUp.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { QUESTIONS, scoreCheckup, type CheckupResult } from '@utils/generators/checkupScorer'
import { useLocalStorage } from '@composables/useLocalStorage'
import { useToast } from '@composables/useToast'

const toast = useToast()

useSEO({
  title: 'AI Work Checkup — Aindgc',
  description: '免费 AI 准备度评估:6 步问卷 → AI Readiness Score + Top 5 自动化机会。',
  keywords: 'AI Checkup, AI Readiness, AI Maturity, Automation Opportunities'
})

const STORAGE_KEY = 'aindgc_checkup_state_v1'

interface CheckupState {
  currentStep: number
  answers: Record<string, string>
  result: CheckupResult | null
  finishedAt: number | null
}

const initialState: CheckupState = {
  currentStep: 0,
  answers: {},
  result: null,
  finishedAt: null
}

const state = useLocalStorage<CheckupState>(STORAGE_KEY, initialState)

const started = computed(() => state.value.currentStep >= 0 && Object.keys(state.value.answers).length > 0)
const finished = computed(() => state.value.result !== null)

const currentQuestion = computed(() => {
  const idx = Math.min(state.value.currentStep, QUESTIONS.length - 1)
  return QUESTIONS[idx]
})

const totalSteps = QUESTIONS.length
const progressPct = computed(() => {
  if (finished.value) return 100
  return Math.round((state.value.currentStep / totalSteps) * 100)
})

function start() {
  state.value.currentStep = 0
  state.value.answers = {}
  state.value.result = null
  state.value.finishedAt = null
}

function answer(qid: string, value: string) {
  state.value.answers = { ...state.value.answers, [qid]: value }
}

function next() {
  if (state.value.currentStep < QUESTIONS.length - 1) {
    state.value.currentStep++
  } else {
    finish()
  }
}

function prev() {
  if (state.value.currentStep > 0) state.value.currentStep--
}

function finish() {
  const result = scoreCheckup({ answers: state.value.answers })
  state.value.result = result
  state.value.finishedAt = Date.now()
  toast.success('Checkup complete')
}

function reset() {
  if (!confirm('Reset checkup? Your answers will be cleared.')) return
  state.value = { ...initialState }
  toast.info('Reset')
}

function bandTone(band: string): 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' {
  switch (band) {
    case 'Architect': return 'success'
    case 'Operator':  return 'primary'
    case 'Builder':   return 'secondary'
    default:          return 'warning'
  }
}

function bandDescription(band: string): string {
  switch (band) {
    case 'Architect':
      return '你已经在系统性地使用 AI。下一阶段是把个人用法沉淀为团队 / 公司的可复用工作流。'
    case 'Operator':
      return '你已经把 AI 用得不错,下一步是把它嵌入到流程里,让团队所有人都能用上。'
    case 'Builder':
      return '你已经体验过 AI 的好处,现在可以开始为团队设计第一个 AI 工作流。'
    default:
      return '从最重复的一个任务开始,3 天内就能看到回报 — 推荐先用 AI 工具集里最贴合你场景的那一个。'
  }
}

onMounted(() => {
  // nothing — state is persisted via useLocalStorage
})

// Auto-clear storage after 30 days of inactivity
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
watch(() => state.value.finishedAt, (v) => {
  if (v && Date.now() - v > THIRTY_DAYS) {
    state.value = { ...initialState }
  }
})

const ringDasharray = 2 * Math.PI * 50
const ringDashoffset = computed(() =>
  ringDasharray * (1 - (state.value.result?.score || 0) / 100)
)
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'AI Checkup' }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero
          eyebrow="FREE · 6 STEPS · ~3 MINUTES"
          title="How AI-ready is your work?"
          subtitle="6 步问卷,得到 AI Readiness Score + Top 5 自动化机会。所有数据保存在你本地浏览器。"
        >
          <AButton v-if="!started && !finished" variant="primary" @click="start">
            <template #icon><AIcon name="play" /></template>
            Start the checkup
          </AButton>
          <AButton v-if="started && !finished" variant="ghost" @click="reset">
            <template #icon><AIcon name="rotate-ccw" /></template>
            Reset
          </AButton>
          <AButton v-if="finished" variant="primary" @click="start">
            <template #icon><AIcon name="refresh-cw" /></template>
            Take again
          </AButton>
        </PageHero>
      </Container>
    </Section>

    <!-- Intro state -->
    <Section v-if="!started && !finished" py="md">
      <Container size="md">
        <RevealOnScroll>
          <ACard variant="glow">
            <Stack :gap="4" align="center">
              <div class="big-icon">
                <AIcon name="check-circle" :size="36" />
              </div>
              <h3>What you'll get</h3>
              <ul class="benefit-list">
                <li><AIcon name="zap" :size="14" /> 一个 0-100 的 AI Readiness Score</li>
                <li><AIcon name="target" :size="14" /> 5 个按相关度排序的自动化机会</li>
                <li><AIcon name="bar-chart" :size="14" /> 每道题的得分细节</li>
                <li><AIcon name="shield" :size="14" /> 完全本地,数据不上传</li>
              </ul>
            </Stack>
          </ACard>
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- Active step -->
    <Section v-if="started && !finished" py="md">
      <Container size="md">
        <div class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPct}%` }" />
          </div>
          <div class="progress-meta">
            <span class="step-label">Step {{ state.currentStep + 1 }} of {{ totalSteps }}</span>
            <span class="step-percent">{{ progressPct }}%</span>
          </div>
        </div>

        <RevealOnScroll :key="currentQuestion.id">
          <ACard variant="default">
            <Stack :gap="5">
              <header>
                <p class="step-q-num">QUESTION {{ state.currentStep + 1 }}</p>
                <h3 class="step-q-title">{{ currentQuestion.title }}</h3>
                <p v-if="currentQuestion.description" class="step-q-desc">{{ currentQuestion.description }}</p>
              </header>

              <ul class="options">
                <li
                  v-for="opt in currentQuestion.options"
                  :key="opt.value"
                  class="option"
                  :class="{ selected: state.answers[currentQuestion.id] === opt.value }"
                  @click="answer(currentQuestion.id, opt.value)"
                >
                  <span class="opt-check">
                    <AIcon v-if="state.answers[currentQuestion.id] === opt.value" name="check" :size="14" />
                  </span>
                  <span class="opt-label">{{ opt.label }}</span>
                </li>
              </ul>

              <div class="nav">
                <AButton variant="ghost" :disabled="state.currentStep === 0" @click="prev">
                  <template #icon><AIcon name="arrow-left" /></template>
                  Back
                </AButton>
                <AButton
                  variant="primary"
                  :disabled="!state.answers[currentQuestion.id]"
                  @click="next"
                >
                  {{ state.currentStep === totalSteps - 1 ? 'See result' : 'Next' }}
                  <template #icon><AIcon :name="state.currentStep === totalSteps - 1 ? 'sparkles' : 'arrow-right'" /></template>
                </AButton>
              </div>
            </Stack>
          </ACard>
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- Result -->
    <Section v-if="finished && state.result" py="md">
      <Container size="lg">
        <RevealOnScroll>
          <ACard variant="glow">
            <div class="result-grid">
              <div class="result-left">
                <p class="result-eyebrow">YOUR AI READINESS SCORE</p>
                <div class="ring">
                  <svg viewBox="0 0 120 120" class="ring-svg">
                    <circle cx="60" cy="60" r="50" class="ring-track" />
                    <circle
                      cx="60" cy="60" r="50"
                      class="ring-fill"
                      :stroke-dasharray="ringDasharray"
                      :stroke-dashoffset="ringDashoffset"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div class="ring-center">
                    <p class="ring-num">
                      <ACountUp :end="state.result.score" />
                    </p>
                    <p class="ring-suffix">/100</p>
                  </div>
                </div>
                <ATag :tone="bandTone(state.result.band)" size="md">{{ state.result.band }}</ATag>
              </div>
              <div class="result-right">
                <h2>{{ bandDescription(state.result.band) }}</h2>
                <div v-if="state.result.strengths.length" class="rb-block">
                  <p class="rb-label">Strengths</p>
                  <div class="rb-tags">
                    <ATag v-for="s in state.result.strengths" :key="s" tone="success" size="sm">{{ s }}</ATag>
                  </div>
                </div>
                <div v-if="state.result.gaps.length" class="rb-block">
                  <p class="rb-label">Gaps to address</p>
                  <div class="rb-tags">
                    <ATag v-for="g in state.result.gaps" :key="g" tone="warning" size="sm">{{ g }}</ATag>
                  </div>
                </div>
              </div>
            </div>
          </ACard>
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- Opportunities -->
    <Section v-if="finished && state.result" py="md">
      <Container size="lg">
        <RevealOnScroll>
          <header class="opp-head">
            <h2>Top 5 opportunities for you</h2>
            <p class="muted">Ordered by relevance to your pain points and current state.</p>
          </header>
        </RevealOnScroll>
        <Stack :gap="3">
          <RevealOnScroll v-for="(o, idx) in state.result.opportunities" :key="o.opportunity.id" :delay="idx * 60">
            <ACard variant="default" hover>
              <div class="opp-row">
                <div class="opp-rank">
                  <span class="rank-num">{{ String(idx + 1).padStart(2, '0') }}</span>
                </div>
                <div class="opp-body">
                  <div class="opp-head-row">
                    <h3>{{ o.opportunity.title }}</h3>
                    <div class="opp-tags">
                      <ATag :tone="o.opportunity.impact === 'High' ? 'success' : o.opportunity.impact === 'Medium' ? 'warning' : 'neutral'" size="sm">
                        Impact · {{ o.opportunity.impact }}
                      </ATag>
                      <ATag :tone="o.opportunity.difficulty === 'Low' ? 'success' : o.opportunity.difficulty === 'Medium' ? 'warning' : 'danger'" size="sm">
                        Effort · {{ o.opportunity.difficulty }}
                      </ATag>
                    </div>
                  </div>
                  <p class="opp-desc">{{ o.opportunity.description }}</p>
                  <p class="opp-reason">{{ o.reason }}</p>
                  <p class="opp-cta">
                    <RouterLink to="/tools" class="cta-link">
                      See matching tools <AIcon name="arrow-right" :size="14" />
                    </RouterLink>
                  </p>
                </div>
              </div>
            </ACard>
          </RevealOnScroll>
        </Stack>
      </Container>
    </Section>

    <!-- Breakdown -->
    <Section v-if="finished && state.result" py="md">
      <Container size="md">
        <RevealOnScroll>
          <header class="opp-head">
            <h2>Breakdown</h2>
            <p class="muted">See how each question contributed to your score.</p>
          </header>
          <Stack :gap="2">
            <div v-for="b in state.result.breakdown" :key="b.questionId" class="bd-row">
              <div class="bd-q">
                <p class="bd-title">{{ QUESTIONS.find(q => q.id === b.questionId)?.title }}</p>
                <p class="bd-ans">
                  Your answer: <strong>{{ QUESTIONS.find(q => q.id === b.questionId)?.options.find(o => o.value === b.answer)?.label || '—' }}</strong>
                </p>
              </div>
              <div class="bd-bar">
                <div class="bd-bar-fill" :style="{ width: `${(b.weight / b.max) * 100}%` }" />
              </div>
              <div class="bd-num">{{ b.weight }}/{{ b.max }}</div>
            </div>
          </Stack>
          <p class="bd-disclaimer">
            <AIcon name="alert-triangle" :size="14" />
            {{ state.result.disclaimer }}
          </p>
        </RevealOnScroll>
      </Container>
    </Section>
  </main>
</template>

<style scoped>
main { padding-bottom: var(--space-9); }

.big-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(111, 168, 255, 0.10);
  color: var(--accent-primary);
  border: 1px solid rgba(111, 168, 255, 0.24);
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--fs-body);
  color: var(--text-secondary);
  text-align: left;
  width: 100%;
  max-width: 360px;
}
.benefit-list li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 0;
}
.benefit-list li :deep(svg) { color: var(--accent-primary); }

/* Progress */
.progress {
  margin-bottom: var(--space-5);
}
.progress-bar {
  height: 4px;
  background: var(--surface-1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-2);
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  transition: width var(--duration-slow) var(--ease-emphasized);
}
.progress-meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
}

/* Question */
.step-q-num {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--accent-primary);
  margin: 0 0 var(--space-2) 0;
}
.step-q-title {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}
.step-q-desc {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  margin: 0;
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.option:hover {
  border-color: var(--border-default);
  background: var(--surface-2);
}
.option.selected {
  border-color: var(--accent-primary);
  background: rgba(111, 168, 255, 0.06);
}

.opt-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--border-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--accent-primary);
  background: var(--bg-overlay);
  transition: all var(--duration-fast) var(--ease-standard);
}
.option.selected .opt-check {
  background: var(--accent-primary);
  color: #06121F;
  border-color: var(--accent-primary);
}

.opt-label {
  font-size: var(--fs-body);
  color: var(--text-secondary);
}
.option.selected .opt-label {
  color: var(--text-primary);
  font-weight: 500;
}

.nav {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

/* Result */
.result-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-7);
  align-items: center;
}
@media (max-width: 768px) {
  .result-grid { grid-template-columns: 1fr; text-align: center; }
}

.result-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}
.result-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}

.ring {
  position: relative;
  width: 180px;
  height: 180px;
}
.ring-svg {
  width: 100%;
  height: 100%;
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
  filter: drop-shadow(0 0 10px rgba(111, 168, 255, 0.4));
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
  font-size: 52px;
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

.result-right h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 var(--space-5) 0;
  line-height: var(--lh-snug);
}

.rb-block { margin-top: var(--space-3); }
.rb-label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 0 var(--space-2) 0;
}
.rb-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* Opportunities */
.opp-head { margin-bottom: var(--space-5); }
.opp-head h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.muted { font-size: var(--fs-body-sm); color: var(--text-tertiary); margin: 0; }

.opp-row {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: var(--space-4);
  align-items: flex-start;
}
.opp-rank {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
}
.rank-num {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: var(--fs-body-lg);
  color: var(--accent-primary);
}

.opp-head-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}
.opp-head-row h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.opp-tags { display: flex; gap: 6px; flex-wrap: wrap; }

.opp-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  margin: 0 0 var(--space-2) 0;
}
.opp-reason {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  margin: 0 0 var(--space-2) 0;
}
.opp-cta { margin: 0; }
.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent-primary);
  text-decoration: none;
}
.cta-link:hover { color: var(--accent-secondary); }

/* Breakdown */
.bd-row {
  display: grid;
  grid-template-columns: 1fr 240px 64px;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
@media (max-width: 768px) {
  .bd-row { grid-template-columns: 1fr; }
}
.bd-title {
  font-size: var(--fs-body-sm);
  color: var(--text-primary);
  margin: 0;
  font-weight: 500;
}
.bd-ans {
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}
.bd-ans strong { color: var(--text-secondary); font-weight: 500; }
.bd-bar {
  height: 6px;
  background: var(--surface-1);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.bd-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
}
.bd-num {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  text-align: right;
}

.bd-disclaimer {
  margin: var(--space-5) 0 0 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--color-warning);
  display: flex;
  gap: 6px;
  align-items: flex-start;
  letter-spacing: 0.02em;
}
</style>
