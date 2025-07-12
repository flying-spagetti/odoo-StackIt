package routes

import (
    "core-server/controllers"
    "core-server/middleware"

    "github.com/gin-gonic/gin"
)


func RegisterAnswerRoutes(r *gin.Engine) {
	a := r.Group("/api/v1")
	a.POST("/questions/:id/answers", middleware.JWTAuth(), controllers.PostAnswer)
	a.POST("/answers/:id/vote", middleware.JWTAuth(), controllers.VoteAnswer)
	a.PATCH("/answers/:id/accept", middleware.JWTAuth(), controllers.AcceptAnswer)
}
