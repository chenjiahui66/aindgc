package com.aindgc.ai.mapper;

import com.aindgc.ai.entity.Article;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {

    @Select("SELECT * FROM t_article WHERE slug = #{slug} AND deleted = 0 LIMIT 1")
    Article selectBySlug(@Param("slug") String slug);

    @Update("UPDATE t_article SET view_count = view_count + 1 WHERE id = #{id} AND deleted = 0")
    int incrementViewCount(@Param("id") Long id);

    @Update("UPDATE t_article SET like_count = like_count + 1 WHERE id = #{id} AND deleted = 0")
    int incrementLikeCount(@Param("id") Long id);

    @Select("SELECT * FROM t_article WHERE status = 'PUBLISHED' AND deleted = 0 ORDER BY is_featured DESC, published_at DESC LIMIT #{limit}")
    java.util.List<Article> selectRecentPublished(@Param("limit") int limit);
}
