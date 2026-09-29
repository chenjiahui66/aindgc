package com.aindgc.ai.mapper;

import com.aindgc.ai.entity.CaseProject;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface CaseProjectMapper extends BaseMapper<CaseProject> {

    @Select("SELECT * FROM t_case_project WHERE slug = #{slug} AND deleted = 0 LIMIT 1")
    CaseProject selectBySlug(@Param("slug") String slug);

    @Update("UPDATE t_case_project SET view_count = view_count + 1 WHERE id = #{id} AND deleted = 0")
    int incrementViewCount(@Param("id") Long id);

    @Select("SELECT * FROM t_case_project WHERE status = 'PUBLISHED' AND deleted = 0 AND is_featured = 1 ORDER BY published_at DESC LIMIT #{limit}")
    List<CaseProject> selectFeatured(@Param("limit") int limit);
}
