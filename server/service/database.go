package services

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DatabaseConfig struct {
	Host string
	User string
	Password string
	Name string
	Port string
	SslMode string
}

var DB *gorm.DB = nil

func getDSN(databaseConfig *DatabaseConfig) string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", 
	databaseConfig.Host, databaseConfig.User, databaseConfig.Password, databaseConfig.Name, databaseConfig.Port, databaseConfig.SslMode)
}

func CreateDatabase(databaseConfig *DatabaseConfig) {
	dsn := getDSN(databaseConfig)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("Unable to connect to database: %s", err.Error()))
	}
	db.AutoMigrate(&User{}, &Document{})
	DB = db
}


func CloseDatabase(instance *gorm.DB) {
	if sqlDB, err := instance.DB(); err != nil {
		panic(fmt.Sprintf("Cannot close database connection: %s", err.Error()))
	} else {
		sqlDB.Close()
	}
}