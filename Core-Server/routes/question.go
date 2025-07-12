package routes

import (
	"core-server/controllers"
	"core-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterQuestionRoutes(r *gin.Engine) {
	q := r.Group("/api/v1/questions")
	q.Use(middleware.JWTAuth()) // protect all question routes
	{
		q.POST("/", controllers.CreateQuestion)
		q.GET("/", controllers.GetQuestions)
	}
}


