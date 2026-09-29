package com.aindgc.ai.controller;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.SiteConfig;
import com.aindgc.ai.mapper.SiteConfigMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Site Config", description = "Public site configuration")
@RestController
@RequestMapping("/api/site/config")
@RequiredArgsConstructor
public class SiteConfigController {

    private final SiteConfigMapper configMapper;

    @GetMapping("/public")
    @Operation(summary = "Get all public site config")
    public Result<Map<String, String>> publicConfig() {
        Map<String, String> map = new LinkedHashMap<>();
        for (SiteConfig c : configMapper.selectPublic()) {
            map.put(c.getConfigKey(), c.getConfigValue());
        }
        return Result.ok(map);
    }
}
