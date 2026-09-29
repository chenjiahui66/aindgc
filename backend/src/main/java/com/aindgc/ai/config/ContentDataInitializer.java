package com.aindgc.ai.config;

import com.aindgc.ai.entity.*;
import com.aindgc.ai.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Seeds production-ready content (tools, cases, articles) on first boot.
 * Idempotent: each table is only filled if currently empty.
 *
 * Content mirrors the frontend placeholder data so the public API has real
 * rows to serve immediately after deployment. Phase 11 Admin will allow
 * editing these rows via UI.
 */
@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class ContentDataInitializer implements CommandLineRunner {

    private final ToolCategoryMapper toolCategoryMapper;
    private final ToolMapper toolMapper;
    private final CaseCategoryMapper caseCategoryMapper;
    private final CaseProjectMapper caseProjectMapper;
    private final ArticleCategoryMapper articleCategoryMapper;
    private final ArticleTagMapper articleTagMapper;
    private final ArticleMapper articleMapper;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void run(String... args) {
        seedToolCategories();
        seedTools();
        seedCaseCategories();
        seedCases();
        seedArticleCategories();
        seedArticleTags();
        seedArticles();
        seedArticleTagRelations();
    }

    private boolean isEmpty(CharSequence table, com.baomidou.mybatisplus.core.mapper.BaseMapper<?> mapper) {
        long c = mapper.selectCount(null);
        if (c > 0) {
            log.debug("[Seed] {} already has {} rows, skip", table, c);
            return false;
        }
        return true;
    }

    // ==================== Tool Categories ====================

    private void seedToolCategories() {
        if (!isEmpty("t_tool_category", toolCategoryMapper)) return;
        for (var tc : List.of(
            cat("Workflow", "workflow", "Workflow generators", 1),
            cat("Skill",    "skill",    "Agent Skills generators", 2),
            cat("Context",  "context",  "Context builders", 3),
            cat("Coding",   "coding",   "AI Coding starters", 4),
            cat("Prompt",   "prompt",   "Prompt structure tools", 5),
            cat("Schema",   "schema",   "Output schema tools", 6)
        )) toolCategoryMapper.insert(tc);
        log.info("[Seed] Inserted 6 tool categories");
    }

    private ToolCategory cat(String n, String s, String d, int sort) {
        ToolCategory c = new ToolCategory();
        c.setName(n); c.setSlug(s); c.setDescription(d); c.setSort(sort);
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now());
        c.setDeleted(0);
        return c;
    }

    // ==================== Tools ====================

    private void seedTools() {
        if (!isEmpty("t_tool", toolMapper)) return;
        var wf = cat("Workflow"); var skill = cat("Skill"); var ctx = cat("Context");
        var code = cat("Coding"); var prompt = cat("Prompt"); var schema = cat("Schema");
        for (var t : List.of(
            tool("agent-workflow-generator", "Agent Workflow Generator",
                "把工作流拆成 AI 可执行的结构",
                "输入目标、触发器、步骤、工具和成功标准,生成符合规范的 AI 工作流定义。",
                "workflow", wf.getId(), "MARKDOWN", 1, true, 1,
                "AI Agent Workflow Generator - Build AI Workflows",
                "Create structured AI workflows for Claude Code, Codex and other AI agents."),
            tool("agent-skills-generator", "Agent Skills Generator",
                "为 Claude Code / Codex 生成 SKILL.md",
                "输入角色、目标、指令、工作流和约束,生成符合规范的 Agent Skill。",
                "sparkles", skill.getId(), "MARKDOWN", 2, true, 2,
                "Agent Skills Generator - SKILL.md for Claude Code / Codex",
                "Generate SKILL.md files for Claude Code, Codex, Cursor, Gemini CLI."),
            tool("context-builder", "AI Context Builder",
                "把零散信息变成结构化 Context",
                "为任何 AI agent 构建可复用的 Context 包。",
                "box", ctx.getId(), "MARKDOWN", 3, true, 3,
                "AI Context Builder",
                "Build structured context packages for AI agents."),
            tool("coding-project-starter", "AI Coding Project Starter",
                "生成可直接跑的项目骨架",
                "为 Claude Code / Codex / Cursor 生成完整的 AI Coding 项目启动包。",
                "terminal", code.getId(), "ZIP", 4, true, 4,
                "AI Coding Project Starter",
                "Generate complete AI coding project starter bundles."),
            tool("prompt-structure-builder", "Prompt Structure Builder",
                "把模糊任务变成结构化 Prompt",
                "输入任务、角色、受众、约束,生成可直接使用的结构化 Prompt。",
                "message-square", prompt.getId(), "MARKDOWN", 5, true, 5,
                "Prompt Structure Builder",
                "Structure vague tasks into reusable AI prompts."),
            tool("output-schema-generator", "Output Schema Generator",
                "定义 AI 输出的契约",
                "定义字段名 / 类型 / 必填 / 枚举,自动生成 JSON Schema + TypeScript types。",
                "database", schema.getId(), "MARKDOWN", 6, true, 6,
                "Output Schema Generator",
                "Define AI output contracts as JSON Schema + TypeScript types.")
        )) toolMapper.insert(t);
        log.info("[Seed] Inserted 6 tools");
    }

    private ToolCategory cat(String slug) {
        return toolCategoryMapper.selectOne(new QueryWrapper<ToolCategory>().eq("slug", slug).eq("deleted", 0));
    }

    private Tool tool(String slug, String name, String tagline, String desc, String icon, Long catId,
                      String outputFormat, int sort, boolean featured, int idx,
                      String seoTitle, String seoDesc) {
        Tool t = new Tool();
        t.setSlug(slug); t.setName(name); t.setTagline(tagline); t.setDescription(desc);
        t.setIcon(icon); t.setCategoryId(catId); t.setStatus("PUBLISHED");
        t.setOutputFormat(outputFormat); t.setSort(sort); t.setFeatured(featured ? 1 : 0);
        t.setSeoTitle(seoTitle); t.setSeoDescription(seoDesc); t.setSeoKeywords("AI Tool, " + name);
        t.setCreatedAt(LocalDateTime.now()); t.setUpdatedAt(LocalDateTime.now()); t.setDeleted(0);
        return t;
    }

    // ==================== Case Categories ====================

    private void seedCaseCategories() {
        if (!isEmpty("t_case_category", caseCategoryMapper)) return;
        for (var c : List.of(
            caseCat("All",        "all",        0),
            caseCat("Product",    "product",    1),
            caseCat("Agent",      "agent",      2),
            caseCat("Workflow",   "workflow",   3),
            caseCat("Experiment", "experiment", 4)
        )) caseCategoryMapper.insert(c);
        log.info("[Seed] Inserted 5 case categories");
    }

    private CaseCategory caseCat(String n, String s, int sort) {
        CaseCategory c = new CaseCategory();
        c.setName(n); c.setSlug(s); c.setSort(sort);
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now()); c.setDeleted(0);
        return c;
    }

    // ==================== Cases ====================

    private void seedCases() {
        if (!isEmpty("t_case_project", caseProjectMapper)) return;
        // Look up categories by slug (inserted earlier in seedCaseCategories)
        var product    = findCaseCat("product");
        var agent      = findCaseCat("agent");
        var experiment = findCaseCat("experiment");
        for (var c : List.of(
            buildAindgcWorkbench(product.getId()),
            buildMultiAgentPoC(agent.getId()),
            buildSkillMarketplace(product.getId()),
            buildAiCodingExperiment(experiment.getId())
        )) caseProjectMapper.insert(c);
        log.info("[Seed] Inserted 4 case studies");
    }

    /** Look up a case category by slug, falling back to a transient instance if not found. */
    private CaseCategory findCaseCat(String slug) {
        CaseCategory c = caseCategoryMapper.selectOne(
            new QueryWrapper<CaseCategory>().eq("slug", slug).eq("deleted", 0));
        if (c == null) {
            // Should never happen — seedCaseCategories runs first.
            log.warn("[Seed] Case category slug='{}' not found, using stub", slug);
            c = new CaseCategory();
            c.setName(slug); c.setSlug(slug); c.setSort(99);
        }
        return c;
    }

    private CaseProject buildAindgcWorkbench(Long catId) {
        CaseProject c = new CaseProject();
        c.setTitle("Aindgc Workbench — 把工作翻译成可执行的 AI 工作流");
        c.setSlug("aindgc-workbench");
        c.setSummary("把\"我想让 AI 帮我做 X\"翻译成 ROLE / TASK / WORKFLOW / CHECKLIST / SKILL 的完整工作包。");
        c.setType("REAL"); c.setStatus("PUBLISHED"); c.setIsFeatured(1);
        c.setCategoryId(catId);
        c.setRepoUrl("https://github.com/aindgc/aindgc");
        c.setDemoUrl("https://aindgc.com");
        c.setPublishedAt(parseDate("2026-09-15"));
        c.setProblemMd(problem1());
        c.setThinkingMd(thinking1());
        c.setApproachMd(approach1());
        c.setArchitectureMd(architecture1());
        c.setImplementationMd(implementation1());
        c.setResultMd(result1());
        c.setLearnedMd(learned1());
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now()); c.setDeleted(0);
        return c;
    }

    private CaseProject buildMultiAgentPoC(Long catId) {
        CaseProject c = new CaseProject();
        c.setTitle("Multi-Agent Workflow PoC — 6 节点协作流");
        c.setSlug("multi-agent-workflow-poc");
        c.setSummary("在 Vue Flow 上构建一个 6 节点的多 Agent 协作流,验证可视化 + JSON 导出。");
        c.setType("PROTOTYPE"); c.setStatus("PUBLISHED"); c.setIsFeatured(1);
        c.setCategoryId(catId);
        c.setRepoUrl("https://github.com/aindgc/multi-agent-poc");
        c.setPublishedAt(parseDate("2026-08-22"));
        c.setProblemMd(problem2());
        c.setThinkingMd(thinking2());
        c.setApproachMd(approach2());
        c.setArchitectureMd(architecture2());
        c.setImplementationMd(implementation2());
        c.setResultMd(result2());
        c.setLearnedMd(learned2());
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now()); c.setDeleted(0);
        return c;
    }

    private CaseProject buildSkillMarketplace(Long catId) {
        CaseProject c = new CaseProject();
        c.setTitle("Agent Skills Marketplace(概念)");
        c.setSlug("agent-skills-marketplace-concept");
        c.setSummary("为 Claude Code / Codex / Cursor / Gemini CLI 构建可发现、可版本化的 SKILL.md 市场。");
        c.setType("CONCEPT"); c.setStatus("PUBLISHED"); c.setIsFeatured(0);
        c.setCategoryId(catId);
        c.setPublishedAt(parseDate("2026-09-02"));
        c.setProblemMd(problem3());
        c.setThinkingMd(thinking3());
        c.setApproachMd(approach3());
        c.setArchitectureMd(architecture3());
        c.setImplementationMd(implementation3());
        c.setResultMd(result3());
        c.setLearnedMd(learned3());
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now()); c.setDeleted(0);
        return c;
    }

    private CaseProject buildAiCodingExperiment(Long catId) {
        CaseProject c = new CaseProject();
        c.setTitle("AI Coding 实际能提升多少生产力?");
        c.setSlug("ai-coding-workflow-experiment");
        c.setSummary("用 Claude Code + Codex 跑同一组任务,记录实际提升。");
        c.setType("EXPERIMENT"); c.setStatus("PUBLISHED"); c.setIsFeatured(1);
        c.setCategoryId(catId);
        c.setPublishedAt(parseDate("2026-08-30"));
        c.setProblemMd(problem4());
        c.setThinkingMd(thinking4());
        c.setApproachMd(approach4());
        c.setArchitectureMd(architecture4());
        c.setImplementationMd(implementation4());
        c.setResultMd(result4());
        c.setLearnedMd(learned4());
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now()); c.setDeleted(0);
        return c;
    }

    // ==================== Article Categories ====================

    private void seedArticleCategories() {
        if (!isEmpty("t_article_category", articleCategoryMapper)) return;
        for (var c : List.of(
            artCat("All",          "all",          0),
            artCat("AI Agent",     "agent",        1),
            artCat("AI Workflow",  "workflow",     2),
            artCat("AI Coding",    "coding",       3),
            artCat("AI Business",  "business",     4),
            artCat("Productivity", "productivity", 5)
        )) articleCategoryMapper.insert(c);
        log.info("[Seed] Inserted 6 article categories");
    }

    private ArticleCategory artCat(String n, String s, int sort) {
        ArticleCategory c = new ArticleCategory();
        c.setName(n); c.setSlug(s); c.setSort(sort);
        c.setCreatedAt(LocalDateTime.now()); c.setUpdatedAt(LocalDateTime.now()); c.setDeleted(0);
        return c;
    }

    // ==================== Article Tags ====================

    private void seedArticleTags() {
        if (!isEmpty("t_article_tag", articleTagMapper)) return;
        for (var t : List.of(
            tag("Claude Code"), tag("Codex"), tag("Cursor"), tag("Gemini CLI"),
            tag("Multi-Agent"), tag("Workflow"), tag("MCP"),
            tag("Prompt Engineering"), tag("ROI"), tag("Small Business"),
            tag("Sales"), tag("Productivity")
        )) articleTagMapper.insert(t);
        log.info("[Seed] Inserted 12 article tags");
    }

    private ArticleTag tag(String n) {
        ArticleTag t = new ArticleTag();
        t.setName(n); t.setSlug(n.toLowerCase().replace(" ", "-"));
        t.setCreatedAt(LocalDateTime.now()); t.setUpdatedAt(LocalDateTime.now()); t.setDeleted(0);
        return t;
    }

    // ==================== Articles ====================

    private void seedArticles() {
        if (!isEmpty("t_article", articleMapper)) return;
        var agent = articleCategoryMapper.selectOne(new QueryWrapper<ArticleCategory>().eq("slug", "agent").eq("deleted", 0));
        var coding = articleCategoryMapper.selectOne(new QueryWrapper<ArticleCategory>().eq("slug", "coding").eq("deleted", 0));
        var business = articleCategoryMapper.selectOne(new QueryWrapper<ArticleCategory>().eq("slug", "business").eq("deleted", 0));
        var workflow = articleCategoryMapper.selectOne(new QueryWrapper<ArticleCategory>().eq("slug", "workflow").eq("deleted", 0));

        articleMapper.insert(buildArticle(
            "ai-agent-vs-workflow", "AI Agent 和 AI Workflow,到底什么关系?",
            "从产品角度拆解 Agent 和 Workflow 的本质区别与组合方式。",
            agent.getId(), "PUBLISHED", 1, "2026-09-22", 7, true,
            "AI Agent vs AI Workflow — 区别、组合与产品定位",
            "深入拆解 Agent 与 Workflow 的本质差异,以及它们如何组合出真正可用的产品。",
            article1Content()
        ));
        articleMapper.insert(buildArticle(
            "claude-code-as-product", "把 Claude Code 当作产品,而不是工具",
            "为什么 CLI 形式的 AI Coding 工具会成为下一个 Native IDE。",
            coding.getId(), "PUBLISHED", 1, "2026-09-18", 8, true,
            "Claude Code 是产品,不是工具 — CLI 为什么赢",
            "CLI 形式的 AI Coding 工具会成为下一代 Native IDE,而不是 VSCode 插件。",
            article2Content()
        ));
        articleMapper.insert(buildArticle(
            "real-ai-roi", "真实的 AI ROI:不是替代,而是放大",
            "从实际案例看,AI 在企业里最先产生回报的从来不是\"自动化\"。",
            business.getId(), "PUBLISHED", 1, "2026-08-25", 9, true,
            "真实的 AI ROI — 为什么企业最先回本的从来不是自动化",
            "AI 在企业里的真实回报路径,以及为什么\"放大\"比\"自动化\"更早产生价值。",
            article3Content()
        ));
        articleMapper.insert(buildArticle(
            "mcp-the-protocol-everyone-misunderstands", "MCP:每个开发者都误解了的协议",
            "Model Context Protocol 不是\"AI 工具的统一 API\",它是 Agent 的文件系统。",
            agent.getId(), "PUBLISHED", 0, "2026-09-05", 6, false,
            "MCP 协议的真实定位 — 不是统一 API,是 Agent 的文件系统",
            "为什么 MCP 不是简单的\"AI 工具标准化\",而是 Agent 时代的基础设施。",
            article4Content()
        ));
        articleMapper.insert(buildArticle(
            "workflow-builder-design-lessons", "做 Workflow Builder 的 5 个设计教训",
            "从 0 设计 AI Workflow Builder 的实战经验,以及用户的真实使用习惯。",
            workflow.getId(), "PUBLISHED", 0, "2026-09-28", 6, false,
            "Workflow Builder 设计教训 — 5 个用户行为观察",
            "做 AI Workflow Builder 的真实经验:用户怎么用、怎么卡住、怎么改进。",
            article5Content()
        ));
        log.info("[Seed] Inserted 5 articles");
    }

    private Article buildArticle(String slug, String title, String summary, Long catId,
                                  String status, int featured, String publishedAt,
                                  int readMin, boolean isFeatured, String seoTitle,
                                  String seoDesc, String content) {
        Article a = new Article();
        a.setSlug(slug); a.setTitle(title); a.setSummary(summary);
        a.setContentMd(content); a.setCategoryId(catId);
        a.setStatus(status); a.setIsFeatured(isFeatured ? 1 : 0);
        // authorId left null — system-seeded content; authorship is "Aindgc" the org
        a.setPublishedAt(parseDate(publishedAt));
        a.setSeoTitle(seoTitle); a.setSeoDescription(seoDesc);
        a.setSeoKeywords("AI Insights, Aindgc, " + title);
        a.setViewCount(0L); a.setLikeCount(0L);
        a.setCreatedAt(LocalDateTime.now()); a.setUpdatedAt(LocalDateTime.now()); a.setDeleted(0);
        return a;
    }

    // ==================== Article-Tag Relations ====================

    private void seedArticleTagRelations() {
        // article slug -> tag slugs
        Map<String, List<String>> map = Map.of(
            "ai-agent-vs-workflow", List.of("multi-agent", "workflow"),
            "claude-code-as-product", List.of("claude-code", "cursor"),
            "real-ai-roi", List.of("roi", "small-business"),
            "mcp-the-protocol-everyone-misunderstands", List.of("mcp", "multi-agent"),
            "workflow-builder-design-lessons", List.of("workflow", "productivity")
        );

        int inserted = 0;
        for (var entry : map.entrySet()) {
            Article a = articleMapper.selectBySlug(entry.getKey());
            if (a == null) continue;
            for (String tagSlug : entry.getValue()) {
                ArticleTag tag = articleTagMapper.selectOne(
                    new QueryWrapper<ArticleTag>().eq("slug", tagSlug).eq("deleted", 0));
                if (tag == null) continue;
                jdbcTemplate.update(
                    "INSERT IGNORE INTO t_article_tag_relation (article_id, tag_id) VALUES (?, ?)",
                    a.getId(), tag.getId()
                );
                inserted++;
            }
        }
        log.info("[Seed] Linked {} article-tag relations", inserted);
    }

    private LocalDateTime parseDate(String s) {
        return LocalDateTime.parse(s + "T00:00:00");
    }

    // ====================================================================
    //  CASE 1 — Aindgc Workbench
    // ====================================================================

    private String problem1() {
        return """
            我有太多想法想用 AI 实现,但每次都要重新组织 prompt / context / 工具调用——重复劳动,而且无法版本化。

            通用 AI 工具给你的是空白对话框,真正的生产力来自把工作沉淀为可复用结构。""";
    }

    private String thinking1() {
        return """
            我需要的是"工作流工厂",而不是又一个 chat 工具。

            两个关键判断:
            1. 不依赖 AI API — 第一版应该是 deterministic,任何人都能跑、可重现
            2. 输出必须是机器可读的,这样未来可以接到 Dify / n8n / Claude Code / Codex 等 runtime""";
    }

    private String approach1() {
        return """
            把 workflow 拆成 6 步标准节点:
            - Trigger:什么触发这个工作流
            - AI:哪一步需要 AI 推理
            - Condition:基于什么规则分支
            - Tool:调用什么外部服务
            - Action:写到哪里 / 通知谁
            - Output:产出什么格式

            每个工具生成结构化 Markdown + JSON schema,Phase 12 接入 runtime 后可以直接执行。""";
    }

    private String architecture1() {
        return """
            前端:Vite + Vue 3 + TypeScript + Pinia
            画布:Vue Flow(@vue-flow/core)
            Generator:纯 TypeScript 规则引擎(无外部 API 依赖)
            存储:localStorage(Phase 14 → 后端)

            未来的 runtime 接入:
            - JSON Schema → Claude Code / Codex tool calling
            - Markdown → 任何 LLM 的 system prompt
            - 节点依赖关系 → DAG scheduler""";
    }

    private String implementation1() {
        return """
            耗时:4 周,大部分时间在调整 design system 和节点类型。

            最大的工程决策:**手写 ZIP writer**(零依赖)而不是引入 JSZip。为了 Phase 4 的多文件 bundle 输出,实现了完整的 PKWARE APPNOTE 6.3.x 格式——这是教科书式的"先有需求再有依赖"案例。""";
    }

    private String result1() {
        return """
            已发布 6 个工具生成器 + 1 个 Workflow Builder。

            用户行为(内部测试):
            - 平均会话时长:8 分钟
            - 工具生成后导出率:73%
            - Workflow Builder 平均节点数:5.4

            Phase 2 计划:接入真实 AI runtime,把 JSON workflow 真正跑起来。""";
    }

    private String learned1() {
        return """
            1. **规则引擎先行**比 AI 先行更稳妥——AI 的边际收益在规则稳定后才会显现
            2. **结构化输出**(Markdown + JSON)比纯对话更有价值——可以搜索、版本化、复用
            3. **手写小工具**比引入大依赖更灵活——ZIP writer 只有 100 行,JSZip 是 80KB
            4. **Vue Flow** 的 API 设计很成熟,完全值得推荐""";
    }

    // ====================================================================
    //  CASE 2 — Multi-Agent PoC
    // ====================================================================

    private String problem2() {
        return "Multi-Agent 协作的理论文章很多,但实际跑通一个 6 节点的 demo 不容易。我想验证:\n- 节点可视化是否真的降低编排复杂度\n- JSON 导出能否被 runtime 直接消费\n- 人类在哪个环节需要介入";
    }

    private String thinking2() {
        return "选 6 节点,因为少于 5 个不够 multi-agent,多于 8 个超出心智容量。\n\n节点设计:\n1. Planner(主 Agent,负责任务拆解)\n2. Researcher(查询资料)\n3. Coder(写代码)\n4. Reviewer(评审)\n5. Condition(是否需要重做)\n6. Writer(汇总输出)\n\n关键判断:**用 JSON 协议**而不是自由对话——每个节点的输出是结构化数据,下一个节点 parse 后再推理。";
    }

    private String approach2() {
        return "1. 手工定义每个节点的 system prompt\n2. 用 Vue Flow 画 DAG\n3. 节点间通过共享 JSON state 通信\n4. Condition 节点用 if/else + JSON Schema 验证\n5. 导出整个 DAG 为一份 JSON,提供给 runtime";
    }

    private String architecture2() {
        return "运行时:Claude API(直接调用)\n状态:DAG 节点的 JSON 持久化在 Pinia + IndexedDB\n可视化:Vue Flow 自定义节点\n导出:JSON 协议(aindgc.workflow/v1)\n\n未做的事:并行执行、超时控制、token 计费(都是 Phase 2)。";
    }

    private String implementation2() {
        return "3 天 PoC。\n\n最大的坑:Claude 的 tool calling 跟我的 JSON 协议对不上——它期望 OpenAI 风格的 tool_calls,我期望的是 plain JSON。\n\n解决:加了一层 adapter,Claude tool_calls → 我的 JSON。代码 30 行,但思考花了 1 天。";
    }

    private String result2() {
        return "PoC 验证通过:\n- 6 节点全部跑通\n- JSON 导出能被 LangChain 解析\n- 人类干预点(修改节点 prompt)显著提升输出质量\n\n未进入产品化:Token 成本和延迟都太高,不适合在线产品。";
    }

    private String learned2() {
        return """
            1. **JSON 协议是 multi-agent 的前提**——没有它,agent 间只能"自然语言对话",不可靠
            2. **人类干预点**比自动化程度更重要——一个能让用户修改 prompt 的节点,比纯自动化节点有用 10 倍
            3. **Token 成本**是 multi-agent 在生产环境的最大障碍(本次 PoC 单次跑 6 个 agent 用了 ~50k tokens,折合人民币 ¥1.5)""";
    }

    // ====================================================================
    //  CASE 3 — Skills Marketplace Concept
    // ====================================================================

    private String problem3() {
        return "SKILL.md 是个伟大的发明——一个文件就能定义一个 Agent Skill。但:\n- 找不到(SKILL.md 没有搜索引擎)\n- 没法版本化(git clone 整个 repo 太重)\n- 没法分享(只能 zip / 邮件)\n- 没法评估(用得好不好,没人知道)";
    }

    private String thinking3() {
        return "我的设想:\n1. SKILL.md 是 first-class artifact,有 metadata(name, version, author, tags, deps)\n2. 注册中心(skills.aindgc.com)提供搜索 / 版本 / 评分\n3. CLI 命令:`aindgc skill install sales-outreach@1.2.0`\n4. MCP(Model Context Protocol)作为分发通道\n\n为什么不做成 npm / pip?因为 SKILL.md 是 prompt artifact,不是代码——应该用自然语言 + 结构化元数据,而非纯代码。";
    }

    private String approach3() {
        return "原型规格:\n\n```yaml\n# SKILL.md frontmatter\nname: sales-outreach\nversion: 1.2.0\nauthor: aindgc\ntags: [sales, automation]\ndeps:\n  - name: crm-reader\n    version: ^1.0.0\nrating: 4.7/5 (1234 downloads)\n```\n\n```\n$ aindgc skill install sales-outreach\nInstalling sales-outreach@1.2.0...\n  ✓ Fetched metadata\n  ✓ Resolved dependencies\n  ✓ Saved to ~/.aindgc/skills/sales-outreach/SKILL.md\n```";
    }

    private String architecture3() {
        return "暂未实现。设计:\n\nRegistry: Cloudflare Workers + R2(SKILL.md 静态文件存储)\nDiscovery: 基于 tag / keyword / 评级\nVersioning: SemVer\nDistribution: MCP servers + standalone CLI\n\nPhase 2 才会开始 MVP。";
    }

    private String implementation3() {
        return "目前状态:只有概念和 README。\n\n未来 12 周计划:\n- Week 1-2:CLI 实现 + 本地注册表\n- Week 3-4:Web 搜索界面\n- Week 5-8:MCP 集成\n- Week 9-12:Community 工具(评分、评论、版本历史)";
    }

    private String result3() {
        return "文档化但未实现。\n\n类似项目已经在做了(Composio、Anthropic Skills),我的差异点是:\n- **跨平台**(Claude Code + Codex + Cursor + Gemini CLI 同时支持)\n- **元数据优先**(把 SKILL.md 当 artifact,不是文件)\n- **社区评级**";
    }

    private String learned3() {
        return """
            1. **Agent Skills 是个真实的需求**,但市场还很早,先发优势 > 完美主义
            2. **跨平台兼容性**比"做得最深入一个平台"更有战略价值——开发者不会被任何单一平台锁死
            3. **YAML frontmatter + Markdown body** 是 SKILL.md 的最佳格式——既能结构化,又能写长说明
            4. **CLI 优先**比 Web 优先更适合开发者工具""";
    }

    // ====================================================================
    //  CASE 4 — AI Coding Experiment
    // ====================================================================

    private String problem4() {
        return "AI Coding 工具铺天盖地,但\"提升 10 倍\"的宣传很少有可验证的数据。\n\n我自己做一组对比实验:同一组 5 个真实任务,不用 AI / 用 Claude Code / 用 Codex,记录耗时与代码质量。";
    }

    private String thinking4() {
        return "实验设计原则:\n1. 任务必须是我**真实做过**的(避免\"AI 适合的演示性任务\")\n2. 每个工具都给 30 分钟熟悉时间,避免新手惩罚\n3. 不用 AI 的时候我**禁止**查 Stack Overflow / 文档,只凭记忆——这样对比更公平\n4. 质量评估由我自己 + 1 个外部 reviewer 盲评";
    }

    private String approach4() {
        return "5 个任务:\n1. 写一个 Vue 3 组件(图标选择器)\n2. 给 Spring Boot API 写完整 CRUD 测试\n3. 重构一个 Python 数据处理脚本(从 Jupyter 到模块化)\n4. 修一个 Next.js 路由 bug\n5. 写一份 OpenAPI 3.0 spec\n\n每个任务分 3 轮:\n- Round A:不借助任何 AI\n- Round B:Claude Code\n- Round C:Codex CLI\n\n记录:总耗时、生成的代码行数、首次通过率、外部 reviewer 评分(1-10)";
    }

    private String architecture4() {
        return "不需要架构。\n\n数据收集:Excel 表 + 时间戳记录。\nReviewer:朋友(同级别开发),盲评代码质量。";
    }

    private String implementation4() {
        return "耗时:3 周(含熟悉时间)\n\n最大问题:Round A 因为\"不能查文档\",耗时虚高。但这是公平的——AI Coding 的核心卖点就是\"不用查文档\"。";
    }

    private String result4() {
        return """
            结果(概要):

            | 任务 | 无 AI | Claude Code | Codex |
            |------|-------|-------------|-------|
            | 图标选择器 | 28 min | 6 min | 9 min |
            | CRUD 测试 | 65 min | 22 min | 28 min |
            | Python 重构 | 45 min | 18 min | 15 min |
            | Next.js bug | 35 min | 8 min | 12 min |
            | OpenAPI spec | 22 min | 5 min | 4 min |

            总耗时:
            - 无 AI:195 min
            - Claude Code:59 min(3.3x)
            - Codex:68 min(2.9x)

            质量评分(1-10):
            - 无 AI:7.8
            - Claude Code:7.5
            - Codex:7.2

            **结论:Claude Code 提升 3.3x,质量持平;Codex 提升 2.9x,质量略降。**""";
    }

    private String learned4() {
        return """
            1. **AI Coding 的真实收益是 3x 左右**,不是宣传的 10x
            2. **质量不降**是亮点——前提是开发者 review AI 输出
            3. **熟悉时间** 是隐藏成本,新工具前 30 分钟收益可能为负
            4. **文档查询**是 AI Coding 最大的红利(我自己不用 AI 也得查 SO,只是没算进 Round A)
            5. **不同任务收益不同**——CRUD / 重构收益大,bug 修复中等,全新设计 AI 还不行""";
    }

    // ====================================================================
    //  ARTICLE 1 — AI Agent vs Workflow
    // ====================================================================

    private String article1Content() {
        return """
            # AI Agent 和 AI Workflow,到底什么关系?

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

            ```
            You are a research assistant.
            Tools: web_search, file_read, file_write
            Loop until task done:
              1. Think
              2. Pick a tool
              3. Run it
              4. Observe
              5. Decide: continue or finish
            ```

            ## Workflow 是什么

            Workflow 是**预定义的有序步骤**:

            - Trigger → AI → Condition → Tool → Action → Output
            - 每一步的输入输出是**结构化**的
            - 通常**不循环**(或者循环是受控的)
            - 可以**持久化**、**版本化**、**审计**

            ## 它们的关系

            ```
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
            ```

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

            下一篇文章我会讲怎么从 0 设计一个 AI Workflow,以及常见的踩坑。""";
    }

    // ====================================================================
    //  ARTICLE 2 — Claude Code as Product
    // ====================================================================

    private String article2Content() {
        return """
            # 把 Claude Code 当作产品,而不是工具

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

            Claude Code 在 macOS / Linux / Windows 上是同一个体验。它读 `CLAUDE.md`、跑 git、看文件——这些跟编辑器无关。

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
            2. `claude "实现 XX 功能"`
            3. Review diff
            4. `git commit`

            注意:**CLAUDE.md 成了新的"代码"**。

            ## 对个人开发者的启示

            ### 技能转变

            - **从写代码 → 写规范**:CLAUDE.md、AGENTS.md 才是新代码
            - **从调试代码 → 调试 AI**:会写 prompt、会选模型、会设计 system message
            - **从单机 IDE → 命令行工程**:git / grep / curl / jq / docker 这些 CLI 工具的熟练度更重要

            ### 项目结构的变化

            ```
            my-project/
            ├── CLAUDE.md          # AI 工作规范
            ├── AGENTS.md          # 多 agent 协作规范
            ├── docs/
            │   ├── architecture.md
            │   └── decisions.md
            ├── src/
            └── tests/
            ```

            AI 友好的项目结构,跟传统项目结构不一样。

            ## 对团队的启示

            ### 文档化是新的代码审查

            传统 PR review 看代码逻辑。新模式:PR review 看**规范是否清晰**。

            ```md
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
            ```

            这种规范越具体,AI 输出越稳。

            ## 我的判断

            **未来 3 年,Native AI IDE 会吃掉传统 IDE 50% 的份额。**

            不是 VSCode 加 AI 插件那种渐进式,而是**重新设计** —— 就像 iPhone 重新设计了手机,而不是把键盘手机加个触屏。

            Claude Code 是这个未来的早期形态。

            ## 总结

            - CLI 不是过渡形态,**它是终局**
            - **CLAUDE.md 是新的代码**,文档化能力 = 编程能力
            - 团队工程文化要从"代码 review"转向"规范 review"
            - 个人开发者要**学会写规范**,而不是只学会写代码""";
    }

    // ====================================================================
    //  ARTICLE 3 — Real AI ROI
    // ====================================================================

    private String article3Content() {
        return """
            # 真实的 AI ROI:不是替代,而是放大

            > 一句话:**AI 在企业里最先回本的,从来不是"自动化",而是"放大"。**

            ## 一个常见误区

            很多企业评估 AI ROI 时,逻辑是这样的:

            ```
            节省人力 = 员工人数 × 平均工资 × 自动化比例
            ```

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

            ```
            AI 真实 ROI =
              (质量提升带来的额外收入)
            + (速度提升带来的额外产出)
            + (范围扩大带来的新收入)
            - (AI 工具成本)
            - (数据治理成本)
            - (人类 review / 监督成本)
            ```

            **几乎所有情况下,前 3 项(放大) >> 后 3 项(替代 + 成本)。**

            ## 总结

            - AI 的真实价值**不在替代**,**在放大**
            - 先做"质量放大"(1-3 个月回本),再做"速度放大"(3-6 个月),最后做"范围放大"(6-12 个月)
            - 衡量"质量指标"(转化率、CSAT、bug 率),不是"节省时间"
            - 数据治理是隐藏成本,先做再说 AI""";
    }

    // ====================================================================
    //  ARTICLE 4 — MCP Misunderstood
    // ====================================================================

    private String article4Content() {
        return """
            # MCP:每个开发者都误解了的协议

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

            ```
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
            ```

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
            - 不是所有场景都适合,简单的工具调用用 OpenAPI 就够了""";
    }

    // ====================================================================
    //  ARTICLE 5 — Workflow Builder Design Lessons
    // ====================================================================

    private String article5Content() {
        return """
            # 做 Workflow Builder 的 5 个设计教训

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

            下一个版本我们会在这些数据基础上重新设计 UX,目标是把"第二次保存率"从 43% 提升到 60%。""";
    }
}
