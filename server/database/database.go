package database

import (
	"fmt"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB  *gorm.DB = nil


func getDSN() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", 
	os.Getenv("HOST"), os.Getenv("USER"), os.Getenv("PASSWORD"), os.Getenv("NAME"), os.Getenv("PORT"), os.Getenv("SSL_MODE"))
}

func GetDatabase() *gorm.DB { 
	if DB == nil {
		dsn := getDSN()
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			panic("Unable to connect to database")
		}
		DB = db
	} 
	return DB
}

func CloseDatabase(db *gorm.DB) {
	sqlDb, _ := db.DB()
	sqlDb.Close()
}