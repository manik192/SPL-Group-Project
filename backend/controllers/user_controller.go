package controllers

import (
	"context"
	"fiber-api/config"
	"fiber-api/model"
	"fmt"
	"net/http"
	"strconv" // <— add this
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Helpers to read either UPPER/lower-case keys and coerce types
func firstString(vals ...interface{}) string {
	for _, v := range vals {
		if s, ok := v.(string); ok && s != "" {
			return s
		}
	}
	return ""
}

func firstFloat64(vals ...interface{}) float64 {
	for _, v := range vals {
		switch t := v.(type) {
		case float64:
			return t
		case float32:
			return float64(t)
		case int:
			return float64(t)
		case int32:
			return float64(t)
		case int64:
			return float64(t)
		case string:
			if f, err := strconv.ParseFloat(t, 64); err == nil {
				return f
			}
		}
	}
	return 0
}

func firstInt(vals ...interface{}) int {
	for _, v := range vals {
		switch t := v.(type) {
		case int:
			return t
		case int32:
			return int(t)
		case int64:
			return int(t)
		case float64:
			return int(t)
		case string:
			if n, err := strconv.Atoi(t); err == nil {
				return n
			}
		}
	}
	return 0
}

// Sample route for testing
func Sample(c *fiber.Ctx) error {
	// Simple route to test server connectivity
	fmt.Println("Inside User route")
	return c.JSON(&fiber.Map{"data": "Hello from Fiber & mongoDB"})
}

// Register a User
// POST /registeruser
func RegisterUser(c *fiber.Ctx) error {
	usersCol := config.GetCollection(config.DB, "users")
	restCol := config.GetCollection(config.DB, "restaurants")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	print(c.Body())
	var in struct {
		Mob        string `json:"mob"`
		Name       string `json:"name"`
		Email      string `json:"email"`
		Password   string `json:"password"`
		Role       string `json:"role"` // "user" | "restaurant"
		Restaurant *struct {
			Name    string           `json:"name"`
			Phone   string           `json:"phone"`
			Address string           `json:"address"`
			Logo    string           `json:"logo"`
			Menu    []model.MenuItem `json:"menu"` // <— array of items
		} `json:"restaurant,omitempty"`
		UserDetails *struct {
			Address    string `json:"address"`
			SpiceLevel string `json:"spiceLevel"`
		}
	}
	if err := c.BodyParser(&in); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}
	if in.Name == "" || in.Password == "" || in.Role == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "name, password, role required"})
	}

	// create user
	_, err := usersCol.InsertOne(ctx, model.User{
		Mob: in.Mob, Name: in.Name, Email: in.Email, Password: in.Password, Role: in.Role,
		Address:    in.UserDetails.Address,
		SpiceLevel: in.UserDetails.SpiceLevel,
	})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "db insert user failed"})
	}

	// if restaurant, store restaurant + menu in restaurants collection
	if in.Role == "restaurant" {
		if in.Restaurant == nil || in.Restaurant.Name == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "restaurant details required"})
		}
		now := time.Now()
		_, err := restCol.InsertOne(ctx, model.Restaurant{
			OwnerName: in.Name,
			Name:      in.Restaurant.Name,
			Phone:     in.Restaurant.Phone,
			Address:   in.Restaurant.Address,
			Logo:      in.Restaurant.Logo,
			Menu:      in.Restaurant.Menu, // <— embed menu here
			CreatedAt: now,
			UpdatedAt: now,
		})
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "db insert restaurant failed"})
		}
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": "registered",
		"role":    in.Role,
		"name":    in.Name,
	})
}

// Get all the users
func GetAllUsers(c *fiber.Ctx) error {
	// Retrieve all users from the database
	fmt.Println("Inside Get all user route")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var userCollection *mongo.Collection = config.GetCollection(config.DB, "users")

	var users []model.User
	defer cancel()

	// Query all users from the database
	results, err := userCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error in fetching data"})
	}

	// Read all user data from the query results
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleUser model.User
		if err = results.Decode(&singleUser); err != nil {
			return c.JSON(&fiber.Map{"data": "error in fetching data"})
		}

		users = append(users, singleUser)
	}

	return c.Status(http.StatusOK).JSON(users)
}

// Fetch  menu
func GetMenu(c *fiber.Ctx) error {
	// Retrieve the  menu from the database
	fmt.Println("Inside Get menu route")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var userCollection *mongo.Collection = config.GetCollection(config.DB, "menu_items")

	var menu []model.Cart
	defer cancel()

	// Query all menu items from the database
	results, err := userCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error in fetching data"})
	}

	// Read all menu items from the query results
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleItem model.Cart
		if err = results.Decode(&singleItem); err != nil {
			return c.JSON(&fiber.Map{"data": "error in decoding fetched document"})
		}

		menu = append(menu, singleItem)
	}

	return c.Status(http.StatusOK).JSON(menu)
}

// Insert or Increment Item in Cart
func InsertCart(c *fiber.Ctx) error {
	fmt.Println("Inside Insert/Update cart route")

	var cartCollection *mongo.Collection = config.GetCollection(config.DB, "cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var item model.CartCollection
	if err := c.BodyParser(&item); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid body parsing"})
	}

	// 1. Find by Name and User (to make cart per user)
	filter := bson.M{
		"name":      item.Name,
		"user_name": item.UserName, // Make sure model.CartCollection has UserName field
	}

	// 2. Increment Quantity, Set other fields
	update := bson.M{
		"$inc": bson.M{"quantity": item.Quantity},
		"$set": bson.M{
			"image":          item.Image,
			"price":          item.Price,
			"ownerName":      item.OwnerName,
			"restaurantName": item.RestaurantName,
			"user_name":      item.UserName,
			"email":          item.Email,
		},
	}

	// 3. Upsert = True (Create if not found)
	opts := options.Update().SetUpsert(true)

	_, err := cartCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Database update failed"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Item added/updated in cart",
		"item":    item.Name,
	})
}

// Retrieve shopping cart items for the currently logged-in user
func RetriveToCart(c *fiber.Ctx) error {
	// Get logged-in user's name from query or headers (frontend should send it)
	userName := c.Query("user_name") // or c.Get("user_name")
	if userName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User name is required"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var cartCollection *mongo.Collection = config.GetCollection(config.DB, "cart")
	var cart []model.CartCollection

	// Query only items for the specific user
	filter := bson.M{"user_name": userName}

	results, err := cartCollection.Find(ctx, filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error fetching data"})
	}
	defer results.Close(ctx)

	for results.Next(ctx) {
		var singleItem model.CartCollection
		if err = results.Decode(&singleItem); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error decoding data"})
		}
		cart = append(cart, singleItem)
	}

	return c.Status(http.StatusOK).JSON(cart)
}

// Login user
func Login(c *fiber.Ctx) error {
	fmt.Println("Inside login user route")
	col := config.GetCollection(config.DB, "users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var in struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&in); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	// Find user by name
	var u model.User
	err := col.FindOne(ctx, bson.M{"name": in.Name}).Decode(&u)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid name or password"})
	}
	if u.Password != in.Password {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid name or password"})
	}

	// Return role for redirect
	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "ok",
		"name":    u.Name,
		"role":    u.Role, // "user" | "restaurant"
	})
}

// Logout user
func LogoutUser(c *fiber.Ctx) error {
	// Clear the shopping cart
	fmt.Println("Inside logout user route")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var CartCollection *mongo.Collection = config.GetCollection(config.DB, "cart")

	defer cancel()

	// Delete all items from the shopping cart
	result, err := CartCollection.DeleteMany(ctx, bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(&fiber.Map{"data": result})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{"data": 1})
}

// Retrive all the ingredients
func GetIngredients(c *fiber.Ctx) error {
	// Retrieve all ingredients from the database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var IngredientsCollection *mongo.Collection = config.GetCollection(config.DB, "ingredientsdata")

	var ingredients []model.Ingredients
	defer cancel()

	// Query all ingredients from the database
	results, err := IngredientsCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error in fetching data"})
	}

	// Read all ingredients from the query results
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleIngredient model.Ingredients
		if err = results.Decode(&singleIngredient); err != nil {
			return c.JSON(&fiber.Map{"data": "error in fetching data"})
		}

		ingredients = append(ingredients, singleIngredient)
	}

	return c.Status(http.StatusOK).JSON(ingredients)
}

// Delete from cart
func DeleteFromCart(c *fiber.Ctx) error {
	// Delete an item from the shopping cart
	fmt.Println("Inside delete from cart route")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var CartCollection *mongo.Collection = config.GetCollection(config.DB, "cart")
	var item model.Cart
	defer cancel()
	if err := c.BodyParser(&item); err != nil {
		return c.JSON(&fiber.Map{"data": "error body parsing"})
	}
	// Delete the specified item from the shopping cart
	result, err := CartCollection.DeleteOne(ctx, bson.M{"name": item.Name})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(&fiber.Map{"data": result})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{"data": 1})
}

// Build api endpoint
// Build api endpoint (POST /build) -> write items directly into cart
func Builditem(c *fiber.Ctx) error {
	fmt.Println("Inside Build route")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cartCol := config.GetCollection(config.DB, "cart")

	// Accept array payload with mixed key casing
	var raw []map[string]interface{}
	if err := c.BodyParser(&raw); err != nil {
		// surface the real error to frontend
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "invalid json array",
			"detail": err.Error(),
		})
	}
	if len(raw) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "empty payload",
		})
	}

	type Doc struct {
		Image    string  `bson:"image"`
		Name     string  `bson:"name"`
		Price    float64 `bson:"price"`
		Quantity int     `bson:"quantity"`
	}
	var docs []interface{}

	for _, m := range raw {
		img := firstString(m["Image"], m["image"])
		name := firstString(m["Name"], m["name"])
		price := firstFloat64(m["Price"], m["price"])
		qty := firstInt(m["Quantity"], m["quantity"])
		if qty == 0 {
			qty = 1
		}
		if name == "" {
			// skip invalid items rather than crashing
			continue
		}
		docs = append(docs, Doc{
			Image:    img,
			Name:     name,
			Price:    price,
			Quantity: qty,
		})
	}

	if len(docs) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "no valid items in payload",
		})
	}

	if _, err := cartCol.InsertMany(ctx, docs); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "failed to save built items",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{"ok": true})
}

// Clear cart
func ClearCart(c *fiber.Ctx) error {
	// Clear all items from the shopping cart
	fmt.Println("Inside clear cart route")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var CartCollection *mongo.Collection = config.GetCollection(config.DB, "cart")
	defer cancel()

	// Delete all items from the cart collection
	result, err := CartCollection.DeleteMany(ctx, bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(&fiber.Map{"data": "Failed to clear cart"})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{"data": "Cart cleared successfully", "deletedCount": result.DeletedCount})
}

// GET /restaurants            -> list all restaurants (summary)
func ListRestaurants(c *fiber.Ctx) error {
	col := config.GetCollection(config.DB, "restaurants")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err := col.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "query failed"})
	}
	defer cur.Close(ctx)

	var out []fiber.Map
	for cur.Next(ctx) {
		var r model.Restaurant
		if err := cur.Decode(&r); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "decode failed"})
		}
		out = append(out, fiber.Map{
			"id":        r.ID,
			"name":      r.Name,
			"logo":      r.Logo,
			"phone":     r.Phone,
			"address":   r.Address,
			"ownerName": r.OwnerName,
		})
	}
	return c.JSON(out)
}

// GET /restaurants/:ownerName -> full restaurant including embedded menu
// GET /restaurants/:id  -> full restaurant doc (including embedded menu)
func GetRestaurantByID(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad id"})
	}

	col := config.GetCollection(config.DB, "restaurants")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var r model.Restaurant // <-- use your model type
	if err := col.FindOne(ctx, bson.M{"_id": oid}).Decode(&r); err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "db error"})
	}

	return c.JSON(r)
}

// AddMenu adds a new item to a specific restaurant's menu
// POST /addmenu
func AddMenu(c *fiber.Ctx) error {
	fmt.Println("Inside Add Menu route")

	// Get the restaurants collection
	restCol := config.GetCollection(config.DB, "restaurants")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Define the expected payload structure
	// matches the React payload: { ownerName: "...", menuItem: { ... } }
	var req struct {
		OwnerName string         `json:"ownerName"`
		MenuItem  model.MenuItem `json:"menuItem"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid body parsing"})
	}

	// Basic validation
	if req.OwnerName == "" || req.MenuItem.Name == "" || req.MenuItem.Price == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Owner Name, Item Name, and Price are required"})
	}

	// Create the update query
	// Find restaurant by OwnerName and push the new MenuItem to the "menu" array
	filter := bson.M{"ownerName": req.OwnerName}
	update := bson.M{"$push": bson.M{"menu": req.MenuItem}}

	result, err := restCol.UpdateOne(ctx, filter, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Database update failed"})
	}

	if result.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Restaurant not found for this user"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Menu item added successfully",
		"item":    req.MenuItem.Name,
	})
}

// EditMenu updates an existing item in the menu
// POST /editmenu
func EditMenu(c *fiber.Ctx) error {
	fmt.Println("Inside Edit Menu route")

	restCol := config.GetCollection(config.DB, "restaurants")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Payload must include the Original Name (to find the item) and the New Data
	var req struct {
		OwnerName    string         `json:"ownerName"`
		OriginalName string         `json:"originalName"` // The name BEFORE editing
		MenuItem     model.MenuItem `json:"menuItem"`     // The NEW updated data
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid body parsing"})
	}

	// 1. Filter: Find restaurant by Owner AND find the specific item by its old name
	filter := bson.M{
		"ownerName": req.OwnerName,
		"menu.name": req.OriginalName,
	}

	// 2. Update: Use the positional operator "$" to update ONLY the matched item
	update := bson.M{
		"$set": bson.M{
			"menu.$": req.MenuItem,
		},
	}

	result, err := restCol.UpdateOne(ctx, filter, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Database update failed"})
	}

	if result.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Item not found (check Owner Name or Original Item Name)"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Menu item updated successfully",
	})

}

func CreateOrder(c *fiber.Ctx) error {
	fmt.Println("Inside CreateOrder route")

	ordersCollection := config.GetCollection(config.DB, "orders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var order model.OrderCollection
	if err := c.BodyParser(&order); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Generate OrderID if not provided
	if order.OrderID == "" {
		order.OrderID = uuid.New().String()
	}

	// Set CreatedAt timestamp
	order.CreatedAt = time.Now()

	// Set default status
	if order.Status == "" {
		order.Status = "Pending"
	}

	// Insert order into MongoDB
	_, err := ordersCollection.InsertOne(ctx, order)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create order"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Order created successfully",
		"order":   order,
	})

}

// GetOrders fetches all orders
func GetOrders(c *fiber.Ctx) error {
	ordersCollection := config.GetCollection(config.DB, "orders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Optional: fetch by owner query param
	ownerName := c.Query("owner") // /orders?owner=ownerName

	filter := bson.M{}
	if ownerName != "" {
		filter["ownerName"] = ownerName
	}

	cursor, err := ordersCollection.Find(ctx, filter)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}
	defer cursor.Close(ctx)

	var orders []model.OrderCollection
	if err := cursor.All(ctx, &orders); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse orders"})
	}

	return c.Status(http.StatusOK).JSON(orders)
}

func GetUser(c *fiber.Ctx) error {
	// Get username from query parameter
	userName := c.Query("name")
	userName = strings.TrimSpace(userName)
	if userName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username is required"})
	}

	// Get users collection
	usersCollection := config.GetCollection(config.DB, "users")

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Prepare case-insensitive filter
	var user model.User
	filter := bson.M{
		"name": bson.M{
			"$regex":   "^" + userName + "$",
			"$options": "i", // case-insensitive
		},
	}

	// Find user
	err := usersCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	// Return user
	return c.JSON(user)
}

func CompleteOrder(c *fiber.Ctx) error {
	type requestBody struct {
		UserName  string `json:"user_name"`
		OwnerName string `json:"ownerName"`
	}

	var body requestBody
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if body.UserName == "" || body.OwnerName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "user_name and ownerName are required"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	ordersCollection := config.GetCollection(config.DB, "orders")

	// Build the filter
	filter := bson.M{
		"username":  body.UserName,
		"ownername": body.OwnerName,
	}

	// Print the filter for debugging
	fmt.Printf("MongoDB delete filter: %+v\n", filter)

	// Delete all orders matching the filter
	res, err := ordersCollection.DeleteMany(ctx, filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to complete order"})
	}

	return c.JSON(fiber.Map{
		"message":       "Order(s) completed successfully",
		"deleted_count": res.DeletedCount,
	})
}
