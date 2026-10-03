package com.aindgc.ai.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Pagination dialect has to follow the active database.
 *
 * <p>MyBatis-Plus generates a different LIMIT clause per database, so the dialect is
 * read from config instead of being hardcoded:
 * <ul>
 *   <li>{@code mybatis-plus.db-type: mysql} — default, used by the dev profile</li>
 *   <li>{@code mybatis-plus.db-type: h2} — set by the "h2" profile used in Docker</li>
 * </ul>
 * Getting this wrong does not fail loudly; it fails at the first paginated query with a
 * syntax error from whichever database is actually running.
 */
@Configuration
public class MybatisPlusConfig {

    @Value("${mybatis-plus.db-type:mysql}")
    private String dbType;

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        DbType dialect = "h2".equalsIgnoreCase(dbType) ? DbType.H2 : DbType.MYSQL;
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(dialect));
        return interceptor;
    }
}
