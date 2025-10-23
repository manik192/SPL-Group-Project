package models

import "time"

type User struct {
	ID           int64     `db:"id"`
	Email        string    `db:"email"`
	PasswordHash string    `db:"password_hash"`
	CreatedAt    time.Time `db:"created_at"`
}

type Dish struct {
	ID          int64   `db:"id"`
	Name        string  `db:"name"`
	Description string  `db:"description"`
	PriceCents  int64   `db:"price_cents"`
	ImageURL    *string `db:"image_url"`
	Category    string  `db:"category"`
	IsAvailable bool    `db:"is_available"`
}

type CartItem struct {
	ID     int64 `db:"id"`
	UserID int64 `db:"user_id"`
	DishID int64 `db:"dish_id"`
	Qty    int   `db:"qty"`
}

type Order struct {
	ID         int64     `db:"id"`
	UserID     int64     `db:"user_id"`
	Status     string    `db:"status"`
	TotalCents int64     `db:"total_cents"`
	CreatedAt  time.Time `db:"created_at"`
}

type OrderItem struct {
	ID         int64 `db:"id"`
	OrderID    int64 `db:"order_id"`
	DishID     int64 `db:"dish_id"`
	Qty        int   `db:"qty"`
	PriceCents int64 `db:"price_cents"`
}
