package services

import (
	"context"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

var Auth *auth.Client

func CreateAuth(){
	opt := option.WithCredentialsFile("./firebase.json")
	backgroundCtx := context.Background()
	app, err := firebase.NewApp(backgroundCtx, &firebase.Config{}, opt)
	if err != nil {
		panic(err.Error())
	}
	if authClient, err := app.Auth(backgroundCtx); err != nil {
		panic(err.Error())
	} else {
		Auth = authClient
	}
}
