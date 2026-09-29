package com.aindgc.ai.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_tool")
public class Tool extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String slug;
    private String name;
    private String tagline;
    private String description;
    private String icon;
    private Long categoryId;
    /** DRAFT / PUBLISHED / ARCHIVED */
    private String status;
    /** JSON column (stored as string in MyBatis, parsed at service layer) */
    private String configJson;
    /** MARKDOWN / ZIP / JSON */
    private String outputFormat;
    private Integer featured;
    private Integer sort;
    private Long viewCount;
    private Long generateCount;
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
}
