package main

import (
	"context"
	"log"
	"net/http"

	"menuplanner/internal/database"
	"menuplanner/internal/handlers"
	"menuplanner/internal/repository"

	"github.com/gin-gonic/gin"
)

func main() {
	ctx := context.Background()

	// Initialize database connection
	pool, err := database.NewPool(ctx)
	if err != nil {
		log.Fatalf("failed to initialize database: %v", err)
	}
	defer pool.Close()

	// Initialize repository and handler
	repo := repository.NewPostgresHouseholdRepository(pool)
	householdHandler := handlers.NewHouseholdHandler(repo)

	// Set up router
	r := gin.Default()

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Family sharing routes
	r.POST("/households", householdHandler.CreateHousehold)
	r.POST("/households/:id/invite", householdHandler.InviteToHousehold)
	r.POST("/households/join", householdHandler.JoinHousehold)

	// Start server
	log.Println("Server starting on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
