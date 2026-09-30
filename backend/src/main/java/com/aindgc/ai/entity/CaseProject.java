package com.aindgc.ai.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_case_project")
public class CaseProject extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;
    private String slug;
    private String cover;
    private String summary;
    private String problemMd;
    private String thinkingMd;
    private String approachMd;
    private String architectureMd;
    private String implementationMd;
    private String resultMd;
    private String learnedMd;
    /** JSON array, e.g. ["Vue 3","TypeScript"] */
    private String technologiesJson;
    /** JSON array, e.g. ["Claude Sonnet 4.5"] */
    private String aiModelsJson;
    /** REAL / PROTOTYPE / EXPERIMENT / CONCEPT */
    private String type;
    /** DRAFT / PUBLISHED */
    private String status;
    private Integer isFeatured;
    private Long viewCount;
    private String repoUrl;
    private String demoUrl;
    private java.time.LocalDateTime publishedAt;
    private Long categoryId;
}
