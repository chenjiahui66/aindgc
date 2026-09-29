package com.aindgc.ai.controller;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.entity.Tool;
import com.aindgc.ai.entity.ToolCategory;
import com.aindgc.ai.exception.BusinessException;
import com.aindgc.ai.mapper.ToolCategoryMapper;
import com.aindgc.ai.mapper.ToolMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Tools", description = "AI tools catalog")
@RestController
@RequestMapping("/api/tools")
@RequiredArgsConstructor
public class ToolController {

    private final ToolMapper toolMapper;
    private final ToolCategoryMapper categoryMapper;

    @GetMapping
    @Operation(summary = "List all published tools")
    public Result<List<Tool>> list() {
        return Result.ok(toolMapper.selectList(
            new QueryWrapper<Tool>().eq("status", "PUBLISHED").eq("deleted", 0)
                .orderByAsc("sort").orderByAsc("id")
        ));
    }

    @GetMapping("/featured")
    @Operation(summary = "List featured tools")
    public Result<List<Tool>> featured(@RequestParam(defaultValue = "6") int limit) {
        return Result.ok(toolMapper.selectFeatured(Math.min(limit, 20)));
    }

    @GetMapping("/categories")
    @Operation(summary = "List tool categories")
    public Result<List<ToolCategory>> categories() {
        return Result.ok(categoryMapper.selectList(
            new QueryWrapper<ToolCategory>().eq("deleted", 0).orderByAsc("sort")
        ));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get tool by slug")
    public Result<Tool> detail(@PathVariable String slug) {
        Tool t = toolMapper.selectBySlug(slug);
        if (t == null) throw new BusinessException(ResultCode.TOOL_NOT_FOUND);
        toolMapper.incrementViewCount(t.getId());
        return Result.ok(t);
    }
}
