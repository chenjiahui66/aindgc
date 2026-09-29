-- =====================================================================
-- Aindgc · Schema (MySQL 8.0)
-- Charset: utf8mb4_unicode_ci, Engine: InnoDB
-- Convention: t_* tables, BIGINT UNSIGNED auto_increment PK
-- Soft delete column: deleted TINYINT NOT NULL DEFAULT 0
-- Audit columns: created_at, updated_at, created_by, updated_by
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- User & Auth
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_user_role;
DROP TABLE IF EXISTS t_role_permission;
DROP TABLE IF EXISTS t_user;
DROP TABLE IF EXISTS t_role;
DROP TABLE IF EXISTS t_permission;

CREATE TABLE t_user (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username        VARCHAR(64)  NOT NULL COMMENT 'Login username, unique',
    email           VARCHAR(128) NOT NULL COMMENT 'Email, unique',
    password_hash   VARCHAR(128) NOT NULL,
    nickname        VARCHAR(64)  NULL,
    avatar          VARCHAR(255) NULL,
    bio             VARCHAR(500) NULL,
    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '0=disabled 1=active',
    last_login_at   DATETIME     NULL,
    last_login_ip   VARCHAR(64)  NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT      NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email),
    KEY idx_status (status, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Users';

CREATE TABLE t_role (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code            VARCHAR(32) NOT NULL COMMENT 'USER, ADMIN, ...',
    name            VARCHAR(64) NOT NULL,
    description     VARCHAR(255) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Roles';

CREATE TABLE t_permission (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code            VARCHAR(64) NOT NULL COMMENT 'unique permission code',
    name            VARCHAR(64) NOT NULL,
    type            VARCHAR(16) NOT NULL DEFAULT 'API' COMMENT 'MENU, BUTTON, API',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permissions';

CREATE TABLE t_user_role (
    user_id         BIGINT UNSIGNED NOT NULL,
    role_id         BIGINT UNSIGNED NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    KEY idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-Role mapping';

CREATE TABLE t_role_permission (
    role_id         BIGINT UNSIGNED NOT NULL,
    permission_id   BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    KEY idx_perm (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Role-Permission mapping';

-- ---------------------------------------------------------------------
-- Tools
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_tool_usage;
DROP TABLE IF EXISTS t_tool;
DROP TABLE IF EXISTS t_tool_category;

CREATE TABLE t_tool_category (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(64) NOT NULL,
    slug            VARCHAR(64) NOT NULL,
    description     VARCHAR(255) NULL,
    sort            INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tool categories';

CREATE TABLE t_tool (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug            VARCHAR(64) NOT NULL COMMENT 'URL slug, unique',
    name            VARCHAR(64) NOT NULL,
    tagline         VARCHAR(255) NULL COMMENT 'One-liner pitch',
    description     TEXT NULL,
    icon            VARCHAR(64) NULL COMMENT 'Lucide icon name',
    category_id     BIGINT UNSIGNED NULL,
    status          VARCHAR(16) NOT NULL DEFAULT 'PUBLISHED' COMMENT 'DRAFT/PUBLISHED/ARCHIVED',
    config_json     JSON NULL COMMENT 'Tool-specific config schema',
    output_format   VARCHAR(16) NOT NULL DEFAULT 'MARKDOWN' COMMENT 'MARKDOWN/ZIP/JSON',
    featured        TINYINT NOT NULL DEFAULT 0,
    sort            INT NOT NULL DEFAULT 0,
    view_count      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    generate_count  BIGINT UNSIGNED NOT NULL DEFAULT 0,
    seo_title       VARCHAR(128) NULL,
    seo_description VARCHAR(255) NULL,
    seo_keywords    VARCHAR(255) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_status_featured (status, featured, deleted),
    KEY idx_category (category_id, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI tools';

CREATE TABLE t_tool_usage (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tool_id         BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NULL,
    anonymous_id    VARCHAR(64) NULL COMMENT 'Browser-generated UUID for visitor',
    action          VARCHAR(16) NOT NULL COMMENT 'OPEN/GENERATE/DOWNLOAD/SHARE',
    ip              VARCHAR(64) NULL,
    user_agent      VARCHAR(500) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_tool_action (tool_id, action, created_at),
    KEY idx_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tool usage tracking';

-- ---------------------------------------------------------------------
-- Workflow
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_workflow;
DROP TABLE IF EXISTS t_workflow_template;
DROP TABLE IF EXISTS t_workflow_category;

CREATE TABLE t_workflow_category (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(64) NOT NULL,
    slug            VARCHAR(64) NOT NULL,
    sort            INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Workflow categories';

CREATE TABLE t_workflow_template (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug            VARCHAR(96) NOT NULL,
    name            VARCHAR(128) NOT NULL,
    description     VARCHAR(500) NULL,
    cover           VARCHAR(255) NULL,
    category_id     BIGINT UNSIGNED NULL,
    complexity      VARCHAR(16) NOT NULL DEFAULT 'BEGINNER' COMMENT 'BEGINNER/INTERMEDIATE/ADVANCED',
    nodes_json      JSON NULL,
    edges_json      JSON NULL,
    config_json     JSON NULL,
    status          VARCHAR(16) NOT NULL DEFAULT 'PUBLISHED',
    view_count      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_status (status, deleted, complexity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Workflow templates';

CREATE TABLE t_workflow (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(128) NOT NULL,
    description     VARCHAR(500) NULL,
    nodes_json      JSON NULL,
    edges_json      JSON NULL,
    is_template     TINYINT NOT NULL DEFAULT 0,
    visibility      VARCHAR(16) NOT NULL DEFAULT 'PRIVATE' COMMENT 'PRIVATE/PUBLIC',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_user (user_id, deleted, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-saved workflows';

-- ---------------------------------------------------------------------
-- Skills
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_skill;
DROP TABLE IF EXISTS t_skill_template;

CREATE TABLE t_skill_template (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug            VARCHAR(96) NOT NULL,
    name            VARCHAR(128) NOT NULL,
    description     VARCHAR(500) NULL,
    content_md      MEDIUMTEXT NOT NULL,
    target          VARCHAR(32) NOT NULL DEFAULT 'ALL' COMMENT 'CLAUDE_CODE/CODEX/CURSOR/GEMINI_CLI/ALL',
    category_id     BIGINT UNSIGNED NULL,
    view_count      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    generate_count  BIGINT UNSIGNED NOT NULL DEFAULT 0,
    status          VARCHAR(16) NOT NULL DEFAULT 'PUBLISHED',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_target_status (target, status, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Skill templates';

CREATE TABLE t_skill (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NULL,
    name            VARCHAR(128) NOT NULL,
    role            VARCHAR(255) NULL,
    purpose         VARCHAR(500) NULL,
    content_md      MEDIUMTEXT NOT NULL,
    target          VARCHAR(32) NOT NULL DEFAULT 'CLAUDE_CODE',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_user (user_id, deleted, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User-generated skills';

-- ---------------------------------------------------------------------
-- AI Coding
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_coding_template;

CREATE TABLE t_coding_template (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug            VARCHAR(96) NOT NULL,
    name            VARCHAR(128) NOT NULL,
    description     VARCHAR(500) NULL,
    frontend_stack  VARCHAR(64) NULL,
    backend_stack   VARCHAR(64) NULL,
    ai_target       VARCHAR(32) NOT NULL DEFAULT 'CLAUDE_CODE',
    structure_json  JSON NULL COMMENT 'Project directory structure',
    files_json      JSON NULL COMMENT 'Generated file contents (path -> content)',
    status          VARCHAR(16) NOT NULL DEFAULT 'PUBLISHED',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_status (status, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI Coding project templates';

-- ---------------------------------------------------------------------
-- Articles (Insights)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_article_tag_relation;
DROP TABLE IF EXISTS t_article;
DROP TABLE IF EXISTS t_article_category;
DROP TABLE IF EXISTS t_article_tag;

CREATE TABLE t_article_category (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(64) NOT NULL,
    slug            VARCHAR(64) NOT NULL,
    description     VARCHAR(255) NULL,
    sort            INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article categories';

CREATE TABLE t_article_tag (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(64) NOT NULL,
    slug            VARCHAR(64) NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article tags';

CREATE TABLE t_article (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(128) NOT NULL,
    cover           VARCHAR(255) NULL,
    summary         VARCHAR(500) NULL,
    content_md      MEDIUMTEXT NOT NULL,
    category_id     BIGINT UNSIGNED NULL,
    author_id       BIGINT UNSIGNED NULL,
    status          VARCHAR(16) NOT NULL DEFAULT 'DRAFT' COMMENT 'DRAFT/PUBLISHED/ARCHIVED',
    is_featured     TINYINT NOT NULL DEFAULT 0,
    view_count      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    like_count      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    seo_title       VARCHAR(128) NULL,
    seo_description VARCHAR(255) NULL,
    seo_keywords    VARCHAR(255) NULL,
    canonical_url   VARCHAR(255) NULL,
    og_image        VARCHAR(255) NULL,
    published_at    DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_status (status, is_featured, published_at, deleted),
    KEY idx_category (category_id, deleted),
    KEY idx_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Articles / Insights';

CREATE TABLE t_article_tag_relation (
    article_id      BIGINT UNSIGNED NOT NULL,
    tag_id          BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    KEY idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article-Tag mapping';

-- ---------------------------------------------------------------------
-- Cases
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_case_project;
DROP TABLE IF EXISTS t_case_category;

CREATE TABLE t_case_category (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(64) NOT NULL,
    slug            VARCHAR(64) NOT NULL,
    description     VARCHAR(255) NULL,
    sort            INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Case categories';

CREATE TABLE t_case_project (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(128) NOT NULL,
    cover           VARCHAR(255) NULL,
    summary         VARCHAR(500) NULL,
    problem_md      MEDIUMTEXT NULL,
    thinking_md     MEDIUMTEXT NULL,
    approach_md     MEDIUMTEXT NULL,
    architecture_md MEDIUMTEXT NULL,
    implementation_md MEDIUMTEXT NULL,
    result_md       MEDIUMTEXT NULL,
    learned_md      MEDIUMTEXT NULL,
    technologies_json JSON NULL,
    ai_models_json    JSON NULL,
    type            VARCHAR(16) NOT NULL DEFAULT 'EXPERIMENT' COMMENT 'REAL/PROTOTYPE/EXPERIMENT/CONCEPT',
    status          VARCHAR(16) NOT NULL DEFAULT 'DRAFT',
    is_featured     TINYINT NOT NULL DEFAULT 0,
    view_count      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    repo_url        VARCHAR(255) NULL,
    demo_url        VARCHAR(255) NULL,
    published_at    DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_type_status (type, status, is_featured, deleted),
    KEY idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Case projects';

-- ---------------------------------------------------------------------
-- ROI & Checkup
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_roi_record;
DROP TABLE IF EXISTS t_checkup_record;

CREATE TABLE t_roi_record (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NULL,
    anonymous_id    VARCHAR(64) NULL,
    inputs_json     JSON NOT NULL,
    outputs_json    JSON NOT NULL,
    share_token     VARCHAR(64) NULL COMMENT 'UUID for shareable link',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_share (share_token),
    KEY idx_user (user_id, created_at),
    KEY idx_anonymous (anonymous_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ROI calculation records';

CREATE TABLE t_checkup_record (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NULL,
    anonymous_id    VARCHAR(64) NULL,
    answers_json    JSON NOT NULL,
    score           INT NOT NULL,
    opportunities_json JSON NULL,
    share_token     VARCHAR(64) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_share (share_token),
    KEY idx_user (user_id, created_at),
    KEY idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Checkup records';

-- ---------------------------------------------------------------------
-- SEO
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_keyword;
DROP TABLE IF EXISTS t_seo_page;

CREATE TABLE t_seo_page (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    page_key        VARCHAR(64) NOT NULL COMMENT 'e.g. HOME, TOOLS_LIST, ARTICLE_DETAIL',
    page_path       VARCHAR(255) NOT NULL COMMENT 'URL path or pattern',
    title           VARCHAR(128) NULL,
    description     VARCHAR(255) NULL,
    keywords        VARCHAR(255) NULL,
    canonical       VARCHAR(255) NULL,
    og_image        VARCHAR(255) NULL,
    robots          VARCHAR(64) NULL,
    schema_type     VARCHAR(64) NULL COMMENT 'Article/Product/Organization/...',
    custom_jsonld   JSON NULL,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_page_key (page_key),
    KEY idx_path (page_path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Per-page SEO config';

CREATE TABLE t_keyword (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    term            VARCHAR(128) NOT NULL,
    locale          VARCHAR(8) NOT NULL DEFAULT 'en',
    search_volume   INT NULL,
    difficulty      INT NULL COMMENT '0-100',
    target_url      VARCHAR(255) NULL,
    priority        INT NOT NULL DEFAULT 0,
    notes           VARCHAR(500) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_term_locale (term, locale),
    KEY idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SEO keyword library';

-- ---------------------------------------------------------------------
-- System
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS t_visitor_stat;
DROP TABLE IF EXISTS t_operation_log;
DROP TABLE IF EXISTS t_ad_slot;
DROP TABLE IF EXISTS t_site_config;

CREATE TABLE t_site_config (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    config_key      VARCHAR(64) NOT NULL,
    config_value    TEXT NOT NULL,
    value_type      VARCHAR(16) NOT NULL DEFAULT 'STRING' COMMENT 'STRING/NUMBER/BOOLEAN/JSON',
    description     VARCHAR(255) NULL,
    is_public       TINYINT NOT NULL DEFAULT 0 COMMENT 'Whether exposed to frontend',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Site configuration';

CREATE TABLE t_ad_slot (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code            VARCHAR(64) NOT NULL COMMENT 'HOME_HERO_BOTTOM / ARTICLE_TOP / ...',
    description     VARCHAR(255) NULL,
    enabled         TINYINT NOT NULL DEFAULT 0,
    content_html    MEDIUMTEXT NULL,
    sort            INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_code (code),
    KEY idx_enabled (enabled, deleted, sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ad slots (Phase 2 monetization)';

CREATE TABLE t_operation_log (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NULL,
    module          VARCHAR(64) NULL,
    action          VARCHAR(64) NULL,
    request_data    TEXT NULL,
    response_data   TEXT NULL,
    ip              VARCHAR(64) NULL,
    ua              VARCHAR(500) NULL,
    status          TINYINT NULL COMMENT '1=success 0=fail',
    duration_ms     BIGINT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_time (user_id, created_at),
    KEY idx_module_action (module, action, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Admin operation audit log';

CREATE TABLE t_visitor_stat (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    anonymous_id    VARCHAR(64) NULL,
    user_id         BIGINT UNSIGNED NULL,
    page            VARCHAR(255) NOT NULL,
    action_type     VARCHAR(32) NULL COMMENT 'VIEW/GENERATE/DOWNLOAD/SHARE',
    target_id       BIGINT UNSIGNED NULL,
    target_type     VARCHAR(32) NULL,
    referer         VARCHAR(500) NULL,
    ip              VARCHAR(64) NULL,
    user_agent      VARCHAR(500) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_page_time (page, created_at),
    KEY idx_anon (anonymous_id, created_at),
    KEY idx_target (target_type, target_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Visitor statistics';

SET FOREIGN_KEY_CHECKS = 1;
