/**
 * Coding Templates — curated AI coding project starters
 *
 * Each entry is a hand-tuned project skeleton (file tree + key file contents)
 * for a common production stack. Browse, preview, copy.
 *
 * For dynamic generation use AI Coding Project Starter:
 *   /tools/coding-project-starter
 */
export interface CodingTemplate {
  id: string
  slug: string
  name: string
  category: 'FRONTEND' | 'BACKEND' | 'FULLSTACK' | 'DEVOPS' | 'MOBILE'
  stack: string                // e.g. "Vue 3 + FastAPI"
  language: string             // e.g. "TypeScript / Python"
  tagline: string
  description: string
  features: string[]
  fileTree: string[]           // paths under project root
  keyFiles: { name: string; content: string }[]
  installCommand: string
  runCommand: string
  author: string
  installs: number
  featured?: boolean
}

export const CODING_CATEGORY_LABEL: Record<CodingTemplate['category'], string> = {
  FRONTEND:  'Frontend',
  BACKEND:   'Backend',
  FULLSTACK: 'Full-stack',
  DEVOPS:    'DevOps',
  MOBILE:    'Mobile'
}

export const CODING_CATEGORY_ICON: Record<CodingTemplate['category'], string> = {
  FRONTEND:  'monitor',
  BACKEND:   'server',
  FULLSTACK: 'layers',
  DEVOPS:    'cloud',
  MOBILE:    'smartphone'
}

function file(n: string, c: string) {
  return { name: n, content: c }
}

export const CODING_TEMPLATES: CodingTemplate[] = [
  /* ───────────── FRONTEND ───────────── */
  {
    id: 'vue3-vite-ts',
    slug: 'vue3-vite-typescript',
    name: 'Vue 3 + Vite + TypeScript',
    category: 'FRONTEND',
    stack: 'Vue 3.4 / Vite 5 / TS 5',
    language: 'TypeScript',
    tagline: 'Editorial SPA starter with design tokens and Pinia.',
    description: 'A Vue 3 single-page application using Vite, TypeScript strict mode, Pinia, Vue Router, and a small design-token layer. No UI library lock-in.',
    features: [
      'Vite 5 with HMR and chunked vendor bundles',
      'TypeScript strict mode, ESLint + Prettier configured',
      'Pinia store with persistence composable',
      'Vue Router 4 with scroll behavior and meta guards',
      'Token-based CSS (no Tailwind, no SCSS vars sprawl)',
      'Axios client with interceptors and JWT attach'
    ],
    fileTree: [
      'package.json', 'vite.config.ts', 'tsconfig.json', 'index.html',
      'src/main.ts', 'src/App.vue', 'src/router/index.ts',
      'src/stores/app.ts', 'src/api/request.ts',
      'src/components/layout/AppHeader.vue', 'src/views/HomeView.vue',
      'src/design-system/tokens.css', '.env.example'
    ],
    keyFiles: [
      file('README.md', `# Vue 3 + Vite + TypeScript

Editorial SPA starter. Design tokens drive the look; Pinia holds state.

## Run

\`\`\`bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
\`\`\`

## Structure

- \`src/router\`     — Vue Router 4 with route guards
- \`src/stores\`     — Pinia stores (auth, app, …)
- \`src/api\`        — Axios client + endpoint modules
- \`src/design-system\` — tokens.css, typography, element overrides
- \`src/views\`      — Page components (one folder per route group)
- \`src/components\` — Reusable UI components
`),
      file('AGENTS.md', `# AI Coding Conventions — Vue 3 + Vite + TS

## Stack
- Vue 3.4 Composition API + <script setup lang="ts">
- Pinia 2 for state, Vue Router 4 for routing
- Vite 5 for build, ESLint + Prettier for style

## Rules
1. Components use PascalCase file names, kebab-case in templates.
2. Stores expose composition-API style (defineStore('id', () => { ... }))
3. No Tailwind, no SCSS sprawl. Use design tokens via CSS variables.
4. Strict TS — no implicit any, no \`as any\` outside test files.
5. Use \`<script setup lang="ts">\` only — no Options API.
6. All public API calls go through \`src/api/\` modules.
7. Before adding a dependency, ask: "can I do this in <30 LOC?".`),
      file('src/main.ts', `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './design-system/tokens.css'
import './design-system/main.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
`)
    ],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    author: 'aindgc',
    installs: 2150,
    featured: true
  },
  {
    id: 'react-vite-ts',
    slug: 'react-vite-typescript',
    name: 'React 18 + Vite + TS',
    category: 'FRONTEND',
    stack: 'React 18 / Vite 5 / TS 5',
    language: 'TypeScript',
    tagline: 'Lean React starter — no router, no UI lib, just hooks + Zustand.',
    description: 'A minimal React 18 + TypeScript + Vite setup with Zustand for state and React Query for server state. No routing baked in.',
    features: [
      'Vite 5 HMR + TypeScript strict',
      'Zustand for client state (no boilerplate)',
      'React Query for server cache and mutations',
      'Axios with interceptors (auth, error normalization)',
      'CSS Modules + design tokens (no Tailwind lock-in)',
      'ESLint flat config + Prettier'
    ],
    fileTree: [
      'package.json', 'vite.config.ts', 'tsconfig.json', 'index.html',
      'src/main.tsx', 'src/App.tsx',
      'src/store/useAppStore.ts',
      'src/api/client.ts', 'src/api/users.ts',
      'src/components/Button/Button.tsx', 'src/components/Button/Button.module.css',
      'src/features/users/UserList.tsx',
      '.env.example'
    ],
    keyFiles: [
      file('README.md', `# React 18 + Vite + TS

Lean React starter. State via Zustand. Server data via React Query.

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`
`),
      file('AGENTS.md', `# AI Coding Conventions — React 18 + Vite + TS

## Stack
- React 18 (function components + hooks only — no class components)
- Zustand 4 for client state
- @tanstack/react-query 5 for server state
- Vite 5, TypeScript strict

## Rules
1. Components are function components only.
2. Props are typed via interfaces — no \`React.FC\`.
3. Side effects in \`useEffect\` only when no declarative alternative.
4. Server data goes through React Query, never in Zustand.
5. Zustand stores expose selectors; never \`useStore(s => s)\` in hot paths.
6. Co-locate styles with components using CSS Modules.
7. No barrel exports from feature folders — import directly from files.`),
      file('src/api/client.ts', `import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)`)
    ],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    author: 'aindgc',
    installs: 1880
  },

  /* ───────────── BACKEND ───────────── */
  {
    id: 'springboot-java17',
    slug: 'spring-boot-java-17',
    name: 'Spring Boot 3 + Java 17',
    category: 'BACKEND',
    stack: 'Spring Boot 3.2 / Java 17 / MyBatis-Plus',
    language: 'Java',
    tagline: 'Production-ready REST API with JWT auth, MySQL, and Swagger.',
    description: 'Spring Boot 3.2 with Java 17, MyBatis-Plus for ORM, Spring Security 6 for JWT auth, and springdoc-openapi for Swagger UI.',
    features: [
      'Spring Boot 3.2 + Java 17 (records, sealed types, pattern matching)',
      'MyBatis-Plus 3.5 with custom @Select queries (no JPA)',
      'Spring Security 6 + JWT (access 24h / refresh 30d)',
      'springdoc-openapi Swagger UI at /swagger-ui.html',
      'Caffeine cache for hot reads',
      'Global exception handler with structured Result<T> responses'
    ],
    fileTree: [
      'pom.xml', 'src/main/java/com/example/app/Application.java',
      'src/main/java/com/example/app/security/SecurityConfig.java',
      'src/main/java/com/example/app/security/JwtUtil.java',
      'src/main/java/com/example/app/common/Result.java',
      'src/main/java/com/example/app/common/GlobalExceptionHandler.java',
      'src/main/java/com/example/app/entity/User.java',
      'src/main/java/com/example/app/mapper/UserMapper.java',
      'src/main/java/com/example/app/controller/UserController.java',
      'src/main/resources/application.yml', 'src/main/resources/application-dev.yml'
    ],
    keyFiles: [
      file('README.md', `# Spring Boot 3 + Java 17

Production REST API template. JWT auth, MyBatis-Plus, Swagger.

## Run

\`\`\`bash
mvn spring-boot:run
# Swagger: http://localhost:8080/swagger-ui.html
\`\`\`

## Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/users/me (JWT)
- GET  /api/admin/users (ADMIN)`),
      file('AGENTS.md', `# AI Coding Conventions — Spring Boot 3

## Stack
- Java 17 (records, sealed types, pattern matching — no Java 8 style)
- Spring Boot 3.2 + Spring Security 6
- MyBatis-Plus 3.5 (NOT JPA)
- jjwt 0.12 for JWT
- Lombok + MapStruct + Hutool
- MySQL 8, Caffeine cache

## Rules
1. All controllers return \`Result<T>\` — never raw objects.
2. Use records for DTOs, never Lombok @Data on public APIs.
3. SQL in mapper XML or @Select/@Update — no JPA-style derived queries.
4. Exception handling via @ControllerAdvice, never try/catch in controllers.
5. Validation: jakarta.validation annotations on DTOs.
6. API doc: @Operation + @Tag on every endpoint.
7. Tests: JUnit 5 + Mockito, one feature test per controller endpoint.`),
      file('src/main/java/com/example/app/common/Result.java', `package com.example.app.common;

import lombok.Data;

@Data
public class Result<T> {
    private int code;
    private String message;
    private T data;
    private String traceId;

    public static <T> Result<T> ok() { return ok(null); }

    public static <T> Result<T> ok(T data) {
        Result<T> r = new Result<>();
        r.code = 200;
        r.message = "OK";
        r.data = data;
        return r;
    }

    public static <T> Result<T> fail(int code, String message) {
        Result<T> r = new Result<>();
        r.code = code;
        r.message = message;
        return r;
    }
}`)
    ],
    installCommand: 'mvn clean install -DskipTests',
    runCommand: 'mvn spring-boot:run',
    author: 'aindgc',
    installs: 2420,
    featured: true
  },
  {
    id: 'fastapi-python',
    slug: 'fastapi-python',
    name: 'FastAPI + Python 3.11',
    category: 'BACKEND',
    stack: 'FastAPI 0.110 / Python 3.11 / SQLAlchemy 2',
    language: 'Python',
    tagline: 'Async REST API with JWT auth, SQLAlchemy 2.0, and Alembic.',
    description: 'FastAPI 0.110 with async SQLAlchemy 2.0, JWT auth via python-jose, Alembic for migrations, and Pydantic v2 for schemas.',
    features: [
      'FastAPI 0.110 async-first with Pydantic v2',
      'SQLAlchemy 2.0 (async) + Alembic migrations',
      'JWT auth with refresh token rotation',
      'SQLite for dev, MySQL/Postgres for prod via env',
      'OpenAPI docs at /docs (Swagger UI) and /redoc',
      'uvicorn reload + structlog JSON logs'
    ],
    fileTree: [
      'pyproject.toml', 'requirements.txt', 'alembic.ini',
      'app/main.py', 'app/core/config.py', 'app/core/security.py',
      'app/db/session.py', 'app/db/base.py',
      'app/models/user.py', 'app/schemas/user.py',
      'app/api/v1/auth.py', 'app/api/v1/users.py',
      'tests/test_auth.py', '.env.example'
    ],
    keyFiles: [
      file('README.md', `# FastAPI + Python 3.11

Async REST API. SQLAlchemy 2.0. JWT auth.

## Run

\`\`\`bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
# Docs: http://localhost:8000/docs
\`\`\``),
      file('AGENTS.md', `# AI Coding Conventions — FastAPI

## Stack
- Python 3.11 (match/case, tomllib, StrEnum)
- FastAPI 0.110 async routes
- SQLAlchemy 2.0 (async) + Alembic
- Pydantic v2 for request/response models
- python-jose for JWT, passlib for hashing
- pytest + httpx.AsyncClient for tests

## Rules
1. All endpoints are \`async def\`. Sync blocks go through \`run_in_threadpool\`.
2. Pydantic v2 syntax: \`Field(...)\`, model_config, model_validator.
3. DB session via Depends — never instantiate directly in routes.
4. Service layer (app/services/) — routes are thin, business logic in services.
5. Migrations: alembic revision --autogenerate, never edit migrations by hand.
6. Tests: one file per route module, fixtures in conftest.py.
7. Logging: structlog, never print()`),
      file('app/main.py', `from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import settings
from app.api.v1 import auth, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/health")
async def health():
    return {"status": "ok"}`)
    ],
    installCommand: 'pip install -r requirements.txt',
    runCommand: 'uvicorn app.main:app --reload',
    author: 'aindgc',
    installs: 1640
  },
  {
    id: 'node-express-ts',
    slug: 'node-express-typescript',
    name: 'Node.js + Express + TS',
    category: 'BACKEND',
    stack: 'Express 4 / Node 20 / TS 5',
    language: 'TypeScript',
    tagline: 'Minimal Express REST API with JWT auth and Prisma.',
    description: 'Node 20 + Express 4 + TypeScript 5 with Prisma ORM, JWT auth, and structured error responses.',
    features: [
      'Express 4 with strict TypeScript',
      'Prisma ORM (MySQL/Postgres/SQLite)',
      'JWT auth with bcrypt password hashing',
      'Zod for runtime request validation',
      'Centralized error middleware',
      'ESLint + Prettier, tsx for dev reload'
    ],
    fileTree: [
      'package.json', 'tsconfig.json', 'prisma/schema.prisma',
      'src/index.ts', 'src/app.ts',
      'src/middleware/auth.ts', 'src/middleware/error.ts',
      'src/routes/auth.ts', 'src/routes/users.ts',
      'src/services/userService.ts', 'src/lib/prisma.ts',
      'src/types/express.d.ts', '.env.example'
    ],
    keyFiles: [
      file('README.md', `# Node + Express + TS

REST API. Prisma ORM. JWT auth.

## Run

\`\`\`bash
npm install
npx prisma migrate dev
npm run dev
\`\`\``),
      file('AGENTS.md', `# AI Coding Conventions — Node + Express

## Stack
- Node 20 LTS, TypeScript 5 strict
- Express 4 (no Nest, no Fastify)
- Prisma ORM (no TypeORM, no raw SQL outside migrations)
- JWT via jsonwebtoken, bcrypt for passwords
- Zod for input validation

## Rules
1. Routes in \`src/routes/\`, business logic in \`src/services/\`.
2. Async errors: throw → caught by error middleware (no try/catch in routes).
3. Validate every request with Zod schema before reaching service.
4. Prisma client via singleton in src/lib/prisma.ts — no new PrismaClient().
5. Auth middleware sets \`req.user\`, typed via \`src/types/express.d.ts\`.
6. Env access only via \`src/lib/env.ts\` — never \`process.env\` directly in code.
7. Tests: vitest + supertest, one file per route module.`),
      file('src/app.ts', `import express from 'express'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { errorMiddleware } from './middleware/error'

export const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.use(errorMiddleware)`)
    ],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    author: 'aindgc',
    installs: 1320
  },

  /* ───────────── FULLSTACK ───────────── */
  {
    id: 'nextjs-app-router',
    slug: 'nextjs-app-router',
    name: 'Next.js 14 App Router + TS',
    category: 'FULLSTACK',
    stack: 'Next.js 14 / React 18 / Prisma',
    language: 'TypeScript',
    tagline: 'App Router with server actions, route handlers, and Prisma.',
    description: 'Next.js 14 with the App Router. Server components by default. Server actions for mutations. Prisma for DB. NextAuth for auth.',
    features: [
      'Next.js 14 App Router (no Pages Router)',
      'Server Components by default, Client Components only where needed',
      'Server Actions for forms (no separate API endpoints for mutations)',
      'Prisma ORM with PostgreSQL',
      'NextAuth v5 with Credentials + JWT session',
      'TypeScript strict + Tailwind CSS'
    ],
    fileTree: [
      'package.json', 'next.config.js', 'tsconfig.json', 'tailwind.config.ts',
      'prisma/schema.prisma',
      'app/layout.tsx', 'app/page.tsx', 'app/dashboard/page.tsx',
      'app/(auth)/login/page.tsx', 'app/api/auth/[...nextauth]/route.ts',
      'lib/db.ts', 'lib/auth.ts', 'components/Button.tsx',
      'middleware.ts'
    ],
    keyFiles: [
      file('README.md', `# Next.js 14 App Router

App Router. Server Components. Server Actions. Prisma.

## Run

\`\`\`bash
npm install
npx prisma migrate dev
npm run dev
\`\`\``),
      file('AGENTS.md', `# AI Coding Conventions — Next.js 14

## Stack
- Next.js 14 App Router (no /pages directory)
- React 18 Server Components by default
- Server Actions for mutations
- Prisma ORM with PostgreSQL
- NextAuth v5
- Tailwind CSS

## Rules
1. Default to Server Components. Add 'use client' only when needed (state, effects, browser APIs).
2. Mutations via Server Actions (\`'use server'\`), not API routes.
3. Data fetching in Server Components, never in useEffect.
4. Auth via NextAuth v5 with Credentials provider.
5. All DB queries go through lib/db.ts singleton.
6. Layouts: nested layouts for route groups (auth), (marketing).
7. Loading + error boundaries: loading.tsx, error.tsx per route segment.`),
      file('app/page.tsx', `import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome</h1>
    </main>
  )
}`)
    ],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    author: 'aindgc',
    installs: 1980
  },

  /* ───────────── DEVOPS ───────────── */
  {
    id: 'nginx-reverse-proxy',
    slug: 'nginx-reverse-proxy',
    name: 'Nginx Reverse Proxy + HTTPS',
    category: 'DEVOPS',
    stack: 'Nginx + Let\'s Encrypt',
    language: 'nginx config',
    tagline: 'HTTPS reverse proxy with certbot, HSTS, and gzip.',
    description: 'Production-grade Nginx config: HTTP→HTTPS redirect, gzip, HSTS, immutable asset cache, certbot-managed TLS, and a backend upstream.',
    features: [
      'HTTP→HTTPS redirect with 301',
      'Let\'s Encrypt TLS via certbot',
      'HSTS, X-Frame-Options, X-Content-Type-Options',
      'gzip + brotli for text assets',
      'Immutable Cache-Control for hashed assets',
      'Upstream with retry + keepalive'
    ],
    fileTree: [
      'nginx.conf', 'conf.d/aindgc.conf',
      'snippets/ssl-params.conf', 'snippets/gzip.conf',
      'scripts/renew-certs.sh', 'scripts/reload.sh',
      'README.md'
    ],
    keyFiles: [
      file('nginx.conf', `user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log warn;

events { worker_connections 4096; }

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile      on;
    tcp_nopush    on;
    keepalive_timeout 65;
    server_tokens off;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}`),
      file('conf.d/aindgc.conf', `# /etc/nginx/conf.d/aindgc.conf
upstream aindgc_backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name aindgc.com www.aindgc.com api.aindgc.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name aindgc.com www.aindgc.com;

    ssl_certificate     /etc/letsencrypt/live/aindgc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aindgc.com/privkey.pem;
    include snippets/ssl-params.conf;
    include snippets/gzip.conf;

    root /var/www/aindgc/dist;
    index index.html;

    # Hashed assets — immutable
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API + admin on api.aindgc.com
server {
    listen 443 ssl http2;
    server_name api.aindgc.com;

    ssl_certificate     /etc/letsencrypt/live/aindgc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aindgc.com/privkey.pem;
    include snippets/ssl-params.conf;
    include snippets/gzip.conf;

    location / {
        proxy_pass http://aindgc_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}`),
      file('snippets/ssl-params.conf', `# Modern SSL params (Mozilla intermediate)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;

add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;`),
      file('scripts/renew-certs.sh', `#!/usr/bin/env bash
# /etc/cron.d/certbot-renew
# 0 3 * * * root certbot renew --quiet && systemctl reload nginx
set -euo pipefail

certbot renew --quiet
systemctl reload nginx
echo "[$(date -Iseconds)] certs renewed" >> /var/log/certbot-renew.log`),
      file('AGENTS.md', `# AI Coding Conventions — Nginx

## Stack
- Nginx mainline
- Let's Encrypt via certbot
- Debian/Ubuntu paths

## Rules
1. One server block per domain/subdomain in conf.d/.
2. HTTP always redirects to HTTPS (return 301).
3. Use snippets/ for repeated config blocks.
4. Hashed assets (build output): immutable cache, 1 year.
5. SPA fallback: \`try_files $uri $uri/ /index.html;\`
6. Proxy: always set Host, X-Real-IP, X-Forwarded-Proto.
7. Run \`nginx -t\` before \`nginx -s reload\` — never skip the test.`)
    ],
    installCommand: 'cp -r . /etc/nginx/ && nginx -t',
    runCommand: 'systemctl reload nginx',
    author: 'aindgc',
    installs: 970
  },

  /* ───────────── MOBILE ───────────── */
  {
    id: 'flutter-riverpod',
    slug: 'flutter-riverpod',
    name: 'Flutter + Riverpod',
    category: 'MOBILE',
    stack: 'Flutter 3.16 / Dart 3.2',
    language: 'Dart',
    tagline: 'Cross-platform mobile starter with Riverpod 2 and go_router.',
    description: 'Flutter 3.16 with Dart 3.2, Riverpod 2 for state, go_router for navigation, and dio for HTTP.',
    features: [
      'Flutter 3.16 stable, Dart 3.2',
      'Riverpod 2 with code generation',
      'go_router for declarative navigation',
      'dio with interceptors (auth, error)',
      'freezed + json_serializable for models',
      'flutter_test + integration_test'
    ],
    fileTree: [
      'pubspec.yaml', 'lib/main.dart',
      'lib/app/router.dart', 'lib/app/theme.dart',
      'lib/features/auth/auth_repository.dart',
      'lib/features/auth/auth_controller.dart',
      'lib/features/auth/login_screen.dart',
      'lib/core/api/api_client.dart',
      'lib/core/models/user.dart',
      'test/auth_test.dart'
    ],
    keyFiles: [
      file('README.md', `# Flutter + Riverpod

Cross-platform mobile starter. Riverpod 2. go_router.

## Run

\`\`\`bash
flutter pub get
dart run build_runner build
flutter run
\`\`\``),
      file('AGENTS.md', `# AI Coding Conventions — Flutter

## Stack
- Flutter 3.16, Dart 3.2
- Riverpod 2 (NOT Provider, NOT Bloc)
- go_router
- dio for HTTP
- freezed + json_serializable for models

## Rules
1. State via @riverpod annotations, not legacy Provider.
2. Models are freezed + immutable.
3. One file per class. Group by feature, not by type.
4. Repositories return Result<T> or throw — never return null on error.
5. Routing via go_router only — no Navigator.push.
6. HTTP via dio singleton, interceptors for auth.
7. Tests: widget tests for UI, integration_test for flows.`),
      file('lib/main.dart', `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/router.dart';
import 'app/theme.dart';

void main() {
  runApp(const ProviderScope(child: AindgcApp()));
}

class AindgcApp extends ConsumerWidget {
  const AindgcApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'Aindgc',
      theme: AppTheme.dark(),
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}`)
    ],
    installCommand: 'flutter pub get',
    runCommand: 'flutter run',
    author: 'aindgc',
    installs: 720
  }
]

export function getTemplateBySlug(slug: string): CodingTemplate | undefined {
  return CODING_TEMPLATES.find(t => t.slug === slug)
}

export function getFeaturedTemplates(): CodingTemplate[] {
  return CODING_TEMPLATES.filter(t => t.featured)
}

export function getTemplatesByCategory(cat: CodingTemplate['category'] | 'all'): CodingTemplate[] {
  if (cat === 'all') return CODING_TEMPLATES
  return CODING_TEMPLATES.filter(t => t.category === cat)
}