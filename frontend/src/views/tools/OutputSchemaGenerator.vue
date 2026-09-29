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
import AButton from '@components/common/AButton.vue'
import ATag from '@components/common/ATag.vue'
import ACodeBlock from '@components/common/ACodeBlock.vue'
import AIcon from '@components/common/AIcon.vue'
import ResultPanel from '@components/common/ResultPanel.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'
import { generateOutputSchema, type SchemaField, type FieldType } from '@utils/generators/outputSchema'
import { getTool } from '@utils/toolCatalog'
import { useToast } from '@composables/useToast'

const meta = getTool('output-schema-generator')!
const toast = useToast()

useSEO({
  title: 'Output Schema Generator — Aindgc',
  description: meta.description,
  keywords: 'JSON Schema, Output Schema, TypeScript Types, AI Output Contract'
})

const name = ref('LeadScore')
const description = ref('AI 对销售线索的评分结果')

const fields = ref<SchemaField[]>([
  { name: 'lead_id',  type: 'string',  required: true,  description: 'CRM 中的线索 ID' },
  { name: 'score',    type: 'integer', required: true,  description: '0-100,越高越优质' },
  { name: 'grade',    type: 'string',  required: true,  description: 'A / B / nurture', enum: ['A','B','nurture'] },
  { name: 'reason',   type: 'string',  description: '一句话评分理由' },
  { name: 'tags',     type: 'array',   itemType: 'string', description: '匹配的 ICP 标签' }
])

const newField = ref<SchemaField>({ name: '', type: 'string', description: '' })

function addField() {
  if (!newField.value.name.trim()) {
    toast.warning('Field name required')
    return
  }
  fields.value.push({ ...newField.value })
  newField.value = { name: '', type: 'string', description: '' }
}

function removeField(idx: number) {
  fields.value.splice(idx, 1)
}

const generated = computed(() => {
  if (!name.value.trim()) return null
  return generateOutputSchema({
    name: name.value,
    description: description.value,
    fields: fields.value
  })
})

const typeOptions = [
  { label: 'string',  value: 'string' },
  { label: 'number',  value: 'number' },
  { label: 'integer', value: 'integer' },
  { label: 'boolean', value: 'boolean' },
  { label: 'array',   value: 'array' },
  { label: 'object',  value: 'object' },
  { label: 'null',    value: 'null' }
]

const itemTypeOptions = typeOptions.filter(o => o.value !== 'array' && o.value !== 'object')
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
                <label class="lbl">Schema name</label>
                <AInput v-model="name" placeholder="e.g. LeadScore" />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">Description</label>
                <ATextarea v-model="description" :rows="2" />
              </Stack>

              <Stack :gap="3">
                <label class="lbl">Fields <span class="hint">{{ fields.length }} field{{ fields.length === 1 ? '' : 's' }}</span></label>
                <ul class="fields">
                  <li v-for="(f, idx) in fields" :key="`${f.name}-${idx}`" class="field">
                    <ATag tone="primary" size="sm">{{ f.type }}{{ f.type === 'array' ? '[]' : '' }}</ATag>
                    <div class="field-text">
                      <p class="field-name">
                        {{ f.name }}
                        <span v-if="f.required" class="req">required</span>
                        <span v-if="f.enum?.length" class="enum">{{ f.enum.join(' | ') }}</span>
                      </p>
                      <p v-if="f.description" class="field-desc">{{ f.description }}</p>
                    </div>
                    <button class="rm" type="button" @click="removeField(idx)" aria-label="Remove">
                      <AIcon name="x" :size="14" />
                    </button>
                  </li>
                </ul>

                <div class="field-add">
                  <AInput v-model="newField.name" placeholder="Field name" />
                  <ASelect v-model="newField.type" :options="typeOptions" />
                  <ASelect
                    v-if="newField.type === 'array'"
                    v-model="newField.itemType"
                    :options="itemTypeOptions"
                  />
                  <AInput v-model="newField.description" placeholder="Description (optional)" />
                  <AButton variant="subtle" size="sm" @click="addField">
                    <template #icon><AIcon name="plus" /></template>
                    Add
                  </AButton>
                </div>
              </Stack>
            </Stack>
          </ACard>

          <div>
            <ResultPanel
              v-if="generated"
              :markdown="generated.markdown"
              :json="generated.jsonSchema"
              :filename="name.toLowerCase().replace(/\s+/g, '-') || 'schema'"
            />
            <ResultPanel v-else />
          </div>
        </Grid>
      </Container>
    </Section>

    <Section v-if="generated" py="md">
      <Container size="lg">
        <header class="sec-head">
          <h2>TypeScript preview</h2>
          <p class="muted">Drop-in types for your codebase.</p>
        </header>
        <ACodeBlock :code="generated.typescript" language="typescript" filename="types.ts" />
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

.fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.field {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
}
.field-text { flex: 1; min-width: 0; }
.field-name {
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-primary);
  margin: 0;
}
.req {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-warning);
  margin-left: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.enum {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent-secondary);
  margin-left: var(--space-2);
}
.field-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 4px 0 0 0;
}
.rm {
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
.rm:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.field-add {
  display: grid;
  grid-template-columns: 1fr 110px 110px 1.5fr auto;
  gap: var(--space-2);
  align-items: center;
}
@media (max-width: 768px) {
  .field-add { grid-template-columns: 1fr 1fr; }
}

.sec-head { margin-bottom: var(--space-3); }
.sec-head h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  margin: 0 0 var(--space-1) 0;
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
