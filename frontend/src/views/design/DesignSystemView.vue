<script setup lang="ts">
import { ref } from 'vue'
import { useSEO } from '@composables/useSEO'

// common
import AButton from '@components/common/AButton.vue'
import ACard from '@components/common/ACard.vue'
import ATag from '@components/common/ATag.vue'
import ABadge from '@components/common/ABadge.vue'
import AAvatar from '@components/common/AAvatar.vue'
import AIcon from '@components/common/AIcon.vue'
import AEmpty from '@components/common/AEmpty.vue'
import ASkeleton from '@components/common/ASkeleton.vue'
import ALoading from '@components/common/ALoading.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import APagination from '@components/common/APagination.vue'
import ACodeBlock from '@components/common/ACodeBlock.vue'
import ACountUp from '@components/common/ACountUp.vue'
import AInput from '@components/common/AInput.vue'
import ATextarea from '@components/common/ATextarea.vue'
import ASelect from '@components/common/ASelect.vue'
import ARadioGroup from '@components/common/ARadioGroup.vue'
import ACheckbox from '@components/common/ACheckbox.vue'
import ASwitch from '@components/common/ASwitch.vue'
import ASlider from '@components/common/ASlider.vue'
import ATabs from '@components/common/ATabs.vue'
import AModal from '@components/common/AModal.vue'
import ADrawer from '@components/common/ADrawer.vue'
import ATooltip from '@components/common/ATooltip.vue'
import APopover from '@components/common/APopover.vue'
import { useToast } from '@composables/useToast'

// layout
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Stack from '@components/layout/Stack.vue'
import Grid from '@components/layout/Grid.vue'
import PageHero from '@components/layout/PageHero.vue'
import Divider from '@components/layout/Divider.vue'

useSEO({
  title: 'Design System — Aindgc',
  description: 'Aindgc Design System: tokens, components, patterns.',
  noindex: true
})

const toast = useToast()
const demoPage = ref(1)
const demoSize = ref(10)
const demoInput = ref('')
const demoTextarea = ref('Multi-line input example.\n第二行。')
const demoSelect = ref<string>('overview')
const demoSwitch = ref(true)
const demoCheckbox = ref<string[]>(['a'])
const demoRadio = ref<string>('x')
const demoSlider = ref(40)
const modalOpen = ref(false)
const drawerOpen = ref(false)
const activeTab = ref<string | number>('overview')

const colorTokens = [
  { name: '--bg-base',         val: '#07090D', desc: '页面底色' },
  { name: '--bg-elevated',     val: '#0B0E13', desc: '卡片 / Header' },
  { name: '--bg-overlay',      val: '#10141B', desc: 'Modal / Drawer' },
  { name: '--surface-1',       val: '#151A22', desc: '表单输入' },
  { name: '--surface-2',       val: '#1B2230', desc: 'Hover' },
  { name: '--surface-3',       val: '#232C3D', desc: 'Selected' },
  { name: '--text-primary',    val: '#E8ECF2', desc: '主文本' },
  { name: '--text-secondary',  val: '#98A2B3', desc: '副文本' },
  { name: '--text-tertiary',   val: '#6B7280', desc: '提示文本' },
  { name: '--accent-primary',  val: '#6FA8FF', desc: '冷蓝' },
  { name: '--accent-secondary',val: '#8FE3D5', desc: '青光' },
  { name: '--accent-warm',     val: '#F2C18D', desc: '暖白提亮' },
  { name: '--color-success',   val: '#5BB98C', desc: '成功' },
  { name: '--color-warning',   val: '#E5B25D', desc: '警告' },
  { name: '--color-danger',    val: '#E26B6B', desc: '错误' }
]

const spacingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const radiusScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

const sampleCode = `# Role: Sales Outreach Agent
name: sales-outreach

## Purpose
Qualify inbound leads and draft personalized follow-ups.

## Workflow
1. Receive lead (name, company, source)
2. Enrich with public data
3. Score against ICP criteria
4. If score >= 70 → draft personalized email
5. If score < 70 → add to nurture sequence
6. Update CRM with result + next action

## Output
- CRM record (status, score, next_action)
- Email draft (subject, body, send_at)
`

const tabs = [
  { label: 'Overview',     name: 'overview' },
  { label: 'Components',   name: 'components' },
  { label: 'Patterns',     name: 'patterns' }
]
</script>

<template>
  <Container as="article">
    <PageHero
      eyebrow="INTERNAL · v0.1"
      title="Design System"
      subtitle="Aindgc 的设计系统 — 颜色、字体、间距、动效、组件。安静的科技感。"
    >
      <AButton variant="ghost" @click="toast.info('Hello from toast!')">
        <template #icon><AIcon name="bell" /></template>
        Trigger toast
      </AButton>
      <AButton variant="outline" @click="modalOpen = true">Open modal</AButton>
      <AButton variant="outline" @click="drawerOpen = true">Open drawer</AButton>
    </PageHero>

    <ABreadcrumb
      :items="[
        { label: 'Home', to: '/', iconName: 'home' },
        { label: 'Design System' }
      ]"
    />

    <Divider />

    <!-- ============ Color ============ -->
    <Section py="md" id="colors">
      <header class="ds-section-header">
        <h2>Color Tokens</h2>
        <p class="muted">所有颜色用 CSS Variables,可在 <code>design-system/tokens.css</code> 修改。</p>
      </header>
      <Grid :cols="{ sm: 1, md: 2, lg: 3 }" :gap="3">
        <div v-for="t in colorTokens" :key="t.name" class="swatch">
          <div class="swatch-chip" :style="{ background: t.val }" />
          <div class="swatch-meta">
            <code class="swatch-name">{{ t.name }}</code>
            <span class="swatch-val">{{ t.val }}</span>
            <span class="swatch-desc">{{ t.desc }}</span>
          </div>
        </div>
      </Grid>
    </Section>

    <Divider />

    <!-- ============ Typography ============ -->
    <Section py="md" id="typography">
      <header class="ds-section-header">
        <h2>Typography</h2>
        <p class="muted">Inter / Noto Sans SC / JetBrains Mono。Display / Heading / Body / Mono。</p>
      </header>
      <Stack :gap="4">
        <div class="typo-row">
          <span class="typo-label">Display 72</span>
          <span class="typo-sample" style="font-size: var(--fs-display); letter-spacing: var(--letter-tight); font-weight: 600;">Turn AI Into Work.</span>
        </div>
        <div class="typo-row">
          <span class="typo-label">H1 56</span>
          <span style="font-size: var(--fs-h1); font-weight: 600;">Build with intent.</span>
        </div>
        <div class="typo-row">
          <span class="typo-label">H2 42</span>
          <span style="font-size: var(--fs-h2); font-weight: 600;">Design that disappears.</span>
        </div>
        <div class="typo-row">
          <span class="typo-label">H3 32</span>
          <span style="font-size: var(--fs-h3); font-weight: 600;">Tools that ship work.</span>
        </div>
        <div class="typo-row">
          <span class="typo-label">Body 18</span>
          <span style="font-size: var(--fs-body-lg);">每个元素都有用,装饰克制。</span>
        </div>
        <div class="typo-row">
          <span class="typo-label">Body 16</span>
          <span style="font-size: var(--fs-body);">安静的科技感,排版精致的杂志感。</span>
        </div>
        <div class="typo-row">
          <span class="typo-label">Mono 14</span>
          <code style="font-size: var(--fs-body-sm);">const agent = await deploy('aindgc')</code>
        </div>
      </Stack>
    </Section>

    <Divider />

    <!-- ============ Spacing ============ -->
    <Section py="md" id="spacing">
      <header class="ds-section-header">
        <h2>Spacing Scale</h2>
        <p class="muted">8px base,4px micro。常用 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128。</p>
      </header>
      <Stack :gap="3">
        <div v-for="s in spacingScale" :key="s" class="space-row">
          <span class="space-label">--space-{{ s }}</span>
          <span class="space-val">{{ 4 * s }}px</span>
          <span class="space-bar" :style="{ width: `${4 * s}px` }" />
        </div>
      </Stack>
    </Section>

    <Divider />

    <!-- ============ Radius ============ -->
    <Section py="md" id="radius">
      <header class="ds-section-header">
        <h2>Radius</h2>
        <p class="muted">克制使用大圆角,默认 8 / 12 / 16。</p>
      </header>
      <Grid :cols="{ sm: 2, md: 3, lg: 6 }" :gap="3">
        <div v-for="r in radiusScale" :key="r" class="radius-box">
          <div class="radius-chip" :class="`radius-${r}`" />
          <code>--radius-{{ r }}</code>
        </div>
      </Grid>
    </Section>

    <Divider />

    <!-- ============ Components ============ -->
    <Section py="md" id="components">
      <header class="ds-section-header">
        <h2>Components</h2>
        <p class="muted">所有 A* 组件 + Element Plus 深度 override。</p>
      </header>

      <Stack :gap="7">
        <!-- Buttons -->
        <div>
          <h3 class="ds-sub">Buttons</h3>
          <Stack :gap="3" align="center">
            <Stack direction="row" :gap="3" align="center">
              <AButton variant="primary">Primary</AButton>
              <AButton variant="outline">Outline</AButton>
              <AButton variant="ghost">Ghost</AButton>
              <AButton variant="subtle">Subtle</AButton>
              <AButton variant="link">Link</AButton>
              <AButton variant="danger">Danger</AButton>
            </Stack>
            <Stack direction="row" :gap="3" align="center">
              <AButton size="sm">Small</AButton>
              <AButton size="md">Medium</AButton>
              <AButton size="lg">Large</AButton>
              <AButton loading>Loading</AButton>
              <AButton disabled>Disabled</AButton>
              <AButton variant="primary" icon-only aria-label="Add">
                <template #icon><AIcon name="plus" /></template>
              </AButton>
            </Stack>
          </Stack>
        </div>

        <Divider />

        <!-- Tags & Badges -->
        <div>
          <h3 class="ds-sub">Tags & Badges</h3>
          <Stack direction="row" :gap="3" align="center">
            <ATag tone="neutral">Neutral</ATag>
            <ATag tone="primary">Primary</ATag>
            <ATag tone="secondary">Secondary</ATag>
            <ATag tone="success">Success</ATag>
            <ATag tone="warning">Warning</ATag>
            <ATag tone="danger">Danger</ATag>
            <ATag tone="info">Info</ATag>
            <ATag tone="primary" closable @close="toast.info('Closed')">Closable</ATag>
            <ABadge tone="primary" :count="12" />
            <ABadge tone="success" :count="200" :max="99" />
            <ABadge tone="danger" dot />
          </Stack>
        </div>

        <Divider />

        <!-- Avatar & Icon -->
        <div>
          <h3 class="ds-sub">Avatar & Icon</h3>
          <Stack direction="row" :gap="3" align="center">
            <AAvatar name="Aindgc Lab" size="xs" />
            <AAvatar name="Aindgc Lab" size="sm" />
            <AAvatar name="Aindgc Lab" size="md" />
            <AAvatar name="Aindgc Lab" size="lg" />
            <AAvatar name="Aindgc Lab" size="xl" />
            <AAvatar name="Aindgc Lab" size="2xl" shape="square" />
            <AAvatar name="AJ" />
          </Stack>
          <Stack direction="row" :gap="3" align="center" class="mt-4">
            <AIcon name="bot" />
            <AIcon name="workflow" />
            <AIcon name="git-branch" />
            <AIcon name="terminal" />
            <AIcon name="zap" />
            <AIcon name="layers" />
            <AIcon name="cpu" />
            <AIcon name="sparkles" />
          </Stack>
        </div>

        <Divider />

        <!-- Inputs -->
        <div>
          <h3 class="ds-sub">Inputs</h3>
          <Grid :cols="{ sm: 1, md: 2 }" :gap="4">
            <Stack :gap="2">
              <label class="ds-label">Input</label>
              <AInput v-model="demoInput" placeholder="Type something…" prefix-icon="search" clearable block />
            </Stack>
            <Stack :gap="2">
              <label class="ds-label">Select</label>
              <ASelect
                v-model="demoSelect"
                :options="[
                  { label: 'Overview',   value: 'overview' },
                  { label: 'Components', value: 'components' },
                  { label: 'Patterns',   value: 'patterns' }
                ]"
                placeholder="Choose"
                block
              />
            </Stack>
            <Stack :gap="2">
              <label class="ds-label">Textarea</label>
              <ATextarea v-model="demoTextarea" placeholder="Multi-line input" :rows="3" block />
            </Stack>
            <Stack :gap="2">
              <label class="ds-label">Switch / Checkbox / Radio</label>
              <Stack direction="row" :gap="4" align="center">
                <ASwitch v-model="demoSwitch" />
                <ACheckbox v-model="demoCheckbox" :options="[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]" />
                <ARadioGroup v-model="demoRadio" :options="[{ label: 'X', value: 'x' }, { label: 'Y', value: 'y' }]" button-style />
              </Stack>
            </Stack>
            <Stack :gap="2">
              <label class="ds-label">Slider</label>
              <ASlider v-model="demoSlider" :min="0" :max="100" />
            </Stack>
          </Grid>
        </div>

        <Divider />

        <!-- Tabs -->
        <div>
          <h3 class="ds-sub">Tabs</h3>
          <ATabs v-model="activeTab" :tabs="tabs">
            <template #tab-overview>
              <p style="padding: 16px 0; color: var(--text-secondary);">Overview tab content — Quick glance at the system.</p>
            </template>
            <template #tab-components>
              <p style="padding: 16px 0; color: var(--text-secondary);">Components tab — All A* components live here.</p>
            </template>
            <template #tab-patterns>
              <p style="padding: 16px 0; color: var(--text-secondary);">Patterns tab — Recurring compositions.</p>
            </template>
          </ATabs>
        </div>

        <Divider />

        <!-- Cards -->
        <div>
          <h3 class="ds-sub">Cards</h3>
          <Grid :cols="{ sm: 1, md: 3 }" :gap="4">
            <ACard variant="default">
              <template #eyebrow>Default</template>
              <h4>Quiet Technology</h4>
              <p style="color: var(--text-secondary);">安静、不喧宾夺主的视觉。</p>
            </ACard>
            <ACard variant="elevated" hover>
              <template #eyebrow>Elevated + Hover</template>
              <h4>Editorial</h4>
              <p style="color: var(--text-secondary);">像排版精致的科技杂志。</p>
            </ACard>
            <ACard variant="glow" interactive>
              <template #eyebrow>Glow + Interactive</template>
              <h4>Spatial</h4>
              <p style="color: var(--text-secondary);">有呼吸感,大留白。</p>
            </ACard>
          </Grid>
        </div>

        <Divider />

        <!-- Loading / Skeleton / Empty -->
        <div>
          <h3 class="ds-sub">Loading · Skeleton · Empty</h3>
          <Grid :cols="{ sm: 1, md: 3 }" :gap="4">
            <ACard>
              <template #eyebrow>Loading</template>
              <Stack direction="row" :gap="4" align="center">
                <ALoading />
                <ALoading variant="dots" />
                <ALoading variant="pulse" />
                <ALoading text="Loading…" />
              </Stack>
            </ACard>
            <ACard>
              <template #eyebrow>Skeleton</template>
              <Stack :gap="2">
                <ASkeleton variant="text" :rows="3" />
                <ASkeleton variant="rect" width="100%" height="60" />
              </Stack>
            </ACard>
            <ACard>
              <template #eyebrow>Empty</template>
              <AEmpty
                title="Nothing yet"
                description="No items to display."
                icon-name="inbox"
                size="sm"
              >
                <AButton variant="primary" size="sm">Create</AButton>
              </AEmpty>
            </ACard>
          </Grid>
        </div>

        <Divider />

        <!-- CountUp / CodeBlock / Pagination / Tooltip / Popover -->
        <div>
          <h3 class="ds-sub">CountUp</h3>
          <Stack direction="row" :gap="5" align="center">
            <div>
              <span style="font-size: 48px; font-weight: 600; color: var(--accent-primary);">
                <ACountUp :end="42" />
              </span>
              <p class="muted">Tools shipped</p>
            </div>
            <div>
              <span style="font-size: 48px; font-weight: 600; color: var(--accent-secondary);">
                <ACountUp :end="12480" />
              </span>
              <p class="muted">Workflows generated</p>
            </div>
            <div>
              <span style="font-size: 48px; font-weight: 600;">
                <ACountUp :end="98" suffix="%" />
              </span>
              <p class="muted">Uptime</p>
            </div>
          </Stack>
        </div>

        <Divider />

        <div>
          <h3 class="ds-sub">Code Block</h3>
          <ACodeBlock :code="sampleCode" language="markdown" filename="SKILL.md" />
        </div>

        <Divider />

        <div>
          <h3 class="ds-sub">Tooltip · Popover</h3>
          <Stack direction="row" :gap="4" align="center">
            <ATooltip content="This is a tooltip">
              <AButton variant="outline">Hover me</AButton>
            </ATooltip>
            <APopover title="Quick info" content="Popovers display rich content on click.">
              <template #reference>
                <AButton variant="outline">Click me</AButton>
              </template>
            </APopover>
          </Stack>
        </div>

        <Divider />

        <div>
          <h3 class="ds-sub">Pagination</h3>
          <APagination
            v-model:page="demoPage"
            v-model:size="demoSize"
            :total="123"
          />
        </div>
      </Stack>
    </Section>

    <!-- Modal & Drawer are rendered outside Sections to overlay -->
    <AModal v-model="modalOpen" title="Modal title" size="md">
      <p style="color: var(--text-secondary);">Modal body — Keep it minimal.</p>
      <p style="color: var(--text-secondary);">Press ESC or click the close button to dismiss.</p>
      <template #footer>
        <Stack direction="row" :gap="3" justify="end">
          <AButton variant="ghost" @click="modalOpen = false">Cancel</AButton>
          <AButton variant="primary" @click="toast.success('Confirmed')">Confirm</AButton>
        </Stack>
      </template>
    </AModal>

    <ADrawer v-model="drawerOpen" title="Drawer title" placement="right">
      <p style="color: var(--text-secondary);">Drawer body — slide-in from the right.</p>
      <ACodeBlock :code="sampleCode" language="markdown" filename="AGENTS.md" />
    </ADrawer>
  </Container>
</template>

<style scoped>
.ds-section-header {
  margin-bottom: var(--space-5);
}
.ds-section-header h2 {
  font-size: var(--fs-h2);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  margin: 0 0 var(--space-2) 0;
}
.muted {
  color: var(--text-tertiary);
  font-size: var(--fs-body);
}
.ds-sub {
  font-size: var(--fs-h4);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  margin: 0 0 var(--space-3) 0;
}
code {
  font-family: var(--font-mono);
  font-size: 0.92em;
  background: var(--surface-1);
  padding: 1px 6px;
  border-radius: var(--radius-xs);
  color: var(--accent-secondary);
}

/* Color swatches */
.swatch {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.swatch-chip {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
}
.swatch-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.swatch-name {
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  background: transparent;
  color: var(--text-primary);
  padding: 0;
}
.swatch-val {
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
}
.swatch-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
}

/* Typography rows */
.typo-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.typo-label {
  width: 120px;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
}
.typo-sample {
  color: var(--text-primary);
}

/* Spacing rows */
.space-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.space-label {
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  width: 96px;
  color: var(--text-primary);
}
.space-val {
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  width: 56px;
}
.space-bar {
  height: 12px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: var(--radius-xs);
  max-width: 100%;
}

/* Radius */
.radius-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.radius-chip {
  width: 80px;
  height: 80px;
  background: var(--surface-2);
  border: 1px solid var(--accent-primary);
}
.radius-xs { border-radius: var(--radius-xs); }
.radius-sm { border-radius: var(--radius-sm); }
.radius-md { border-radius: var(--radius-md); }
.radius-lg { border-radius: var(--radius-lg); }
.radius-xl { border-radius: var(--radius-xl); }
.radius-2xl { border-radius: var(--radius-2xl); }

/* Form */
.ds-label {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.mt-4 { margin-top: var(--space-4); }
</style>
