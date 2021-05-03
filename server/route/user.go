package routes

import (
	"recap-server/controller"
	"github.com/gin-gonic/gin"
)

func AddUserRoutes(engine *gin.Engine){
	userRouter := engine.Group("/user")
	{
		userRouter.GET("/:id", controllers.GetUser)
		userRouter.POST("/create", controllers.CreateUser)
	}
}