# Aindgc · AI Product Lab

> Turn AI Into Work. 让 AI 真正开始工作。

一个高级 AI 产品作品集网站 + AI Agent / Workflow 工具集合 + AI 项目案例展示入口。

**生产域名**: `aindgc.com` · `admin.aindgc.com` · `api.aindgc.com`

---

## 项目结构

```
aindgc/
├── frontend/               # Vue 3 + TypeScript + Vite (port 5173)
├── backend/                # Spring Boot 3.2 + Java 17 + MyBatis-Plus (port 8080)
├── deploy/                 # Nginx + systemd configs
├── docs/                   # 架构、设计、API 文档
├── .gitignore
└── README.md (this file)
```

## 当前状态 · 全部 Phase 已完成 ✅

`D:\project\MVPdemo\aindgc\` 下,frontend + backend + deploy 三大子系统都已端到端落地:

- **Frontend (30 个 view, 25 个 A* 组件)**: Vue 3 + TS + Vite + Pinia + Vue Router + Element Plus,完整设计系统
- **Backend (10 个 controller + 9 个 mapper + 6 个 generator)**: Spring Boot 3.2 + Java 17 + MyBatis-Plus + Spring Security 6 + JWT
- **Database**: 25 张表 + 自动 seed (6 tools + 4 cases + 5 articles + 12 tags)
- **Admin**: 7 个 admin view + 6 个 admin controller,Dashboard / Articles / Cases / Tools / Users / Settings
- **Auth**: JWT access + refresh,公开注册登录,role-based 权限
- **SEO**: sitemap.xml / robots.txt / JSON-LD (WebSite + Organization + Article + CreativeWork + ItemList + BreadcrumbList)
- **Deploy**: systemd + Nginx + Let's Encrypt + deploy.sh + backup.sh + DEPLOY.md

## 快速启动

### 1. 启动 MySQL 并初始化数据

```bash
# Windows PowerShell
$env:MYSQL_PWD = "your_password"
mysql -u root -e "CREATE DATABASE IF NOT EXISTS aindgc DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root aindgc < backend\src\main\resources\sql\01-schema.sql
mysql -u root aindgc < backend\src\main\resources\sql\02-seed.sql
```

### 2. 启动 Backend

```bash
cd backend
mvn spring-boot:run
# -> http://127.0.0.1:8080
# -> Swagger UI: http://127.0.0.1:8080/swagger-ui.html
```

健康检查:

```bash
curl http://127.0.0.1:8080/api/health
# -> {"status":"UP","app":"aindgc-backend","version":"0.1.0","env":"dev","timestamp":...}
```

默认管理员(首次启动自动创建):
- 用户名:`admin`
- 密  码:`Aindgc@2026`(从环境变量 `AINDGC_ADMIN_PASSWORD` 覆盖)
- ⚠️ 首次登录后立即修改

### 3. 启动 Frontend

```bash
cd frontend
pnpm install     # 或 npm install / yarn
pnpm dev         # -> http://localhost:5173
```

访问 `http://localhost:5173`,首页会调用 `/api/health` 显示 backend 状态。

---

## 完整 Phase 路线图

| # | Phase | 状态 | 说明 |
|---|---|---|---|
| 1 | 项目初始化 | ✅ | Frontend + Backend + DB + Nginx 骨架 |
| 2 | 设计系统 | ✅ | 25 个 A* 组件 + Element Plus 主题 override + tokens.css |
| 3 | 首页 | ✅ | 10 个 Section + HeroWorkflowVisualizer + CapabilityMap |
| 4 | Tools | ✅ | 6 个生成器 (Workflow / Skills / Context / Coding / Prompt / Schema) |
| 5 | Workflow Builder | ✅ | Vue Flow 拖拽 + 3 模板 + 6 节点类型 |
| 6 | ROI | ✅ | 计算器 + Share link + History drawer |
| 7 | Checkup | ✅ | 6 步问卷 + 16 机会池 + 4 bands |
| 8 | Skills | ✅ | 生成器 + **Marketplace** (12 curated SKILL.md) |
| 9 | Coding | ✅ | Starter 生成器 + **Templates** (8 curated stack templates) |
| 10 | Cases / Insights | ✅ | 4 cases + 5 articles,Markdown rendering |
| 11 | Admin | ✅ | 7 view + 6 controller,Dashboard / Articles / Cases / Tools / Users / Settings |
| 12 | API 实现 | ✅ | 10 controller + 9 mapper + 6 Java generator |
| 13 | 数据初始化 | ✅ | ContentDataInitializer 自动 seed |
| 14 | Authentication | ✅ | JWT access/refresh + AuthController + login/register/profile |
| 15 | SEO | ✅ | sitemap.xml + robots.txt + JSON-LD (Article / CreativeWork / ItemList / WebSite / Organization / BreadcrumbList) |
| 16 | 部署 | ✅ | systemd + nginx + Let's Encrypt + deploy.sh + backup.sh + DEPLOY.md (11 章) |

## 技术栈

| Layer | Choice |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus |
| Backend | Java 17 + Spring Boot 3.2 + MyBatis-Plus + Spring Security 6 + JWT |
| Database | MySQL 8.0 (utf8mb4) |
| Deployment | Ubuntu 24.04 + Nginx + Let's Encrypt + systemd |
| Server | 阿里云 ECS 2C2G 40GB |

## 设计哲学

- **Quiet Technology** · 安静、不喧宾夺主
- **Editorial** · 像一本排版精致的科技杂志
- **Spatial** · 大留白,有呼吸感
- **Functional Beauty** · 每个元素都有用,装饰克制
- **First-Principles AI** · 不堆砌 AI API,工具解决具体问题

## 文档

- [架构文档](docs/00-PROJECT-ARCHITECTURE.md) — 完整 IA / 技术选型 / ER / API / Design System / Phase
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Deploy guide](deploy/DEPLOY.md) — Aliyun ECS 一键部署

## License

MIT
