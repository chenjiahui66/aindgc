# Aindgc · Production Deployment Guide

Target: **Aliyun ECS 2C2G 40GB · Ubuntu 24.04 LTS · aindgc.com**

> Estimated cost: ¥80-150/month (ECS 2C2G + 40G disk + 5M bandwidth)

---

## 0 · Architecture overview

```
                ┌───────────────────────────────────────┐
                │           Aliyun ECS 2C2G              │
                │           Ubuntu 24.04 LTS             │
                │                                       │
Internet ──────►│ Nginx :80 / :443 (TLS via Let's       │
   (HTTPS)      │   Encrypt)                           │
                │   │                                  │
                │   ├─ /api/*  ──►  Spring Boot :8080    │
                │   ├─ /sitemap ──►  Spring Boot         │
                │   ├─ /robots  ──►  Spring Boot         │
                │   └─ /*       ──►  /var/www/aindgc/    │
                │                   (Vue3 dist/)        │
                │                                       │
                │   MySQL 8 :3306  (localhost only)     │
                │   Certbot  (auto-renew every 60d)      │
                │                                       │
                │   systemd aindgc-backend.service      │
                │   logrotate  /var/log/aindgc/*.log     │
                │   cron       daily MySQL backup        │
                └───────────────────────────────────────┘
```

---

## 1 · Buy & prep the VPS

1. Go to <https://ecs.console.aliyun.com>
2. **Custom purchase**:
   - Region: Hong Kong or Singapore (no ICP needed)
   - Instance type: `ecs.t6-c2m1.large` or `ecs.s6-c1m2.small` (2 vCPU / 2 GiB)
   - Image: Ubuntu 24.04 LTS 64-bit
   - Storage: 40 GiB ESSD
   - Bandwidth: 5 Mbps (peak)
   - Public IP: assign + release-to-EIP recommended
3. **Security Group** open: `22 (SSH)`, `80 (HTTP)`, `443 (HTTPS)`. **Close 3306, 8080**.
4. Set a root password or upload an SSH key.

---

## 2 · First login & run `server-init.sh`

```bash
# From your local machine
ssh root@<ECS_PUBLIC_IP>

# Update apt, install git, clone the repo
apt update && apt install -y git
git clone https://github.com/your-org/aindgc.git /opt/aindgc-src
cd /opt/aindgc-src/deploy

# Set required env vars
export MYSQL_ROOT_PASS='PickAStrongRootPass!'
export MYSQL_APP_PASS='PickAStrongAppPass!'
export AINDGC_DOMAIN='aindgc.com'
export AINDGC_ADMIN_EMAIL='hello@aindgc.com'

# Run initialiser (idempotent)
bash server-init.sh
```

What it does (~3 min):
- Installs JDK 17 / Node 20 / pnpm / Nginx / MySQL 8 / Certbot
- Configures UFW (ssh/80/443 only)
- Creates `aindgc` database + user
- Creates `aindgc` system user + `/opt/aindgc/{backend,frontend,logs,uploads,backups}`
- Sets up logrotate + daily backup cron + systemd placeholder

Verify:
```bash
java -version       # 17.x
node -v             # 20.x
nginx -v            # 1.24.x
mysql --version     # 8.x
ufw status          # 22/80/443 ALLOW
```

---

## 3 · Prepare environment file

```bash
sudo cp /opt/aindgc-src/deploy/backend.env.example /etc/aindgc/backend.env
sudo chown root:www-data /etc/aindgc/backend.env
sudo chmod 640 /etc/aindgc/backend.env
sudo vi /etc/aindgc/backend.env
```

Required values:
```bash
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080

DB_USER=aindgc
DB_PASS=PickAStrongAppPass!     # matches MYSQL_APP_PASS from step 2

# JWT secret — at least 64 chars random
AINDGC_JWT_SECRET=$(openssl rand -base64 64)

# Admin bootstrap (only used on first boot)
AINDGC_ADMIN_USERNAME=admin
AINDGC_ADMIN_EMAIL=admin@aindgc.com
AINDGC_ADMIN_PASSWORD=TempAdminPass2026!    # change immediately after first login

AINDGC_UPLOAD_DIR=/opt/aindgc/uploads
```

Generate a random JWT secret:
```bash
openssl rand -base64 64 | head -c 96
```

---

## 4 · Upload source & build artefacts

From your **local machine**:
```bash
# Rsync the whole repo to the server
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude 'dist' \
  ./aindgc/ root@<ECS_PUBLIC_IP>:/opt/aindgc-src/
```

Or use git (recommended):
```bash
ssh root@<ECS_PUBLIC_IP>
cd /opt/aindgc
git clone https://github.com/your-org/aindgc.git .
```

---

## 5 · Run `deploy.sh`

On the **server**:
```bash
cd /opt/aindgc/deploy
export DOMAIN=aindgc.com
export ADMIN_DOMAIN=admin.aindgc.com
export API_DOMAIN=api.aindgc.com

bash deploy.sh
```

What it does (~3 min):
1. `pnpm install && pnpm build` → `frontend/dist/`
2. Rsync dist → `/var/www/aindgc/`
3. Build `backend/aindgc-backend.jar` (Maven) if not present
4. Install / restart `aindgc-backend.service`
5. Wait for `/api/health` 200
6. Run `01-schema.sql` against MySQL (ContentDataInitializer seeds on first boot)
7. Write Nginx site config + HTTPS redirect
8. Run `certbot --nginx` for the first time → HTTPS ready
9. Smoke test: `curl -fsI https://aindgc.com`

Verify:
```bash
curl -fs https://aindgc.com/api/health
# {"status":"UP","app":"aindgc-backend","version":"0.1.0","env":"prod","timestamp":...}

curl -fs https://aindgc.com/api/articles | jq '.data.list | length'
# 5  (or whatever count of seed articles)

curl -fsI https://aindgc.com
# HTTP/2 200
# content-type: text/html
```

---

## 6 · DNS configuration

Point your domain to the ECS public IP:

| Type | Host | Value | TTL |
|---|---|---|---|
| A | `aindgc.com` | `<ECS_IP>` | 600 |
| A | `www.aindgc.com` | `<ECS_IP>` | 600 |
| A | `admin.aindgc.com` | `<ECS_IP>` | 600 |
| A | `api.aindgc.com` | `<ECS_IP>` | 600 |

> `api.aindgc.com` is optional — currently the API is served at `aindgc.com/api/*` (same-origin). Use the subdomain if you later split to a different host.

Wait 5-10 min for propagation, then:
```bash
dig aindgc.com A +short    # should return your ECS IP
```

Certbot has already issued the cert. Let's Encrypt supports up to 5 alt names per cert, so the single `certbot` run covers all 4 subdomains.

---

## 7 · Post-deploy hardening

### 7.1 · Change default admin password

```bash
# Backend doesn't expose auth UI in Phase 12; use mysql to rotate:
mysql --user=root --password=$MYSQL_ROOT_PASS aindgc -e "
UPDATE t_user SET password_hash = CONCAT('{bcrypt}', (
  SELECT password_hash FROM t_user WHERE username='admin'
)) WHERE username='admin';
"
# Then log in via /admin (Phase 11) or call /api/auth/login once Phase 14 ships.
```

### 7.2 · Set up HTTPS auto-renewal

Certbot already installs a systemd timer:
```bash
systemctl list-timers | grep certbot
# Should show: certbot.timer
```

Test renewal:
```bash
certbot renew --dry-run
```

### 7.3 · Restrict MySQL to localhost (already done by `server-init.sh`)

```bash
sudo ss -tlnp | grep 3306
# LISTEN 127.0.0.1:3306   ← good, NOT 0.0.0.0
```

### 7.4 · Configure Fail2Ban (ssh)

Already installed by `server-init.sh`. Enable:
```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

### 7.5 · Backup verification

The cron job runs `backup.sh` at 03:30 daily:
```bash
# Manually trigger
sudo bash /opt/aindgc/scripts/backup.sh

# List backups
ls -lh /opt/aindgc/backups/daily/
ls -lh /opt/aindgc/backups/weekly/
```

To restore from a backup:
```bash
gunzip -c /opt/aindgc/backups/daily/aindgc-20260930-030000.sql.gz | \
  mysql --user=aindgc --password=$MYSQL_APP_PASS aindgc
```

### 7.6 · Monitor

Quick health check from your local machine:
```bash
curl -fs https://aindgc.com/api/health
curl -fs https://aindgc.com/sitemap.xml | head -5
```

Service status (on server):
```bash
sudo systemctl status aindgc-backend
sudo journalctl -u aindgc-backend -n 50 --no-pager
sudo tail -n 50 /var/log/aindgc/err.log
sudo tail -n 50 /var/log/nginx/aindgc.error.log
```

---

## 8 · Routine maintenance

### Update code
```bash
# Local
git pull && pnpm build
rsync -avz --delete frontend/dist/ root@<ECS_IP>:/var/www/aindgc/
ssh root@<ECS_IP> 'cd /opt/aindgc/backend && mvn clean package -DskipTests'
ssh root@<ECS_IP> 'cp /opt/aindgc/backend/target/aindgc-backend.jar /opt/aindgc/backend/ && systemctl restart aindgc-backend'
```

Or one-liner via deploy.sh:
```bash
ssh root@<ECS_IP> 'cd /opt/aindgc && bash deploy/deploy.sh'
```

### Rotate admin password
```sql
-- After generating bcrypt hash with:
--   htpasswd -nbBC 12 "" "newPass" | sed 's/^\$2y/\$2a/'
UPDATE t_user SET password_hash = '<bcrypt-hash>' WHERE username = 'admin';
```

### Renew Let's Encrypt manually
```bash
sudo certbot renew --force
sudo systemctl reload nginx
```

### Check disk usage
```bash
df -h /                       # overall
du -sh /opt/aindgc/backups/*  # backups
du -sh /opt/aindgc/uploads/*  # uploads
journalctl --vacuum-time=30d  # old journal logs
```

---

## 9 · Troubleshooting

### Frontend returns 502 Bad Gateway
```bash
sudo systemctl status aindgc-backend
sudo journalctl -u aindgc-backend -n 30 --no-pager
# Common: DB not reachable. Check:
sudo ss -tlnp | grep 3306
mysql --user=aindgc --password=$MYSQL_APP_PASS aindgc -e "SELECT 1;"
```

### Nginx 502 on /api/*
```bash
sudo tail -f /var/log/nginx/aindgc.error.log
# Check backend port:
curl -fs http://127.0.0.1:8080/api/health
# If empty, restart backend:
sudo systemctl restart aindgc-backend
```

### Cert renewal failed
```bash
sudo certbot renew --dry-run
sudo certbot certificates
# Common cause: A record not pointing to this IP
dig +short aindgc.com
```

### Out of disk
```bash
# Find large files:
du -ah /var/log | sort -rh | head
du -ah /opt | sort -rh | head
# Prune old logs:
sudo journalctl --vacuum-time=14d
sudo find /var/log/aindgc -name '*.log.*' -mtime +30 -delete
```

### Backend OOM (MemoryMax exceeded)
- 2C2G = 2 GiB RAM, minus MySQL ≈ 600 MiB, leaves ~1.4 GiB for backend.
- Symptom: `systemctl status` shows `status=1/FAILURE`, journalctl shows `oom-kill`
- Fix: lower memory usage, or upgrade ECS. See systemd unit override in `aindgc-backend.service`.

---

## 10 · Cost summary

| Item | Monthly cost (CNY) |
|---|---|
| ECS 2C2G 40G 5M (Hong Kong burstable) | ~70 |
| Data transfer (5 Mbps peak) | included |
| Public IP (if not free trial) | ~20 |
| Domain (.com, first year ~¥70, renew ~¥80) | ~6 avg |
| Let's Encrypt | free |
| **Total** | **~¥80-150 / month** |

---

## 11 · What you should do *after* Phase 16

| Phase | Why |
|---|---|
| Phase 14 — Auth (JWT login) | Let users save workflows across devices |
| Phase 11 — Admin | Edit content from UI instead of SQL |
| Phase 15 — SEO JSON-LD | Rich snippets in Google |
| Set up Cloudflare in front | Free CDN, DDoS protection, edge cache |

---

## Quick command reference

```bash
# Service
sudo systemctl {start|stop|restart|status} aindgc-backend
sudo journalctl -u aindgc-backend -f

# Logs
sudo tail -f /var/log/aindgc/out.log
sudo tail -f /var/log/aindgc/err.log
sudo tail -f /var/log/nginx/aindgc.{access,error}.log

# Deploy
cd /opt/aindgc && bash deploy/deploy.sh

# Backup
sudo bash /opt/aindgc/scripts/backup.sh

# Database
mysql --user=aindgc --password=$MYSQL_APP_PASS aindgc

# SSL
sudo certbot certificates
sudo certbot renew --dry-run
```
