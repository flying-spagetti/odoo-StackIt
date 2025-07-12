package controllers

import (
	"context"
	"net/http"
	"time"

	"Core-Server/config"
	"Core-Server/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateQuestion(c *gin.Context) {
	var input struct {
		Title       string   `json:"title" binding:"required"`
		Description string   `json:"description" binding:"required"`
		Tags        []string `json:"tags" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIdValue, exists := c.Get("userId") // set by JWT middleware
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	authorID, _ := primitive.ObjectIDFromHex(userIdValue.(string))

	question := models.Question{
		Title:       input.Title,
		Description: input.Description,
		Tags:        input.Tags,
		AuthorID:    authorID,
		CreatedAt:   time.Now(),
	}

	collection := config.DB.Collection("questions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, question)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert question"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Question created", "id": result.InsertedID})
}
