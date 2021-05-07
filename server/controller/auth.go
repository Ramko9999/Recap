package controllers

import (
	"net/http"
	"recap-server/service"
	"github.com/gin-gonic/gin"
)



func GetTokens(context *gin.Context){
	var body services.User

	if err := context.ShouldBindJSON(&body); err != nil {
		context.Status(http.StatusBadRequest)
		return
	}

	jwtCredentials := services.GetTokens(body.ID, body.Email)
	context.JSON(http.StatusOK, jwtCredentials)
}

func RefreshAccessToken(context *gin.Context){
	var body services.RefreshRequest
	if err := context.ShouldBindJSON(&body); err != nil {
		context.Status(http.StatusBadRequest)
		return 
	}

	jwtCredentials, err := services.RefreshAccessToken(body.RefreshToken)
	if err != nil {
		context.Status(http.StatusUnauthorized)
		return
	}
	context.JSON(http.StatusOK, jwtCredentials)
}

