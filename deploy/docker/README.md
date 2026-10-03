# Aindgc — Docker 部署

单机 Docker 部署：**nginx(前端) + Spring Boot(后端, H2 库)**，共 2 个容器，无数据库容器。

## 为什么用 H2 而不是 MySQL

目标服务器约 1.6 GB 内存。一个 MySQL 容器空载就要 400–500 MB 常驻，而这个库的总数据量只有几 MB。H2 跑在后端 JVM 进程内，整个栈约 700 MB。

这不是拍脑袋的选择——H2 版本已在本地跑通与 MySQL 版本**完全相同的 48 项冒烟测试**（公开内容/中文编码/案例契约/登录/Admin/6 个生成器/SEO/点赞），并验证了重启幂等（数据不丢、种子不重复）。

MySQL 版仍然保留（`01-schema.sql` 是唯一真源，`--spring.profiles.active=dev` 走 MySQL），H2 的 DDL 由脚本生成：

```bash
node deploy/docker/tools/mysql2h2.mjs \
  backend/src/main/resources/sql/01-schema.sql \
  backend/src/main/resources/sql/01-schema-h2.sql \
  backend/src/main/resources/sql/02-seed.sql \
  backend/src/main/resources/sql/02-seed-h2.sql
```

**改了 MySQL schema 后必须重新生成 H2 版本**，否则两边会漂移。

## 架构

```
浏览器 ──▶ web:80 (nginx) ──/api──▶ backend:8080 (Spring Boot)
                                        │
                                        └── H2 文件库  volume: aindgc-data:/data
```

## 部署步骤

### 1. 本地构建产物（不要在服务器上构建）

服务器内存不够跑 Maven + Node 构建，构建会 OOM。

```bash
cd backend && mvn clean package -DskipTests && cd ..
cd frontend && pnpm install && pnpm build && cd ..
```

产物：`backend/target/aindgc-backend.jar`（约 40 MB）、`frontend/dist/`（约 3 MB）

### 2. 上传

```bash
# 在你的电脑上
cd D:/project/MVPdemo/aindgc
ssh root@47.98.253.138 'mkdir -p /opt/aindgc/deploy/docker'
scp backend/target/aindgc-backend.jar root@47.98.253.138:/opt/aindgc/backend/target/aindgc-backend.jar
scp -r frontend/dist root@47.98.253.138:/opt/aindgc/frontend/dist
scp deploy/docker/{docker-compose.yml,backend.Dockerfile,frontend.Dockerfile,nginx.conf,purge-old.sh,.env.example} root@47.98.253.138:/opt/aindgc/deploy/docker/
```

Dockerfile 的 build context 是仓库根（`context: ../..`），所以 `/opt/aindgc` 下必须保持 `backend/` 和 `frontend/` 的目录结构。

### 3. 清理旧项目

```bash
cd /opt/aindgc/deploy/docker
chmod +x purge-old.sh
./purge-old.sh          # dry run，先看清单
./purge-old.sh --yes    # 确认后执行
```

见下方「清理说明」。

### 4. 配置

```bash
cd /opt/aindgc/deploy/docker
cp .env.example .env
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$(openssl rand -base64 48)|" .env
sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$(openssl rand -base64 24)|" .env
cat .env    # 确认没有 CHANGE_ME 残留
```

### 5. 启动

```bash
# 国内服务器先配镜像加速，否则拉镜像会超时
cat > /etc/docker/daemon.json <<'EOF'
{ "registry-mirrors": ["https://<你的阿里云专属加速地址>"] }
EOF
systemctl restart docker

cd /opt/aindgc/deploy/docker
docker compose build
docker compose up -d
docker compose ps
```

### 6. 验证

```bash
docker compose logs -f backend      # 看到 "Started AindgcApplication" 和 [Seed] 日志
curl -s localhost/api/health        # {"status":"UP","app":"aindgc-backend",...}
curl -s localhost/api/cases | head -c 200
curl -sI localhost/                 # 200
```

## 清理说明

`purge-old.sh` 删除以下内容，**volume 删除不可恢复**：

| 类型 | 内容 |
|---|---|
| 容器 | 名字匹配 `aitools\|aiwork` 的 |
| 镜像 | 同上 |
| 网络 | 同上（排除 bridge/host/none） |
| **数据卷** | 名字匹配的（**H2/H2 文件数据库在这里**） |
| 主机路径 | `/opt/aitools`、`/opt/aiwork`、旧 nginx conf |

脚本默认 dry-run，只有加 `--yes` 才真正执行。

## 日常运维

```bash
cd /opt/aindgc/deploy/docker

docker compose ps                      # 状态
docker compose logs -f backend         # 后端日志
docker compose restart backend         # 重启后端
docker compose up -d --build           # 重新构建部署

# ⚠ 绝对不要用 down -v，它会删掉 aindgc-data 卷（H2 库）
docker compose down                    # 停止
docker compose down --remove-orphans   # 停止并清理游离容器
```

## 备份

H2 是单文件数据库，备份就是复制文件（需停机或用 H2 的 `SCRIPT` 命令在线导出）：

```bash
# 在线导出为 SQL（不停机）
docker compose exec backend sh -c "java -cp /app/app.jar org.h2.tools.Script \
  -url 'jdbc:h2:file:/data/aindgc' -user sa -script /data/backup.sql"
docker compose cp backend:/data/backup.sql ./backup-$(date +%F).sql
```

## 排错

| 症状 | 原因 |
|---|---|
| `aindgc-web` 一直 `starting` | 后端健康检查没过，看 `docker compose logs backend` |
| 502 | 后端进程挂了；小内存机器重点查 OOM：`dmesg -T \| grep -i "killed process"` |
| 站点 404 但容器在跑 | nginx `default_server` 被别的配置抢了：`nginx -T \| grep default_server` |
| 数据没了 | 用了 `docker compose down -v` 或 `docker volume rm` |
| 中文乱码 | 确认 `application-h2.yml` 的 `spring.sql.init.encoding: UTF-8` |
| JWT 启动即失败 | `JWT_SECRET` 少于 32 字符 |
