import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@views/home/HomeView.vue'),
    meta: {
      title: 'Aindgc — AI Product Lab',
      description: 'Turn AI Into Work. 让 AI 真正开始工作。AI Workflow、Agent、ROI、AI 项目作品集。'
    }
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@views/tools/ToolsIndexView.vue'),
    meta: {
      title: 'AI Tools — Aindgc',
      description: 'AI 工具集合:Agent Workflow、Skills Generator、Context Builder、Coding Starter、Prompt Builder、Output Schema。'
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
      description: '可视化构建 AI 工作流。Trigger / AI / Condition / Tool / Action / Output 节点,拖拽编辑,导出 Markdown 和 JSON。'
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
      description: '免费 AI ROI 计算器:输入员工数、工资、重复工作时间,得到估算的 AI 自动化潜力与年度节省。所有结果标注 Simulation。'
    }
  },
  {
    path: '/checkup',
    name: 'checkup',
    component: () => import('@views/checkup/CheckupView.vue'),
    meta: {
      title: 'AI Work Checkup — Aindgc',
      description: '免费 AI 准备度评估:6 步问卷 → AI Readiness Score + Top 5 自动化机会。'
    }
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('@views/skills/SkillsIndexView.vue'),
    meta: {
      title: 'Skills Marketplace — Aindgc',
      description: 'Curated SKILL.md packs for Claude Code / Codex / Cursor / Gemini CLI.'
    }
  },
  {
    path: '/coding',
    name: 'coding',
    component: () => import('@views/coding/CodingTemplatesView.vue'),
    meta: {
      title: 'Coding Templates — Aindgc',
      description: 'Curated AI coding project starters: Vue / React / Spring Boot / FastAPI / Next.js / Flutter / Nginx. Includes AGENTS.md and key files.'
    }
  },
  {
    path: '/cases',
    name: 'cases',
    component: () => import('@views/cases/CasesIndexView.vue'),
    meta: {
      title: 'Cases — Aindgc',
      description: 'AI 项目案例集:真实项目、原型、实验、概念。Problem / Approach / Architecture / Implementation / Result / What I Learned。'
    }
  },
  {
    path: '/cases/:slug',
    name: 'case-detail',
    component: () => import('@views/cases/CaseDetailView.vue'),
    meta: {
      title: 'Case Study — Aindgc',
      description: 'Aindgc case study'
    }
  },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('@views/insights/InsightsIndexView.vue'),
    meta: {
      title: 'Insights — Aindgc',
      description: 'AI 行业观察、思考、实验笔记。Agent、Workflow、Coding、Business、Productivity。'
    }
  },
  {
    path: '/insights/:slug',
    name: 'article-detail',
    component: () => import('@views/insights/ArticleDetailView.vue'),
    meta: {
      title: 'Article — Aindgc',
      description: 'Aindgc insights'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@views/auth/LoginView.vue'),
    meta: { title: 'Sign in — Aindgc', description: 'Sign in to your Aindgc account.', noindex: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@views/auth/RegisterView.vue'),
    meta: { title: 'Create account — Aindgc', description: 'Create a free Aindgc account.', noindex: true }
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
    meta: { title: 'Not Found — Aindgc' }
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

router.afterEach((to) => {
  const meta = to.meta as { title?: string; description?: string; noindex?: boolean }
  if (meta.title) {
    document.title = meta.title
  }
  if (meta.description) {
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', meta.description)
  }
  if (meta.noindex) {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex,nofollow')
  }
})

export default router
