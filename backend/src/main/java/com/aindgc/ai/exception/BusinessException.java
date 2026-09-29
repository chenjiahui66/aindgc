package com.aindgc.ai.exception;

import com.aindgc.ai.common.ResultCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final int code;
    private final transient Object[] args;

    public BusinessException(ResultCode code) {
        super(code.getMessage());
        this.code = code.getCode();
        this.args = null;
    }

    public BusinessException(ResultCode code, String message) {
        super(message);
        this.code = code.getCode();
        this.args = null;
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.args = null;
    }

    public BusinessException(ResultCode code, String message, Object... args) {
        super(message);
        this.code = code.getCode();
        this.args = args;
    }
}
