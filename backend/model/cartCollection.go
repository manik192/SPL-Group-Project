package model

// CartCollection struct represents a collection of items in the shopping cart.
type CartCollection struct {
	Image    string  `json:"Image,omitempty"`    // Image URL of the item
	Name     string  `json:"name,omitempty"`     // Name of the item
	Price    float64 `json:"price,omitempty"`    // Price of the item
	Quantity int     `json:"quantity,omitempty"` // Quantity of the item
}
