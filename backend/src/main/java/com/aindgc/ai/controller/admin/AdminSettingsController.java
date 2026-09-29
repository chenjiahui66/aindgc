package com.aindgc.ai.controller.admin;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.SiteConfig;
import com.aindgc.ai.mapper.SiteConfigMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "Admin · Settings")
@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final SiteConfigMapper mapper;

    @GetMapping
    @Operation(summary = "List all site config (including private)")
    public Result<List<SiteConfig>> list() {
        return Result.ok(mapper.selectList(null));
    }

    @PutMapping("/{key}")
    @Operation(summary = "Update site config by key")
    public Result<SiteConfig> update(@PathVariable("key") String key, @RequestBody SiteConfig body) {
        SiteConfig existing = mapper.selectByKey(key);
        if (existing == null) {
            SiteConfig c = new SiteConfig();
            c.setConfigKey(key);
            c.setConfigValue(body.getConfigValue() != null ? body.getConfigValue() : "");
            c.setValueType(body.getValueType() != null ? body.getValueType() : "STRING");
            c.setDescription(body.getDescription());
            c.setIsPublic(body.getIsPublic() != null ? body.getIsPublic() : 1);
            c.setCreatedAt(LocalDateTime.now());
            c.setUpdatedAt(LocalDateTime.now());
            mapper.insert(c);
            return Result.ok(c);
        }
        if (body.getConfigValue() != null) existing.setConfigValue(body.getConfigValue());
        if (body.getValueType() != null) existing.setValueType(body.getValueType());
        if (body.getDescription() != null) existing.setDescription(body.getDescription());
        if (body.getIsPublic() != null) existing.setIsPublic(body.getIsPublic());
        existing.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(existing);
        return Result.ok(existing);
    }
}
