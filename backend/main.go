package main

import (
	"fiber-api/config" // Corrected import path
	"fiber-api/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {

	// intialize the app
	app := fiber.New()

	// Cross browser compatibility with specific CORS configuration
	app.Use(cors.New(cors.Config{}))

	// Connect to a database
	config.Connect_to_Db()

	// Using the routes
	routes.UserRoute(app)

	// Listening on port number
	log.Fatal(app.Listen(":8080"))

}
