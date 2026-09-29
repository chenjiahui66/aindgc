package com.aindgc.ai.mapper;

import com.aindgc.ai.entity.Tool;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ToolMapper extends BaseMapper<Tool> {

    @Select("SELECT * FROM t_tool WHERE slug = #{slug} AND deleted = 0 LIMIT 1")
    Tool selectBySlug(@Param("slug") String slug);

    @Select("SELECT * FROM t_tool WHERE status = 'PUBLISHED' AND deleted = 0 AND featured = 1 ORDER BY sort ASC, id ASC LIMIT #{limit}")
    List<Tool> selectFeatured(@Param("limit") int limit);

    @Update("UPDATE t_tool SET view_count = view_count + 1 WHERE id = #{id} AND deleted = 0")
    int incrementViewCount(@Param("id") Long id);

    @Update("UPDATE t_tool SET generate_count = generate_count + 1 WHERE id = #{id} AND deleted = 0")
    int incrementGenerateCount(@Param("id") Long id);
}
