package com.aindgc.ai.security;

import com.aindgc.ai.common.ResultCode;
import com.aindgc.ai.exception.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static JwtAuthenticationFilter.AuthenticatedUser currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof JwtAuthenticationFilter.AuthenticatedUser u)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED, "Not authenticated");
        }
        return u;
    }

    public static Long currentUserId() {
        return currentUser().id();
    }

    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated()
                && auth.getPrincipal() instanceof JwtAuthenticationFilter.AuthenticatedUser;
    }

    public static boolean isAdmin() {
        if (!isAuthenticated()) return false;
        return "ADMIN".equals(currentUser().role());
    }
}
