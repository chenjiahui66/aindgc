package com.aindgc.ai.controller.admin;

import com.aindgc.ai.common.PageResult;
import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.CaseProject;
import com.aindgc.ai.mapper.CaseProjectMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Tag(name = "Admin · Cases")
@RestController
@RequestMapping("/api/admin/cases")
@RequiredArgsConstructor
public class AdminCaseController {

    private final CaseProjectMapper mapper;

    @GetMapping
    @Operation(summary = "List all cases (admin)")
    public Result<PageResult<CaseProject>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "20") long size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type
    ) {
        QueryWrapper<CaseProject> w = new QueryWrapper<>();
        if (status != null && !status.isBlank() && !"all".equals(status)) w.eq("status", status);
        if (type != null && !type.isBlank() && !"all".equals(type)) w.eq("type", type);
        w.orderByDesc("updated_at");
        return Result.ok(PageResult.of(mapper.selectPage(new Page<>(page, size), w)));
    }

    @GetMapping("/{id}")
    public Result<CaseProject> get(@PathVariable Long id) {
        return Result.ok(mapper.selectById(id));
    }

    @PostMapping
    public Result<CaseProject> save(@RequestBody CaseProject c) {
        if (c.getId() == null) c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());
        if (c.getStatus() == null) c.setStatus("DRAFT");
        if (c.getViewCount() == null) c.setViewCount(0L);
        if (c.getDeleted() == null) c.setDeleted(0);
        if (c.getId() == null) mapper.insert(c); else mapper.updateById(c);
        return Result.ok(c);
    }

    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id, @RequestParam(defaultValue = "PUBLISHED") String status) {
        CaseProject c = mapper.selectById(id);
        if (c == null) return Result.ok();
        c.setStatus(status);
        if ("PUBLISHED".equals(status) && c.getPublishedAt() == null) {
            c.setPublishedAt(LocalDateTime.now());
        }
        c.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(c);
        return Result.ok();
    }

    @PostMapping("/{id}/feature")
    public Result<Void> feature(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean featured) {
        CaseProject c = mapper.selectById(id);
        if (c == null) return Result.ok();
        c.setIsFeatured(featured ? 1 : 0);
        c.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(c);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        CaseProject c = mapper.selectById(id);
        if (c == null) return Result.ok();
        c.setDeleted(1);
        c.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(c);
        return Result.ok();
    }
}
