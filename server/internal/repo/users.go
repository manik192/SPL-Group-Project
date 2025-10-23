package repo

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
	"github.com/you/indian-spice-hub/server/internal/models"
)

type Users struct{ db *sqlx.DB }

func NewUsers(db *sql.DB) *Users { return &Users{db: sqlx.NewDb(db, "postgres")} }

func (r *Users) Create(email, hash string) (int64, error) {
	var id int64
	err := r.db.QueryRowx(`INSERT INTO users(email, password_hash) VALUES ($1,$2) RETURNING id`, email, hash).Scan(&id)
	return id, err
}

func (r *Users) ByEmail(email string) (*models.User, error) {
	var u models.User
	err := r.db.Get(&u, `SELECT * FROM users WHERE email=$1`, email)
	if err != nil { return nil, err }
	return &u, nil
}
