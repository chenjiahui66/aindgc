package com.aindgc.ai.config;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final ObjectMapper objectMapper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("*"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(false);
        cfg.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public reads
                .requestMatchers(
                    "/api/health",
                    "/api/auth/**",
                    "/api/articles/**",
                    "/api/cases/**",
                    "/api/tools",
                    "/api/tools/featured",
                    "/api/tools/categories",
                    "/api/tools/*/generate",
                    "/api/generate/**",
                    "/api/roi/**",
                    "/api/checkup/**",
                    "/api/seo/**",
                    "/api/site/config/public",
                    "/sitemap.xml",
                    "/robots.txt",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/error"
                ).permitAll()
                // Admin requires ADMIN role
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Authenticated users (saved workflows etc.)
                .requestMatchers("/api/users/me/**").authenticated()
                .anyRequest().permitAll() // unknown paths fall through
            )
            .exceptionHandling(eh -> eh
                .authenticationEntryPoint(jsonAuthEntryPoint())
                .accessDeniedHandler(jsonAccessDeniedHandler())
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private AuthenticationEntryPoint jsonAuthEntryPoint() {
        return (HttpServletRequest req, HttpServletResponse res, AuthenticationException ex) ->
            writeJson(res, HttpStatus.UNAUTHORIZED, ResultCode.UNAUTHORIZED.getCode(), "Authentication required");
    }

    private AccessDeniedHandler jsonAccessDeniedHandler() {
        return (HttpServletRequest req, HttpServletResponse res, AccessDeniedException ex) ->
            writeJson(res, HttpStatus.FORBIDDEN, ResultCode.FORBIDDEN.getCode(), "Permission denied");
    }

    private void writeJson(HttpServletResponse res, HttpStatus status, int code, String msg) throws IOException {
        res.setStatus(status.value());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.getWriter().write(objectMapper.writeValueAsString(Result.fail(code, msg)));
    }
}
