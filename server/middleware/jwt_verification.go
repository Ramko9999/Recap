package middleware

import (
	"net/http"
	"recap-server/service"
	"strings"
	"github.com/gin-gonic/gin"
)


func VerifyAccess() gin.HandlerFunc {

	return func(context *gin.Context){
		values, ok := context.Request.Header["Authorization"]
		if !ok || !strings.Contains(values[0], "Bearer") {
			context.AbortWithStatus(http.StatusBadRequest)
			return	
		}

		tokenString := strings.TrimSpace(strings.Split(values[0], "Bearer")[1])
		isTokenValid, err := services.VerifyAccessToken(tokenString)
		if isTokenValid {
			context.Next()
		} else{
			canRefreshToken := strings.Contains(err.Error(), "token is expired")
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"refresh": canRefreshToken,
			})
		}
	}
}