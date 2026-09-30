package com.aindgc.ai.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Auto-fills the audit columns declared on {@link com.aindgc.ai.entity.BaseEntity}.
 *
 * <p>MyBatis-Plus always emits fields annotated with {@code @TableField(fill = ...)} in the
 * generated INSERT/UPDATE statement, on the assumption that a {@code MetaObjectHandler} is
 * registered to populate them. Without this bean those columns go out as literal {@code NULL},
 * which fails the {@code NOT NULL} constraints on {@code created_at} / {@code updated_at}.
 *
 * <p>Registration is what makes {@code @TableField(fill = FieldFill.INSERT)} meaningful; without
 * it the annotations on {@code BaseEntity} are silently inert.
 */
@Component
public class MybatisPlusMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        LocalDateTime now = LocalDateTime.now();
        this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, now);
        this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, now);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }
}
