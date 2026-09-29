package com.aindgc.ai.common;

import lombok.Data;

@Data
public class PageQuery {

    private long page = 1;
    private long size = 10;
    private String orderBy;
    private String order = "desc";
    private String keyword;

    public long offset() {
        return Math.max(0, (page - 1) * size);
    }
}
