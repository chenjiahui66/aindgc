package com.aindgc.ai.controller;

import com.aindgc.ai.entity.Article;
import com.aindgc.ai.entity.CaseProject;
import com.aindgc.ai.entity.SiteConfig;
import com.aindgc.ai.entity.Tool;
import com.aindgc.ai.mapper.*;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Dynamic sitemap.xml — generated from DB.
 * Disable in dev by environment variable, or override robots.txt.
 */
@Tag(name = "SEO", description = "Sitemap / robots")
@RestController
@RequiredArgsConstructor
public class SitemapController {

    private final ArticleMapper articleMapper;
    private final CaseProjectMapper caseMapper;
    private final ToolMapper toolMapper;
    private final SiteConfigMapper siteConfigMapper;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_DATE;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "Generate sitemap.xml from DB")
    public ResponseEntity<String> sitemap() {
        SiteConfig siteUrlCfg = siteConfigMapper.selectByKey("site.url");
        String siteUrl = siteUrlCfg != null && siteUrlCfg.getConfigValue() != null
                ? siteUrlCfg.getConfigValue()
                : "https://aindgc.com";

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // Static pages
        addStatic(xml, siteUrl);

        // Articles
        List<Article> articles = articleMapper.selectList(
            new QueryWrapper<Article>().eq("status", "PUBLISHED").eq("deleted", 0));
        for (Article a : articles) {
            xml.append("  <url>\n")
               .append("    <loc>").append(siteUrl).append("/insights/").append(a.getSlug()).append("</loc>\n")
               .append("    <lastmod>").append(a.getUpdatedAt() != null ? a.getUpdatedAt().toLocalDate().format(ISO) : "").append("</lastmod>\n")
               .append("    <changefreq>weekly</changefreq>\n")
               .append("    <priority>0.8</priority>\n")
               .append("  </url>\n");
        }

        // Cases
        List<CaseProject> cases = caseMapper.selectList(
            new QueryWrapper<CaseProject>().eq("status", "PUBLISHED").eq("deleted", 0));
        for (CaseProject c : cases) {
            xml.append("  <url>\n")
               .append("    <loc>").append(siteUrl).append("/cases/").append(c.getSlug()).append("</loc>\n")
               .append("    <lastmod>").append(c.getUpdatedAt() != null ? c.getUpdatedAt().toLocalDate().format(ISO) : "").append("</lastmod>\n")
               .append("    <changefreq>monthly</changefreq>\n")
               .append("    <priority>0.7</priority>\n")
               .append("  </url>\n");
        }

        // Tools
        List<Tool> tools = toolMapper.selectList(
            new QueryWrapper<Tool>().eq("status", "PUBLISHED").eq("deleted", 0));
        for (Tool t : tools) {
            xml.append("  <url>\n")
               .append("    <loc>").append(siteUrl).append("/tools/").append(t.getSlug()).append("</loc>\n")
               .append("    <lastmod>").append(t.getUpdatedAt() != null ? t.getUpdatedAt().toLocalDate().format(ISO) : "").append("</lastmod>\n")
               .append("    <changefreq>monthly</changefreq>\n")
               .append("    <priority>0.8</priority>\n")
               .append("  </url>\n");
        }

        xml.append("</urlset>");
        return ResponseEntity.ok()
                .header("Content-Type", "application/xml; charset=utf-8")
                .body(xml.toString());
    }

    private void addStatic(StringBuilder xml, String siteUrl) {
        String[][] pages = {
            {"",            "1.0", "daily"},
            {"/tools",      "0.9", "weekly"},
            {"/workbench",  "0.9", "monthly"},
            {"/workflow",   "0.8", "weekly"},
            {"/roi",        "0.8", "weekly"},
            {"/checkup",    "0.8", "weekly"},
            {"/skills",     "0.8", "monthly"},
            {"/coding",     "0.8", "monthly"},
            {"/cases",      "0.8", "weekly"},
            {"/insights",   "0.9", "daily"},
            {"/about",      "0.5", "monthly"}
        };
        for (String[] p : pages) {
            xml.append("  <url>\n")
               .append("    <loc>").append(siteUrl).append(p[0]).append("</loc>\n")
               .append("    <changefreq>").append(p[2]).append("</changefreq>\n")
               .append("    <priority>").append(p[1]).append("</priority>\n")
               .append("  </url>\n");
        }
    }
}
