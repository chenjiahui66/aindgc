package com.aindgc.ai.controller;

import com.aindgc.ai.common.PageResult;
import com.aindgc.ai.common.Result;
import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.entity.CaseCategory;
import com.aindgc.ai.entity.CaseProject;
import com.aindgc.ai.exception.BusinessException;
import com.aindgc.ai.mapper.CaseCategoryMapper;
import com.aindgc.ai.mapper.CaseProjectMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Cases", description = "Case projects")
@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseProjectMapper caseMapper;
    private final CaseCategoryMapper categoryMapper;

    @GetMapping
    @Operation(summary = "List cases")
    public Result<PageResult<CaseProject>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type
    ) {
        QueryWrapper<CaseProject> w = new QueryWrapper<>();
        w.eq("status", "PUBLISHED").eq("deleted", 0);
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            w.eq("category_id",
                categoryMapper.selectCount(new QueryWrapper<CaseCategory>().eq("slug", category).eq("deleted", 0)) > 0
                    ? categoryMapper.selectOne(new QueryWrapper<CaseCategory>().eq("slug", category).eq("deleted", 0)).getId()
                    : 0);
        }
        if (type != null && !type.isBlank() && !"all".equalsIgnoreCase(type)) {
            w.eq("type", type.toUpperCase());
        }
        w.orderByDesc("is_featured").orderByDesc("published_at");
        Page<CaseProject> p = caseMapper.selectPage(new Page<>(page, size), w);
        return Result.ok(PageResult.of(p));
    }

    @GetMapping("/featured")
    @Operation(summary = "List featured cases")
    public Result<List<CaseProject>> featured(@RequestParam(defaultValue = "3") int limit) {
        return Result.ok(caseMapper.selectFeatured(Math.min(limit, 20)));
    }

    @GetMapping("/categories")
    @Operation(summary = "List case categories")
    public Result<List<CaseCategory>> categories() {
        return Result.ok(categoryMapper.selectList(new QueryWrapper<CaseCategory>().eq("deleted", 0).orderByAsc("sort")));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get case by slug")
    public Result<CaseProject> detail(@PathVariable String slug) {
        CaseProject c = caseMapper.selectBySlug(slug);
        if (c == null) throw new BusinessException(ResultCode.CASE_NOT_FOUND);
        caseMapper.incrementViewCount(c.getId());
        return Result.ok(c);
    }
}
