import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { i18n, type Locale } from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@views/home/HomeView.vue'),
    meta: {
      title: 'Aindgc — AI Product Lab',
      titleZh: 'Aindgc — AI 产品实验室',
      description: 'Turn AI Into Work. AI workflows, agents, skills, coding, ROI — all free.'
    }
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@views/tools/ToolsIndexView.vue'),
    meta: {
      title: 'AI Tools — Aindgc',
      titleZh: 'AI 工具 — Aindgc',
      description: 'Six AI productivity generators — Agent Workflow, Skills, Context Builder, Coding Starter, Prompt Builder, Output Schema.'
    }
  },
  {
    path: '/tools/agent-workflow-generator',
    name: 'tool-agent-workflow',
    component: () => import('@views/tools/AgentWorkflowGenerator.vue'),
    meta: {
      title: 'AI Agent Workflow Generator — Aindgc',
      description: '把工作流拆成 AI 可执行的结构。生成标准化的 AI Workflow 定义。'
    }
  },
  {
    path: '/tools/agent-skills-generator',
    name: 'tool-agent-skills',
    component: () => import('@views/tools/AgentSkillsGenerator.vue'),
    meta: {
      title: 'Agent Skills Generator — Aindgc',
      description: '为 Claude Code / Codex / Cursor / Gemini CLI 生成 SKILL.md。'
    }
  },
  {
    path: '/tools/context-builder',
    name: 'tool-context',
    component: () => import('@views/tools/ContextBuilder.vue'),
    meta: {
      title: 'AI Context Builder — Aindgc',
      description: '把零散信息变成结构化 Context 包。'
    }
  },
  {
    path: '/tools/coding-project-starter',
    name: 'tool-coding',
    component: () => import('@views/tools/CodingProjectStarter.vue'),
    meta: {
      title: 'AI Coding Project Starter — Aindgc',
      description: '为 Claude Code / Codex / Cursor 生成完整 AI Coding 项目启动包。'
    }
  },
  {
    path: '/tools/prompt-structure-builder',
    name: 'tool-prompt',
    component: () => import('@views/tools/PromptStructureBuilder.vue'),
    meta: {
      title: 'Prompt Structure Builder — Aindgc',
      description: '把模糊任务变成结构化 Prompt。'
    }
  },
  {
    path: '/tools/output-schema-generator',
    name: 'tool-output-schema',
    component: () => import('@views/tools/OutputSchemaGenerator.vue'),
    meta: {
      title: 'Output Schema Generator — Aindgc',
      description: '定义 AI 输出的契约:JSON Schema + TypeScript types。'
    }
  },
  {
    path: '/design-system',
    name: 'design-system',
    component: () => import('@views/design/DesignSystemView.vue'),
    meta: {
      title: 'Design System — Aindgc',
      description: 'Aindgc Design System: tokens, components, patterns.',
      noindex: true
    }
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: () => import('@views/workflow/WorkflowListView.vue'),
    meta: {
      title: 'AI Workflow Builder — Aindgc',
      titleZh: 'AI 工作流编辑器 — Aindgc',
      description: 'Visual AI workflow builder. Trigger / AI / Condition / Tool / Action / Output nodes, drag-edit, export Markdown & JSON.'
    }
  },
  {
    path: '/workflow/builder',
    name: 'workflow-builder',
    component: () => import('@views/workflow/WorkflowBuilderView.vue'),
    meta: {
      title: 'Workflow Builder — Aindgc',
      description: 'Build and edit AI workflows visually.',
      noindex: true
    }
  },
  {
    path: '/roi',
    name: 'roi',
    component: () => import('@views/roi/RoiView.vue'),
    meta: {
      title: 'AI ROI Calculator — Aindgc',
      titleZh: 'AI ROI 计算器 — Aindgc',
      description: 'Free AI ROI calculator. Estimate automation savings. Results labeled "Simulation".'
    }
  },
  {
    path: '/checkup',
    name: 'checkup',
    component: () => import('@views/checkup/CheckupView.vue'),
    meta: {
      title: 'AI Work Checkup — Aindgc',
      titleZh: 'AI 工作体检 — Aindgc',
      description: 'Free AI readiness assessment. 6-step questionnaire → AI Readiness Score + Top 5 automation opportunities.'
    }
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('@views/skills/SkillsIndexView.vue'),
    meta: {
      title: 'Skills Marketplace — Aindgc',
      titleZh: 'Skills 市场 — Aindgc',
      description: 'Curated SKILL.md packs for Claude Code / Codex / Cursor / Gemini CLI.'
    }
  },
  {
    path: '/coding',
    name: 'coding',
    component: () => import('@views/coding/CodingTemplatesView.vue'),
    meta: {
      title: 'Coding Templates — Aindgc',
      titleZh: 'Coding 模板 — Aindgc',
      description: 'Curated AI coding project starters: Vue / React / Spring Boot / FastAPI / Next.js / Flutter / Nginx. Includes AGENTS.md and key files.'
    }
  },
  {
    path: '/cases',
    name: 'cases',
    component: () => import('@views/cases/CasesIndexView.vue'),
    meta: {
      title: 'Cases — Aindgc',
      titleZh: '项目案例 — Aindgc',
      description: 'AI case studies: real projects, prototypes, experiments, concepts. Problem / Approach / Architecture / Implementation / Result / Lessons.'
    }
  },
  {
    path: '/cases/:slug',
    name: 'case-detail',
    component: () => import('@views/cases/CaseDetailView.vue'),
    meta: {
      title: 'Case Study — Aindgc',
      titleZh: '案例详情 — Aindgc',
      description: 'Aindgc case study'
    }
  },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('@views/insights/InsightsIndexView.vue'),
    meta: {
      title: 'Insights — Aindgc',
      titleZh: '行业洞察 — Aindgc',
      description: 'AI industry observations, thinking, experiment notes — Agent, Workflow, Coding, Business, Productivity.'
    }
  },
  {
    path: '/insights/:slug',
    name: 'article-detail',
    component: () => import('@views/insights/ArticleDetailView.vue'),
    meta: {
      title: 'Article — Aindgc',
      titleZh: '文章 — Aindgc',
      description: 'Aindgc insights'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@views/auth/LoginView.vue'),
    meta: { title: 'Sign in — Aindgc', titleZh: '登录 — Aindgc', description: 'Sign in to your Aindgc account.', noindex: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@views/auth/RegisterView.vue'),
    meta: { title: 'Create account — Aindgc', titleZh: '注册 — Aindgc', description: 'Create a free Aindgc account.', noindex: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@views/auth/ProfileView.vue'),
    meta: { title: 'Profile — Aindgc', noindex: true, requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('@views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, noindex: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@views/admin/DashboardView.vue'), meta: { title: 'Admin Dashboard — Aindgc' } },
      { path: 'articles', name: 'admin-articles', component: () => import('@views/admin/ArticlesAdminView.vue'), meta: { title: 'Articles — Admin' } },
      { path: 'cases', name: 'admin-cases', component: () => import('@views/admin/CasesAdminView.vue'), meta: { title: 'Cases — Admin' } },
      { path: 'tools', name: 'admin-tools', component: () => import('@views/admin/ToolsAdminView.vue'), meta: { title: 'Tools — Admin' } },
      { path: 'users', name: 'admin-users', component: () => import('@views/admin/UsersAdminView.vue'), meta: { title: 'Users — Admin' } },
      { path: 'settings', name: 'admin-settings', component: () => import('@views/admin/SettingsAdminView.vue'), meta: { title: 'Settings — Admin' } }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@views/error/NotFoundView.vue'),
    meta: { title: 'Not Found — Aindgc', titleZh: '页面未找到 — Aindgc' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_BASE ? '/' : '/'),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// Auth guard
router.beforeEach((to) => {
  const meta = to.meta as { requiresAuth?: boolean; requiresAdmin?: boolean }
  const token = localStorage.getItem('aindgc_token')
  const userJson = localStorage.getItem('aindgc_user')
  const user = userJson ? safeParse(userJson) : null

  if (meta.requiresAuth && !token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (meta.requiresAdmin && (!user || user.role !== 'ADMIN')) {
    return { path: '/' }
  }
})

function safeParse(s: string): { role?: string } | null {
  try { return JSON.parse(s) } catch { return null }
}

/**
 * Resolve route title/description for current locale.
 * Convention:
 *   meta.title       — English/default title (required)
 *   meta.titleZh     — Chinese title (optional)
 *   meta.description — English description
 *   meta.descriptionZh — Chinese description (optional)
 */
function resolveLocaleMeta(meta: Record<string, unknown>) {
  const locale = (i18n.global.locale.value as Locale) || 'zh'
  const titleKey = locale === 'zh' ? 'titleZh' : 'title'
  const descKey = locale === 'zh' ? 'descriptionZh' : 'description'
  return {
    title: (meta[titleKey] as string) ?? (meta.title as string | undefined),
    description: (meta[descKey] as string) ?? (meta.description as string | undefined)
  }
}

function applyMeta(to: { meta: Record<string, unknown> }) {
  const { title, description } = resolveLocaleMeta(to.meta)
  if (title) document.title = title
  if (description) {
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', description)
  }
  if (to.meta.noindex) {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex,nofollow')
  }
}

router.afterEach((to) => applyMeta(to))

// Re-apply current route's meta on locale change (titles, descriptions, html lang)
i18n.global.locale.subscribe(() => {
  applyMeta(router.currentRoute.value)
})

export default router
