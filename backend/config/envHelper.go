package config

import (
    "log"
    "os"
    "github.com/joho/godotenv"
)

// GetDbURL retrieves the MongoDB connection URL from the environment variables.
func GetDbURL() string {
    // Load environment variables from the .env file.
    err := godotenv.Load()
    if err != nil {
        // If there's an error loading the .env file, log the error and exit.
        log.Fatal("Error loading .env file")
    }
  
    // Retrieve the value of the "URL" environment variable (the MongoDB connection URL).
    return os.Getenv("URL")
}
