# Indian Spice Hub — Mostly-Go Project Skeleton (≥70% Go)

Server-rendered Go app using chi, gorilla/sessions, gorilla/csrf, and sqlx.
Postgres by default (docker-compose included).

## Quick Start
```
cp .env.example .env
docker compose up -d db
psql "$DB_DSN" -f migrations/0001_init.sql
cd server && go run ./cmd/spicehub
# http://localhost:8081
```
