package com.aindgc.ai.controller.auth;

import com.aindgc.ai.common.Result;
import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.entity.Role;
import com.aindgc.ai.entity.User;
import com.aindgc.ai.entity.UserRole;
import com.aindgc.ai.exception.BusinessException;
import com.aindgc.ai.mapper.RoleMapper;
import com.aindgc.ai.mapper.UserMapper;
import com.aindgc.ai.mapper.UserRoleMapper;
import com.aindgc.ai.security.JwtAuthenticationFilter;
import com.aindgc.ai.security.JwtUtil;
import com.aindgc.ai.security.SecurityUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Tag(name = "Auth", description = "Authentication endpoints")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    @Operation(summary = "Register new user")
    public Result<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        Long existing = userMapper.selectCount(
            new QueryWrapper<User>().eq("username", req.getUsername()).eq("deleted", 0));
        if (existing > 0) throw new BusinessException(ResultCode.USER_ALREADY_EXISTS, "Username taken");

        Long emailExisting = userMapper.selectCount(
            new QueryWrapper<User>().eq("email", req.getEmail()).eq("deleted", 0));
        if (emailExisting > 0) throw new BusinessException(ResultCode.USER_ALREADY_EXISTS, "Email taken");

        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setNickname(req.getNickname() != null ? req.getNickname() : req.getUsername());
        u.setStatus(1);
        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());
        u.setDeleted(0);
        userMapper.insert(u);

        Role userRole = roleMapper.selectOne(new QueryWrapper<Role>().eq("code", "USER").eq("deleted", 0));
        if (userRole != null) {
            UserRole ur = new UserRole();
            ur.setUserId(u.getId());
            ur.setRoleId(userRole.getId());
            userRoleMapper.insert(ur);
        }

        return Result.ok(buildResponse(u, "USER"));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with username + password")
    public Result<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        User u = userMapper.selectOne(
            new QueryWrapper<User>().eq("username", req.getUsername()).eq("deleted", 0));
        if (u == null) throw new BusinessException(ResultCode.INVALID_CREDENTIALS);

        if (u.getStatus() == null || u.getStatus() != 1) {
            throw new BusinessException(ResultCode.FORBIDDEN, "Account disabled");
        }

        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new BusinessException(ResultCode.INVALID_CREDENTIALS);
        }

        String role = primaryRoleOf(u.getId());
        updateLoginMeta(u);
        return Result.ok(buildResponse(u, role));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using a valid refresh token")
    public Result<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        if (token == null || token.isBlank()) {
            throw new BusinessException(ResultCode.TOKEN_INVALID, "Missing refreshToken");
        }
        Claims c = jwtUtil.parse(token);
        if (!"refresh".equals(c.get("type", String.class))) {
            throw new BusinessException(ResultCode.TOKEN_INVALID, "Not a refresh token");
        }
        Long userId = Long.parseLong(c.getSubject());
        User u = userMapper.selectById(userId);
        if (u == null || u.getDeleted() != 0) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        String role = primaryRoleOf(u.getId());
        return Result.ok(buildResponse(u, role));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user")
    public Result<Map<String, Object>> me() {
        JwtAuthenticationFilter.AuthenticatedUser u = SecurityUtils.currentUser();
        User user = userMapper.selectById(u.id());
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", user.getId());
        m.put("username", user.getUsername());
        m.put("email", user.getEmail());
        m.put("nickname", user.getNickname());
        m.put("avatar", user.getAvatar());
        m.put("bio", user.getBio());
        m.put("role", u.role());
        m.put("createdAt", user.getCreatedAt());
        return Result.ok(m);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout (client should discard tokens)")
    public Result<Void> logout() {
        // Stateless JWT — server-side invalidation is a stretch goal.
        // Phase 15 will add a denylist if needed.
        return Result.ok();
    }

    private AuthResponse buildResponse(User u, String role) {
        String access = jwtUtil.generateAccessToken(u.getId(), u.getUsername(), role);
        String refresh = jwtUtil.generateRefreshToken(u.getId(), u.getUsername(), role);
        AuthResponse r = new AuthResponse();
        r.setAccessToken(access);
        r.setRefreshToken(refresh);
        r.setTokenType("Bearer");
        Map<String, Object> u2 = new LinkedHashMap<>();
        u2.put("id", u.getId());
        u2.put("username", u.getUsername());
        u2.put("email", u.getEmail());
        u2.put("nickname", u.getNickname());
        u2.put("avatar", u.getAvatar());
        u2.put("role", role);
        r.setUser(u2);
        return r;
    }

    private String primaryRoleOf(Long userId) {
        var rows = userRoleMapper.selectList(
            new QueryWrapper<com.aindgc.ai.entity.UserRole>().eq("user_id", userId));
        if (rows.isEmpty()) return "USER";
        for (var ur : rows) {
            Role r = roleMapper.selectById(ur.getRoleId());
            if (r != null && "ADMIN".equals(r.getCode())) return "ADMIN";
        }
        Role first = roleMapper.selectById(rows.get(0).getRoleId());
        return first != null ? first.getCode() : "USER";
    }

    private void updateLoginMeta(User u) {
        u.setLastLoginAt(LocalDateTime.now());
        u.setLastLoginIp(null); // could be set from X-Forwarded-For in Phase 15
        userMapper.updateById(u);
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank @Size(min = 6, max = 100) private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 32) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6, max = 100) private String password;
        private String nickname;
    }

    @Data
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private Map<String, Object> user;
    }
}
