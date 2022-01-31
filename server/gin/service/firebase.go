package services

import (
	"context"
	"fmt"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)


var Auth *auth.Client

func InitFirebaseServices(){
	opt := option.WithCredentialsFile("./firebase.json")
	backgroundCtx := context.Background()
	app, err := firebase.NewApp(backgroundCtx, &firebase.Config{}, opt)
	if err != nil {
		panic(fmt.Sprintf("Failed to create a firebase app: %s", err.Error()))
	}
	
	if authClient, err := app.Auth(backgroundCtx); err != nil {
		panic(fmt.Sprintf("failed to create an firebase auth instance: %s", err.Error()))
	} else {
		Auth = authClient
	}
}
