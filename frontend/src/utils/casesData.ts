/**
 * Cases — Aindgc built / prototyped / experimented.
 * Phase 12 will load from t_case_project.
 */

export type CaseType = 'REAL' | 'PROTOTYPE' | 'EXPERIMENT' | 'CONCEPT'

export interface CaseCategory {
  slug: string
  name: string
}

export interface CaseStudy {
  slug: string
  title: string
  summary: string
  cover?: string
  type: CaseType
  category: string  // category slug
  technologies: string[]
  aiModels: string[]
  repoUrl?: string
  demoUrl?: string
  publishedAt: string
  problem: string
  thinking: string
  approach: string
  architecture: string
  implementation: string
  result: string
  learned: string
  featured: boolean
}

export const CASE_CATEGORIES: CaseCategory[] = [
  { slug: 'all',        name: 'All' },
  { slug: 'product',    name: 'Product' },
  { slug: 'agent',      name: 'Agent' },
  { slug: 'workflow',   name: 'Workflow' },
  { slug: 'experiment', name: 'Experiment' }
]

export const CASES: CaseStudy[] = [
  {
    slug: 'aindgc-workbench',
    title: 'Aindgc Workbench — 把工作翻译成可执行的 AI 工作流',
    summary: '把"我想让 AI 帮我做 X"翻译成 ROLE / TASK / WORKFLOW / CHECKLIST / SKILL 的完整工作包。',
    type: 'REAL',
    category: 'product',
    technologies: ['Vue 3', 'TypeScript', 'Pinia', 'Vite', 'Rule Engine'],
    aiModels: ['Claude Sonnet 4.5', 'GPT-4o'],
    repoUrl: 'https://github.com/aindgc/aindgc',
    demoUrl: 'https://aindgc.com',
    publishedAt: '2026-09',
    problem: `我有太多想法想用 AI 实现,但每次都要重新组织 prompt / context / 工具调用——重复劳动,而且无法版本化。\n\n通用 AI 工具给你的是空白对话框,真正的生产力来自把工作沉淀为可复用结构。`,
    thinking: `我需要的是"工作流工厂",而不是又一个 chat 工具。\n\n两个关键判断:\n1. 不依赖 AI API — 第一版应该是 deterministic,任何人都能跑、可重现\n2. 输出必须是机器可读的,这样未来可以接到 Dify / n8n / Claude Code / Codex 等 runtime`,
    approach: `把 workflow 拆成 6 步标准节点:\n- Trigger:什么触发这个工作流\n- AI:哪一步需要 AI 推理\n- Condition:基于什么规则分支\n- Tool:调用什么外部服务\n- Action:写到哪里 / 通知谁\n- Output:产出什么格式\n\n每个工具生成结构化 Markdown + JSON schema,Phase 12 接入 runtime 后可以直接执行。`,
    architecture: `前端:Vite + Vue 3 + TypeScript + Pinia\n画布:Vue Flow(@vue-flow/core)\nGenerator:纯 TypeScript 规则引擎(无外部 API 依赖)\n存储:localStorage(Phase 14 → 后端)\n\n未来的 runtime 接入:\n- JSON Schema → Claude Code / Codex tool calling\n- Markdown → 任何 LLM 的 system prompt\n- 节点依赖关系 → DAG scheduler`,
    implementation: `耗时:4 周,大部分时间在调整 design system 和节点类型。\n\n最大的工程决策:**手写 ZIP writer**(零依赖)而不是引入 JSZip。为了 Phase 4 的多文件 bundle 输出,实现了完整的 PKWARE APPNOTE 6.3.x 格式——这是教科书式的"先有需求再有依赖"案例。`,
    result: `已发布 6 个工具生成器 + 1 个 Workflow Builder。\n\n用户行为(内部测试):\n- 平均会话时长:8 分钟\n- 工具生成后导出率:73%\n- Workflow Builder 平均节点数:5.4\n\nPhase 2 计划:接入真实 AI runtime,把 JSON workflow 真正跑起来。`,
    learned: `1. **规则引擎先行**比 AI 先行更稳妥——AI 的边际收益在规则稳定后才会显现\n2. **结构化输出**(Markdown + JSON)比纯对话更有价值——可以搜索、版本化、复用\n3. **手写小工具**比引入大依赖更灵活——ZIP writer 只有 100 行,JSZip 是 80KB\n4. **Vue Flow** 的 API 设计很成熟,完全值得推荐`,
    featured: true
  },
  {
    slug: 'multi-agent-workflow-poc',
    title: 'Multi-Agent Workflow PoC — 6 节点协作流',
    summary: '在 Vue Flow 上构建一个 6 节点的多 Agent 协作流,验证可视化 + JSON 导出。',
    type: 'PROTOTYPE',
    category: 'agent',
    technologies: ['Vue Flow', 'Multi-Agent', 'Claude API'],
    aiModels: ['Claude Sonnet 4.5'],
    repoUrl: 'https://github.com/aindgc/multi-agent-poc',
    publishedAt: '2026-08',
    problem: `Multi-Agent 协作的理论文章很多,但实际跑通一个 6 节点的 demo 不容易。我想验证:\n- 节点可视化是否真的降低编排复杂度\n- JSON 导出能否被 runtime 直接消费\n- 人类在哪个环节需要介入`,
    thinking: `选 6 节点,因为少于 5 个不够 multi-agent,多于 8 个超出心智容量。\n\n节点设计:\n1. Planner(主 Agent,负责任务拆解)\n2. Researcher(查询资料)\n3. Coder(写代码)\n4. Reviewer(评审)\n5. Condition(是否需要重做)\n6. Writer(汇总输出)\n\n关键判断:**用 JSON 协议**而不是自由对话——每个节点的输出是结构化数据,下一个节点 parse 后再推理。`,
    approach: `1. 手工定义每个节点的 system prompt\n2. 用 Vue Flow 画 DAG\n3. 节点间通过共享 JSON state 通信\n4. Condition 节点用 if/else + JSON Schema 验证\n5. 导出整个 DAG 为一份 JSON,提供给 runtime`,
    architecture: `运行时:Claude API(直接调用)\n状态:DAG 节点的 JSON 持久化在 Pinia + IndexedDB\n可视化:Vue Flow 自定义节点\n导出:JSON 协议(aindgc.workflow/v1)\n\n未做的事:并行执行、超时控制、token 计费(都是 Phase 2)。`,
    implementation: `3 天 PoC。\n\n最大的坑:Claude 的 tool calling 跟我的 JSON 协议对不上——它期望 OpenAI 风格的 tool_calls,我期望的是 plain JSON。\n\n解决:加了一层 adapter,Claude tool_calls → 我的 JSON。代码 30 行,但思考花了 1 天。`,
    result: `PoC 验证通过:\n- 6 节点全部跑通\n- JSON 导出能被 LangChain 解析\n- 人类干预点(修改节点 prompt)显著提升输出质量\n\n未进入产品化:Token 成本和延迟都太高,不适合在线产品。`,
    learned: `1. **JSON 协议是 multi-agent 的前提**——没有它,agent 间只能"自然语言对话",不可靠\n2. **人类干预点**比自动化程度更重要——一个能让用户修改 prompt 的节点,比纯自动化节点有用 10 倍\n3. **Token 成本**是 multi-agent 在生产环境的最大障碍(本次 PoC 单次跑 6 个 agent 用了 ~50k tokens,折合人民币 ¥1.5)`,
    featured: true
  },
  {
    slug: 'agent-skills-marketplace-concept',
    title: 'Agent Skills Marketplace(概念)',
    summary: '为 Claude Code / Codex / Cursor / Gemini CLI 构建可发现、可版本化的 SKILL.md 市场。',
    type: 'CONCEPT',
    category: 'product',
    technologies: ['MCP', 'Git', 'Markdown', 'YAML Frontmatter'],
    aiModels: ['Claude Code', 'Codex', 'Cursor', 'Gemini CLI'],
    publishedAt: '2026-09',
    problem: `SKILL.md 是个伟大的发明——一个文件就能定义一个 Agent Skill。但:\n- 找不到(SKILL.md 没有搜索引擎)\n- 没法版本化(git clone 整个 repo 太重)\n- 没法分享(只能 zip / 邮件)\n- 没法评估(用得好不好,没人知道)`,
    thinking: `我的设想:\n1. SKILL.md 是 first-class artifact,有 metadata(name, version, author, tags, deps)\n2. 注册中心(skills.aindgc.com)提供搜索 / 版本 / 评分\n3. CLI 命令:\`aindgc skill install sales-outreach@1.2.0\`\n4. MCP(Model Context Protocol)作为分发通道\n\n为什么不做成 npm / pip?因为 SKILL.md 是 prompt artifact,不是代码——应该用自然语言 + 结构化元数据,而非纯代码。`,
    approach: `原型规格:\n\n\`\`\`yaml\n# SKILL.md frontmatter\nname: sales-outreach\nversion: 1.2.0\nauthor: aindgc\ntags: [sales, automation]\ndeps:\n  - name: crm-reader\n    version: ^1.0.0\nrating: 4.7/5 (1234 downloads)\n\`\`\`\n\n\`\`\`\n$ aindgc skill install sales-outreach\nInstalling sales-outreach@1.2.0...\n  ✓ Fetched metadata\n  ✓ Resolved dependencies\n  ✓ Saved to ~/.aindgc/skills/sales-outreach/SKILL.md\n\`\`\``,
    architecture: `暂未实现。设计:\n\nRegistry: Cloudflare Workers + R2(SKILL.md 静态文件存储)\nDiscovery: 基于 tag / keyword / 评级\nVersioning: SemVer\nDistribution: MCP servers + standalone CLI\n\nPhase 2 才会开始 MVP。`,
    implementation: `目前状态:只有概念和 README。\n\n未来 12 周计划:\n- Week 1-2:CLI 实现 + 本地注册表\n- Week 3-4:Web 搜索界面\n- Week 5-8:MCP 集成\n- Week 9-12:Community 工具(评分、评论、版本历史)`,
    result: `文档化但未实现。\n\n类似项目已经在做了(Composio、Anthropic Skills),我的差异点是:\n- **跨平台**(Claude Code + Codex + Cursor + Gemini CLI 同时支持)\n- **元数据优先**(把 SKILL.md 当 artifact,不是文件)\n- **社区评级**`,
    learned: `1. **Agent Skills 是个真实的需求**,但市场还很早,先发优势 > 完美主义\n2. **跨平台兼容性**比"做得最深入一个平台"更有战略价值——开发者不会被任何单一平台锁死\n3. **YAML frontmatter + Markdown body** 是 SKILL.md 的最佳格式——既能结构化,又能写长说明\n4. **CLI 优先**比 Web 优先更适合开发者工具`,
    featured: false
  },
  {
    slug: 'ai-coding-workflow-experiment',
    title: 'AI Coding 实际能提升多少生产力?',
    summary: '用 Claude Code + Codex 跑同一组任务,记录实际提升。',
    type: 'EXPERIMENT',
    category: 'experiment',
    technologies: ['Claude Code', 'Codex', 'Git'],
    aiModels: ['Claude Code', 'Codex'],
    publishedAt: '2026-08',
    problem: `AI Coding 工具铺天盖地,但"提升 10 倍"的宣传很少有可验证的数据。\n\n我自己做一组对比实验:同一组 5 个真实任务,不用 AI / 用 Claude Code / 用 Codex,记录耗时与代码质量。`,
    thinking: `实验设计原则:\n1. 任务必须是我**真实做过**的(避免"AI 适合的演示性任务")\n2. 每个工具都给 30 分钟熟悉时间,避免新手惩罚\n3. 不用 AI 的时候我**禁止**查 Stack Overflow / 文档,只凭记忆——这样对比更公平\n4. 质量评估由我自己 + 1 个外部 reviewer 盲评`,
    approach: `5 个任务:\n1. 写一个 Vue 3 组件(图标选择器)\n2. 给 Spring Boot API 写完整 CRUD 测试\n3. 重构一个 Python 数据处理脚本(从 Jupyter 到模块化)\n4. 修一个 Next.js 路由 bug\n5. 写一份 OpenAPI 3.0 spec\n\n每个任务分 3 轮:\n- Round A:不借助任何 AI\n- Round B:Claude Code\n- Round C:Codex CLI\n\n记录:总耗时、生成的代码行数、首次通过率、外部 reviewer 评分(1-10)`,
    architecture: `不需要架构。\n\n数据收集:Excel 表 + 时间戳记录。\nReviewer:朋友(同级别开发),盲评代码质量。`,
    implementation: `耗时:3 周(含熟悉时间)\n\n最大问题:Round A 因为"不能查文档",耗时虚高。但这是公平的——AI Coding 的核心卖点就是"不用查文档"。`,
    result: `结果(概要):\n\n| 任务 | 无 AI | Claude Code | Codex |\n|------|-------|-------------|-------|\n| 图标选择器 | 28 min | 6 min | 9 min |\n| CRUD 测试 | 65 min | 22 min | 28 min |\n| Python 重构 | 45 min | 18 min | 15 min |\n| Next.js bug | 35 min | 8 min | 12 min |\n| OpenAPI spec | 22 min | 5 min | 4 min |\n\n总耗时:\n- 无 AI:195 min\n- Claude Code:59 min(3.3x)\n- Codex:68 min(2.9x)\n\n质量评分(1-10):\n- 无 AI:7.8\n- Claude Code:7.5\n- Codex:7.2\n\n**结论:Claude Code 提升 3.3x,质量持平;Codex 提升 2.9x,质量略降。**`,
    learned: `1. **AI Coding 的真实收益是 3x 左右**,不是宣传的 10x\n2. **质量不降**是亮点——前提是开发者 review AI 输出\n3. **熟悉时间** 是隐藏成本,新工具前 30 分钟收益可能为负\n4. **文档查询**是 AI Coding 最大的红利(我自己不用 AI 也得查 SO,只是没算进 Round A)\n5. **不同任务收益不同**——CRUD / 重构收益大,bug 修复中等,全新设计 AI 还不行`,
    featured: true
  }
]

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find(c => c.slug === slug)
}

export function getCasesByCategory(category: string): CaseStudy[] {
  if (category === 'all' || !category) return CASES
  return CASES.filter(c => c.category === category)
}

export function getRelatedCases(slug: string, limit = 3): CaseStudy[] {
  const current = getCase(slug)
  if (!current) return []
  return CASES
    .filter(c => c.slug !== slug && c.category === current.category)
    .slice(0, limit)
}

export const TYPE_LABEL: Record<CaseType, { label: string; tone: 'primary' | 'secondary' | 'warning' | 'neutral' }> = {
  REAL:       { label: 'Real Project',   tone: 'primary' },
  PROTOTYPE:  { label: 'Prototype',      tone: 'secondary' },
  EXPERIMENT: { label: 'Experiment',     tone: 'warning' },
  CONCEPT:    { label: 'Concept',        tone: 'neutral' }
}
