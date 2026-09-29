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
import ResultPanel from '@components/common/ResultPanel.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { generateSkill } from '@utils/generators/agentSkill'
import { getTool } from '@utils/toolCatalog'

const meta = getTool('agent-skills-generator')!

useSEO({
  title: 'Agent Skills Generator — Aindgc',
  description: meta.description,
  keywords: 'SKILL.md, Claude Code, Codex, Cursor, Gemini CLI, Agent Skill'
})

const name = ref('code-reviewer')
const role = ref('You are a senior code reviewer focused on correctness, security, and maintainability.')
const purpose = ref('Review pull request diffs and produce structured, actionable feedback without re-explaining trivial style issues.')
const instructions = ref('1. Read the full diff first; do not comment line-by-line without understanding intent.\n2. Group feedback by severity (blocking / important / nit).\n3. For each issue, cite file:line and suggest a concrete fix.\n4. If the diff is large, prioritize by risk.')
const tools = ref('Read\nGrep\nBash (read-only)')
const workflow = ref('1. Receive diff (git diff or PR link)\n2. Identify changed files\n3. Read full files for context\n4. Spot bugs, security issues, perf risks\n5. Emit grouped review')
const examples = ref('Input: a 200-line PR touching auth.ts\nOutput:\n  ## Blocking\n  - SQL injection in `authenticate()` — line 42\n  ## Important\n  - Race condition on token refresh — line 87\n  ## Nits\n  - Unused import')
const constraints = ref('- Do NOT comment on whitespace / formatting\n- Do NOT recommend frameworks\n- Stay under 400 words unless explicitly asked')
const target = ref<'CLAUDE_CODE' | 'CODEX' | 'CURSOR' | 'GEMINI_CLI' | 'ALL'>('CLAUDE_CODE')

const generated = computed(() => {
  if (!name.value.trim() && !purpose.value.trim()) return null
  return generateSkill({
    name: name.value,
    role: role.value,
    purpose: purpose.value,
    instructions: instructions.value,
    tools: tools.value.split('\n').map(s => s.trim()).filter(Boolean),
    workflow: workflow.value,
    examples: examples.value,
    constraints: constraints.value,
    target: target.value
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
            <Stack :gap="5">
              <Grid :cols="{ sm: 1, md: 2 }" :gap="4">
                <Stack :gap="2">
                  <label class="lbl">Skill name</label>
                  <AInput v-model="name" placeholder="e.g. code-reviewer" />
                </Stack>
                <Stack :gap="2">
                  <label class="lbl">Target</label>
                  <ASelect v-model="target" :options="[
                    { label: 'Claude Code',  value: 'CLAUDE_CODE' },
                    { label: 'Codex CLI',    value: 'CODEX' },
                    { label: 'Cursor',       value: 'CURSOR' },
                    { label: 'Gemini CLI',   value: 'GEMINI_CLI' },
                    { label: 'Universal',    value: 'ALL' }
                  ]" />
                </Stack>
              </Grid>
              <Stack :gap="2">
                <label class="lbl">Role</label>
                <ATextarea v-model="role" :rows="3" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Purpose</label>
                <ATextarea v-model="purpose" :rows="3" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Instructions</label>
                <ATextarea v-model="instructions" :rows="6" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Tools <span class="hint">one per line</span></label>
                <ATextarea v-model="tools" :rows="3" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Workflow</label>
                <ATextarea v-model="workflow" :rows="4" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Examples</label>
                <ATextarea v-model="examples" :rows="4" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Constraints</label>
                <ATextarea v-model="constraints" :rows="3" />
              </Stack>
            </Stack>
          </ACard>

          <div>
            <ResultPanel
              v-if="generated"
              :markdown="generated.markdown"
              :json="generated.json"
              :filename="name || 'skill'"
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
.hint {
  text-transform: none;
  letter-spacing: 0;
  color: var(--text-muted);
  font-size: 11px;
  margin-left: var(--space-2);
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
.faq summary::after {
  content: '+';
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  float: right;
}
.faq[open] summary::after { content: '−'; }
.faq p {
  margin: var(--space-3) 0 0 0;
  color: var(--text-secondary);
  font-size: var(--fs-body-sm);
  line-height: var(--lh-relaxed);
}
</style>
