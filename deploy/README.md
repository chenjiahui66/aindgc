# Aindgc · Deploy

Production deployment on **Aliyun ECS 2C2G · Ubuntu 24.04**.

## 📖 Complete guide

👉 **[DEPLOY.md](./DEPLOY.md)** — full step-by-step production deployment.

## Files in this folder

| File | Purpose | Where it runs |
|---|---|---|
| **DEPLOY.md** | Complete deployment handbook | (read it!) |
| `server-init.sh` | One-shot VPS initialiser (JDK, Node, Nginx, MySQL, Certbot, UFW) | Run on **fresh VPS** as root |
| `deploy.sh` | One-shot deployer (build, upload, restart, HTTPS) | Run on **server** as root |
| `backup.sh` | Daily MySQL backup (cron @ 03:30) | Run on **server** daily |
| `aindgc-backend.service` | systemd unit for Spring Boot | Installed by `deploy.sh` |
| `backend.env.example` | Backend env template (DB creds, JWT secret, etc.) | Copy to `/etc/aindgc/backend.env` |
| `nginx.prod.conf.template` | Reference nginx config (used by `deploy.sh` to generate live config) | Reference only |
| `nginx.dev.conf` | Local-dev nginx (port 80 → Vite :5173 + Spring :8080) | Local dev only |

## Two-step deployment in 30 seconds

```bash
# 1. On a fresh Ubuntu 24.04 VPS:
ssh root@<ECS_IP>
git clone https://github.com/your-org/aindgc.git /opt/aindgc
cd /opt/aindgc/deploy
MYSQL_ROOT_PASS='...' MYSQL_APP_PASS='...' bash server-init.sh

# 2. Upload source + env, then deploy:
# (from local)
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude 'dist' \
  ./aindgc/ root@<ECS_IP>:/opt/aindgc/
ssh root@<ECS_IP> 'cp /opt/aindgc/deploy/backend.env.example /etc/aindgc/backend.env && vi /etc/aindgc/backend.env'

# (on server)
cd /opt/aindgc && bash deploy/deploy.sh
```

Done. <https://aindgc.com> is live.

## Cost

| Item | Monthly (CNY) |
|---|---|
| ECS 2C2G 40G 5M (HK burstable) | ~70 |
| Domain (.com, amortized) | ~6 |
| **Total** | **~¥80-150 / month** |

See [DEPLOY.md §10](./DEPLOY.md#10--cost-summary) for details.
