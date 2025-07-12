package main


import (
	"context"                     // ✅ Needed for MongoDB ping
	"log"
	"net/http"
	"os"
	"time"                        // ✅ Needed for context timeout
	"core-server/config"
	"core-server/routes"      // ✅ Fix this import path if needed
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)


func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	config.ConnectDB()

	r := gin.Default()


	
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	r.Use(func(ctx *gin.Context) {
		c.HandlerFunc(ctx.Writer, ctx.Request)
		ctx.Next()
	})
	routes.RegisterQuestionRoutes(r)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/test", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "API is working",
				"data":    "Hello from Go backend!",
			})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	// Connect to MongoDB
	r.GET("/db-status", func(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err := config.DB.Client().Ping(ctx, nil)
	if err != nil {
		c.JSON(500, gin.H{"status": "error", "message": "MongoDB not reachable"})
		return
	}
	c.JSON(200, gin.H{"status": "ok", "message": "MongoDB connected"})
})


	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
