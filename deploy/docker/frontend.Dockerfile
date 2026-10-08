# =====================================================================
# Aindgc frontend — static build served by nginx
#
# Same reasoning as the backend image: the Vite build happens locally
# (`pnpm build`) and only dist/ is uploaded. Node + the dev server need
# more RAM than this box has spare.
#
# The dev proxy in vite.config.ts already points /api at the backend, and
# request.ts defaults to VITE_API_BASE='/api'. In production nginx proxies
# the same path to the backend container, so the frontend needs no
# build-time API configuration and same-origin requests stay same-origin.
# =====================================================================
FROM nginx:1.27-alpine

# NOTE: this COPY is a fallback only.
# docker-compose.yml bind-mounts ../../frontend/dist over /usr/share/nginx/html
# so that publishing a release is just a file upload — no image rebuild, no
# container recreate. This baked-in copy keeps the image usable standalone.
COPY frontend/dist /usr/share/nginx/html
COPY deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
