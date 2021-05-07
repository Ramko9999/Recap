package routes

import (
	"recap-server/controller"
	"github.com/gin-gonic/gin"
)


func AddAuthRoutes(engine *gin.Engine){
	authRouter := engine.Group("/auth")
	{
		authRouter.POST("/tokens", controllers.GetTokens)
		authRouter.POST("/refresh", controllers.RefreshAccessToken)
	}
}	



