package repo

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
	"github.com/you/indian-spice-hub/server/internal/models"
)

type Dishes struct{ db *sqlx.DB }

func NewDishes(db *sql.DB) *Dishes { return &Dishes{db: sqlx.NewDb(db, "postgres")} }

func (r *Dishes) ListAvailable() ([]models.Dish, error) {
	var out []models.Dish
	err := r.db.Select(&out, `SELECT * FROM dishes WHERE is_available = true ORDER BY category, name`)
	return out, err
}

func (r *Dishes) ByID(id int64) (*models.Dish, error) {
	var d models.Dish
	err := r.db.Get(&d, `SELECT * FROM dishes WHERE id=$1`, id)
	if err != nil { return nil, err }
	return &d, nil
}
