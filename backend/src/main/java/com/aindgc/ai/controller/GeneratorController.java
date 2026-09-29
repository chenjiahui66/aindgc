package com.aindgc.ai.controller;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.entity.Tool;
import com.aindgc.ai.exception.BusinessException;
import com.aindgc.ai.generator.*;
import com.aindgc.ai.mapper.ToolMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Unified Generator endpoint.
 * POST /api/generate/{slug}  -> forwards to the matching generator service.
 * For coding-project-starter, returns files[] instead of single markdown.
 */
@Tag(name = "Generators", description = "AI tool generators (rule engine)")
@Slf4j
@RestController
@RequestMapping("/api/generate")
@RequiredArgsConstructor
public class GeneratorController {

    private final ToolMapper toolMapper;
    private final AgentWorkflowGenerator workflowGen;
    private final AgentSkillGenerator skillGen;
    private final ContextBuilderGenerator contextGen;
    private final CodingProjectGenerator codingGen;
    private final PromptBuilderGenerator promptGen;
    private final OutputSchemaGenerator schemaGen;

    @PostMapping("/{slug}")
    @Operation(summary = "Generate tool output")
    public Result<Map<String, Object>> generate(
            @PathVariable String slug,
            @RequestBody Map<String, Object> input
    ) {
        Tool tool = toolMapper.selectBySlug(slug);
        if (tool == null) throw new BusinessException(ResultCode.TOOL_NOT_FOUND);

        toolMapper.incrementGenerateCount(tool.getId());
        long t = System.currentTimeMillis();
        Map<String, Object> result = new HashMap<>();
        result.put("tool", tool.getSlug());

        switch (slug) {
            case "agent-workflow-generator" -> {
                GeneratorResult r = workflowGen.generate(input);
                result.put("markdown", r.getMarkdown());
                result.put("json", r.getJson());
            }
            case "agent-skills-generator" -> {
                GeneratorResult r = skillGen.generate(input);
                result.put("markdown", r.getMarkdown());
                result.put("json", r.getJson());
            }
            case "context-builder" -> {
                GeneratorResult r = contextGen.generate(input);
                result.put("markdown", r.getMarkdown());
                result.put("json", r.getJson());
            }
            case "coding-project-starter" -> {
                List<Map<String, String>> files = codingGen.generateFiles(input);
                result.put("files", files);
                result.put("file_count", files.size());
            }
            case "prompt-structure-builder" -> {
                GeneratorResult r = promptGen.generate(input);
                result.put("markdown", r.getMarkdown());
                result.put("json", r.getJson());
            }
            case "output-schema-generator" -> {
                GeneratorResult r = schemaGen.generate(input);
                result.put("markdown", r.getMarkdown());
                result.put("json_schema", r.getJson());
            }
            default -> throw new BusinessException(ResultCode.TOOL_NOT_FOUND);
        }
        result.put("elapsed_ms", System.currentTimeMillis() - t);
        log.info("[Generate] {} -> {}ms", slug, System.currentTimeMillis() - t);
        return Result.ok(result);
    }
}
