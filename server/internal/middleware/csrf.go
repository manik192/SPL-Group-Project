package middleware

import (
	"net/http"
	"github.com/gorilla/csrf"
)

func CSRF(key []byte) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return csrf.Protect(key, csrf.SameSite(csrf.SameSiteLaxMode))(next)
	}
}
