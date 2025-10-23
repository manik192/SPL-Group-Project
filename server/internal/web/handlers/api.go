package handlers

import (
	"encoding/json"
	"net/http"
	"github.com/you/indian-spice-hub/server/internal/repo"
)

type jsonResp map[string]any

func APIListMenu(dishes *repo.Dishes) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		items, err := dishes.ListAvailable()
		if err != nil { http.Error(w, "db", 500); return }
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(jsonResp{"items": items})
	}
}
