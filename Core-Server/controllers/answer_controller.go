package controllers

import (
    "context"
    "time"

    "core-server/config"
    "core-server/models"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
)
func PostAnswer(c *gin.Context) {
	questionID := c.Param("id")
	qID, err := primitive.ObjectIDFromHex(questionID)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid question ID"})
		return
	}

	var input struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userId, _ := c.Get("userId")
	authorID, _ := primitive.ObjectIDFromHex(userId.(string))

	answer := models.Answer{
		QuestionID: qID,
		Content:    input.Content,
		AuthorID:   authorID,
		CreatedAt:  time.Now(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err = config.DB.Collection("answers").InsertOne(ctx, answer)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to post answer"})
		return
	}

	c.JSON(201, gin.H{"message": "Answer posted"})
}

func VoteAnswer(c *gin.Context) {
	answerID := c.Param("id")
	aID, err := primitive.ObjectIDFromHex(answerID)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid answer ID"})
		return
	}

	var input struct {
		Vote string `json:"vote" binding:"required"` // "up" or "down"
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var update bson.M
	if input.Vote == "up" {
		update = bson.M{"$inc": bson.M{"upvotes": 1}}
	} else {
		update = bson.M{"$inc": bson.M{"downvotes": 1}}
	}

	_, err = config.DB.Collection("answers").UpdateByID(c, aID, update)
	if err != nil {
		c.JSON(500, gin.H{"error": "Vote failed"})
		return
	}

	c.JSON(200, gin.H{"message": "Vote recorded"})
}
func AcceptAnswer(c *gin.Context) {
	answerID := c.Param("id")
	aID, _ := primitive.ObjectIDFromHex(answerID)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Find answer → get question ID
	var answer models.Answer
	err := config.DB.Collection("answers").FindOne(ctx, bson.M{"_id": aID}).Decode(&answer)
	if err != nil {
		c.JSON(404, gin.H{"error": "Answer not found"})
		return
	}

	// Only question owner can accept
	var question models.Question
	_ = config.DB.Collection("questions").FindOne(ctx, bson.M{"_id": answer.QuestionID}).Decode(&question)
	userId, _ := c.Get("userId")
	if question.AuthorID.Hex() != userId {
		c.JSON(403, gin.H{"error": "Only question owner can accept answers"})
		return
	}

	// Mark answer as accepted
	_, err = config.DB.Collection("answers").UpdateOne(ctx, bson.M{"_id": aID}, bson.M{"$set": bson.M{"isAccepted": true}})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to accept answer"})
		return
	}

	c.JSON(200, gin.H{"message": "Answer accepted"})
}
