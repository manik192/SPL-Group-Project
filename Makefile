run:
	cd server && go run ./cmd/spicehub

migrate:
	psql "$$DB_DSN" -f migrations/0001_init.sql
