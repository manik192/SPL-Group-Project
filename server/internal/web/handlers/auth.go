package handlers

import (
	"net/http"

	"github.com/you/indian-spice-hub/server/internal/repo"
	"github.com/you/indian-spice-hub/server/internal/services"
	"github.com/you/indian-spice-hub/server/internal/web/view"
)

func LoginPage() http.HandlerFunc { return func(w http.ResponseWriter, r *http.Request){ view.Render(w, r, "login.tmpl", nil) } }
func SignupPage() http.HandlerFunc { return func(w http.ResponseWriter, r *http.Request){ view.Render(w, r, "signup.tmpl", nil) } }

func Login(users *repo.Users) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_ = r.ParseForm()
		email := r.FormValue("email")
		pw := r.FormValue("password")
		a := &services.Auth{Users: users}
		uid, err := a.Login(email, pw)
		if err != nil { view.Render(w, r, "login.tmpl", map[string]any{"Error":"Invalid credentials"}); return }
		sess := view.Session(r)
		sess.Values["user_id"] = uid
		_ = sess.Save(r, w)
		http.Redirect(w, r, "/menu", http.StatusSeeOther)
	}
}

func Signup(users *repo.Users) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_ = r.ParseForm()
		email := r.FormValue("email")
		pw := r.FormValue("password")
		a := &services.Auth{Users: users}
		_, err := a.SignUp(email, pw)
		if err != nil { view.Render(w, r, "signup.tmpl", map[string]any{"Error":"Email may be taken"}); return }
		http.Redirect(w, r, "/auth/login", http.StatusSeeOther)
	}
}

func Logout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sess := view.Session(r)
		delete(sess.Values, "user_id")
		_ = sess.Save(r, w)
		http.Redirect(w, r, "/", http.StatusSeeOther)
	}
}
