package com.aindgc.ai.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(200, "success"),
    BAD_REQUEST(400, "Bad request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Not found"),
    METHOD_NOT_ALLOWED(405, "Method not allowed"),
    CONFLICT(409, "Conflict"),
    VALIDATION_ERROR(422, "Validation failed"),
    INTERNAL_ERROR(500, "Internal server error"),

    /* Business codes (1xxx) */
    USER_NOT_FOUND(1001, "User not found"),
    USER_ALREADY_EXISTS(1002, "User already exists"),
    INVALID_CREDENTIALS(1003, "Invalid username or password"),
    TOKEN_EXPIRED(1004, "Token expired"),
    TOKEN_INVALID(1005, "Invalid token"),

    TOOL_NOT_FOUND(2001, "Tool not found"),
    TOOL_DISABLED(2002, "Tool disabled"),
    TOOL_GENERATE_FAILED(2003, "Tool generation failed"),

    ARTICLE_NOT_FOUND(3001, "Article not found"),
    CASE_NOT_FOUND(4001, "Case not found"),

    WORKFLOW_INVALID(5001, "Invalid workflow"),
    SKILL_INVALID(6001, "Invalid skill parameters"),
    ROI_INVALID(7001, "Invalid ROI inputs"),
    CHECKUP_INVALID(8001, "Invalid checkup answers"),

    PERMISSION_DENIED(9001, "Permission denied");

    private final int code;
    private final String message;
}
