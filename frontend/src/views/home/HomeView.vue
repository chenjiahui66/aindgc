<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSEO } from '@composables/useSEO'
import { useJsonLd, SITE_URL } from '@composables/useJsonLd'

import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Stack from '@components/layout/Stack.vue'
import Grid from '@components/layout/Grid.vue'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import ATag from '@components/common/ATag.vue'
import RevealOnScroll from '@components/animation/RevealOnScroll.vue'

import HeroWorkflowVisualizer from '@components/home/HeroWorkflowVisualizer.vue'
import CapabilityMap from '@components/home/CapabilityMap.vue'
import ToolCard from '@components/home/ToolCard.vue'
import WorkflowStory from '@components/home/WorkflowStory.vue'
import RoiPreview from '@components/home/RoiPreview.vue'
import CheckupPreview from '@components/home/CheckupPreview.vue'
import CaseCard from '@components/home/CaseCard.vue'
import ArticleCard from '@components/home/ArticleCard.vue'

useSEO({
  title: 'Aindgc — AI Product Lab',
  description: 'Turn AI Into Work. 让 AI 真正开始工作。AI Workflow、Agent、ROI 计算器、AI Coding 项目、Skill 生成器 — 全部免费可用。',
  keywords: 'AI, AI Agent, AI Workflow, Claude Code, Codex, Cursor, ROI, AI Lab, Automation',
  ogTitle: 'Aindgc — Turn AI Into Work',
  ogDescription: '把 AI 真正变成可以执行的工作。',
  ogType: 'website'
})

// JSON-LD: WebSite + Organization
useJsonLd('site', [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Aindgc',
    'alternateName': 'Aindgc AI Product Lab',
    'url': SITE_URL,
    'description': 'Turn AI Into Work. AI Workflow、Agent、ROI、AI Coding — a working AI product lab.',
    'inLanguage': ['en', 'zh-CN'],
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${SITE_URL}/insights?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Aindgc',
    'url': SITE_URL,
    'logo': `${SITE_URL}/favicon.svg`,
    'description': 'Premium AI product lab. Workflow / Agent / Skills / Coding / Context / Prompt / Schema generators, ROI calculator, AI readiness checkup.',
    'sameAs': [
      'https://github.com/aindgc'
    ]
  }
])

const tools = [
  {
    slug: 'agent-workflow-generator',
    name: 'Agent Workflow Generator',
    tagline: '把工作流变成 AI 可执行的结构',
    description: '输入目标和上下文,自动生成标准化的 AI Workflow 定义(JSON / Markdown)。',
    iconName: 'workflow',
    tags: ['Workflow', 'Agent', 'Free'],
    to: '/tools/agent-workflow-generator'
  },
  {
    slug: 'agent-skills-generator',
    name: 'Agent Skills Generator',
    tagline: '为 Claude Code / Codex 生成 SKILL.md',
    description: '输入角色与目标,生成符合规范的 Agent Skill,可直接投入生产。',
    iconName: 'sparkles',
    tags: ['SKILL.md', 'Claude Code'],
    to: '/tools/agent-skills-generator'
  },
  {
    slug: 'roi',
    name: 'AI ROI Calculator',
    tagline: '估算 AI 自动化的成本与收益',
    description: '基于员工数、工资、重复工作时间,得到保守的 ROI 估算(标注 Simulation)。',
    iconName: 'trending-up',
    tags: ['Business', 'ROI'],
    to: '/roi'
  },
  {
    slug: 'checkup',
    name: 'AI Work Checkup',
    tagline: '6 步评估 AI 准备度与机会',
    description: '完成问卷得到 AI Readiness Score + Top 5 AI 自动化机会。',
    iconName: 'check-circle',
    tags: ['Checkup', 'Free'],
    to: '/checkup'
  },
  {
    slug: 'context-builder',
    name: 'AI Context Builder',
    tagline: '把零散信息变成结构化 Context',
    description: '用模板生成可复用的 Context 包,提升 AI 输出稳定性。',
    iconName: 'box',
    tags: ['Context', 'Free'],
    to: '/tools/context-builder'
  },
  {
    slug: 'coding-project-starter',
    name: 'AI Coding Project Starter',
    tagline: '生成可直接跑的项目骨架',
    description: '为 Claude Code / Codex / Cursor 生成 AGENTS.md + 完整目录结构。',
    iconName: 'terminal',
    tags: ['Claude Code', 'Codex'],
    to: '/tools/coding-project-starter'
  }
]

const businesses = [
  { label: 'Sales',           desc: '线索分级 · 自动跟进',     icon: 'phone' },
  { label: 'Customer Service',desc: '工单分类 · 自动回复',     icon: 'headphones' },
  { label: 'Marketing',       desc: '内容生成 · 受众分析',     icon: 'megaphone' },
  { label: 'Operations',      desc: '流程自动化 · 报表',       icon: 'settings' },
  { label: 'Knowledge Base',  desc: '知识检索 · 内部问答',     icon: 'book-open' },
  { label: 'Data Analysis',   desc: '指标解读 · 异常检测',     icon: 'bar-chart' },
  { label: 'Internal Automation', desc: '重复任务 · 自动化',    icon: 'cog' }
]

const cases = [
  {
    slug: 'ai-workbench',
    title: 'AI Workbench — 把工作变成可执行的工作流',
    summary: '把"我想让 AI 帮我做 X"翻译成 ROLE / TASK / WORKFLOW / CHECKLIST 的完整工作包。',
    type: 'REAL' as const,
    technologies: ['Vue 3', 'Rule Engine', 'JSON Schema'],
    cover: 'wb'
  },
  {
    slug: 'agent-skills-marketplace-concept',
    title: 'Agent Skills Marketplace (概念)',
    summary: '为 Claude Code / Codex / Cursor 构建可发现、可版本化的 SKILL.md 市场。',
    type: 'CONCEPT' as const,
    technologies: ['Claude Code', 'MCP', 'Marketplace'],
    cover: 'sm'
  },
  {
    slug: 'multi-agent-workflow-poc',
    title: 'Multi-Agent Workflow PoC',
    summary: '在 Vue Flow 上构建一个 6 节点的多 Agent 协作流,验证可视化 + JSON 导出。',
    type: 'PROTOTYPE' as const,
    technologies: ['Vue Flow', 'Multi-Agent', 'Dify'],
    cover: 'mw'
  }
]

const insights = [
  {
    slug: 'ai-agent-vs-workflow',
    title: 'AI Agent 和 AI Workflow,到底什么关系?',
    summary: '从产品角度拆解 Agent 和 Workflow 的本质区别与组合方式。',
    category: 'AI Agent',
    readMinutes: 6,
    publishedAt: '2026-09'
  },
  {
    slug: 'claude-code-as-product',
    title: '把 Claude Code 当作产品,而不是工具',
    summary: '为什么 CLI 形式的 AI Coding 工具会成为下一个 Native IDE。',
    category: 'AI Coding',
    readMinutes: 8,
    publishedAt: '2026-09'
  },
  {
    slug: 'real-ai-roi',
    title: '真实的 AI ROI:不是替代,而是放大',
    summary: '从实际案例看,AI 在企业里最先产生回报的从来不是"自动化"。',
    category: 'AI Business',
    readMinutes: 7,
    publishedAt: '2026-08'
  }
]
</script>

<template>
  <main>
    <!-- ========== SECTION 01 · HERO ========== -->
    <Section py="xl" id="hero">
      <Container>
        <div class="hero-grid">
          <RevealOnScroll class="hero-text" :duration="700">
            <p class="eyebrow">AI Product Lab · est. 2026</p>
            <h1 class="display">
              Turn AI <span class="accent">Into Work.</span>
            </h1>
            <p class="sub-zh">让 AI 真正开始工作。</p>
            <p class="sub-en">
              从一个想法,到一个可以执行的 AI 工作流。
              <br />
              Explore. Build. Automate.
            </p>
            <div class="cta-row">
              <AButton variant="primary" size="lg">
                <RouterLink to="/tools" class="cta-link">Explore AI Tools</RouterLink>
              </AButton>
              <AButton variant="outline" size="lg">
                <RouterLink to="/workbench" class="cta-link">Start Building</RouterLink>
              </AButton>
            </div>
            <p class="hero-meta">No signup · No credit card · Open architecture</p>
          </RevealOnScroll>

          <RevealOnScroll :delay="200" :duration="800" class="hero-viz">
            <HeroWorkflowVisualizer />
          </RevealOnScroll>
        </div>
      </Container>
    </Section>

    <!-- ========== SECTION 02 · CAPABILITY MAP ========== -->
    <Section py="xl" id="capabilities" bg="elevated">
      <Container>
        <RevealOnScroll>
          <header class="section-head">
            <p class="eyebrow">CAPABILITIES</p>
            <h2>Six capabilities. One platform.</h2>
            <p class="section-sub">从对话到执行,AI 在这里被设计成可运行的系统。</p>
          </header>
        </RevealOnScroll>
        <RevealOnScroll :delay="200" :duration="800">
          <CapabilityMap />
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- ========== SECTION 03 · FEATURED TOOLS ========== -->
    <Section py="xl" id="tools">
      <Container>
        <RevealOnScroll>
          <header class="section-head">
            <p class="eyebrow">FEATURED TOOLS</p>
            <h2>Tools that ship work.</h2>
            <p class="section-sub">不只是生成,是产出可用的工作包。</p>
          </header>
        </RevealOnScroll>
        <Grid :cols="{ sm: 1, md: 2, lg: 3 }" :gap="4">
          <RevealOnScroll
            v-for="(tool, idx) in tools"
            :key="tool.slug"
            :delay="idx * 60"
            :duration="500"
            :y="20"
          >
            <ToolCard :tool="tool" :index="idx" />
          </RevealOnScroll>
        </Grid>
      </Container>
    </Section>

    <!-- ========== SECTION 04 · WORKFLOW STORY ========== -->
    <Section py="xl" id="workflow" bg="elevated">
      <Container>
        <RevealOnScroll>
          <header class="section-head">
            <p class="eyebrow">FROM SIGNAL TO OUTCOME</p>
            <h2>From signal to outcome.</h2>
            <p class="section-sub">把一个工作,变成 AI 可以执行的流程。</p>
          </header>
        </RevealOnScroll>
        <RevealOnScroll :delay="200">
          <WorkflowStory />
        </RevealOnScroll>
        <RevealOnScroll :delay="300" class="section-cta">
          <RouterLink to="/workflow" class="cta-link">
            <AButton variant="ghost">See Workflow Examples <AIcon name="arrow-right" :size="14" /></AButton>
          </RouterLink>
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- ========== SECTION 05 · FOR BUSINESS ========== -->
    <Section py="xl" id="business">
      <Container>
        <RevealOnScroll>
          <header class="section-head">
            <p class="eyebrow">FOR BUSINESS</p>
            <h2>Where can AI actually work?</h2>
            <p class="section-sub">哪些环节,真正适合 AI 化?</p>
          </header>
        </RevealOnScroll>
        <Grid :cols="{ sm: 2, md: 3, lg: 4 }" :gap="3">
          <RevealOnScroll
            v-for="(b, idx) in businesses"
            :key="b.label"
            :delay="idx * 40"
            :y="12"
          >
            <div class="biz-card">
              <div class="biz-icon"><AIcon :name="b.icon" :size="22" /></div>
              <h4>{{ b.label }}</h4>
              <p>{{ b.desc }}</p>
              <AIcon name="arrow-up-right" :size="16" class="biz-arrow" />
            </div>
          </RevealOnScroll>
        </Grid>
      </Container>
    </Section>

    <!-- ========== SECTION 06 · ROI PREVIEW ========== -->
    <Section py="xl" id="roi" bg="elevated">
      <Container>
        <RevealOnScroll>
          <header class="section-head">
            <p class="eyebrow">ROI · SIMULATION</p>
            <h2>Discover your AI opportunity.</h2>
            <p class="section-sub">输入数据,实时看到 AI 自动化的潜在收益 — 全部为估算值。</p>
          </header>
        </RevealOnScroll>
        <RevealOnScroll :delay="200">
          <RoiPreview />
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- ========== SECTION 07 · CHECKUP PREVIEW ========== -->
    <Section py="xl" id="checkup">
      <Container>
        <RevealOnScroll>
          <header class="section-head">
            <p class="eyebrow">AI CHECKUP</p>
            <h2>How AI-ready is your work?</h2>
            <p class="section-sub">6 步问卷,得到 AI Readiness Score + Top 5 自动化机会。</p>
          </header>
        </RevealOnScroll>
        <RevealOnScroll :delay="200">
          <CheckupPreview />
        </RevealOnScroll>
      </Container>
    </Section>

    <!-- ========== SECTION 08 · CASES ========== -->
    <Section py="xl" id="cases" bg="elevated">
      <Container>
        <RevealOnScroll>
          <header class="section-head between">
            <div>
              <p class="eyebrow">CASES</p>
              <h2>Things I've built.</h2>
              <p class="section-sub">真实项目 · 实验 · 原型 · 概念 — 明确区分,不夸大。</p>
            </div>
            <RouterLink to="/cases" class="see-all">
              All cases <AIcon name="arrow-right" :size="14" />
            </RouterLink>
          </header>
        </RevealOnScroll>
        <Stack :gap="4">
          <RevealOnScroll v-for="(c, idx) in cases" :key="c.slug" :delay="idx * 80">
            <CaseCard :item="c" :index="idx" />
          </RevealOnScroll>
        </Stack>
      </Container>
    </Section>

    <!-- ========== SECTION 09 · INSIGHTS ========== -->
    <Section py="xl" id="insights">
      <Container>
        <RevealOnScroll>
          <header class="section-head between">
            <div>
              <p class="eyebrow">INSIGHTS</p>
              <h2>What I'm learning.</h2>
              <p class="section-sub">AI 观察 · 思考 · 实验笔记。</p>
            </div>
            <RouterLink to="/insights" class="see-all">
              All insights <AIcon name="arrow-right" :size="14" />
            </RouterLink>
          </header>
        </RevealOnScroll>
        <Grid :cols="{ sm: 1, md: 3 }" :gap="4">
          <RevealOnScroll v-for="(a, idx) in insights" :key="a.slug" :delay="idx * 80">
            <ArticleCard :article="a" :variant="idx === 0 ? 'feature' : 'regular'" />
          </RevealOnScroll>
        </Grid>
      </Container>
    </Section>
  </main>
</template>

<style scoped>
main { display: block; }

/* ============== HERO ============== */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-7);
  align-items: center;
}
.hero-text { max-width: 640px; }
.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  margin: 0 0 var(--space-4) 0;
}
.display {
  font-size: var(--fs-display);
  font-weight: 600;
  line-height: var(--lh-tight);
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}
.display .accent {
  background: linear-gradient(120deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.sub-zh {
  margin: var(--space-4) 0 0 0;
  font-size: var(--fs-h4);
  color: var(--text-secondary);
  font-weight: 400;
}
.sub-en {
  margin: var(--space-2) 0 0 0;
  font-size: var(--fs-body-lg);
  color: var(--text-tertiary);
}
.cta-row {
  margin-top: var(--space-6);
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.cta-link { color: inherit; text-decoration: none; }
.hero-meta {
  margin: var(--space-5) 0 0 0;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.02em;
}

@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; gap: var(--space-7); }
  .hero-text { max-width: none; }
}

/* ============== SECTION HEAD ============== */
.section-head {
  margin-bottom: var(--space-7);
}
.section-head h2 {
  font-size: var(--fs-h2);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  line-height: var(--lh-tight);
  color: var(--text-primary);
  margin: 0 0 var(--space-3) 0;
}
.section-head .eyebrow {
  margin-bottom: var(--space-3);
}
.section-sub {
  font-size: var(--fs-body-lg);
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0;
}
.section-head.between {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.see-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}
.see-all:hover { color: var(--accent-primary); }

.section-cta {
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
}

/* ============== BUSINESS ============== */
.biz-card {
  position: relative;
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition:
    border-color var(--duration-base) var(--ease-standard),
    background var(--duration-base) var(--ease-standard);
}
.biz-card:hover {
  border-color: var(--border-default);
  background: var(--bg-overlay);
}
.biz-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--accent-primary);
  margin-bottom: var(--space-2);
}
.biz-card h4 {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.biz-card p {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 0;
  flex: 1;
}
.biz-arrow {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}
.biz-card:hover .biz-arrow {
  color: var(--accent-primary);
  transform: translate(2px, -2px);
}
</style>
