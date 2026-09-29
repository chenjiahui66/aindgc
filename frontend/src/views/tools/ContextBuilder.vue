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
import ATextarea from '@components/common/ATextarea.vue'
import ResultPanel from '@components/common/ResultPanel.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { generateContext } from '@utils/generators/contextBuilder'
import { getTool } from '@utils/toolCatalog'

const meta = getTool('context-builder')!

useSEO({
  title: 'AI Context Builder — Aindgc',
  description: meta.description,
  keywords: 'AI Context, Context Builder, Prompt Engineering'
})

const purpose = ref('为销售团队提供 AI 助手,自动撰写个性化跟进邮件。')
const audience = ref('销售经理 + 销售代表')
const scope = ref('- 自动撰写首封和跟进邮件\n- 总结客户互动历史\n- 建议下一步行动')
const keyInfo = ref('产品: Aindgc AI Workflow Generator\n价格区间: ¥1,200 - ¥6,000 / 月\n目标客户: 中小企业销售团队')
const constraints = ref('- 不出现竞品名称\n- 单封邮件不超过 200 字\n- 语气专业但不生硬')
const examples = ref('输入: 客户为 SaaS 公司销售经理,最近下载了 ROI 白皮书\n输出邮件: 主题「您团队的 ROI 测算」+ 1 段简短开场 + 1 段 CTA')
const successSignals = ref('- 销售愿意直接采用\n- 客户回复率高于 25%\n- 单封邮件生成时间 < 5 秒')

const generated = computed(() => {
  if (!purpose.value.trim()) return null
  return generateContext({
    purpose: purpose.value,
    audience: audience.value,
    scope: scope.value,
    keyInfo: keyInfo.value,
    constraints: constraints.value,
    examples: examples.value,
    successSignals: successSignals.value
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
                <label class="lbl">1. Purpose</label>
                <ATextarea v-model="purpose" :rows="3" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">2. Audience</label>
                <ATextarea v-model="audience" :rows="2" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">3. Scope</label>
                <ATextarea v-model="scope" :rows="4" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">4. Key Information</label>
                <ATextarea v-model="keyInfo" :rows="4" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">5. Constraints</label>
                <ATextarea v-model="constraints" :rows="3" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">6. Examples</label>
                <ATextarea v-model="examples" :rows="4" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">7. Success Signals</label>
                <ATextarea v-model="successSignals" :rows="3" />
              </Stack>
            </Stack>
          </ACard>

          <div>
            <ResultPanel
              v-if="generated"
              :markdown="generated.markdown"
              :json="generated.json"
              filename="context"
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
