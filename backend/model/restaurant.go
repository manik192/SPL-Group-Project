package model

import "time"

type MenuItem struct {
    Name        string   `json:"name"        bson:"name"`
    Price       float64  `json:"price"       bson:"price"`
    Description string   `json:"description" bson:"description,omitempty"`
    Image       string   `json:"image"       bson:"image,omitempty"`
    Type        string   `json:"type"        bson:"type,omitempty"` // "veg" | "non-veg"
    Ingredients []string `json:"ingredients" bson:"ingredients,omitempty"`
}

type Restaurant struct {
    ID        string     `json:"id"         bson:"_id,omitempty"`
    OwnerName string     `json:"ownerName"  bson:"ownerName"` // ties to User.Name (your login key)
    Name      string     `json:"name"       bson:"name"`
    Phone     string     `json:"phone"      bson:"phone"`
    Address   string     `json:"address"    bson:"address"`
    Logo      string     `json:"logo"       bson:"logo,omitempty"`
    Menu      []MenuItem `json:"menu"       bson:"menu"`      // <— embed menu here
    CreatedAt time.Time  `json:"createdAt"  bson:"createdAt"`
    UpdatedAt time.Time  `json:"updatedAt"  bson:"updatedAt"`
}
