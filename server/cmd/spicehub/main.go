package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"github.com/you/indian-spice-hub/server/internal/config"
	"github.com/you/indian-spice-hub/server/internal/db"
	"github.com/you/indian-spice-hub/server/internal/web"
)

func main() {
	_ = godotenv.Load()
	cfg := config.FromEnv()

	conn, err := db.Open(cfg.DBDriver, cfg.DBDsn)
	if err != nil { log.Fatalf("db: %v", err) }
	defer conn.Close()

	r := web.Router(conn, cfg)
	log.Printf("listening on %s", cfg.Addr)
	log.Fatal(http.ListenAndServe(cfg.Addr, r))
}
