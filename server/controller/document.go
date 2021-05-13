package controllers

import (
	"net/http"
	"recap-server/service"
	"github.com/gin-gonic/gin"
)


func GetDocuments(context *gin.Context) {
	userId := context.Param("userId")
	documents, err := services.GetDocuments(userId);
	if err != nil {
		context.AbortWithStatus(http.StatusNotFound)
	}
	context.JSON(http.StatusOK, documents)
}

func CreateDocument(context *gin.Context) {
	var body services.DocumentCreation

	if err := context.ShouldBindJSON(&body); err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}

	if document, err := services.CreateDocument(body); err != nil{
		context.AbortWithStatusJSON(http.StatusInternalServerError, &gin.H{
			"error": err.Error(),
		})
	} else {
		context.JSON(http.StatusCreated, document)
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