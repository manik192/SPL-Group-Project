package config

import "os"

type Config struct {
	AppName    string
	Addr       string
	DBDriver   string
	DBDsn      string
	SessionKey []byte
	CSRFKey    []byte
}

func FromEnv() Config {
	return Config{
		AppName:    getenv("APP_NAME", "Indian Spice Hub"),
		Addr:       getenv("ADDR", ":8081"),
		DBDriver:   getenv("DB_DRIVER", "postgres"),
		DBDsn:      getenv("DB_DSN", "postgres://postgres:postgres@localhost:5432/spicehub?sslmode=disable"),
		SessionKey: []byte(getenv("SESSION_KEY", "dev-session-key-change")),
		CSRFKey:    []byte(getenv("CSRF_KEY", "dev-csrf-key-change")),
	}
}

func getenv(k, def string) string { if v := os.Getenv(k); v != "" { return v }; return def }
