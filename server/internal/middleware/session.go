package middleware

import (
	"context"
	"net/http"

	"github.com/gorilla/sessions"
)

type Session struct{ store *sessions.CookieStore }

func NewSession(key []byte) *Session {
	st := sessions.NewCookieStore(key)
	st.Options = &sessions.Options{ Path: "/", HttpOnly: true, SameSite: http.SameSiteLaxMode }
	return &Session{store: st}
}

func (s *Session) Store() *sessions.CookieStore { return s.store }

const userKey = "user_id"

func (s *Session) With(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sess, _ := s.store.Get(r, "ish_session")
		var uid int64
		if v, ok := sess.Values["user_id"].(int64); ok { uid = v }
		ctx := context.WithValue(r.Context(), userKey, uid)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
