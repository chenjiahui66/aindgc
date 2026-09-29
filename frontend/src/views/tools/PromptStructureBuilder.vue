<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSEO } from '@composables/useSEO'
import Container from '@components/layout/Container.vue'
import PageHero from '@components/layout/PageHero.vue'
import Section from '@components/layout/Section.vue'
import Grid from '@components/layout/Grid.vue'
import Stack from '@components/layout/Stack.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import ACard from '@components/common/ACard.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASelect from '@components/common/ASelect.vue'
import ASwitch from '@components/common/ASwitch.vue'
import ResultPanel from '@components/common/ResultPanel.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { generatePrompt } from '@utils/generators/promptBuilder'
import { getTool } from '@utils/toolCatalog'

const meta = getTool('prompt-structure-builder')!

useSEO({
  title: 'Prompt Structure Builder — Aindgc',
  description: meta.description,
  keywords: 'Prompt Builder, Prompt Engineering, AI Prompt, Claude Prompt'
})

const task = ref('为一个 SaaS 产品写一份投资人邮件,目标是 30 秒内让收件人理解产品。')
const role = ref('资深 SaaS 行业的产品营销总监')
const audience = ref('天使投资人,投资 SaaS / AI 工具')
const context = ref('产品: Aindgc\n阶段: 种子轮,月收入 ¥30k\n亮点: 上线 3 个月,已有 200 个活跃用户')
const constraints = ref('- 不超过 120 字\n- 一句话讲清产品,一句话讲清优势\n- 结尾给出一个明确的 CTA(15 分钟通话)')
const outputFormat = ref('Subject: <一句话>\nBody:\n  Hook: <一段,30 字以内>\n  Value: <一段,50 字以内>\n  CTA: <一句话>')
const examples = ref('Subject: 让销售线索自动跑起来\nBody: Aindgc 让你的销售线索在 5 分钟内被 AI 分级、写邮件、入 CRM,无需人工。今天下午聊聊?')
const tone = ref<'formal' | 'casual' | 'technical' | 'friendly'>('formal')
const includeSteps = ref(true)

const generated = computed(() => {
  if (!task.value.trim()) return null
  return generatePrompt({
    task: task.value,
    role: role.value,
    audience: audience.value,
    context: context.value,
    constraints: constraints.value,
    outputFormat: outputFormat.value,
    examples: examples.value,
    tone: tone.value,
    includeSteps: includeSteps.value
  })
})
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'Tools', to: '/tools' },
          { label: meta.name }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero :eyebrow="`${meta.category.toUpperCase()} · ${meta.complexity}`" :title="meta.name" :subtitle="meta.tagline" />
      </Container>
    </Section>

    <Section py="md">
      <Container>
        <Grid :cols="{ sm: 1, lg: 2 }" :gap="5">
          <ACard>
            <Stack :gap="4">
              <Stack :gap="2">
                <label class="lbl">Task</label>
                <ATextarea v-model="task" :rows="3" />
              </Stack>
              <Grid :cols="{ sm: 1, md: 2 }" :gap="4">
                <Stack :gap="2">
                  <label class="lbl">Role</label>
                  <AInput v-model="role" />
                </Stack>
                <Stack :gap="2">
                  <label class="lbl">Audience</label>
                  <AInput v-model="audience" />
                </Stack>
              </Grid>
              <Stack :gap="2">
                <label class="lbl">Context</label>
                <ATextarea v-model="context" :rows="4" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Constraints</label>
                <ATextarea v-model="constraints" :rows="3" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Output format</label>
                <ATextarea v-model="outputFormat" :rows="5" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Examples</label>
                <ATextarea v-model="examples" :rows="4" />
              </Stack>
              <Grid :cols="{ sm: 1, md: 2 }" :gap="4">
                <Stack :gap="2">
                  <label class="lbl">Tone</label>
                  <ASelect v-model="tone" :options="[
                    { label: 'Formal',    value: 'formal' },
                    { label: 'Casual',    value: 'casual' },
                    { label: 'Technical', value: 'technical' },
                    { label: 'Friendly',  value: 'friendly' }
                  ]" />
                </Stack>
                <Stack direction="row" :gap="3" align="center" :style="{ alignSelf: 'flex-end' }">
                  <ASwitch v-model="includeSteps" />
                  <span class="muted">Include thinking steps</span>
                </Stack>
              </Grid>
            </Stack>
          </ACard>

          <div>
            <ResultPanel
              v-if="generated"
              :markdown="generated.markdown"
              :json="generated.json"
              filename="prompt"
            />
            <ResultPanel v-else />
          </div>
        </Grid>
      </Container>
    </Section>

    <Section py="lg" bg="elevated">
      <Container size="md">
        <RevealOnScroll>
          <h2 class="sec-h">FAQ</h2>
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

<style scoped>
.lbl {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.muted { color: var(--text-tertiary); font-size: var(--fs-body-sm); }
.sec-h {
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
}
.faq summary::after { content: '+'; color: var(--text-tertiary); font-family: var(--font-mono); float: right; }
.faq[open] summary::after { content: '−'; }
.faq p {
  margin: var(--space-3) 0 0 0;
  color: var(--text-secondary);
  font-size: var(--fs-body-sm);
  line-height: var(--lh-relaxed);
}
</style>
