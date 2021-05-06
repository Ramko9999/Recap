package main

import (
	"io"
	"os"
	"recap-server/database"
	"recap-server/route"
	"recap-server/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getLog() *os.File {
	logPath := "gin.log"
	logFile, _ := os.Create(logPath)
	return logFile
}

func main() {

	logFile := getLog()
	gin.DefaultWriter = io.MultiWriter(logFile, os.Stdout)
	DB := database.GetDatabase()

	DB.AutoMigrate(&services.User{})

	engine := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}

	engine.Use(cors.New(corsConfig))
	routes.AddUserRoutes(engine)

	engine.Run("127.0.0.1:8080")
}