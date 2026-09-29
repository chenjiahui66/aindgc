package com.aindgc.ai.controller.admin;

import com.aindgc.ai.common.PageResult;
import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.Tool;
import com.aindgc.ai.mapper.ToolMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Tag(name = "Admin · Tools")
@RestController
@RequestMapping("/api/admin/tools")
@RequiredArgsConstructor
public class AdminToolController {

    private final ToolMapper mapper;

    @GetMapping
    public Result<PageResult<Tool>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "20") long size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q
    ) {
        QueryWrapper<Tool> w = new QueryWrapper<>();
        if (status != null && !status.isBlank() && !"all".equals(status)) w.eq("status", status);
        if (q != null && !q.isBlank()) {
            w.and(qw -> qw.like("name", q).or().like("description", q));
        }
        w.orderByAsc("sort").orderByAsc("id");
        return Result.ok(PageResult.of(mapper.selectPage(new Page<>(page, size), w)));
    }

    @GetMapping("/{id}")
    public Result<Tool> get(@PathVariable Long id) {
        return Result.ok(mapper.selectById(id));
    }

    @PostMapping
    public Result<Tool> save(@RequestBody Tool t) {
        if (t.getId() == null) t.setCreatedAt(LocalDateTime.now());
        t.setUpdatedAt(LocalDateTime.now());
        if (t.getStatus() == null) t.setStatus("DRAFT");
        if (t.getViewCount() == null) t.setViewCount(0L);
        if (t.getGenerateCount() == null) t.setGenerateCount(0L);
        if (t.getDeleted() == null) t.setDeleted(0);
        if (t.getId() == null) mapper.insert(t); else mapper.updateById(t);
        return Result.ok(t);
    }

    @PostMapping("/{id}/publish")
    public Result<Void> publish(@PathVariable Long id, @RequestParam(defaultValue = "PUBLISHED") String status) {
        Tool t = mapper.selectById(id);
        if (t == null) return Result.ok();
        t.setStatus(status);
        t.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(t);
        return Result.ok();
    }

    @PostMapping("/{id}/feature")
    public Result<Void> feature(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean featured) {
        Tool t = mapper.selectById(id);
        if (t == null) return Result.ok();
        t.setFeatured(featured ? 1 : 0);
        t.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(t);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        Tool t = mapper.selectById(id);
        if (t == null) return Result.ok();
        t.setDeleted(1);
        t.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(t);
        return Result.ok();
    }
}
