package com.aindgc.ai.common;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
public class PageResult<T> {

    private List<T> list;
    private long total;
    private long page;
    private long size;

    public static <T> PageResult<T> of(IPage<T> page) {
        PageResult<T> r = new PageResult<>();
        r.setList(page.getRecords() == null ? Collections.emptyList() : page.getRecords());
        r.setTotal(page.getTotal());
        r.setPage(page.getCurrent());
        r.setSize(page.getSize());
        return r;
    }

    public static <T> PageResult<T> empty(long page, long size) {
        PageResult<T> r = new PageResult<>();
        r.setList(Collections.emptyList());
        r.setTotal(0);
        r.setPage(page);
        r.setSize(size);
        return r;
    }
}
