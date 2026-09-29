package com.aindgc.ai.controller;

import com.aindgc.ai.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Phase 12: pure computation. Phase 14 will persist results to t_checkup_record.
 */
@Tag(name = "Checkup", description = "AI Work Checkup scoring")
@RestController
@RequestMapping("/api/checkup")
public class CheckupController {

    /** Mirrors frontend utils/generators/checkupScorer.ts */
    private static final List<Question> QUESTIONS = List.of(
        new Question("industry",  1, "Which industry are you in?", List.of(
            opt("Sales & Marketing", "sales", 1), opt("Customer Service", "support", 1),
            opt("Software / Tech", "tech", 1), opt("Operations / HR", "ops", 1),
            opt("Education / Content", "edu", 1), opt("Manufacturing", "mfg", 1),
            opt("Other", "other", 1))),
        new Question("role", 2, "What is your role?", List.of(
            opt("Individual contributor", "ic", 1), opt("Team lead / manager", "lead", 1),
            opt("Founder / executive", "exec", 1), opt("Operations / analyst", "ops", 1))),
        new Question("workload", 3, "How much of your work is repeatable?", List.of(
            opt("Almost none", "a", 0), opt("Some 20-40%", "b", 2),
            opt("A lot 40-70%", "c", 4), opt("Almost all", "d", 5))),
        new Question("pain", 4, "Where does time leak?", List.of(
            opt("Writing", "writing", 1), opt("Research", "research", 1),
            opt("Data entry", "data", 1), opt("Customer Q&A", "support", 1),
            opt("Meetings", "meetings", 1), opt("Coding", "coding", 1))),
        new Question("data", 5, "How is your data stored?", List.of(
            opt("Modern SaaS", "saas", 5), opt("Spreadsheets", "sheet", 4),
            opt("Own DB", "db", 5), opt("Mixed", "mixed", 3),
            opt("Paper / email", "paper", 1))),
        new Question("aiUsage", 6, "How is your team using AI today?", List.of(
            opt("Never", "none", 0), opt("Occasional", "casual", 2),
            opt("Daily", "daily", 4), opt("Embedded", "embedded", 5)))
    );

    private static final Map<String, List<Opportunity>> POOL = Map.of(
        "writing",   List.of(new Opportunity("meeting-summary", "Meeting Summary", "AI 总结会议纪要,提取行动项。", "High", "Low"), new Opportunity("customer-followup", "Customer Follow-up", "AI 写个性化跟进邮件。", "High", "Medium"), new Opportunity("weekly-report", "Weekly Report", "汇总数据生成报告初稿。", "Medium", "Low")),
        "research",  List.of(new Opportunity("knowledge-search", "Knowledge Search", "AI 检索内部文档回答问题。", "High", "Medium"), new Opportunity("competitor-watch", "Competitor Watch", "定时抓取竞品动态。", "Medium", "Medium")),
        "data",      List.of(new Opportunity("lead-qualification", "Lead Qualification", "AI 评分线索并写回 CRM。", "High", "Medium"), new Opportunity("invoice-ocr", "Invoice OCR", "AI 提取发票字段自动入账。", "Medium", "Low")),
        "support",   List.of(new Opportunity("ticket-triage", "Ticket Triage", "AI 自动分类 + 紧急度 + 分配坐席。", "High", "Medium"), new Opportunity("faq-bot", "FAQ Bot", "基于知识库自动回复。", "High", "Medium")),
        "meetings",  List.of(new Opportunity("meeting-summary-2", "Meeting Summary", "AI 转写 + 提取行动项。", "High", "Low"), new Opportunity("scheduling-bot", "Scheduling Bot", "AI 助理日程协调。", "Medium", "Medium")),
        "coding",    List.of(new Opportunity("ai-coding-pair", "AI Coding Pair", "Claude Code / Codex 引入工作流。", "High", "Medium"), new Opportunity("code-review-bot", "Code Review Bot", "AI 评审 PR diff。", "Medium", "Low"))
    );

    @PostMapping("/submit")
    @Operation(summary = "Submit checkup answers and get score + opportunities")
    public Result<Map<String, Object>> submit(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) body.getOrDefault("answers", Map.of());

        int score = 0, max = 0;
        List<String> strengths = new ArrayList<>();
        List<String> gaps = new ArrayList<>();
        List<Map<String, Object>> breakdown = new ArrayList<>();

        for (Question q : QUESTIONS) {
            String ans = String.valueOf(answers.getOrDefault(q.id, ""));
            QOption opt = q.options.stream().filter(o -> o.value.equals(ans)).findFirst().orElse(null);
            int weight = opt != null ? opt.weight : 0;
            int qMax = q.options.stream().mapToInt(o -> o.weight).max().orElse(1);
            score += weight;
            max += qMax;
            breakdown.add(Map.of("questionId", q.id, "answer", ans, "weight", weight, "max", qMax));
            if (weight >= qMax * 0.8) strengths.add(q.title);
            else if (weight <= qMax * 0.3) gaps.add(q.title);
        }

        int scorePct = max > 0 ? (int) Math.round((score / (double) max) * 100) : 0;
        String band = scorePct >= 80 ? "Architect" : scorePct >= 60 ? "Operator" : scorePct >= 35 ? "Builder" : "Explorer";

        String pain = String.valueOf(answers.getOrDefault("pain", "writing"));
        List<Opportunity> pool = POOL.getOrDefault(pain, POOL.get("writing"));
        List<Map<String, Object>> opportunities = pool.stream().map(o -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("opportunity", Map.of(
                "id", o.id, "title", o.title, "description", o.description,
                "impact", o.impact, "difficulty", o.difficulty
            ));
            m.put("relevance", 0.7);
            m.put("reason", reasonFor(pain));
            return m;
        }).collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", scorePct);
        result.put("band", band);
        result.put("strengths", strengths);
        result.put("gaps", gaps);
        result.put("opportunities", opportunities);
        result.put("breakdown", breakdown);
        result.put("disclaimer", "Heuristic self-assessment. Use as a starting point, not a definitive audit.");
        return Result.ok(result);
    }

    private static String reasonFor(String pain) {
        return switch (pain) {
            case "writing"   -> "You spend significant time on writing — AI excels here.";
            case "research"  -> "Research tasks are high-leverage targets for AI.";
            case "data"      -> "Data entry is a prime candidate for AI automation.";
            case "support"   -> "Customer Q&A is one of the highest-ROI AI use cases.";
            case "meetings"  -> "Meeting summarization is a quick win.";
            case "coding"    -> "AI coding tools deliver immediate productivity gains.";
            default          -> "High-impact opportunity based on your pain point.";
        };
    }

    private static QOption opt(String label, String value, int weight) {
        return new QOption(label, value, weight);
    }

    record Question(String id, int step, String title, List<QOption> options) {}
    record QOption(String label, String value, int weight) {}
    record Opportunity(String id, String title, String description, String impact, String difficulty) {}
}
