package controllers

import (
	"fmt"
	"log"
	"net/http"
	"recap-server/service"
	"github.com/gin-gonic/gin"
)

func GetUser(context *gin.Context){
    userId := context.Param("id")
	user := services.GetUser(userId)

	if user == nil {
		context.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Sprintf("User %s does not exist", userId),
		})
		return
	}
	context.JSON(http.StatusOK, user)
}

func CreateUser(context *gin.Context){
	var body services.User
	if err := context.ShouldBindJSON(&body); err != nil {
		log.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}
	
	user := services.CreateUser(body.ID, body.Email, body.Username)
	context.JSON(http.StatusCreated, user)
}

