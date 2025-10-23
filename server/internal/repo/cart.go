package repo

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
	"github.com/you/indian-spice-hub/server/internal/models"
)

type Cart struct{ db *sqlx.DB }

func NewCart(db *sql.DB) *Cart { return &Cart{db: sqlx.NewDb(db, "postgres")} }

func (r *Cart) Items(userID int64) ([]models.CartItem, error) {
	var out []models.CartItem
	err := r.db.Select(&out, `SELECT id, user_id, dish_id, qty FROM cart_items WHERE user_id=$1`, userID)
	return out, err
}

func (r *Cart) Add(userID, dishID int64, qty int) error {
	_, err := r.db.Exec(`INSERT INTO cart_items(user_id,dish_id,qty) VALUES($1,$2,$3)
		ON CONFLICT (user_id,dish_id) DO UPDATE SET qty = cart_items.qty + EXCLUDED.qty`, userID, dishID, qty)
	return err
}

func (r *Cart) UpdateQty(userID, itemID int64, qty int) error {
	_, err := r.db.Exec(`UPDATE cart_items SET qty=$1 WHERE id=$2 AND user_id=$3`, qty, itemID, userID)
	return err
}

func (r *Cart) Remove(userID, itemID int64) error {
	_, err := r.db.Exec(`DELETE FROM cart_items WHERE id=$1 AND user_id=$2`, itemID, userID)
	return err
}

func (r *Cart) Clear(userID int64) error {
	_, err := r.db.Exec(`DELETE FROM cart_items WHERE user_id=$1`, userID)
	return err
}
