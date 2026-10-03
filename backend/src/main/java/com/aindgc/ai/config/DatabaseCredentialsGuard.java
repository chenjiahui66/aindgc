package com.aindgc.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Fails fast when the dev datasource has no password.
 *
 * <p>{@code application-dev.yml} uses {@code password: ${DB_PASS:}} — the empty
 * default exists so a missing env var does not break config binding, but it means
 * the app happily boots with a blank password and then dies deep inside MySQL with
 * {@code Access denied for user 'aindgc'@'localhost' (using password: NO)}, which
 * reads like a permissions problem rather than a missing configuration value.
 *
 * <p>This check runs during context refresh, i.e. before any {@code CommandLineRunner},
 * so the failure message arrives before the confusing JDBC stack trace.
 *
 * <p>Dev profile only: production is expected to inject {@code DB_PASS} as a real
 * secret, and we do not want this guard to interfere with that.
 */
@Component
@Profile("dev")
public class DatabaseCredentialsGuard {

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @PostConstruct
    void check() {
        if (password != null && !password.isBlank()) return;

        throw new IllegalStateException(
            "No MySQL password configured for user '" + username + "'.\n" +
            "  Cause: application-dev.yml uses `password: ${DB_PASS:}` and DB_PASS was empty,\n" +
            "  so the driver connected with no password and MySQL rejected it.\n" +
            "  Fix:  create backend/.env containing a line `DB_PASS=<your password>`\n" +
            "        (it is gitignored and auto-loaded), or export DB_PASS before starting."
        );
    }
}
