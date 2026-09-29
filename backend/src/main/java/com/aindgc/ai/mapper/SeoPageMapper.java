package com.aindgc.ai.mapper;

import com.aindgc.ai.entity.SeoPage;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SeoPageMapper extends BaseMapper<SeoPage> {

    @Select("SELECT * FROM t_seo_page WHERE page_key = #{pageKey} AND deleted = 0 LIMIT 1")
    SeoPage selectByKey(@Param("pageKey") String pageKey);

    @Select("SELECT * FROM t_seo_page WHERE page_path = #{path} AND deleted = 0 LIMIT 1")
    SeoPage selectByPath(@Param("path") String path);
}
