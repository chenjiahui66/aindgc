/**
 * Tool catalog — single source of truth for /tools listing and cross-linking.
 * Phase 12 will replace this with /api/tools (DB-driven).
 */

export interface Faq {
  q: string
  a: string
}

export interface ToolMeta {
  slug: string
  name: string
  tagline: string
  description: string
  iconName: string
  category: 'workflow' | 'skill' | 'context' | 'coding' | 'prompt' | 'schema'
  outputFormats: ('md' | 'json' | 'zip')[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
  to: string
  faqs: Faq[]
  related: string[]  // slugs
}

export const TOOL_CATALOG: ToolMeta[] = [
  {
    slug: 'agent-workflow-generator',
    name: 'Agent Workflow Generator',
    tagline: '把工作流拆成 AI 可执行的结构',
    description: '输入目标、触发器、步骤、工具和成功标准,生成符合规范的 AI 工作流定义(Markdown + JSON)。',
    iconName: 'workflow',
    category: 'workflow',
    outputFormats: ['md', 'json'],
    complexity: 'intermediate',
    to: '/tools/agent-workflow-generator',
    faqs: [
      { q: '生成的内容可以直接用于 Claude Code / Codex 吗?', a: '可以。Markdown 部分可以直接粘贴到任何 AI agent 的系统提示词;JSON 部分符合 aindgc.workflow/v1 schema,可被 runtime 解析执行。' },
      { q: 'Phase 1 之后会接入 AI 优化吗?', a: '会的。当前是规则引擎生成结构化骨架;Phase 2+ 会加入可选 AI 优化建议,生成的内容仍然可独立使用。' },
      { q: '生成的内容有版权问题吗?', a: '没有。所有内容均来自你提供的输入,生成过程不引用任何外部数据集。' }
    ],
    related: ['agent-skills-generator', 'context-builder', 'workflow']
  },
  {
    slug: 'agent-skills-generator',
    name: 'Agent Skills Generator',
    tagline: '为 Claude Code / Codex 生成 SKILL.md',
    description: '输入角色、目标、指令、工作流和约束,生成符合规范的 Agent Skill。',
    iconName: 'sparkles',
    category: 'skill',
    outputFormats: ['md', 'json'],
    complexity: 'intermediate',
    to: '/tools/agent-skills-generator',
    faqs: [
      { q: '生成的 SKILL.md 能直接被 Claude Code 识别吗?', a: '可以。Frontmatter 包含 name / description / target,Claude Code 0.2+ 能自动发现。' },
      { q: 'Cursor / Codex / Gemini CLI 也支持吗?', a: '支持。选择对应 target 后,文件名会自动调整(.cursorrules / AGENTS.md / GEMINI.md)。' },
      { q: '可以一次生成多个 Skill 吗?', a: 'Phase 1 一次一个。Phase 2+ 会加入批量生成与 marketplace。' }
    ],
    related: ['agent-workflow-generator', 'context-builder', 'coding-project-starter']
  },
  {
    slug: 'context-builder',
    name: 'AI Context Builder',
    tagline: '把零散信息变成结构化 Context',
    description: '为任何 AI agent 构建可复用的 Context 包(Purpose / Audience / Scope / Key Info / Constraints / Examples / Success Signals)。',
    iconName: 'box',
    category: 'context',
    outputFormats: ['md', 'json'],
    complexity: 'beginner',
    to: '/tools/context-builder',
    faqs: [
      { q: 'Context 包和 Prompt 有什么区别?', a: 'Prompt 是单次任务指令,Context 是稳定的背景信息。Context 可以被多个 Prompt 引用。' },
      { q: '生成的 Context 可以直接粘贴到 ChatGPT 吗?', a: '可以。Markdown 格式可以直接粘贴,AI 会自动解析结构。' }
    ],
    related: ['prompt-structure-builder', 'agent-skills-generator']
  },
  {
    slug: 'coding-project-starter',
    name: 'AI Coding Project Starter',
    tagline: '生成可直接跑的项目骨架',
    description: '为 Claude Code / Codex / Cursor 生成完整的 AI Coding 项目启动包:AGENTS.md / CLAUDE.md / README / ARCHITECTURE / CONTRIBUTING / CHANGELOG。',
    iconName: 'terminal',
    category: 'coding',
    outputFormats: ['zip'],
    complexity: 'intermediate',
    to: '/tools/coding-project-starter',
    faqs: [
      { q: '生成的项目在 Claude Code 中如何打开?', a: '下载 ZIP → 解压 → 在项目根目录运行 claude code。Claude Code 会自动读取 CLAUDE.md。' },
      { q: '支持哪些 AI 工具?', a: 'Claude Code / Codex / Cursor / Gemini CLI。每个工具对应一个文件名(CLAUDE.md / AGENTS.md / .cursorrules / GEMINI.md)。' },
      { q: '生成的文件包含真实代码吗?', a: '不包含。生成的是项目骨架、AI 指令和约定。实际代码需要你和 AI 一起写。' }
    ],
    related: ['agent-skills-generator', 'agent-workflow-generator']
  },
  {
    slug: 'prompt-structure-builder',
    name: 'Prompt Structure Builder',
    tagline: '把模糊任务变成结构化 Prompt',
    description: '输入任务、角色、受众、约束,生成可直接使用的结构化 Prompt。',
    iconName: 'message-square',
    category: 'prompt',
    outputFormats: ['md', 'json'],
    complexity: 'beginner',
    to: '/tools/prompt-structure-builder',
    faqs: [
      { q: '生成的 Prompt 适合哪些 AI?', a: '通用:Claude / GPT / Gemini / DeepSeek / Qwen 都适用。' },
      { q: '和 Context Builder 的区别?', a: 'Prompt Structure Builder 偏向单次任务的指令;Context Builder 偏向稳定的背景信息。' }
    ],
    related: ['context-builder', 'output-schema-generator']
  },
  {
    slug: 'output-schema-generator',
    name: 'Output Schema Generator',
    tagline: '定义 AI 输出的契约',
    description: '定义字段名 / 类型 / 必填 / 枚举,自动生成 JSON Schema + TypeScript types + Markdown 文档。',
    iconName: 'database',
    category: 'schema',
    outputFormats: ['md', 'json'],
    complexity: 'intermediate',
    to: '/tools/output-schema-generator',
    faqs: [
      { q: '生成的 JSON Schema 兼容哪些版本?', a: 'Draft-07,广泛兼容(Claude / GPT / Gemini / 大多数 schema validator)。' },
      { q: '可以导出 OpenAPI 吗?', a: 'Phase 2+ 加入。当前生成 JSON Schema 和 TypeScript types。' }
    ],
    related: ['prompt-structure-builder', 'agent-workflow-generator']
  }
]

export function getTool(slug: string): ToolMeta | undefined {
  return TOOL_CATALOG.find(t => t.slug === slug)
}

export function getRelatedTools(slugs: string[]): ToolMeta[] {
  return slugs.map(s => getTool(s)).filter(Boolean) as ToolMeta[]
}
