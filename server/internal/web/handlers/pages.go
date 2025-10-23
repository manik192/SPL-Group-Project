package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/you/indian-spice-hub/server/internal/config"
	"github.com/you/indian-spice-hub/server/internal/repo"
	"github.com/you/indian-spice-hub/server/internal/web/view"
)

func Home(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		view.Render(w, r, "home.tmpl", map[string]any{"Title": cfg.AppName})
	}
}

func MenuList(dishes *repo.Dishes) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		list, err := dishes.ListAvailable()
		if err != nil { http.Error(w, "db", 500); return }
		view.Render(w, r, "menu.tmpl", map[string]any{"Items": list})
	}
}

func ViewCart(cart *repo.Cart) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid := view.UserID(r)
		if uid == 0 { http.Redirect(w, r, "/auth/login", http.StatusFound); return }
		items, _ := cart.Items(uid)
		view.Render(w, r, "cart.tmpl", map[string]any{"Items": items})
	}
}

func AddToCart(cart *repo.Cart) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil { http.Error(w, "bad", 400); return }
		uid := view.UserID(r)
		if uid == 0 { http.Redirect(w, r, "/auth/login", http.StatusFound); return }
		did, _ := strconv.ParseInt(r.FormValue("dish_id"), 10, 64)
		qty, _ := strconv.Atoi(r.FormValue("qty"))
		if qty <= 0 { qty = 1 }
		if err := cart.Add(uid, did, qty); err != nil { http.Error(w, "db", 500); return }
		http.Redirect(w, r, "/cart", http.StatusSeeOther)
	}
}

func UpdateCart(cart *repo.Cart) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil { http.Error(w, "bad", 400); return }
		uid := view.UserID(r)
		itemID, _ := strconv.ParseInt(r.FormValue("item_id"), 10, 64)
		qty, _ := strconv.Atoi(r.FormValue("qty"))
		if err := cart.UpdateQty(uid, itemID, qty); err != nil { http.Error(w, "db", 500); return }
		http.Redirect(w, r, "/cart", http.StatusSeeOther)
	}
}

func RemoveCart(cart *repo.Cart) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil { http.Error(w, "bad", 400); return }
		uid := view.UserID(r)
		itemID, _ := strconv.ParseInt(r.FormValue("item_id"), 10, 64)
		if err := cart.Remove(uid, itemID); err != nil { http.Error(w, "db", 500); return }
		http.Redirect(w, r, "/cart", http.StatusSeeOther)
	}
}

func PlaceOrder(orders *repo.Orders) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid := view.UserID(r)
		if uid == 0 { http.Redirect(w, r, "/auth/login", http.StatusFound); return }
		id, total, err := orders.Place(uid)
		if err != nil { http.Error(w, "db", 500); return }
		http.Redirect(w, r, fmt.Sprintf("/orders?placed=%d&total=%d", id, total), http.StatusSeeOther)
	}
}
