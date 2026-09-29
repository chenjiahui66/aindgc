<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSEO } from '@composables/useSEO'
import { useWorkflowStore } from '@stores/workflow'
import Container from '@components/layout/Container.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import Grid from '@components/layout/Grid.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import AButton from '@components/common/AButton.vue'
import AEmpty from '@components/common/AEmpty.vue'
import { WORKFLOW_TEMPLATES } from '@utils/workflowTemplates'
import { NODE_KINDS } from '@utils/workflowTypes'

useSEO({
  title: 'AI Workflow Builder — Aindgc',
  description: '可视化构建 AI 工作流。Trigger / AI / Condition / Tool / Action / Output 节点,拖拽编辑,导出 Markdown 和 JSON。',
  keywords: 'AI Workflow Builder, Vue Flow, Multi-Agent, Automation, AI Agent Workflow'
})

const router = useRouter()
const store = useWorkflowStore()

function startFromTemplate(slug: string) {
  const t = WORKFLOW_TEMPLATES.find(x => x.slug === slug)
  if (!t) return
  store.loadTemplate(t)
  router.push('/workflow/builder')
}

function openSaved(id: string) {
  const wf = store.saved.find(s => s.id === id)
  if (!wf) return
  store.loadGraph(wf)
  router.push('/workflow/builder')
}

function deleteSaved(id: string, name: string) {
  if (!confirm(`Delete workflow "${name}"?`)) return
  store.deleteSaved(id)
}

function startBlank() {
  store.reset()
  router.push('/workflow/builder')
}

function complexityTone(c: string) {
  if (c === 'beginner') return 'success'
  if (c === 'intermediate') return 'warning'
  return 'danger'
}
</script>

<template>
  <main>
    <Container>
      <ABreadcrumb :items="[
        { label: 'Home', to: '/', iconName: 'home' },
        { label: 'Workflow' }
      ]" />
    </Container>

    <Container>
      <PageHero
        eyebrow="WORKFLOW BUILDER"
        title="Visualize your AI workflow."
        subtitle="拖拽节点、连接、配置、保存。导出为 Markdown 或 JSON,直接对接 Claude Code / Codex / n8n / Dify。"
      >
        <AButton variant="primary" @click="startBlank">
          <template #icon><AIcon name="plus" /></template>
          New blank workflow
        </AButton>
      </PageHero>
    </Container>

    <Container>
      <section class="block">
        <header class="block-head">
          <h2>Templates</h2>
          <p class="muted">From the Aindgc library — copy and customize.</p>
        </header>
        <Grid :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
          <article v-for="t in WORKFLOW_TEMPLATES" :key="t.slug" class="tpl-card">
            <header class="tpl-head">
              <ATag :tone="complexityTone(t.complexity) as 'success' | 'warning' | 'danger'" size="sm">{{ t.complexity }}</ATag>
              <ATag tone="neutral" size="sm">{{ t.category }}</ATag>
            </header>
            <h3>{{ t.name }}</h3>
            <p class="tpl-desc">{{ t.description }}</p>
            <div class="tpl-meta">
              <span><AIcon name="box" :size="12" /> {{ t.graph.nodes.length }} nodes</span>
              <span><AIcon name="git-branch" :size="12" /> {{ t.graph.edges.length }} edges</span>
              <span>
                <AIcon :name="NODE_KINDS[t.graph.nodes[0].data.kind].iconName" :size="12" />
                {{ NODE_KINDS[t.graph.nodes[0].data.kind].label }}
              </span>
            </div>
            <AButton variant="outline" size="sm" block @click="startFromTemplate(t.slug)">
              <template #icon><AIcon name="copy" /></template>
              Use this template
            </AButton>
          </article>
        </Grid>
      </section>

      <section class="block">
        <header class="block-head">
          <h2>My workflows</h2>
          <p class="muted">Saved locally to your browser. Sign in to sync to server (Phase 14).</p>
        </header>
        <div v-if="store.saved.length === 0" class="empty-wrap">
          <AEmpty
            icon-name="workflow"
            title="No saved workflows yet"
            description="Build something in the canvas and click Save."
            size="sm"
          >
            <AButton variant="primary" size="sm" @click="startBlank">
              <template #icon><AIcon name="plus" /></template>
              New
            </AButton>
          </AEmpty>
        </div>
        <Grid v-else :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
          <article v-for="wf in store.saved" :key="wf.id" class="saved-card">
            <h3>{{ wf.name }}</h3>
            <p v-if="wf.description" class="saved-desc">{{ wf.description }}</p>
            <div class="saved-meta">
              <span>{{ wf.nodes.length }} nodes</span>
              <span>·</span>
              <span>{{ wf.edges.length }} edges</span>
              <span>·</span>
              <span>{{ new Date(wf.updatedAt).toLocaleDateString() }}</span>
            </div>
            <div class="saved-actions">
              <AButton variant="primary" size="sm" @click="openSaved(wf.id)">
                <template #icon><AIcon name="external-link" /></template>
                Open
              </AButton>
              <AButton variant="ghost" size="sm" @click="deleteSaved(wf.id, wf.name)">
                <template #icon><AIcon name="trash-2" /></template>
              </AButton>
            </div>
          </article>
        </Grid>
      </section>
    </Container>
  </main>
</template>

<style scoped>
main {
  padding-bottom: var(--space-9);
}
.block {
  margin-top: var(--space-7);
}
.block-head {
  margin-bottom: var(--space-4);
}
.block-head h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.muted {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 0;
}

.tpl-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: border-color var(--duration-base) var(--ease-standard);
}
.tpl-card:hover {
  border-color: var(--border-default);
}
.tpl-head {
  display: flex;
  gap: 6px;
}
.tpl-card h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}
.tpl-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  margin: 0;
  flex: 1;
}
.tpl-meta {
  display: flex;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
}
.tpl-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.empty-wrap {
  background: var(--bg-elevated);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
}

.saved-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.saved-card h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.saved-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
}
.saved-meta {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  display: flex;
  gap: 6px;
}
.saved-actions {
  display: flex;
  gap: var(--space-2);
}
</style>
