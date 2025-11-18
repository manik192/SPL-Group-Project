package model

import "time"

// OrderCollection represents a placed order with multiple items
type OrderCollection struct {
	OrderID        string           `json:"order_id"`       // Unique order identifier
	UserName       string           `json:"user_name"`      // User who placed the order
	Email          string           `json:"email"`          // User email
	Mob            string           `json:"mob"`            // User mobile number
	RestaurantName string           `json:"restaurantName"` // Restaurant from which order is placed
	OwnerName      string           `json:"ownerName"`      // Restaurant owner
	Items          []CartCollection `json:"items"`          // Items in the order
	Subtotal       float64          `json:"subtotal"`       // Subtotal amount
	Tax            float64          `json:"tax"`            // Tax amount
	DeliveryFee    float64          `json:"delivery_fee"`   // Delivery fee
	Total          float64          `json:"total"`          // Total amount
	Address        string           `json:"address"`        // Address of the user
	Status         string           `json:"status"`         // e.g., "pending", "completed"
	CreatedAt      time.Time        `json:"created_at"`     // Timestamp of order creation
}
