package model

// Build struct represents a custom item build.
type Build struct {
	Image    string  `json:"image,omitempty"`    // Image URL of the custom item
	Name     string  `json:"name,omitempty"`     // Name of the custom item
	Price    float64 `json:"price,omitempty"`    // Price of the custom item
	Quantity int     `json:"quantity,omitempty"` // Quantity of the custom item
}
