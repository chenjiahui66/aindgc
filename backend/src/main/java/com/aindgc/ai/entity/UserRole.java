package com.aindgc.ai.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Join table for {@code t_user_role}.
 *
 * <p>Note: this table has a composite primary key {@code (user_id, role_id)} and NO
 * surrogate {@code id} column. Only {@link com.aindgc.ai.mapper.UserRoleMapper} insert /
 * selectList / delete-by-wrapper are used, so {@code user_id} is declared as the
 * {@code IdType.INPUT} key part purely to stop MyBatis-Plus from emitting a phantom key.
 */
@Data
@TableName("t_user_role")
public class UserRole {

    @TableId(value = "user_id", type = IdType.INPUT)
    private Long userId;

    private Long roleId;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
