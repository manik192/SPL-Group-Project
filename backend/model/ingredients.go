package model

// Ingredients struct represents an ingredient used in a recipe.
type Ingredients struct {
	Image string  `json:"Image,omitempty"` // Image URL of the ingredient
	Tname string  `json:"tname,omitempty"` // Name of the ingredient
	Price float64 `json:"price,omitempty"` // Price of the ingredient
}
