package middleware

import (
	"net/http"
	"recap-server/service"
	"strings"
	"github.com/gin-gonic/gin"
)


func JWT() gin.HandlerFunc {

	return func(context *gin.Context){
		values, ok := context.Request.Header["Authorization"]
		if !ok || !strings.Contains(values[0], "Bearer") {
			context.AbortWithStatus(http.StatusBadRequest)
			return	
		}
		
		tokenString := strings.TrimSpace(strings.Split(values[0], "Bearer")[1])
		_, err := services.Auth.VerifyIDToken(context.Request.Context(), tokenString)

		if err == nil {
			context.Next()
		} else{
			context.AbortWithStatusJSON(http.StatusUnauthorized, &gin.H{
				"error": err.Error(),
			})
		}
		
	}
}