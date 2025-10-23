package repo

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
)

type Orders struct{ db *sqlx.DB }

func NewOrders(db *sql.DB) *Orders { return &Orders{db: sqlx.NewDb(db, "postgres")} }

func (r *Orders) Place(userID int64) (int64, int64, error) {
	tx, err := r.db.Beginx()
	if err != nil { return 0, 0, err }
	defer func(){ if err != nil { _ = tx.Rollback() } }()

	var total int64
	if err = tx.QueryRowx(`SELECT COALESCE(SUM(ci.qty * d.price_cents),0)
		FROM cart_items ci JOIN dishes d ON d.id=ci.dish_id WHERE ci.user_id=$1`, userID).Scan(&total); err != nil {
		return 0, 0, err
	}

	var orderID int64
	if err = tx.QueryRowx(`INSERT INTO orders(user_id,status,total_cents) VALUES ($1,'placed',$2) RETURNING id`, userID, total).Scan(&orderID); err != nil {
		return 0, 0, err
	}

	if _, err = tx.Exec(`INSERT INTO order_items(order_id,dish_id,qty,price_cents)
		SELECT $1, dish_id, qty, d.price_cents FROM cart_items ci JOIN dishes d ON d.id=ci.dish_id WHERE ci.user_id=$2`, orderID, userID); err != nil {
		return 0, 0, err
	}

	if _, err = tx.Exec(`DELETE FROM cart_items WHERE user_id=$1`, userID); err != nil {
		return 0, 0, err
	}

	if err = tx.Commit(); err != nil { return 0, 0, err }
	return orderID, total, nil
}
