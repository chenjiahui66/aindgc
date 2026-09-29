package com.aindgc.ai.controller.admin;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.mapper.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Admin · Dashboard")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final ArticleMapper articleMapper;
    private final CaseProjectMapper caseMapper;
    private final ToolMapper toolMapper;
    private final UserMapper userMapper;

    @GetMapping("/dashboard/summary")
    @Operation(summary = "Admin dashboard summary")
    public Result<Map<String, Object>> summary() {
        Map<String, Object> m = new LinkedHashMap<>();

        // Headline counts
        long totalArticles = articleMapper.selectCount(null);
        long totalCases = caseMapper.selectCount(null);
        long totalTools = toolMapper.selectCount(null);
        long totalUsers = userMapper.selectCount(null);

        m.put("totalArticles", totalArticles);
        m.put("totalCases", totalCases);
        m.put("totalTools", totalTools);
        m.put("totalUsers", totalUsers);

        // Published vs drafts
        long publishedArticles = articleMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.aindgc.ai.entity.Article>().eq("status", "PUBLISHED"));
        long draftArticles = totalArticles - publishedArticles;
        m.put("publishedArticles", publishedArticles);
        m.put("draftArticles", draftArticles);

        long publishedTools = toolMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.aindgc.ai.entity.Tool>().eq("status", "PUBLISHED"));
        m.put("publishedTools", publishedTools);

        // Featured
        long featuredArticles = articleMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.aindgc.ai.entity.Article>().eq("is_featured", 1));
        long featuredCases = caseMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.aindgc.ai.entity.CaseProject>().eq("is_featured", 1));
        m.put("featuredArticles", featuredArticles);
        m.put("featuredCases", featuredCases);

        // Recent
        List<Map<String, Object>> recentArticles = articleMapper.selectList(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.aindgc.ai.entity.Article>()
                .orderByDesc("updated_at").last("LIMIT 5"))
            .stream().map(a -> {
                Map<String, Object> r = new LinkedHashMap<>();
                r.put("id", a.getId()); r.put("title", a.getTitle());
                r.put("status", a.getStatus()); r.put("updatedAt", a.getUpdatedAt());
                return r;
            }).toList();
        m.put("recentArticles", recentArticles);

        // 7-day user signup trend (last 7 days, all zeros if too few)
        Map<String, Long> users7d = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.plusDays(1).atStartOfDay();
            long c = userMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.aindgc.ai.entity.User>()
                    .between("created_at", start, end));
            users7d.put(day.toString(), c);
        }
        m.put("users7d", users7d);

        return Result.ok(m);
    }
}
