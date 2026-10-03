#!/usr/bin/env bash
# =====================================================================
# Aindgc · issue a Let's Encrypt certificate and switch to HTTPS
#
# Prereqs (both are on the host, outside Docker, and outside this script):
#   1. DNS:  aindgc.com  and/or  www.aindgc.com  →  this server's IP
#            verify with:  getent hosts aindgc.com
#   2. Aliyun security group: inbound TCP 80 AND 443 open
#
# Usage:
#   ./issue-cert.sh aindgc.com www.aindgc.com
#
# How it works:
#   The certbot container solves the HTTP-01 challenge over port 80, which
#   the already-running web container serves from /var/www/certbot. The
#   site therefore never has to be down, and there is no nginx reload race.
# =====================================================================
set -euo pipefail

cd "$(dirname "$0")"

DOMAINS=("${@:-aindgc.com}")
[[ ${#DOMAINS[@]} -eq 0 ]] && { echo "usage: ./issue-cert.sh aindgc.com [www.aindgc.com ...]"; exit 1; }

log()  { printf '\033[1;34m[cert]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[ ok]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[err]\033[0m %s\n' "$*" >&2; exit 1; }

mkdir -p certs/conf certbot/www

# ---- preflight: does DNS already point here? -----------------------------
for d in "${DOMAINS[@]}"; do
  if ! getent hosts "$d" >/dev/null 2>&1; then
    fail "DNS: $d does not resolve yet. Add the A record first."
  fi
  log "DNS ok: $d -> $(getent hosts "$d" | awk '{print $1}' | head -1)"
done

# ---- is the HTTP-only site up? (needed to serve the challenge) ----------
if ! curl -fsS -m 8 -o /dev/null http://127.0.0.1/; then
  fail "port 80 is not serving. Run 'docker compose up -d' (HTTP mode) first."
fi
ok "HTTP site is up on :80"

# ---- fetch the certbot image, working around a blocked Docker Hub --------
CANDIDATES=(
  docker.m.daocloud.io
  dockerproxy.net
  hub.rat.dev
  docker.1ms.run
  docker.nju.edu.cn
  mirror.baidubce.com
)

if docker image inspect certbot/certbot:latest >/dev/null 2>&1; then
  log "certbot image already present"
else
  log "fetching certbot image (Docker Hub is commonly blocked on CN servers)"
  for m in "${CANDIDATES[@]}"; do
    log "trying $m"
    if timeout 180 docker pull "$m/certbot/certbot:latest" >/dev/null 2>&1; then
      docker tag "$m/certbot/certbot:latest" certbot/certbot:latest
      ok "got certbot image via $m"
      break
    fi
  done
  docker image inspect certbot/certbot:latest >/dev/null 2>&1 \
    || fail "could not fetch certbot from any mirror. Pull it manually, tag it certbot/certbot:latest, re-run."
fi

# ---- request the certificate --------------------------------------------
DOMAIN_ARGS=()
for d in "${DOMAINS[@]}"; do DOMAIN_ARGS+=(-d "$d"); done

log "requesting certificate for: ${DOMAINS[*]}"
docker run --rm \
  -v "$(pwd)/certs/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot:latest \
  certonly --webroot -w /var/www/certbot \
  "${DOMAIN_ARGS[@]}" \
  # --cert-name pins the directory under certs/conf/live/ to "aindgc"
  # regardless of which domains were requested. Without it certbot names the
  # folder after the first -d, so passing only www.aindgc.com would write to
  # live/www.aindgc.com and nginx.https.conf would not find it.
  --cert-name aindgc \
  --agree-tos --no-eff-email --non-interactive \
  --email "${LETSENCRYPT_EMAIL:-admin@aindgc.com}"

[[ -f certs/conf/live/aindgc/fullchain.pem ]] || fail "certificate was not written"
ok "certificate issued"

# ---- switch the site to HTTPS -------------------------------------------
log "switching web container to HTTPS config"
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d web
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d certbot

sleep 5
docker compose -f docker-compose.yml -f docker-compose.https.yml ps

echo
ok "HTTPS is up. Verify:"
for d in "${DOMAINS[@]}"; do
  echo "  curl -sI https://$d/ | head -1"
done
echo
echo "Renewal is automatic (certbot loop every 12h)."
echo "To go back to HTTP-only:"
echo "  docker compose -f docker-compose.yml up -d web"
