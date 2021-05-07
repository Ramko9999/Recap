package controllers

import (
	"net/http"
	"recap-server/service"
	"github.com/gin-gonic/gin"
)

func GetUser(context *gin.Context){
    userId := context.Param("id")
	user := services.GetUser(userId)
	if user == nil {
		context.Status(http.StatusNotFound)
		return
	}
	context.JSON(http.StatusOK, user)
}

func CreateUser(context *gin.Context){
	var body services.User
	if err := context.ShouldBindJSON(&body); err != nil {
		context.Status(http.StatusBadRequest)
		return
	}
	
	user, err := services.CreateUser(body.ID, body.Email, body.Username)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	context.JSON(http.StatusCreated, user)
}

