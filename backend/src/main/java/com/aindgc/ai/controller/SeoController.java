package com.aindgc.ai.controller;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.SeoPage;
import com.aindgc.ai.mapper.SeoPageMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@Tag(name = "SEO", description = "Per-page SEO config")
@RestController
@RequestMapping("/api/seo")
@RequiredArgsConstructor
public class SeoController {

    private final SeoPageMapper seoMapper;

    @GetMapping("/page")
    @Operation(summary = "Get SEO config by path or key")
    public Result<Map<String, Object>> page(
            @RequestParam(required = false) String path,
            @RequestParam(required = false) String key
    ) {
        SeoPage page = null;
        if (key != null && !key.isBlank()) page = seoMapper.selectByKey(key);
        else if (path != null && !path.isBlank()) page = seoMapper.selectByPath(path);
        if (page == null) return Result.ok(Map.of());
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("pageKey", page.getPageKey());
        m.put("pagePath", page.getPagePath());
        m.put("title", page.getTitle());
        m.put("description", page.getDescription());
        m.put("keywords", page.getKeywords());
        m.put("canonical", page.getCanonical());
        m.put("ogImage", page.getOgImage());
        m.put("robots", page.getRobots());
        m.put("schemaType", page.getSchemaType());
        return Result.ok(m);
    }
}
