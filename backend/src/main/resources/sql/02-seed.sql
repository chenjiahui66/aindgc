-- =====================================================================
-- Aindgc · Seed data (configuration only)
--
-- User and role records are auto-created by InitDataInitializer on first
-- backend boot. This file only seeds reference/configuration data so
-- the public site is immediately usable.
--
-- All inserts are INSERT IGNORE keyed on the table's unique slug/key, so
-- re-running this file is a no-op instead of a duplicate-key failure.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tool categories (used by /tools page and admin)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO t_tool_category (name, slug, sort, description) VALUES
('Workflow',  'workflow',  1, 'Workflow generators'),
('Skill',     'skill',     2, 'Agent Skills generators'),
('Context',   'context',   3, 'Context builders'),
('Coding',    'coding',    4, 'AI Coding starters'),
('Prompt',    'prompt',    5, 'Prompt structure tools'),
('Schema',    'schema',    6, 'Output schema tools');

-- ---------------------------------------------------------------------
-- SEO pages (frontend uses these for dynamic meta)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO t_seo_page (page_key, page_path, title, description, keywords, schema_type) VALUES
('HOME',         '/',                        'Aindgc — AI Product Lab',     'Turn AI Into Work. AI 工作流、Agent、Workflow、ROI、AI 项目作品集。', 'Organization,WebSite', 'WebSite'),
('TOOLS_LIST',   '/tools',                   'AI Tools — Aindgc',           'AI 工具集合:Agent Workflow、Skills Generator、Context Builder。',     'WebSite', 'WebSite'),
('WORKBENCH',    '/workbench',               'AI Workbench — Aindgc',       'AI Workbench,组合生成 ROLE/TASK/WORKFLOW 工作包。',                  'WebSite', 'WebSite'),
('WORKFLOW',     '/workflow',                'AI Workflow Builder — Aindgc','Workflow Builder,可视化构建 AI 工作流。',                          'WebSite', 'WebSite'),
('ROI',          '/roi',                     'AI ROI Calculator — Aindgc',  'AI ROI 计算器,估算 AI 自动化潜力。',                                'WebSite', 'WebSite'),
('CHECKUP',      '/checkup',                 'AI Work Checkup — Aindgc',    'AI 工作体检,评估 AI 准备度与机会。',                                'WebSite', 'WebSite'),
('SKILLS',       '/skills',                  'Agent Skills — Aindgc',       'Agent Skills 生成器,为 Claude Code / Codex / Cursor 生成 SKILL.md。', 'WebSite', 'WebSite'),
('CODING',       '/coding',                  'AI Coding Project Starter',   'AI Coding Project Starter,生成可执行的 AI 项目骨架。',               'WebSite', 'WebSite'),
('CASES',        '/cases',                   'Cases — Aindgc',              'AI 项目案例:真实项目、实验、原型、概念。',                          'WebSite', 'WebSite'),
('INSIGHTS',     '/insights',                'AI Insights — Aindgc',        'AI 行业观察、思考、实验笔记。',                                     'WebSite', 'WebSite'),
('ABOUT',        '/about',                   'About — Aindgc',              '关于 Aindgc,一个真正懂 AI 产品、Agent、Workflow 的实验室。',         'WebSite', 'WebSite');

-- ---------------------------------------------------------------------
-- Site config (public keys are exposed to frontend via /api/site/config)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO t_site_config (config_key, config_value, value_type, description, is_public) VALUES
('site.title',           'Aindgc',                'STRING',  'Site title',                          1),
('site.tagline',         'Turn AI Into Work.',    'STRING',  'Site tagline (English)',              1),
('site.tagline_zh',      '让 AI 真正开始工作。',   'STRING',  'Site tagline (Chinese)',              1),
('site.description',     'AI Product Lab. Build with AI.', 'STRING', 'Site description',    1),
('site.url',             'https://aindgc.com',    'STRING',  'Canonical site URL',                  1),
('site.author',          'Aindgc',                'STRING',  'Author/owner name',                   1),
('site.icp',             '',                      'STRING',  'ICP record number (China)',           1),
('contact.email',        'hello@aindgc.com',      'STRING',  'Public contact email',                1),
('social.github',        '',                      'STRING',  'GitHub URL',                          1),
('social.twitter',       '',                      'STRING',  'Twitter URL',                         1),
('analytics.enabled',    'false',                 'BOOLEAN', 'Whether analytics is enabled',        0),
('analytics.ga_id',      '',                      'STRING',  'Google Analytics ID',                 1),
('analytics.baidu_id',   '',                      'STRING',  'Baidu Tongji ID',                     1);

-- ---------------------------------------------------------------------
-- Ad slots (all disabled by default; reserve for Phase 2 monetization)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO t_ad_slot (code, description, enabled, sort) VALUES
('HOME_HERO_BOTTOM',  'Home, bottom of hero',    0, 1),
('ARTICLE_TOP',       'Article detail, top',     0, 2),
('ARTICLE_MIDDLE',    'Article detail, middle',  0, 3),
('ARTICLE_BOTTOM',    'Article detail, bottom',  0, 4),
('TOOL_SIDEBAR',      'Tool pages sidebar',      0, 5);
