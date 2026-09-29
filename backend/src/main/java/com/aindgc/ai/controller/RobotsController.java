package com.aindgc.ai.controller;

import com.aindgc.ai.entity.SiteConfig;
import com.aindgc.ai.mapper.SiteConfigMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "SEO", description = "Sitemap / robots")
@RestController
@RequiredArgsConstructor
public class RobotsController {

    private final SiteConfigMapper siteConfigMapper;

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    @Operation(summary = "Generate robots.txt")
    public ResponseEntity<String> robots() {
        SiteConfig cfg = siteConfigMapper.selectByKey("site.url");
        String siteUrl = cfg != null && cfg.getConfigValue() != null ? cfg.getConfigValue() : "https://aindgc.com";

        String body = """
            User-agent: *
            Allow: /
            Disallow: /admin/
            Disallow: /workflow/builder

            Sitemap: %s/sitemap.xml
            """.formatted(siteUrl);
        return ResponseEntity.ok()
                .header("Content-Type", "text/plain; charset=utf-8")
                .body(body);
    }
}
