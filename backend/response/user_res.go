package response

import "github.com/gofiber/fiber/v2"

// UserResponse struct represents a response format for user-related operations.
type UserResponse struct {
    Status  int        `json:"status"`    // Status code of the response
    Message string     `json:"message"`   // Message describing the response
    Data    *fiber.Map `json:"data"`      // Data associated with the response
}
