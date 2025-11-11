package model

// Cart struct represents an item in the shopping cart.
type Cart struct {
	Image       string   `json:"Image,omitempty"`       // Image URL of the item
	Name        string   `json:"name,omitempty"`        // Name of the item
	Price       float64  `json:"price,omitempty"`       // Price of the item
	Ingredients []string `json:"ingredients,omitempty"` // Ingredients of the item
	Topping     []string `json:"topping,omitempty"`     // Toppings of the item
	Description string   `json:"description,omitempty"` // Description of the item
	Type        string   `json:"type,omitempty"`        // Type of the item
}
