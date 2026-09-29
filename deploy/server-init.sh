#!/usr/bin/env bash
# =====================================================================
# Aindgc · Server initialiser (Ubuntu 24.04 LTS on Aliyun ECS 2C2G)
# Run as root on a fresh VPS: `sudo bash server-init.sh`
# Idempotent: safe to re-run.
# =====================================================================
set -euo pipefail

# ---- Config (override via env vars) ----
AINDGC_USER="${AINDGC_USER:-www-data}"
AINDGC_DOMAIN="${AINDGC_DOMAIN:-aindgc.com}"
AINDGC_ADMIN_EMAIL="${AINDGC_ADMIN_EMAIL:-hello@aindgc.com}"
MYSQL_ROOT_PASS="${MYSQL_ROOT_PASS:-}"
MYSQL_APP_USER="${MYSQL_APP_USER:-aindgc}"
MYSQL_APP_PASS="${MYSQL_APP_PASS:-}"

if [[ -z "$MYSQL_ROOT_PASS" || -z "$MYSQL_APP_PASS" ]]; then
  echo "[ERR] MYSQL_ROOT_PASS and MYSQL_APP_PASS must be set in env" >&2
  exit 1
fi

# ---- Logging ----
log() { printf "\033[1;34m[init]\033[0m %s\n" "$*"; }
ok()  { printf "\033[1;32m[ ok]\033[0m %s\n" "$*"; }

# ---- 1. System update + essentials ----
log "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y >/dev/null
apt-get upgrade -y >/dev/null
apt-get install -y curl wget git vim ufw fail2ban software-properties-common apt-transport-https ca-certificates gnupg

# ---- 2. Firewall ----
log "Configuring UFW (SSH + HTTP + HTTPS only)..."
ufw --force reset >/dev/null
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow ssh >/dev/null
ufw allow http >/dev/null
ufw allow https >/dev/null
ufw --force enable >/dev/null
ok "UFW configured (ssh/80/443)"

# ---- 3. Timezone ----
log "Setting timezone..."
timedatectl set-timezone Asia/Shanghai || true

# ---- 4. Java 17 (Temurin) ----
if ! command -v java >/dev/null 2>&1; then
  log "Installing OpenJDK 17..."
  apt-get install -y openjdk-17-jdk-headless
else
  ok "Java already installed: $(java -version 2>&1 | head -1)"
fi

# ---- 5. Node 20 + pnpm ----
if ! command -v node >/dev/null 2>&1; then
  log "Installing Node 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null
  apt-get install -y nodejs
  npm install -g pnpm@9
else
  ok "Node already installed: $(node -v)"
fi

# ---- 6. Nginx ----
if ! command -v nginx >/dev/null 2>&1; then
  log "Installing Nginx..."
  apt-get install -y nginx
  systemctl enable nginx
else
  ok "Nginx already installed: $(nginx -v 2>&1)"
fi

# ---- 7. MySQL 8 ----
if ! command -v mysql >/dev/null 2>&1; then
  log "Installing MySQL 8..."
  apt-get install -y mysql-server
  systemctl enable mysql
else
  ok "MySQL already installed: $(mysql --version)"
fi

# Secure MySQL & create app database/user
log "Configuring MySQL..."
systemctl start mysql
mysql --user=root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASS}';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
EOF
ok "MySQL root secured"

# Create app database + user (idempotent)
mysql --user=root --password="${MYSQL_ROOT_PASS}" <<EOF
CREATE DATABASE IF NOT EXISTS aindgc DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${MYSQL_APP_USER}'@'localhost' IDENTIFIED BY '${MYSQL_APP_PASS}';
ALTER USER '${MYSQL_APP_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_APP_PASS}';
GRANT ALL PRIVILEGES ON aindgc.* TO '${MYSQL_APP_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF
ok "Database 'aindgc' + user '${MYSQL_APP_USER}' ready"

# ---- 8. Certbot (Let's Encrypt) ----
if ! command -v certbot >/dev/null 2>&1; then
  log "Installing Certbot..."
  apt-get install -y certbot python3-certbot-nginx
else
  ok "Certbot already installed"
fi

# ---- 9. aindgc user & directories ----
log "Creating aindgc user..."
if ! id -u aindgc >/dev/null 2>&1; then
  useradd --system --shell /bin/bash --home /opt/aindgc aindgc
fi
mkdir -p /opt/aindgc/{backend,frontend,logs,uploads,backups}
chown -R aindgc:aindgc /opt/aindgc
ok "User 'aindgc' + directories created"

# ---- 10. Nginx site (placeholder; replaced by deploy.sh) ----
if [[ ! -f /etc/nginx/sites-available/aindgc ]]; then
  log "Installing placeholder Nginx site (replace after deploy)..."
  cat > /etc/nginx/sites-available/aindgc <<'NGINX'
server {
    listen 80 default_server;
    server_name _;
    location / {
        return 200 'Aindgc — backend not yet deployed. Run deploy.sh first.\n';
        add_header Content-Type text/plain;
    }
}
NGINX
  ln -sf /etc/nginx/sites-available/aindgc /etc/nginx/sites-enabled/aindgc
  rm -f /etc/nginx/sites-enabled/default
  nginx -t && systemctl reload nginx
fi

# ---- 11. systemd backend unit (placeholder) ----
cat > /etc/systemd/system/aindgc-backend.service <<'UNIT'
[Unit]
Description=Aindgc Backend (placeholder — replace via deploy.sh)
After=network.target mysql.service
Wants=mysql.service
[Service]
Type=oneshot
ExecStart=/bin/true
RemainAfterExit=yes
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload

# ---- 12. Logrotate ----
cat > /etc/logrotate.d/aindgc <<'LOGROTATE'
/var/log/aindgc/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    create 0640 aindgc aindgc
    postrotate
        systemctl reload aindgc-backend.service > /dev/null 2>&1 || true
    endscript
}
LOGROTATE

# ---- 13. Backup cron ----
cat > /etc/cron.d/aindgc-backup <<CRON
# Daily MySQL backup at 03:30
30 3 * * * aindgc bash /opt/aindgc/scripts/backup.sh >> /var/log/aindgc/backup.log 2>&1
CRON

log "=========================================================="
log "  Server initialised."
log "  Next: copy deploy.sh to /opt/aindgc/scripts/, then run it."
log "=========================================================="
