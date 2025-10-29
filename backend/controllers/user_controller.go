package controllers

import (
	"context"
	"fiber-api/config"
	"fiber-api/model"
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Sample route for testing
func Sample(c *fiber.Ctx) error {
	// Simple route to test server connectivity
	fmt.Println("Inside User route")
	return c.JSON(&fiber.Map{"data": "Hello from Fiber & mongoDB"})
}

// Register a User
func RegisterUser(c *fiber.Ctx) error {
	// Register a new user
	fmt.Println("Inside User route")
	// Get the MongoDB collection for users
	var userCollection *mongo.Collection = config.GetCollection(config.DB, "users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user model.User
	defer cancel()
	if err := c.BodyParser(&user); err != nil {
		return c.JSON(&fiber.Map{"data": "error body parsing"})
	}
	// Create a new user based on request data
	newUser := model.User{
		Mob:      user.Mob,
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
	}
	// Insert the new user into the database
	result, err := userCollection.InsertOne(ctx, newUser)
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error"})
	}

	return c.JSON(&fiber.Map{"data": result})
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

// Insert into cart
func InsertCart(c *fiber.Ctx) error {
	// Insert a new item into the cart
	fmt.Println("Inside Insert into cart route")
	var userCollection *mongo.Collection = config.GetCollection(config.DB, "cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var item model.CartCollection
	defer cancel()
	if err := c.BodyParser(&item); err != nil {
		return c.JSON(&fiber.Map{"data": "error body parsing"})
	}
	// Create a new cart item based on request data
	newitem := model.CartCollection{
		Image:    item.Image,
		Name:     item.Name,
		Price:    item.Price,
		Quantity: item.Quantity,
	}
	// Insert the new cart item into the database
	result, err := userCollection.InsertOne(ctx, newitem)
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error in insertion to db"})
	}

	return c.JSON(result)
}

// Shopping cart button to right
func RetriveToCart(c *fiber.Ctx) error {
	// Retrieve items from the shopping cart
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var CartCollection *mongo.Collection = config.GetCollection(config.DB, "cart")

	var cart []model.CartCollection
	defer cancel()

	// Query all items from the shopping cart
	results, err := CartCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error in fetching data"})
	}

	// Read all items from the query results
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleItem model.CartCollection
		if err = results.Decode(&singleItem); err != nil {
			return c.JSON(&fiber.Map{"data": "error in fetching data"})
		}

		cart = append(cart, singleItem)
	}

	return c.Status(http.StatusOK).JSON(cart)
}

// Login user
func Login(c *fiber.Ctx) error {
	// Authenticate user login
	fmt.Println("Inside login user route")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var userCollection *mongo.Collection = config.GetCollection(config.DB, "users")

	var users []model.User
	defer cancel()

	// Query all users from the database
	results, err := userCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.JSON(&fiber.Map{"data": "error in fetching data"})
	}

	// Read all users from the query results
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleUser model.User
		if err = results.Decode(&singleUser); err != nil {
			return c.JSON(&fiber.Map{"data": "error in fetching data"})
		}

		users = append(users, singleUser)
	}
	var loginuserdata model.User
	defer cancel()
	if err := c.BodyParser(&loginuserdata); err != nil {
		return c.JSON(&fiber.Map{"data": "error body parsing"})
	}
	// Authenticate users here
	for i := 0; i < len(users); i++ {
		if users[i].Name == loginuserdata.Name && users[i].Password == loginuserdata.Password {
			return c.Status(http.StatusOK).JSON(&fiber.Map{"data": 1})
		}
	}

	return c.Status(http.StatusBadRequest).JSON(&fiber.Map{"data": 0})
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
func Builditem(c *fiber.Ctx) error {
	// Build custom items
	fmt.Println("Inside Build route")
	var BuildCollection *mongo.Collection = config.GetCollection(config.DB, "cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Parse the request body as an array of items
	var items []model.Build
	if err := c.BodyParser(&items); err != nil {
		return c.JSON(&fiber.Map{"data": "error body parsing"})
	}

	// Insert each item into the database
	var results []interface{}
	for _, item := range items {
		newitem := model.Build{
			Image:    item.Image,
			Name:     item.Name,
			Price:    item.Price,
			Quantity: item.Quantity,
		}
		result, err := BuildCollection.InsertOne(ctx, newitem)
		if err != nil {
			return c.JSON(&fiber.Map{"data": "error in insertion to db"})
		}
		results = append(results, result)
	}

	return c.JSON(&fiber.Map{"data": results})
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
