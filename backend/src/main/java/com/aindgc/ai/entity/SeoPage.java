package com.aindgc.ai.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("t_seo_page")
public class SeoPage extends BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String pageKey;
    private String pagePath;
    private String title;
    private String description;
    private String keywords;
    private String canonical;
    private String ogImage;
    private String robots;
    /** Organization / WebSite / Article / SoftwareApplication / FAQPage / Product */
    private String schemaType;
    private String customJsonld;
}
