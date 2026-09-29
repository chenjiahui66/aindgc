# Aindgc Frontend

Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus.

## Stack

| Layer | Choice |
|---|---|
| Framework | Vue 3.4+ (Composition API + `<script setup>`) |
| Language | TypeScript (strict) |
| Build | Vite 5 |
| Router | Vue Router 4 |
| State | Pinia 2 |
| UI Base | Element Plus 2 (fully overridden by Design System) |
| Icons | Lucide |
| Charts | ECharts 5 |
| Workflow | Vue Flow (Phase 5) |
| Animation | GSAP (Phase 3) |

## Quick start

```bash
# Install dependencies (recommended: pnpm)
pnpm install

# Dev server
pnpm dev
# -> http://localhost:5173

# Production build
pnpm build
# -> dist/

# Type check only
pnpm type-check

# Lint
pnpm lint
```

## Project layout

```
src/
├── api/           # Axios client + endpoints
├── assets/        # Static assets (fonts, images)
├── components/    # A* design system components
├── composables/   # Vue composables
├── design-system/ # tokens.css, reset.css, typography.css
├── router/        # Vue Router routes
├── stores/        # Pinia stores
├── styles/        # Global styles entry
├── types/         # TS types (auto-imports, entities)
├── utils/         # Utilities
├── views/         # Page components
├── App.vue
├── env.d.ts
└── main.ts
```

## Phase progress

- [x] **Phase 1** — Project init: Vite + Vue 3 + TS + Router + Pinia + Design System tokens
- [x] **Phase 2** — Design System: 25 A* components + Layout primitives + Element Plus deep override + /design-system preview
- [x] **Phase 3** — Home page: AppHeader + AppFooter + 10 sections + Hero node viz + Capability map
- [x] **Phase 4** — Tools: 6 generators (workflow / skill / context / coding / prompt / schema) + ResultPanel + Markdown/JSON/ZIP export + Share link
- [x] **Phase 5** — Workflow Builder: Vue Flow + 6 node kinds + drag/drop + Inspector + templates + Markdown/JSON export + localStorage persistence
- [x] **Phase 6** — ROI Calculator: input form + live calc + count-up + Share link + history (localStorage) + JSON export
- [x] **Phase 7** — AI Checkup: 6-step questionnaire + scoring engine + Score ring + Top 5 opportunities + Strengths/Gaps + Breakdown + 30-day auto-expire
- [ ] **Phase 8** — Skills (工具已做,Phase 8 做 marketplace)
- [ ] **Phase 9** — Coding
- [x] **Phase 10** — Cases & Insights: 4 case studies (Real/Prototype/Experiment/Concept) + 5 long-form articles with full Markdown rendering, SEO landing pages
- [ ] **Phase 11** — Admin
- [ ] **Phase 15** — SEO
- [ ] **Phase 16** — Deployment

See `../docs/00-PROJECT-ARCHITECTURE.md` for full architecture.

## Visit

- `/` — Home (10 sections)
- `/tools` — All tools (search + category filter)
- `/tools/<slug>` — Each tool: 6 generators, real-time preview, Markdown / JSON / ZIP export, share link
- `/design-system` — Design system preview (noindex)
