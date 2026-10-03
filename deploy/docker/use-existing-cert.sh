#!/usr/bin/env bash
# =====================================================================
# Aindgc — reuse an EXISTING certificate instead of requesting a new one
#
# For when the host already has a valid cert (e.g. left over from a previous
# deployment) and pulling a fresh Let's Encrypt cert is not worth the wait.
#
# The certificate is copied into the layout the container already expects
# (certs/conf/live/aindgc/{fullchain.pem,privkey.pem}), so nginx.https.conf
# needs no editing and a later ./issue-cert.sh can overwrite it cleanly.
#
# Usage:
#   ./use-existing-cert.sh /path/to/fullchain.pem /path/to/privkey.pem
#
# Renames are handled: a ".crt" fullchain or a ".key" private key are fine,
# they get normalised on the way in.
# =====================================================================
set -euo pipefail

cd "$(dirname "$0")"

CERT_SRC="${1:-}"
KEY_SRC="${2:-}"

log()  { printf '\033[1;34m[cert]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[ ok]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[err]\033[0m %s\n' "$*" >&2; exit 1; }

[[ -n "$CERT_SRC" && -n "$KEY_SRC" ]] || fail "usage: ./use-existing-cert.sh <fullchain.pem> <privkey.pem>"

for f in "$CERT_SRC" "$KEY_SRC"; do
  [[ -r "$f" ]] || fail "cannot read: $f"
done

# ---- inspect what we were given ------------------------------------------
log "certificate details:"
openssl x509 -in "$CERT_SRC" -noout -subject -issuer -dates | sed 's/^/    /'

# Reject a cert that is not yet valid — nginx would start but every client
# would get a warning, which is worse than staying on HTTP.
if ! openssl x509 -in "$CERT_SRC" -noout -checkend 0 >/dev/null 2>&1; then
  fail "certificate is EXPIRED or not yet valid"
fi
if ! openssl x509 -in "$CERT_SRC" -noout -checkend 2592000 >/dev/null 2>&1; then
  log "WARNING: expires within 30 days — plan a renewal"
fi

if ! openssl rsa -in "$KEY_SRC" -noout -check >/dev/null 2>&1 \
   && ! openssl ec -in "$KEY_SRC" -noout -check >/dev/null 2>&1; then
  fail "private key is not readable as RSA or EC — wrong file?"
fi

# cert and key must actually belong together
CERT_PUB=$(openssl x509 -in "$CERT_SRC" -noout -pubkey | openssl md5)
KEY_PUB=$(openssl pkey -in "$KEY_SRC" -pubout | openssl md5)
[[ "$CERT_PUB" == "$KEY_PUB" ]] || fail "certificate and private key do NOT match (mismatched pair)"
ok "cert/key pair matches"

# ---- install into the layout the container mounts -------------------------
DEST="certs/conf/live/aindgc"
mkdir -p "$DEST"
install -m 644 "$CERT_SRC" "$DEST/fullchain.pem"
install -m 600 "$KEY_SRC"  "$DEST/privkey.pem"
ok "installed to $DEST/{fullchain.pem,privkey.pem}"

# ---- switch the web container to the HTTPS config ------------------------
log "switching web container to HTTPS"
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d web

# nginx -t inside the container is the only real check
if ! docker compose -f docker-compose.yml -f docker-compose.https.yml exec -T web nginx -t 2>&1 | tail -3; then
  fail "nginx rejected the config — see the message above"
fi
ok "nginx config accepted"

sleep 5
docker compose -f docker-compose.yml -f docker-compose.https.yml logs --tail=10 web

# ---- verify --------------------------------------------------------------
echo
log "listening sockets:"
docker compose -f docker-compose.yml -f docker-compose.https.yml exec -T web ss -ltn 2>/dev/null \
  | grep -E ':(80|443)' || echo "    (could not read sockets from container)"

echo
ok "Done. Check externally:"
echo "  curl -sI https://www.aindgc.com/ | head -1"
echo
echo "If port 443 is still unreachable, the ALIYUN SECURITY GROUP needs an"
echo "inbound rule: custom TCP, 443/443, source 0.0.0.0/0."
