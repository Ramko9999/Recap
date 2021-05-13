package tests

import (
	"recap-server/service"
	"testing"
)


func TestCreateNewUser(t *testing.T) {
	user := &services.User{
		ID: "Created User's Id",
		Email: "jameson@gmail.com",
		Username: "jameson",
	}

	if createdUser, err := services.CreateUser(user.ID, user.Email, user.Username); err != nil {
		t.Errorf("Unexpected error when creating a user %s", err.Error())
	} else {
		if !user.Equals(createdUser){
			t.Errorf("Expected user %s is not Actual User %s", user.String(), createdUser.String())
		}
	}	
}

func TestGettingNonExistingUser(t *testing.T) {
	nonExistantId := "Non-Existant User's Id"
	if nonExistantUser := services.GetUser(nonExistantId); nonExistantUser != nil {
		t.Errorf("Expected user to be nil, found user to be: %s", nonExistantUser.String())
	}
}