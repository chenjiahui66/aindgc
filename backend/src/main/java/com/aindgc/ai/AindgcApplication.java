package com.aindgc.ai;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Aindgc backend application.
 * Phase 1: skeleton (health endpoint only).
 * Subsequent phases add auth, tools, workflows, content, admin, etc.
 */
@SpringBootApplication
@MapperScan("com.aindgc.ai.mapper")
@EnableCaching
public class AindgcApplication {

    public static void main(String[] args) {
        SpringApplication.run(AindgcApplication.class, args);
    }
}
