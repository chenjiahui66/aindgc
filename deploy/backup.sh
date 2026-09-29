#!/usr/bin/env bash
# =====================================================================
# Aindgc · Daily MySQL backup
# Keeps 7 daily + 4 weekly backups.
# Runs from /etc/cron.d/aindgc-backup.
# =====================================================================
set -euo pipefail

BACKUP_DIR="/opt/aindgc/backups"
TS=$(date +%Y%m%d-%H%M%S)
KEEP_DAILY=7
KEEP_WEEKLY=4

ENV_FILE="/etc/aindgc/backend.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "[ERR] $ENV_FILE missing" >&2
  exit 1
fi

DB_USER=$(grep '^DB_USER=' "$ENV_FILE" | cut -d= -f2)
DB_PASS=$(grep '^DB_PASS=' "$ENV_FILE" | cut -d= -f2)

mkdir -p "$BACKUP_DIR"

# Daily backup
DAILY="$BACKUP_DIR/daily/aindgc-${TS}.sql.gz"
mkdir -p "$(dirname "$DAILY")"
mysqldump -u"$DB_USER" -p"$DB_PASS" --single-transaction --routines --triggers --events aindgc \
  | gzip > "$DAILY"
echo "[ok] Daily backup: $DAILY ($(du -h "$DAILY" | cut -f1))"

# Weekly backup (Sunday)
if [[ $(date +%u) -eq 7 ]]; then
  WEEKLY="$BACKUP_DIR/weekly/aindgc-week-$(date +%Y%W).sql.gz"
  mkdir -p "$(dirname "$WEEKLY")"
  cp "$DAILY" "$WEEKLY"
  echo "[ok] Weekly backup: $WEEKLY"
fi

# Prune old
echo "[info] Pruning backups older than ${KEEP_DAILY} days (daily) / ${KEEP_WEEKLY} weeks (weekly)..."
find "$BACKUP_DIR/daily" -type f -name '*.sql.gz' -mtime +${KEEP_DAILY} -delete || true
find "$BACKUP_DIR/weekly" -type f -name '*.sql.gz' -mtime +$((KEEP_WEEKLY * 7)) -delete || true

echo "[done] Backup complete: $(date)"
