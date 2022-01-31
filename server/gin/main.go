package main

import (
	"io"
	"os"
	"recap-server/route"
	"recap-server/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

const (
	LOG_PATH = "gin.log"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic("Unable to load environment variables")
	}
	
	logFile, _ := os.Create(LOG_PATH)
	defer logFile.Close()

	gin.DefaultWriter = io.MultiWriter(logFile, os.Stdout);

	services.CreateDatabase(&services.DatabaseConfig{
		Host: os.Getenv("HOST"),
		Port: os.Getenv("PORT"),
		Name: os.Getenv("NAME"),
		User: os.Getenv("USER"),
		Password: os.Getenv("PASSWORD"),
		SslMode: os.Getenv("SSL_MODE"),
	}, gin.DefaultWriter)

	defer services.PSQL.Close()

	services.InitFirebaseServices()
	services.InitMessageQueue(gin.DefaultWriter)

	defer services.MQ.Close()

	engine := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowHeaders = []string{"Authorization", "Content-Type"}

	engine.Use(cors.New(corsConfig))
	routes.AddUserRoutes(engine)
	routes.AddDocumentRoutes(engine)
	engine.Run("127.0.0.1:8080")
}