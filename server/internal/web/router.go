package web

import (
	"database/sql"
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMw "github.com/go-chi/chi/v5/middleware"
	"github.com/gorilla/csrf"

	"github.com/you/indian-spice-hub/server/internal/config"
	"github.com/you/indian-spice-hub/server/internal/middleware"
	"github.com/you/indian-spice-hub/server/internal/repo"
	"github.com/you/indian-spice-hub/server/internal/web/handlers"
	"github.com/you/indian-spice-hub/server/internal/web/view"
)

func Router(db *sql.DB, cfg config.Config) http.Handler {
	r := chi.NewRouter()
	r.Use(chiMw.RequestID, chiMw.RealIP, chiMw.Logger, chiMw.Recoverer)

	sessMw := middleware.NewSession(cfg.SessionKey)
	view.SetSessionStore(sessMw.Store())
	r.Use(sessMw.With)
	r.Use(middleware.CSRF(cfg.CSRFKey))

	users := repo.NewUsers(db)
	dishes := repo.NewDishes(db)
	cart := repo.NewCart(db)
	orders := repo.NewOrders(db)

	r.Handle("/assets/*", http.StripPrefix("/assets/", http.FileServer(http.Dir("internal/web/assets"))))

	r.Get("/", handlers.Home(cfg))
	r.Get("/menu", handlers.MenuList(dishes))
	r.Get("/cart", handlers.ViewCart(cart))
	r.Post("/cart/add", handlers.AddToCart(cart))
	r.Post("/cart/update", handlers.UpdateCart(cart))
	r.Post("/cart/remove", handlers.RemoveCart(cart))
	r.Post("/orders/place", handlers.PlaceOrder(orders))

	r.Get("/auth/login", handlers.LoginPage())
	r.Post("/auth/login", handlers.Login(users))
	r.Get("/auth/signup", handlers.SignupPage())
	r.Post("/auth/signup", handlers.Signup(users))
	r.Post("/auth/logout", handlers.Logout())

	r.Get("/api/menu", handlers.APIListMenu(dishes))

	r.Get("/csrf", func(w http.ResponseWriter, r *http.Request){ _, _ = w.Write([]byte(csrf.Token(r))) })

	return r
}
