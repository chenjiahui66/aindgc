package com.aindgc.ai.config;

import com.aindgc.ai.entity.Role;
import com.aindgc.ai.entity.User;
import com.aindgc.ai.entity.UserRole;
import com.aindgc.ai.mapper.RoleMapper;
import com.aindgc.ai.mapper.UserMapper;
import com.aindgc.ai.mapper.UserRoleMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * First-boot initialiser.
 *
 * Phase 1: creates default roles + admin user if absent.
 * Default credentials come from env (overridable):
 *   AINDGC_ADMIN_USERNAME (default: admin)
 *   AINDGC_ADMIN_EMAIL    (default: admin@aindgc.com)
 *   AINDGC_ADMIN_PASSWORD (default: Aindgc@2026)
 *
 * IMPORTANT: rotate the password immediately after first login.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class InitDataInitializer implements CommandLineRunner {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${aindgc.admin.username:admin}")
    private String adminUsername;

    @Value("${aindgc.admin.email:admin@aindgc.com}")
    private String adminEmail;

    @Value("${aindgc.admin.password:Aindgc@2026}")
    private String adminPassword;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void run(String... args) {
        ensureRoles();
        ensureAdmin();
    }

    private void ensureRoles() {
        upsertRole("USER",  "User",  "Default registered user");
        upsertRole("ADMIN", "Admin", "Administrator with full access");
    }

    private void upsertRole(String code, String name, String description) {
        Role existing = roleMapper.selectOne(new QueryWrapper<Role>().eq("code", code));
        if (existing == null) {
            Role r = new Role();
            r.setCode(code);
            r.setName(name);
            r.setDescription(description);
            roleMapper.insert(r);
            log.info("[Init] Created role: {}", code);
        }
    }

    private void ensureAdmin() {
        User existing = userMapper.selectOne(
            new QueryWrapper<User>().eq("username", adminUsername)
        );
        if (existing != null) {
            log.info("[Init] Admin user already exists: {}", adminUsername);
            return;
        }

        User u = new User();
        u.setUsername(adminUsername);
        u.setEmail(adminEmail);
        u.setPasswordHash(passwordEncoder.encode(adminPassword));
        u.setNickname("Admin");
        u.setStatus(1);
        userMapper.insert(u);

        Role adminRole = roleMapper.selectOne(new QueryWrapper<Role>().eq("code", "ADMIN"));
        if (adminRole != null) {
            UserRole ur = new UserRole();
            ur.setUserId(u.getId());
            ur.setRoleId(adminRole.getId());
            userRoleMapper.insert(ur);
        }

        log.warn("==========================================================");
        log.warn("[Init] Default admin created");
        log.warn("  username: {}", adminUsername);
        log.warn("  email:    {}", adminEmail);
        log.warn("  password: {}", adminPassword);
        log.warn("  ACTION REQUIRED: change this password immediately.");
        log.warn("==========================================================");
    }
}
