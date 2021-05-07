package routes

import (
	"recap-server/controller"
	"recap-server/middleware"
	"github.com/gin-gonic/gin"
)

func AddUserRoutes(engine *gin.Engine){
	userRouter := engine.Group("/user")
	userRouter.Use(middleware.VerifyAccess())
	{
		userRouter.GET("/:id", controllers.GetUser)
		userRouter.POST("/create", controllers.CreateUser)
	}
}