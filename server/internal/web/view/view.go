package view

import (
	"html/template"
	"net/http"

	"github.com/gorilla/csrf"
	"github.com/gorilla/sessions"
)

var (
	store     *sessions.CookieStore
	funcMap = template.FuncMap{
		"div100": func(cents int64) float64 { return float64(cents) / 100.0 },
	}
	templates = template.Must(template.New("").Funcs(funcMap).ParseFS(tplFS, "templates/*.tmpl"))
)

func SetSessionStore(s *sessions.CookieStore) { store = s }

func Render(w http.ResponseWriter, r *http.Request, name string, data map[string]any) {
	if data == nil { data = map[string]any{} }
	data["CSRFToken"] = csrf.Token(r)
	data["UserID"] = UserID(r)
	if err := templates.ExecuteTemplate(w, name, data); err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func Session(r *http.Request) *sessions.Session {
	s, _ := store.Get(r, "ish_session")
	return s
}

// read user id from context (set by middleware/session.go using key "user_id")
func UserID(r *http.Request) int64 {
	if v, ok := r.Context().Value("user_id").(int64); ok { return v }
	return 0
}
