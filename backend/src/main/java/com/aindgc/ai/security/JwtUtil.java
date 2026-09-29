package com.aindgc.ai.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT utility — sign & validate HS256 tokens.
 * Token shape: { sub=userId, username, role, iat, exp }
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${aindgc.jwt.secret}")
    private String secret;

    @Value("${aindgc.jwt.access-token-ttl-seconds:86400}")
    private long accessTtl;

    @Value("${aindgc.jwt.refresh-token-ttl-seconds:2592000}")
    private long refreshTtl;

    @Value("${aindgc.jwt.issuer:aindgc}")
    private String issuer;

    private SecretKey key;

    @PostConstruct
    void init() {
        // jjwt requires >= 256 bits for HS256
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("aindgc.jwt.secret must be >= 32 chars (got " + bytes.length + ")");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String generateAccessToken(Long userId, String username, String role) {
        return buildToken(userId, username, role, accessTtl * 1000L, "access");
    }

    public String generateRefreshToken(Long userId, String username, String role) {
        return buildToken(userId, username, role, refreshTtl * 1000L, "refresh");
    }

    private String buildToken(Long userId, String username, String role, long ttlMs, String type) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + ttlMs);
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("role", role)
                .claim("type", type)
                .issuer(issuer)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(issuer)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            log.debug("[JWT] Parse failed: {}", e.getMessage());
            throw e;
        }
    }

    public boolean isAccess(Claims c) {
        return "access".equals(c.get("type", String.class));
    }
}
