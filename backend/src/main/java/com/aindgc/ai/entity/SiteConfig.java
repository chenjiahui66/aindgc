package com.aindgc.ai.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_site_config")
public class SiteConfig extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String configKey;
    private String configValue;
    /** STRING / NUMBER / BOOLEAN / JSON */
    private String valueType;
    private String description;
    private Integer isPublic;
}
