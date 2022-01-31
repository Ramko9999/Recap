package routes

import (
	"recap-server/controller"
	"recap-server/middleware"
	"github.com/gin-gonic/gin"
)


func AddDocumentRoutes(engine *gin.Engine) {
	documentRouter := engine.Group("/document")
	documentRouter.Use(middleware.JWT())
	{
		documentRouter.GET("/all/:userId", controllers.GetDocuments)
		documentRouter.POST("/create", controllers.CreateDocument)
		documentRouter.DELETE("/:id", controllers.DeleteDocument)
	}
	documentQueueRouter := engine.Group("/docQueue")
	{
		documentQueueRouter.GET("/", controllers.PutDocumentInQueue)
	}
}