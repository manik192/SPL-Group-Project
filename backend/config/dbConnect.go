package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Function to establish a connection to the database.
func Connect_to_Db() *mongo.Client {
	// Create a new MongoDB client with connection options.
	client, connection_err := mongo.NewClient(options.Client().ApplyURI(GetDbURL()))
	if connection_err != nil {
		log.Fatal(connection_err)
	}

	// Set a context with a timeout for the connection operation.
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	// Connect to the MongoDB server.
	connection_err = client.Connect(ctx)
	if connection_err != nil {
		log.Fatal(connection_err)
	}

	// Ping the MongoDB server to ensure connectivity.
	connection_err = client.Ping(ctx, nil)
	if connection_err != nil {
		log.Fatal(connection_err)
	}

	// Connection successful, print confirmation message.
	fmt.Println("Connected to MongoDB")
	return client
}

// Client instance to be used throughout the application.
var DB *mongo.Client = Connect_to_Db()

// Function to retrieve a specific collection from the database.
func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	// Get the specified collection from the "" database.
	collection := client.Database("indian_spice_hub").Collection(collectionName)
	return collection
}
