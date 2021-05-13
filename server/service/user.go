package services

import (
	"fmt"
	"time"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)


type User struct {
	ID        string `gorm:"primaryKey;type:varchar(50)" json:"id" binding:"required"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Email     string `gorm:"type:varchar(50)" json:"email" binding:"required"` 
	Username  string `gorm:"type:varchar(25)" json:"username" binding:"required"`
	Documents []Document 
}


func GetUser(id string) *User {
	user := &User{}
	result := DB.First(user, "id = ?", id)
	if result.Error != nil {
		return nil
	}
	return user
}

func CreateUser(id string, email string, username string) (*User, error) {
	user := &User{
		ID: id,
		Email: email,
		Username: username,
	}

	result := DB.Clauses(clause.OnConflict{DoNothing: true}).Create(user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func (user *User) Equals(otherUser *User) bool {
	return user.ID == otherUser.ID && user.Email == otherUser.Email && user.Username == otherUser.Username;
}

func (user *User) String() string {
	return fmt.Sprintf("%s %s %s", user.ID, user.Email, user.Username)
}