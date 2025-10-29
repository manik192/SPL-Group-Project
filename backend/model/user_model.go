package model

// User struct represents a user entity.
type User struct {
	Mob      string `json:"Mob,omitempty"`      // Mobile number of the user
	Name     string `json:"Name,omitempty" `    // Name of the user
	Email    string `json:"Email,omitempty" `   // Email address of the user
	Password string `json:"Password,omitempty"` // Password of the user
}
