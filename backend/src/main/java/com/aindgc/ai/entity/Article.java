package com.aindgc.ai.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_article")
public class Article extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;
    private String slug;
    private String cover;
    private String summary;
    private String contentMd;
    private Long categoryId;
    private Long authorId;
    /** DRAFT / PUBLISHED / ARCHIVED */
    private String status;
    private Integer isFeatured;
    private Long viewCount;
    private Long likeCount;
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    private String canonicalUrl;
    private String ogImage;
    private java.time.LocalDateTime publishedAt;
}
