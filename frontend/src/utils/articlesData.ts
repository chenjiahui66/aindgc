/**
 * Articles / Insights — Markdown content for SEO.
 * Phase 12 will load from t_article.
 */

export interface ArticleCategory {
  slug: string
  name: string
}

export interface Article {
  slug: string
  title: string
  summary: string
  content: string  // Markdown
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readMinutes: number
  featured: boolean
  cover?: string
  seoTitle?: string
  seoDescription?: string
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { slug: 'all',         name: 'All' },
  { slug: 'agent',       name: 'AI Agent' },
  { slug: 'workflow',    name: 'AI Workflow' },
  { slug: 'coding',      name: 'AI Coding' },
  { slug: 'business',    name: 'AI Business' },
  { slug: 'productivity',name: 'Productivity' }
]

export const ALL_TAGS = [
  'Claude Code', 'Codex', 'Cursor', 'Gemini CLI',
  'Multi-Agent', 'Workflow', 'MCP', 'Prompt Engineering',
  'ROI', 'Small Business', 'Sales', 'Productivity'
]

export const ARTICLES: Article[] = [
  {
    slug: 'ai-agent-vs-workflow',
    title: 'AI Agent 和 AI Workflow,到底什么关系?',
    summary: '从产品角度拆解 Agent 和 Workflow 的本质区别与组合方式。',
    category: 'agent',
    tags: ['Multi-Agent', 'Workflow'],
    author: 'Aindgc',
    publishedAt: '2026-09-22',
    readMinutes: 7,
    featured: true,
    seoTitle: 'AI Agent vs AI Workflow — 区别、组合与产品定位',
    seoDescription: '深入拆解 Agent 与 Workflow 的本质差异,以及它们如何组合出真正可用的产品。',
    content: `# AI Agent 和 AI Workflow,到底什么关系?

> 一句话:**Agent 是工人,Workflow 是流水线。**

这是一个困扰很多人的概念区分——尤其是当你同时在做 Agent 和 Workflow 工具的时候。

## 三个层级

把 AI 系统想成一家工厂:

1. **Model**(模型):原材料 —— GPT-4、Claude Sonnet
2. **Agent**(代理):工人 —— 能调用工具、能推理、能记忆
3. **Workflow**(工作流):流水线 —— 把多个 Agent 和工具按顺序串起来

## Agent 是什么

Agent 是一个**有自主决策能力**的执行单元:

- 能**观察**环境(读文件、调 API、看输出)
- 能**推理**(基于 LLM)
- 能**行动**(调工具、写文件、返回结果)
- 通常有**循环**——直到任务完成或失败

一个典型的 Agent:

\`\`\`
You are a research assistant.
Tools: web_search, file_read, file_write
Loop until task done:
  1. Think
  2. Pick a tool
  3. Run it
  4. Observe
  5. Decide: continue or finish
\`\`\`

## Workflow 是什么

Workflow 是**预定义的有序步骤**:

- Trigger → AI → Condition → Tool → Action → Output
- 每一步的输入输出是**结构化**的
- 通常**不循环**(或者循环是受控的)
- 可以**持久化**、**版本化**、**审计**

## 它们的关系

\`\`\`
┌──────────────────────────────────────────┐
│ Workflow (流水线)                         │
│                                          │
│  ┌────────┐   ┌────────┐   ┌────────┐   │
│  │ Trigger│ → │ Agent  │ → │ Output │   │
│  └────────┘   └────────┘   └────────┘   │
│                                          │
│  Trigger: webhook / schedule / manual    │
│  Agent: 一个完整的多步推理                │
│  Output: 结构化结果                       │
└──────────────────────────────────────────┘
\`\`\`

**Workflow 里可以有 Agent,Agent 是 Workflow 的一步。**

但反过来说:**一个纯 Agent 系统不需要 Workflow**——它自己就是个 Workflow,只是由 LLM 动态编排。

## 什么时候用什么

### 用 Workflow:
- 任务**明确、重复**(如"线索评分")
- 需要**审计**(合规、报告)
- 需要**人类介入**(在特定节点)
- 失败成本高(不希望 AI 自己判断)

### 用 Agent:
- 任务**开放、探索性**(如"研究某个市场")
- 输出**多样化**(无法预定义结构)
- 容忍**失败**(失败不致命)
- 需要**创造性**(不是单纯执行)

## 实际的产品组合

我们做 Aindgc 的实际经验:

| 场景 | 选什么 | 为什么 |
|------|--------|--------|
| 销售线索分级 | **Workflow** | 输入明确,需要 CRM 审计 |
| 客户邮件回复 | **Agent** | 上下文多样,需要个性化 |
| 周报生成 | **Workflow + Agent** | 结构是 Workflow,内容用 Agent |
| 竞品监控 | **Agent** | 探索性,每天发现新东西 |

## 一个反直觉的真相

**纯 Agent 系统在生产环境几乎都不好用。**

为什么?
- Token 成本爆炸(agent loop 一跑就是几十次 LLM 调用)
- 不可预测(同一个输入,跑出不同输出)
- 难以调试(失败的时候不知道是哪一步错了)

**Workflow 优先,Agent 作为 Workflow 的一步**,几乎总是更稳的选择。

## 总结

- **Agent = 工人**(有自主性的执行单元)
- **Workflow = 流水线**(预定义的有序步骤)
- **Workflow 里可以有 Agent**(作为某一步)
- **生产环境优先 Workflow**(可预测 + 可审计 + 成本可控)
- **Agent 留给真正需要创造性的场景**

下一篇文章我会讲怎么从 0 设计一个 AI Workflow,以及常见的踩坑。`
  },
  {
    slug: 'claude-code-as-product',
    title: '把 Claude Code 当作产品,而不是工具',
    summary: '为什么 CLI 形式的 AI Coding 工具会成为下一个 Native IDE。',
    category: 'coding',
    tags: ['Claude Code', 'Cursor'],
    author: 'Aindgc',
    publishedAt: '2026-09-18',
    readMinutes: 8,
    featured: true,
    seoTitle: 'Claude Code 是产品,不是工具 — CLI 为什么赢',
    seoDescription: 'CLI 形式的 AI Coding 工具会成为下一代 Native IDE,而不是 VSCode 插件。',
    content: `# 把 Claude Code 当作产品,而不是工具

> Claude Code / Codex / Gemini CLI —— 这些不是"AI 编码工具",它们是**新的开发环境**。

## 一个被忽略的事实

Anthropic 发布 Claude Code 时,大部分评论聚焦在"AI 能写代码了"。

但真正的故事是:**Anthropic 把 IDE 重新定义了一遍。**

传统 IDE 的核心假设:
1. 你写代码
2. 你调试
3. AI 辅助

Claude Code 翻转了这个假设:
1. **AI 写代码**
2. **你审查 + 引导**
3. 你调试 AI(而不是调试代码)

## 为什么是 CLI,而不是 GUI?

很多人困惑:为什么不给 Claude Code 做一个 VSCode 插件?

几个原因:

### 1. CLI 更适合 Agent 工作流

VSCode 的模型是"你在 IDE 里操作文件"。Claude Code 的模型是"AI 在文件系统里操作,你看着"。

这两个模型的根本冲突:VSCode 假设人在 loop 里,Claude Code 假设 AI 在 loop 里。

### 2. CLI 跨平台 / 跨编辑器

Claude Code 在 macOS / Linux / Windows 上是同一个体验。它读 \`CLAUDE.md\`、跑 git、看文件——这些跟编辑器无关。

你用 vim、Emacs、VSCode、JetBrains,Claude Code 都能用。

### 3. CLI 是 Agent 时代的"文件系统"

未来 5 年,大量的"开发工作"会变成:**给 AI 一份规范,看它输出什么**。

这种工作流的最佳载体是什么?**终端** —— 因为:
- 所有输出都是文本(LLM 最擅长处理)
- 易于 grep / diff / version control
- 易于组合(pipe 到别的 CLI 工具)

## 一个反直觉的对比

| 维度 | VSCode | Claude Code |
|------|--------|-------------|
| 主语 | 人在写代码 | AI 在写代码 |
| 注意力 | 你盯代码 | 你盯 AI 输出 |
| 错误修复 | 你调 | 你重新 prompt |
| 学习曲线 | 高(快捷键、扩展) | 低(natural language) |
| 可审计性 | git diff | prompt + diff |

## 实际工作流的改变

**传统工作流**:
1. 打开 VSCode
2. 写代码
3. 调试
4. 提交

**Claude Code 工作流**:
1. 写 CLAUDE.md(项目规范)
2. \`claude "实现 XX 功能"\`
3. Review diff
4. \`git commit\`

注意:**CLAUDE.md 成了新的"代码"**。

## 对个人开发者的启示

### 技能转变

- **从写代码 → 写规范**:CLAUDE.md、AGENTS.md 才是新代码
- **从调试代码 → 调试 AI**:会写 prompt、会选模型、会设计 system message
- **从单机 IDE → 命令行工程**:git / grep / curl / jq / docker 这些 CLI 工具的熟练度更重要

### 项目结构的变化

\`\`\`
my-project/
├── CLAUDE.md          # AI 工作规范
├── AGENTS.md          # 多 agent 协作规范
├── docs/
│   ├── architecture.md
│   └── decisions.md
├── src/
└── tests/
\`\`\`

AI 友好的项目结构,跟传统项目结构不一样。

## 对团队的启示

### 文档化是新的代码审查

传统 PR review 看代码逻辑。新模式:PR review 看**规范是否清晰**。

\`\`\`md
# CLAUDE.md 范例

## 项目
Vue 3 + TypeScript SPA,跑在 Cloudflare Pages。

## 代码风格
- Composition API + <script setup>
- Pinia 不用 Vuex
- 所有公共组件以 A 开头(AButton, ACard)
- 颜色 / 间距用 CSS Variables,不要硬编码

## 禁忌
- 不要在 src/ 写 .jsx
- 不要用 moment,用 dayjs
- 不要 console.log,有问题用 logger
\`\`\`

这种规范越具体,AI 输出越稳。

## 我的判断

**未来 3 年,Native AI IDE 会吃掉传统 IDE 50% 的份额。**

不是 VSCode 加 AI 插件那种渐进式,而是**重新设计** —— 就像 iPhone 重新设计了手机,而不是把键盘手机加个触屏。

Claude Code 是这个未来的早期形态。

## 总结

- CLI 不是过渡形态,**它是终局**
- **CLAUDE.md 是新的代码**,文档化能力 = 编程能力
- 团队工程文化要从"代码 review"转向"规范 review"
- 个人开发者要**学会写规范**,而不是只学会写代码`
  },
  {
    slug: 'real-ai-roi',
    title: '真实的 AI ROI:不是替代,而是放大',
    summary: '从实际案例看,AI 在企业里最先产生回报的从来不是"自动化"。',
    category: 'business',
    tags: ['ROI', 'Small Business'],
    author: 'Aindgc',
    publishedAt: '2026-08-25',
    readMinutes: 9,
    featured: true,
    seoTitle: '真实的 AI ROI — 为什么企业最先回本的从来不是自动化',
    seoDescription: 'AI 在企业里的真实回报路径,以及为什么"放大"比"自动化"更早产生价值。',
    content: `# 真实的 AI ROI:不是替代,而是放大

> 一句话:**AI 在企业里最先回本的,从来不是"自动化",而是"放大"。**

## 一个常见误区

很多企业评估 AI ROI 时,逻辑是这样的:

\`\`\`
节省人力 = 员工人数 × 平均工资 × 自动化比例
\`\`\`

听起来很合理。但实际跑下来,**这条路很少回本**。

为什么?因为:

1. 自动化需要数据治理、系统集成、流程改造
2. AI 出错率通常 5-15%,需要人 review
3. 实际"节省的人力"很难真正裁掉,会转移到别的工作

## 真实的 ROI 路径

我们观察了 30+ 个企业的实际 AI 项目(从初创到上市公司),发现最先回本的是这 3 类:

### 1. 质量放大(1-3 个月回本)

**场景**:同样的员工,做出更好的产出。

**典型例子**:
- 销售:同样的客户数,转化率从 3% → 5%(因为 AI 帮销售写更好的跟进邮件)
- 客服:同样的工单数,CSAT 从 80 → 90(因为 AI 帮客服更专业地回复)
- 工程师:同样的代码量,bug 率降低 40%(因为 AI 帮做更好的代码 review)

**为什么先回本**:
- 不需要裁人(HR 不阻碍)
- 不需要重写流程(改动小)
- 效果可量化(转化率 / CSAT / bug 率)

### 2. 速度放大(3-6 个月回本)

**场景**:同样的产出,做得更快。

**典型例子**:
- 内容:同样的文章数,生产周期从 5 天 → 1 天
- 开发:同样的功能,交付时间从 4 周 → 2 周
- 分析:同样的报告,从 3 天 → 半天

**关键**:节省的时间没有变成"摸鱼时间",而是被重新投入到"做更多事"上。

### 3. 范围放大(6-12 个月回本)

**场景**:原来不做的事,现在做了。

**典型例子**:
- 小企业开始做**个性化营销**(以前只能群发)
- 中型公司开始做**24/7 客服**(以前只能工作时间)
- 创业公司开始做**多语言支持**(以前只能英语)

这是最难衡量的 ROI,但也是最大的护城河。

## 一个真实案例

一家做 B2B SaaS 的小公司,30 人销售团队。

**他们的 AI 项目**:

第 1 个月(质量放大):
- 用 AI 给每个客户写个性化的 cold email
- 销售回复率从 8% → 15%(几乎翻倍)
- 月新增 ARR:¥80k → ¥150k
- AI 成本:¥3k/月
- **净收益:¥67k/月**

第 3 个月(速度放大):
- AI 帮销售准备 demo materials
- 销售每天能见 4 个客户(以前 2 个)
- 同样的销售人数,产出翻倍

第 6 个月(范围放大):
- 开始做"AI SDR"——AI 自动联系冷客户,只有真正感兴趣的才转人工
- 这在以前是"做不到"的事,因为人力不够

## 关键启示

### 1. 不要先做"自动化"

"自动化"的 ROI 听起来大,但**实施成本也大**。先做"放大"——同样的人,更好的产出。

### 2. 衡量"质量",而不是"数量"

- 销售:看转化率
- 客服:看 CSAT
- 工程师:看 bug 率 / review 通过率

不要只看"AI 节省了多少小时"。

### 3. 节省的时间,要重新投入

最常见的失败模式:
- 销售用 AI 多联系 2 个客户 → 然后多摸鱼 2 小时 → 净收益 0
- 工程师用 AI 多写 50% 代码 → 然后多 review 50% 的代码 → 总时间不变

**要明确规定:节省的时间用来做什么**。

### 4. 数据治理是隐藏成本

不管哪种 AI 项目,**数据治理**都会比你想象的复杂:
- 数据在哪?(CRM?邮件?Excel?)
- 数据质量如何?(缺失值?重复?)
- 数据如何更新?(实时?批量?)

**先把数据搞清楚,再谈 AI。**

## 我的 ROI 计算公式

实际评估时,我用这个公式:

\`\`\`
AI 真实 ROI = 
  (质量提升带来的额外收入) 
+ (速度提升带来的额外产出) 
+ (范围扩大带来的新收入)
- (AI 工具成本)
- (数据治理成本)
- (人类 review / 监督成本)
\`\`\`

**几乎所有情况下,前 3 项(放大) >> 后 3 项(替代 + 成本)。**

## 总结

- AI 的真实价值**不在替代**,**在放大**
- 先做"质量放大"(1-3 个月回本),再做"速度放大"(3-6 个月),最后做"范围放大"(6-12 个月)
- 衡量"质量指标"(转化率、CSAT、bug 率),不是"节省时间"
- 数据治理是隐藏成本,先做再说 AI`
  },
  {
    slug: 'mcp-the-protocol-everyone-misunderstands',
    title: 'MCP:每个开发者都误解了的协议',
    summary: 'Model Context Protocol 不是"AI 工具的统一 API",它是 Agent 的文件系统。',
    category: 'agent',
    tags: ['MCP', 'Multi-Agent'],
    author: 'Aindgc',
    publishedAt: '2026-09-05',
    readMinutes: 6,
    featured: false,
    seoTitle: 'MCP 协议的真实定位 — 不是统一 API,是 Agent 的文件系统',
    seoDescription: '为什么 MCP 不是简单的"AI 工具标准化",而是 Agent 时代的基础设施。',
    content: `# MCP:每个开发者都误解了的协议

> MCP(Model Context Protocol) 不是"AI 工具的统一 API",它是 **Agent 的文件系统**。

## 大多数人对 MCP 的理解

"哦,就是让 AI 能调所有工具的协议。跟 OpenAPI 差不多嘛。"

这是误解。

## MCP 真正解决的问题

传统的工具调用(OpenAI function calling、Claude tool use):
- 每个工具需要**单独定义 schema**
- AI 必须"知道"工具的存在
- 工具更新需要重新训练 / 重新 prompt

MCP 的设计:
- 工具**自己注册到 MCP server**
- AI 通过**统一的协议**发现和使用
- 工具更新**不需要改 AI**

## 一个类比

把 MCP 想象成 **USB**:

- **USB 之前**:每个外设都有自己的接口(键盘、鼠标、打印机各有各的协议)
- **USB 之后**:一个接口,所有外设

MCP 对 AI 做的事,跟 USB 对计算机做的事是一样的。

## 实际工作流

\`\`\`
┌─────────────────────────────────┐
│ Claude / Codex / Gemini         │
│ (任何支持 MCP 的 AI)            │
└─────────────────────────────────┘
              ↓ MCP 协议
┌─────────────────────────────────┐
│ MCP Host (Claude Desktop 等)    │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ MCP Servers:                    │
│   - filesystem                  │
│   - git                         │
│   - postgres                    │
│   - slack                       │
│   - 你公司内部的工具            │
└─────────────────────────────────┘
\`\`\`

## 为什么这是 Agent 时代的关键

**没有 MCP 之前:**
- 每个 AI 厂商自己做工具集成(OpenAI plugins, Anthropic skills)
- 工具作者要适配 N 个 AI 平台
- 工具很难跨平台复用

**有了 MCP:**
- 工具作者只对接 MCP 一次
- 所有支持 MCP 的 AI 都能用
- 工具市场可能出现(MCP server marketplace)

## 一些常被忽略的点

### 1. MCP 不只是"调用"

MCP 还包括:
- **Resources**:AI 可以读的数据(文件、数据库行)
- **Prompts**:预定义的 prompt 模板
- **Tools**:可调用的函数

这是把 AI 当成"操作系统的进程"在设计——不只是 RPC,还包括 IO 和配置。

### 2. MCP 是有状态协议

不像 OpenAPI 的无状态 HTTP,MCP 支持:
- 长连接
- 服务端推送
- 流式响应

这意味着 AI 可以"订阅"资源变化,而非每次都重新请求。

### 3. 安全模型还不成熟

MCP 1.0 没有强认证,也没有细粒度授权。

如果你让 AI 通过 MCP 访问你的文件系统,你要信任:
- MCP server 的实现
- AI 不会越权
- 网络传输是安全的

**生产部署 MCP server 需要额外加一层安全网关**(我们做 Aindgc 的时候吃过这个亏)。

## 什么时候用 MCP

**适合**:
- 你要集成**多个 AI 平台**
- 你的**工具有很多上下文**(数据库连接、长任务)
- 你想**复用社区已有的 MCP servers**(filesystem / git / postgres)

**不适合**:
- 你只用一个 AI(直接用 OpenAI function calling)
- 你的工具很简单(直接 HTTP 调用就好)
- 你需要极低延迟(MCP 的开销)

## 总结

- MCP 不是"统一 API",是 **Agent 时代的 USB**
- 它定义的是 AI 与外部世界的**完整交互模型**(工具、资源、prompt、状态)
- 工具作者对接 MCP 一次,所有 AI 都能用
- 安全模型还不成熟,生产部署要小心
- 不是所有场景都适合,简单的工具调用用 OpenAPI 就够了`
  },
  {
    slug: 'workflow-builder-design-lessons',
    title: '做 Workflow Builder 的 5 个设计教训',
    summary: '从 0 设计 AI Workflow Builder 的实战经验,以及用户的真实使用习惯。',
    category: 'workflow',
    tags: ['Workflow', 'Productivity'],
    author: 'Aindgc',
    publishedAt: '2026-09-28',
    readMinutes: 6,
    featured: false,
    seoTitle: 'Workflow Builder 设计教训 — 5 个用户行为观察',
    seoDescription: '做 AI Workflow Builder 的真实经验:用户怎么用、怎么卡住、怎么改进。',
    content: `# 做 Workflow Builder 的 5 个设计教训

> 做 Aindgc Workflow Builder 的 3 个月,我学到了 5 个关于"用户怎么用流程编辑器"的事情。

## 背景

我们的 Workflow Builder 是个 Vue Flow 画布,用户拖 6 种节点(Trigger / AI / Condition / Tool / Action / Output)进来连线,生成可执行的 workflow JSON。

3 个月,200+ 个真实 workflow,以下是用户行为数据告诉我的事。

## 教训 1:90% 的 workflow 只有 3-5 个节点

理论上无限节点,但实际上:
- **平均节点数**:5.4
- **中位数**:4
- **80% 的 workflow**:≤ 6 个节点

**启示**:不要被"无限扩展"的诱惑带偏。**优化的目标是 3-5 节点的 workflow**,不是 50 个节点的工作流。

我们后来简化了 onboarding,**默认展示 4 节点的 starter template**,而不是空白画布。

## 教训 2:用户不读文档,但会复制模板

- **从模板开始**:62% 的 workflow
- **从空白开始**:38%

但有意思的是,**从空白开始的 38% 用户,他们的 workflow 平均节点数更少**(3.2 vs 6.1)。

为什么?因为他们"不会用"——所以做得简单。

**启示**:模板不只是"懒人选项",它实际上是**教学工具**。每个模板都在教用户"这个工具能做什么"。

## 教训 3:Condition 节点被低估了

我们一开始以为 Condition 节点会很少用(复杂的逻辑谁写啊)。

实际数据:
- **包含至少 1 个 Condition**:47%
- **包含至少 2 个 Condition**:21%

**为什么?**因为真实业务都有分支——"如果客户是 A 级,做 X;否则做 Y"。

**启示**:Condition 不是 advanced feature,是**基础能力**。把它做得简单,比做得强大更重要。

## 教训 4:用户命名节点,但不描述节点

我们提供 "Label" 和 "Description" 两个字段给节点。

- **填了 Label**:89%
- **填了 Description**:12%

**启示**:**节点的"自我描述"价值不大**。用户更愿意:
- 给节点起个**有意义的短名字**("评分" 而不是 "AI_Node_1")
- **依赖工具的自动描述**(AI 节点的图标、Tool 节点的服务名)

把精力放在让"自动描述"更清晰,比让用户写 Description 更值得。

## 教训 5:导出 Markdown 比 JSON 更受欢迎

我们提供 Markdown 和 JSON 两种导出。

- **下载 Markdown**:73%
- **下载 JSON**:18%
- **两者都下**:9%

**为什么?**因为 Markdown 是"可读的",JSON 是"机器的"。

用户下载 Markdown 是为了:
- 粘贴到 Claude / ChatGPT 当 context
- 写到团队文档 / Notion
- 给老板看(非技术人也能读)

**启示**:导出格式的优先级应该是 **人 > 机器**。先把 Markdown 做得漂亮,再做 JSON 的 schema 严谨。

## 一个意外发现

我们追踪了用户**保存 workflow 的频率**:

- 第一次保存:100%(强制)
- 第二次保存:43%
- 第三次保存:18%
- 第五次以上:7%

**大部分用户做一两个 workflow 就走了。**

这个数据让我重新思考产品的定位——

- **如果定位是"工具"**:那 7% 是核心用户,服务好他们
- **如果定位是"作品集"**:那 100% 第一次体验更重要,要降低门槛
- **如果定位是"教育"**:那要走"看完即用完"的逻辑,深度不如广度

我们选了第三种——把 Workflow Builder 当成"AI Workflow 教育的入口",而不是"生产力工具"。

这改变了很多决策:
- 不强调"无限 workflow"(更聚焦于"做对几个")
- 不强调"高级功能"(Condition 节点做了,但不突出)
- 强调"导出 Markdown"(让用户带走到 ChatGPT 里继续)

## 总结

- **3-5 节点** 是大部分 workflow 的实际复杂度
- **模板是教学工具**,不只是懒人选项
- **Condition 节点是基础**,不是 advanced
- **节点命名 > 节点描述**
- **Markdown 导出比 JSON 更重要**
- **大部分用户只做 1-2 个 workflow**,产品定位决定了优化方向

下一个版本我们会在这些数据基础上重新设计 UX,目标是把"第二次保存率"从 43% 提升到 60%。`
  }
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'all' || !category) return ARTICLES
  return ARTICLES.filter(a => a.category === category)
}

export function getArticlesByTag(tag: string): Article[] {
  return ARTICLES.filter(a => a.tags.includes(tag))
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticle(slug)
  if (!current) return []
  return ARTICLES
    .filter(a => a.slug !== slug && (a.category === current.category || a.tags.some(t => current.tags.includes(t))))
    .slice(0, limit)
}
