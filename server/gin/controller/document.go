package controllers

import (
	"net/http"
	"recap-server/service"
	"github.com/gin-gonic/gin"
	"fmt"
)

func GetDocuments(context *gin.Context) {
	userId := context.Param("userId")
	documents, err := services.GetDocuments(userId);
	if err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, &gin.H{
			"error": err.Error(),
		})
	}
	context.JSON(http.StatusOK, documents)
}

func CreateDocument(context *gin.Context) {
	var body services.DocumentCreation

	if err := context.ShouldBindJSON(&body); err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}

	document, err := services.CreateDocument(body);
	if err != nil{
		context.AbortWithStatusJSON(http.StatusInternalServerError, &gin.H{
			"error": err.Error(),
		})
	} 

	job := &services.DocumentJob{
		UserId: body.UserId,
		DocumentId: document.ID,
	}

	if err := services.PutDocumentInQueue(job); err != nil {
		gin.DefaultWriter.Write([]byte(fmt.Sprintf("failed to write document job to broker %s", err.Error())))
		services.DeleteDocument(document.ID) // delete document from db to clean up
		context.AbortWithStatusJSON(http.StatusInternalServerError, &gin.H{
			"error": err.Error(),
		})
	} else {
		context.JSON(http.StatusAccepted, document)
	}
}

func DeleteDocument(context *gin.Context) {
	documentId := context.Param("id")
	if err := services.DeleteDocument(documentId); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, &gin.H{
			"error": err.Error(),
		})
	}
	context.Status(http.StatusOK)
}

func PutDocumentInQueue(context *gin.Context) {
	job := &services.DocumentJob{
		DocumentId: context.Query("documentId"),
		UserId: context.Query("userId"),
	}

	if err := services.PutDocumentInQueue(job); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, &gin.H{
			"error" : err.Error(),
		})
	} else {
		context.Status(http.StatusAccepted)
	}
}