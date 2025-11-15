package model

// CartCollection struct represents a collection of items in the shopping cart.
type CartCollection struct {
	Name           string  `json:"Name"`
	Image          string  `json:"Image"`
	Price          float64 `json:"Price"`
	Quantity       int     `json:"Quantity"`
	OwnerName      string  `json:"ownerName"`
	RestaurantName string  `json:"restaurantName"`
	UserName       string  `json:"user_name"`
	Email          string  `json:"email"`
	Mob            string  `json:"mob"`
}

