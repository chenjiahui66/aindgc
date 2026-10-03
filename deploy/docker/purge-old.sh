#!/usr/bin/env bash
# =====================================================================
# Aindgc · Purge the previous aitools / aiwork deployment
#
# Removes containers, networks, named volumes and host config left behind by
# the old stack, so that aindgc can own :80 and the disk.
#
#   ./purge-old.sh          # dry run — prints what WOULD be removed
#   ./purge-old.sh --yes    # actually do it
#
# NOTE: volume removal is NOT reversible. The dry run exists so you can read
# the exact list before passing --yes.
# =====================================================================
set -uo pipefail

ASSUME_YES=0
[[ "${1:-}" == "--yes" ]] && ASSUME_YES=1

MATCH='aitools|aiwork|aitoolshub'

red()   { printf '\033[1;31m%s\033[0m\n' "$*"; }
yellow(){ printf '\033[1;33m%s\033[0m\n' "$*"; }
green() { printf '\033[1;32m%s\033[0m\n' "$*"; }
dim()   { printf '\033[2m%s\033[0m\n' "$*"; }

# ---- 1. containers -------------------------------------------------------
mapfile -t CONTAINERS < <(docker ps -a --format '{{.Names}}' | grep -E "$MATCH" || true)

# ---- 2. images -----------------------------------------------------------
mapfile -t IMAGES < <(docker images --format '{{.Repository}}:{{.Tag}}' \
  | grep -E "$MATCH" | grep -v '<none>' || true)

# ---- 3. named volumes ----------------------------------------------------
# Only volumes whose NAME matches. This is the irreversible part.
mapfile -t VOLUMES < <(docker volume ls --format '{{.Name}}' | grep -E "$MATCH" || true)

# ---- 4. user-defined networks -------------------------------------------
mapfile -t NETWORKS < <(docker network ls --format '{{.Name}}' \
  | grep -E "$MATCH" | grep -vE '^(bridge|host|none)$' || true)

# ---- 5. host config outside docker --------------------------------------
# Directories that belong solely to the old stack.
HOST_DIRS=(
  /opt/aitools
  /opt/aiwork
  /opt/docker-compose.yml
)

# nginx confs are matched by CONTENT, never deleted blindly: a file called
# default.conf may well belong to some other service on this host.
NGINX_DIRS=(/etc/nginx/conf.d /etc/nginx/sites-enabled)
NGINX_GREP='aitools|aiwork|aitoolshub'

mapfile -t NGINX_FILES < <(
  for d in "${NGINX_DIRS[@]}"; do
    [[ -d "$d" ]] || continue
    grep -rlE "$NGINX_GREP" "$d" 2>/dev/null || true
  done
)

MODE="DRY RUN"
[[ $ASSUME_YES -eq 1 ]] && MODE="LIVE"

echo
echo "===================== $MODE ====================="
echo "containers to remove : ${#CONTAINERS[@]}"
for c in "${CONTAINERS[@]}"; do dim "    - $c"; done
echo "images to remove     : ${#IMAGES[@]}"
for i in "${IMAGES[@]}"; do dim "    - $i"; done
echo "volumes to remove    : ${VOLUMES[*]:-(none)}"
echo "networks to remove   : ${NETWORKS[*]:-(none)}"
echo "host dirs to check :"
for p in "${HOST_DIRS[@]}"; do
  if [[ -e "$p" ]]; then red "    - $p  (EXISTS)"; else dim "    - $p  (absent)"; fi
done
echo "nginx files matching '$NGINX_GREP' :"
if [[ ${#NGINX_FILES[@]} -gt 0 ]]; then
  for f in "${NGINX_FILES[@]}"; do red "    - $f"; done
else
  dim "    (none)"
fi
echo "=================================================="
echo

if [[ ${#CONTAINERS[@]} -eq 0 && ${#VOLUMES[@]} -eq 0 ]]; then
  green "Nothing matching '$MATCH' found. Already clean."
  exit 0
fi

if [[ $ASSUME_YES -eq 0 ]]; then
  yellow "Nothing was changed. Re-run with --yes to actually remove."
  exit 0
fi

red ">>> Proceeding with removal."

# ---- remove containers ---------------------------------------------------
if [[ ${#CONTAINERS[@]} -gt 0 ]]; then
  docker rm -f "${CONTAINERS[@]}" && green "removed ${#CONTAINERS[@]} container(s)"
fi

# ---- remove images -------------------------------------------------------
if [[ ${#IMAGES[@]} -gt 0 ]]; then
  docker rmi -f "${IMAGES[@]}" 2>/dev/null && green "removed images" || yellow "some images still in use"
fi

# ---- remove networks (after containers) ----------------------------------
if [[ ${#NETWORKS[@]} -gt 0 ]]; then
  docker network rm "${NETWORKS[@]}" 2>/dev/null && green "removed networks" || yellow "some networks still in use"
fi

# ---- remove volumes (IRREVERSIBLE — last) -------------------------------
if [[ ${#VOLUMES[@]} -gt 0 ]]; then
  red ">>> Removing volumes (IRREVERSIBLE): ${VOLUMES[*]}"
  docker volume rm "${VOLUMES[@]}" && green "removed volumes"
fi

# ---- host config ---------------------------------------------------------
for p in "${HOST_DIRS[@]}"; do
  if [[ -e "$p" ]]; then
    # Confine deletion to the exact enumerated paths; never a wildcard.
    rm -rf -- "$p" && green "removed $p"
  fi
done

# nginx confs, only those whose CONTENT names the old stack.
if [[ ${#NGINX_FILES[@]} -gt 0 ]]; then
  for f in "${NGINX_FILES[@]}"; do
    rm -f -- "$f" && green "removed nginx conf $f"
  done
fi

# nginx must still be valid after losing its old config
if systemctl is-active --quiet nginx; then
  if nginx -t 2>/dev/null; then
    systemctl reload nginx && green "nginx config OK, reloaded"
  else
    red "nginx config is INVALID after cleanup — check: nginx -t"
  fi
fi

echo
green "Purge complete. Verify with:"
echo "  docker ps -a"
echo "  ss -tlnp | grep :80"
