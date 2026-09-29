package com.aindgc.ai.mapper;

import com.aindgc.ai.entity.SiteConfig;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface SiteConfigMapper extends BaseMapper<SiteConfig> {

    @Select("SELECT * FROM t_site_config WHERE config_key = #{key} LIMIT 1")
    SiteConfig selectByKey(@Param("key") String key);

    @Select("SELECT * FROM t_site_config WHERE is_public = 1 ORDER BY config_key")
    List<SiteConfig> selectPublic();
}
