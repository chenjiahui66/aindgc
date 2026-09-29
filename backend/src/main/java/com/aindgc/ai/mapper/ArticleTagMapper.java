package com.aindgc.ai.mapper;

import com.aindgc.ai.entity.ArticleTag;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ArticleTagMapper extends BaseMapper<ArticleTag> {

    @Select("SELECT t.* FROM t_article_tag t INNER JOIN t_article_tag_relation r ON r.tag_id = t.id WHERE r.article_id = #{articleId} AND t.deleted = 0")
    List<ArticleTag> selectTagsByArticleId(Long articleId);
}
