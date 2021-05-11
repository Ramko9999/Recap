package services

import (
	"recap-server/database"
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
}


func GetUser(id string) *User {
	DB := database.GetDatabase()
	user := &User{}
	result := DB.First(user, "id = ?", id)
	if result.Error != nil {
		return nil
	}
	return user
}

func CreateUser(id string, email string, username string) (*User, error) {
	DB := database.GetDatabase()
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