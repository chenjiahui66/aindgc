# Aindgc Backend

Spring Boot 3.2 + Java 17 + MyBatis-Plus + MySQL 8 + Spring Security 6 + JWT.

## Stack

| Layer | Choice |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2.5 |
| ORM | MyBatis-Plus 3.5.5 |
| Database | MySQL 8.0 |
| Security | Spring Security 6 + jjwt 0.12 |
| Docs | springdoc-openapi 2.3 (Swagger UI) |
| Cache | Caffeine (Phase 1) |
| Tooling | Lombok, MapStruct, Hutool |

## Quick start (local)

### 1. Requirements

- JDK 17
- Maven 3.8+
- MySQL 8.0 (running on `127.0.0.1:3306`)

### 2. Create database

```bash
mysql -u root -p
> CREATE DATABASE aindgc DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Initialize schema + seed

```bash
mysql -u root -p aindgc < src/main/resources/sql/01-schema.sql
mysql -u root -p aindgc < src/main/resources/sql/02-seed.sql
```

Or use Maven plugin (after first run config):

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### 4. Configure env (optional)

Create `~/.aindgc/env.sh` or `.env.local`:

```bash
export DB_USER=root
export DB_PASS=your-password
export AINDGC_ADMIN_PASSWORD=YourSecurePassword!
export AINDGC_JWT_SECRET=$(openssl rand -base64 64)
export AINDGC_UPLOAD_DIR=/opt/aindgc/uploads
```

Then `source ~/.aindgc/env.sh` before running.

### 5. Run

```bash
# Dev (auto reload via Spring DevTools is NOT enabled by default)
mvn spring-boot:run

# Or build and run jar
mvn clean package -DskipTests
java -jar target/aindgc-backend.jar
```

### 6. Verify

```bash
# Health check
curl http://127.0.0.1:8080/api/health

# Swagger UI
open http://127.0.0.1:8080/swagger-ui.html
```

Expected response from `/api/health`:

```json
{
  "status": "UP",
  "app": "aindgc-backend",
  "version": "0.1.0",
  "env": "dev",
  "timestamp": 1738...
}
```

## Default admin (auto-created on first boot)

| Field | Value | Override env |
|---|---|---|
| Username | `admin` | `AINDGC_ADMIN_USERNAME` |
| Email | `admin@aindgc.com` | `AINDGC_ADMIN_EMAIL` |
| Password | `Aindgc@2026` | `AINDGC_ADMIN_PASSWORD` |

> ⚠️ **MUST change the default password immediately after first login.**
> Auth controller is implemented in Phase 14.

## Project layout

```
src/main/java/com/aindgc/ai/
├── AindgcApplication.java
├── common/                # Result, ResultCode, PageResult, PageQuery
├── config/                # WebConfig, SecurityConfig, MybatisPlusConfig, OpenApiConfig, InitDataInitializer
├── controller/            # REST controllers (HealthController for Phase 1)
├── entity/                # MyBatis-Plus entities
├── exception/             # BusinessException, GlobalExceptionHandler
├── mapper/                # MyBatis-Plus mappers
└── utils/                 # (Phase 2+)

src/main/resources/
├── application.yml         # Shared config (port, JWT settings, etc.)
├── application-dev.yml     # Dev profile (DB connection)
├── application-prod.yml    # Prod profile (HikariCP tuned)
├── sql/
│   ├── 01-schema.sql       # All table DDL
│   └── 02-seed.sql         # Reference/config data
└── mapper/                 # Custom MyBatis XML (when needed)
```

## Phase progress

- [x] **Phase 1** — Init: Spring Boot skeleton + `/api/health` + User/Role entities + InitDataInitializer + SQL schema
- [x] **Phase 12** — Backend API: 9 entities + 9 mappers + 6 generators (Java 规则引擎) + 11 controllers covering all公开 API + dynamic sitemap.xml + robots.txt
- [x] **Phase 13** — Content seed: ContentDataInitializer auto-fills tools (6) + cases (4) + articles (5) + tags + tag relations on first boot (idempotent)
- [ ] **Phase 14** — Auth: JWT login/register/refresh + Security 6 config
- [ ] **Phase 15** — SEO: structured data (JSON-LD) + OG image generation
- [ ] **Phase 16** — Deployment: systemd unit + nginx + Let's Encrypt

See `../docs/00-PROJECT-ARCHITECTURE.md` for full architecture.

## API surface

### Public read APIs

| Method | Path | Description |
|---|---|---|
| GET | `/api/articles` | List articles (filter by category, tag, q, page, size) |
| GET | `/api/articles/featured` | Featured articles |
| GET | `/api/articles/categories` | Article categories |
| GET | `/api/articles/tags` | All article tags |
| GET | `/api/articles/{slug}` | Article detail (auto-increment view count) |
| GET | `/api/cases` | List cases (filter by category, type) |
| GET | `/api/cases/featured` | Featured cases |
| GET | `/api/cases/categories` | Case categories |
| GET | `/api/cases/{slug}` | Case detail |
| GET | `/api/tools` | List tools |
| GET | `/api/tools/featured` | Featured tools |
| GET | `/api/tools/categories` | Tool categories |
| GET | `/api/tools/{slug}` | Tool detail |
| POST | `/api/generate/{slug}` | Generate tool output (6 generators) |
| POST | `/api/roi/calculate` | Calculate ROI |
| POST | `/api/checkup/submit` | Submit checkup answers, get score |
| GET | `/api/seo/page` | Get SEO config (by path or key) |
| GET | `/api/site/config/public` | Public site config map |
| GET | `/sitemap.xml` | Dynamic sitemap |
| GET | `/robots.txt` | robots.txt |
| GET | `/swagger-ui.html` | API docs (springdoc-openapi) |
