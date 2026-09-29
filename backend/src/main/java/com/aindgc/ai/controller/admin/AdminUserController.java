package com.aindgc.ai.controller.admin;

import com.aindgc.ai.common.PageResult;
import com.aindgc.ai.common.Result;
import com.aindgc.ai.entity.Role;
import com.aindgc.ai.entity.User;
import com.aindgc.ai.entity.UserRole;
import com.aindgc.ai.mapper.RoleMapper;
import com.aindgc.ai.mapper.UserMapper;
import com.aindgc.ai.mapper.UserRoleMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Admin · Users")
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final UserRoleMapper userRoleMapper;

    @GetMapping
    @Operation(summary = "List users")
    public Result<PageResult<Map<String, Object>>> list(
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "20") long size,
            @RequestParam(required = false) String q
    ) {
        QueryWrapper<User> w = new QueryWrapper<>();
        if (q != null && !q.isBlank()) {
            w.and(qw -> qw.like("username", q).or().like("email", q).or().like("nickname", q));
        }
        w.orderByDesc("created_at");
        Page<User> p = userMapper.selectPage(new Page<>(page, size), w);
        List<Map<String, Object>> records = p.getRecords().stream().map(u -> {
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("id", u.getId());
            r.put("username", u.getUsername());
            r.put("email", u.getEmail());
            r.put("nickname", u.getNickname());
            r.put("status", u.getStatus());
            r.put("lastLoginAt", u.getLastLoginAt());
            r.put("createdAt", u.getCreatedAt());
            r.put("role", primaryRole(u.getId()));
            return r;
        }).toList();
        Page<Map<String, Object>> mapped = new Page<>(p.getCurrent(), p.getSize(), p.getTotal());
        mapped.setRecords(records);
        return Result.ok(PageResult.of(mapped));
    }

    @PostMapping("/{id}/status")
    @Operation(summary = "Enable / disable user")
    public Result<Void> setStatus(@PathVariable Long id, @RequestParam int status) {
        User u = userMapper.selectById(id);
        if (u == null) return Result.ok();
        u.setStatus(status);
        u.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(u);
        return Result.ok();
    }

    @PostMapping("/{id}/role")
    @Operation(summary = "Set user role (ADMIN / USER)")
    public Result<Void> setRole(@PathVariable Long id, @RequestParam String role) {
        User u = userMapper.selectById(id);
        if (u == null) return Result.ok();
        Role r = roleMapper.selectOne(new QueryWrapper<Role>().eq("code", role).eq("deleted", 0));
        if (r == null) return Result.fail(400, "Unknown role: " + role);
        // remove existing
        userRoleMapper.delete(new QueryWrapper<UserRole>().eq("user_id", id));
        // assign
        UserRole ur = new UserRole();
        ur.setUserId(id);
        ur.setRoleId(r.getId());
        userRoleMapper.insert(ur);
        return Result.ok();
    }

    private String primaryRole(Long userId) {
        var rows = userRoleMapper.selectList(new QueryWrapper<UserRole>().eq("user_id", userId));
        if (rows.isEmpty()) return "USER";
        for (var ur : rows) {
            Role r = roleMapper.selectById(ur.getRoleId());
            if (r != null && "ADMIN".equals(r.getCode())) return "ADMIN";
        }
        Role first = roleMapper.selectById(rows.get(0).getRoleId());
        return first != null ? first.getCode() : "USER";
    }
}
