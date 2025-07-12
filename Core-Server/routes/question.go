package routes

import (
	"core-server/controllers"
	"core-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterQuestionRoutes(r *gin.Engine) {
	q := r.Group("/api/v1/questions")
	q.GET("/", controllers.GetQuestions) // public
	q.Use(middleware.JWTAuth())          // protect below
	q.POST("/", controllers.CreateQuestion)
}


