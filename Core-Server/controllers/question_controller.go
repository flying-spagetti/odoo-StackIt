package controllers

import (
    "context"
    "net/http"
    "time"
    "strconv"

    "core-server/config"
    "core-server/models"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo/options"
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

func int64Ptr(i int64) *int64 {
    return &i
}

func GetQuestions(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	tag := c.Query("tag")
	search := c.Query("search")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)
	skip := (page - 1) * limit

	filter := bson.M{}
	if tag != "" {
		filter["tags"] = tag
	}
	if search != "" {
		filter["title"] = bson.M{"$regex": search, "$options": "i"}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err := config.DB.Collection("questions").Find(ctx, filter, &options.FindOptions{
		Limit: int64Ptr(int64(limit)),
		Skip:  int64Ptr(int64(skip)),
		Sort:  bson.D{{"createdAt", -1}},
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Error fetching questions"})
		return
	}
	defer cur.Close(ctx)

	var questions []models.Question
	if err := cur.All(ctx, &questions); err != nil {
		c.JSON(500, gin.H{"error": "Error parsing questions"})
		return
	}

	c.JSON(200, questions)
}
