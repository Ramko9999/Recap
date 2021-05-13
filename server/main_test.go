package main

import (
	"os"
	"log"
	"recap-server/service"
	"testing"
	"recap-server/test"
	"github.com/joho/godotenv"
)

func TestUsers(t *testing.T){
	documentCreator := services.User{
		ID: "Document Creator's Id",
		Email: "document@creator.com",
		Username: "document creator",
	}

	services.CreateUser(documentCreator.ID, documentCreator.Email, documentCreator.Username)

	t.Run("Create User", tests.TestCreateNewUser)
	t.Run("Get Non Existant User", tests.TestGettingNonExistingUser)
}

func TestDocuments(t *testing.T){
	t.Run("Create Documents", tests.TestCreatingDocuments)
	t.Run("Delete Documents", tests.TestDeletingDocuments)
}

func TestMain(m *testing.M){

	if err := godotenv.Load(".env"); err != nil {
		log.Fatalln("Failed to load env variables")
	}
	services.CreateDatabase(&services.DatabaseConfig{
		Host: os.Getenv("TEST_HOST"),
		Port: os.Getenv("TEST_PORT"),
		Name: os.Getenv("TEST_NAME"),
		User: os.Getenv("TEST_USER"),
		Password: os.Getenv("TEST_PASSWORD"),
		SslMode: os.Getenv("TEST_SSL_MODE"),
	})

	defer func (){
		services.DB.Migrator().DropTable(&services.User{}, &services.Document{})
		services.CloseDatabase(services.DB)
	}()
	m.Run()
}

