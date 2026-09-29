package com.aindgc.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

/**
 * Health check endpoint. Public, unauthenticated.
 * Returns {status, app, version, env, timestamp} so the frontend HomeView
 * can verify backend connectivity in Phase 1.
 */
@Tag(name = "System", description = "System endpoints")
@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.application.name:aindgc-backend}")
    private String appName;

    @Value("${spring.profiles.active:default}")
    private String env;

    @Value("${aindgc.version:0.1.0}")
    private String version;

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public HealthInfo health() {
        HealthInfo h = new HealthInfo();
        h.setStatus("UP");
        h.setApp(appName);
        h.setVersion(version);
        h.setEnv(env);
        h.setTimestamp(Instant.now().toEpochMilli());
        return h;
    }

    @Data
    public static class HealthInfo {
        private String status;
        private String app;
        private String version;
        private String env;
        private long timestamp;
    }
}
