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
// NOTE: type Stack is aliased to StackOption to avoid colliding with the
// <Stack> layout component imported above (both would be "Stack").
import { generateCodingProject, type Stack as StackOption, type AiTarget } from '@utils/generators/codingProject'
import { getTool } from '@utils/toolCatalog'

const meta = getTool('coding-project-starter')!

useSEO({
  title: 'AI Coding Project Starter — Aindgc',
  description: meta.description,
  keywords: 'AI Coding, Claude Code, Codex, Cursor, AGENTS.md, CLAUDE.md, project starter'
})

const projectName = ref('My AI App')
const description = ref('A small web app for generating AI workflows.')
const frontend = ref<StackOption | ''>('Vue 3')
const backend = ref<StackOption | ''>('FastAPI')
const fullStack = ref(true)
const aiTarget = ref<AiTarget>('CLAUDE_CODE')
const features = ref('User authentication\nWorkflow builder\nROI calculator\nAdmin dashboard')
const conventions = ref('- TypeScript strict mode\n- Vue 3 Composition API\n- Backend uses repository pattern\n- All API responses follow {code, message, data}')

const stackOptions: StackOption[] = ['Vue 3', 'React', 'Next.js', 'Nuxt 3', 'Spring Boot', 'FastAPI', 'Node.js (Express)', 'Node.js (NestJS)', 'Go (Gin)', 'Python (Django)']
const targetOptions = [
  { label: 'Claude Code', value: 'CLAUDE_CODE' },
  { label: 'Codex CLI',   value: 'CODEX' },
  { label: 'Cursor',      value: 'CURSOR' },
  { label: 'Gemini CLI',  value: 'GEMINI_CLI' }
]

const generated = computed(() => {
  if (!projectName.value.trim()) return null
  return generateCodingProject({
    projectName: projectName.value,
    description: description.value,
    frontend: frontend.value,
    backend: backend.value,
    fullStack: fullStack.value,
    aiTarget: aiTarget.value,
    features: features.value.split('\n').map(s => s.trim()).filter(Boolean),
    conventions: conventions.value
  })
})

const previewFile = computed(() => generated.value?.files[0])
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
              <Grid :cols="{ sm: 1, md: 2 }" :gap="4">
                <Stack :gap="2">
                  <label class="lbl">Project name</label>
                  <AInput v-model="projectName" placeholder="e.g. My AI App" />
                </Stack>
                <Stack :gap="2">
                  <label class="lbl">AI target</label>
                  <ASelect v-model="aiTarget" :options="targetOptions" />
                </Stack>
              </Grid>

              <Stack :gap="2">
                <label class="lbl">Description</label>
                <ATextarea v-model="description" :rows="3" />
              </Stack>

              <Grid :cols="{ sm: 1, md: 2 }" :gap="4">
                <Stack :gap="2">
                  <label class="lbl">Frontend stack <span class="hint">optional</span></label>
                  <ASelect v-model="frontend" :options="[{ label: '— None —', value: '' }, ...stackOptions.filter(s => ['Vue 3','React','Next.js','Nuxt 3'].includes(s)).map(s => ({ label: s, value: s }))]" />
                </Stack>
                <Stack :gap="2">
                  <label class="lbl">Backend stack <span class="hint">optional</span></label>
                  <ASelect v-model="backend" :options="[{ label: '— None —', value: '' }, ...stackOptions.filter(s => ['Spring Boot','FastAPI','Node.js (Express)','Node.js (NestJS)','Go (Gin)','Python (Django)'].includes(s)).map(s => ({ label: s, value: s }))]" />
                </Stack>
              </Grid>

              <Stack direction="row" :gap="3" align="center">
                <ASwitch v-model="fullStack" />
                <span class="muted">Full-stack project (separate frontend/ and backend/ directories)</span>
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Features <span class="hint">one per line</span></label>
                <ATextarea v-model="features" :rows="5" />
              </Stack>

              <Stack :gap="2">
                <label class="lbl">Conventions</label>
                <ATextarea v-model="conventions" :rows="5" />
              </Stack>
            </Stack>
          </ACard>

          <div>
            <ResultPanel
              v-if="generated && previewFile"
              :markdown="previewFile.content"
              :files="generated.files"
              :filename="(projectName || 'project').toLowerCase().replace(/\s+/g, '-')"
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
