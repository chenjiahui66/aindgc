package com.aindgc.ai.controller.admin;

import com.aindgc.ai.common.PageResult;
import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.Article;
import com.aindgc.ai.mapper.ArticleMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Tag(name = "Admin · Articles")
@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleMapper mapper;

    @GetMapping
    @Operation(summary = "List all articles (admin)")
    public Result<PageResult<Article>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "20") long size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q
    ) {
        QueryWrapper<Article> w = new QueryWrapper<>();
        if (status != null && !status.isBlank() && !"all".equals(status)) w.eq("status", status);
        if (q != null && !q.isBlank()) {
            w.and(qw -> qw.like("title", q).or().like("summary", q));
        }
        w.orderByDesc("updated_at");
        return Result.ok(PageResult.of(mapper.selectPage(new Page<>(page, size), w)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get article by id (admin)")
    public Result<Article> get(@PathVariable Long id) {
        return Result.ok(mapper.selectById(id));
    }

    @PostMapping
    @Operation(summary = "Create or update article")
    public Result<Article> save(@RequestBody Article a) {
        if (a.getId() == null) {
            a.setCreatedAt(LocalDateTime.now());
        }
        a.setUpdatedAt(LocalDateTime.now());
        if (a.getStatus() == null) a.setStatus("DRAFT");
        if (a.getViewCount() == null) a.setViewCount(0L);
        if (a.getLikeCount() == null) a.setLikeCount(0L);
        if (a.getDeleted() == null) a.setDeleted(0);
        if (a.getId() == null) {
            mapper.insert(a);
        } else {
            mapper.updateById(a);
        }
        return Result.ok(a);
    }

    @PostMapping("/{id}/publish")
    @Operation(summary = "Publish / unpublish")
    public Result<Void> publish(@PathVariable Long id, @RequestParam(defaultValue = "PUBLISHED") String status) {
        Article a = mapper.selectById(id);
        if (a == null) return Result.ok();
        a.setStatus(status);
        if ("PUBLISHED".equals(status) && a.getPublishedAt() == null) {
            a.setPublishedAt(LocalDateTime.now());
        }
        a.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(a);
        return Result.ok();
    }

    @PostMapping("/{id}/feature")
    @Operation(summary = "Toggle featured flag")
    public Result<Void> feature(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean featured) {
        Article a = mapper.selectById(id);
        if (a == null) return Result.ok();
        a.setIsFeatured(featured ? 1 : 0);
        a.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(a);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete")
    public Result<Void> delete(@PathVariable Long id) {
        Article a = mapper.selectById(id);
        if (a == null) return Result.ok();
        a.setDeleted(1);
        a.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(a);
        return Result.ok();
    }
}
