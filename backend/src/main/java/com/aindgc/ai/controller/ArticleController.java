package com.aindgc.ai.controller;

import com.aindgc.ai.common.PageResult;
import com.aindgc.ai.common.Result;
import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.entity.Article;
import com.aindgc.ai.entity.ArticleCategory;
import com.aindgc.ai.entity.ArticleTag;
import com.aindgc.ai.exception.BusinessException;
import com.aindgc.ai.mapper.ArticleCategoryMapper;
import com.aindgc.ai.mapper.ArticleMapper;
import com.aindgc.ai.mapper.ArticleTagMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Tag(name = "Articles", description = "Articles / Insights")
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleMapper articleMapper;
    private final ArticleCategoryMapper categoryMapper;
    private final ArticleTagMapper tagMapper;

    @GetMapping
    @Operation(summary = "List articles")
    public Result<PageResult<Article>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String q
    ) {
        QueryWrapper<Article> w = new QueryWrapper<>();
        w.eq("status", "PUBLISHED").eq("deleted", 0);
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            ArticleCategory cat = categoryMapper.selectOne(
                new QueryWrapper<ArticleCategory>().eq("slug", category).eq("deleted", 0));
            if (cat != null) w.eq("category_id", cat.getId());
        }
        if (tag != null && !tag.isBlank()) {
            // tags filter: subquery
            w.inSql("id", "SELECT article_id FROM t_article_tag_relation r INNER JOIN t_article_tag t ON r.tag_id = t.id WHERE t.slug = '" + tag + "' AND t.deleted = 0");
        }
        if (q != null && !q.isBlank()) {
            w.and(qw -> qw.like("title", q).or().like("summary", q).or().like("seo_keywords", q));
        }
        w.orderByDesc("is_featured").orderByDesc("published_at");
        Page<Article> p = articleMapper.selectPage(new Page<>(page, size), w);
        return Result.ok(PageResult.of(p));
    }

    @GetMapping("/featured")
    @Operation(summary = "List featured articles")
    public Result<List<Article>> featured(@RequestParam(defaultValue = "3") int limit) {
        QueryWrapper<Article> w = new QueryWrapper<>();
        w.eq("status", "PUBLISHED").eq("deleted", 0).eq("is_featured", 1)
         .orderByDesc("published_at").last("LIMIT " + Math.min(limit, 20));
        return Result.ok(articleMapper.selectList(w));
    }

    @GetMapping("/categories")
    @Operation(summary = "List article categories")
    public Result<List<ArticleCategory>> categories() {
        QueryWrapper<ArticleCategory> w = new QueryWrapper<>();
        w.eq("deleted", 0).orderByAsc("sort");
        return Result.ok(categoryMapper.selectList(w));
    }

    @GetMapping("/tags")
    @Operation(summary = "List all article tags")
    public Result<List<ArticleTag>> tags() {
        return Result.ok(tagMapper.selectList(new QueryWrapper<ArticleTag>().eq("deleted", 0).orderByAsc("name")));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get article by slug")
    public Result<Map<String, Object>> detail(@PathVariable String slug) {
        Article a = articleMapper.selectBySlug(slug);
        if (a == null) throw new BusinessException(ResultCode.ARTICLE_NOT_FOUND);
        articleMapper.incrementViewCount(a.getId());
        List<ArticleTag> tags = tagMapper.selectTagsByArticleId(a.getId());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("article", a);
        result.put("tags", tags);
        return Result.ok(result);
    }

    @PostMapping("/{slug}/like")
    @Operation(summary = "Like an article (idempotent increment)")
    public Result<Map<String, Object>> like(@PathVariable String slug) {
        Article a = articleMapper.selectBySlug(slug);
        if (a == null) throw new BusinessException(ResultCode.ARTICLE_NOT_FOUND);
        articleMapper.incrementLikeCount(a.getId());
        // Re-read to get the fresh count
        Article fresh = articleMapper.selectById(a.getId());
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("likeCount", fresh != null ? fresh.getLikeCount() : 0L);
        return Result.ok(r);
    }
}
