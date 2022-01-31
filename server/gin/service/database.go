package services

import (
	"fmt"
	"io"
	"log"
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

type PSQLSession struct {
	Logger *log.Logger
	DB 	*gorm.DB
}

var PSQL *PSQLSession

func getDSN(databaseConfig *DatabaseConfig) string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", 
	databaseConfig.Host, databaseConfig.User, databaseConfig.Password, databaseConfig.Name, databaseConfig.Port, databaseConfig.SslMode)
}

func CreateDatabase(databaseConfig *DatabaseConfig, writer io.Writer) {
	dsn := getDSN(databaseConfig)
	PSQL = &PSQLSession{
		Logger: log.New(writer, "[PSQL] ", log.Ldate | log.Ltime | log.LUTC),
	}

	if db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{}); err != nil {
		PSQL.Logger.Panicf("unable to connect to database: %s", err.Error())
	} else {
		db.AutoMigrate(&User{}, &Document{})
		PSQL.DB = db
	}
}

func (psql *PSQLSession) Close() {
	if sqlDB, err := psql.DB.DB(); err != nil {
		psql.Logger.Panicf("unable to get sql database: %s", err.Error())
	} else {
		err := sqlDB.Close()
		if err != nil {psql.Logger.Panicf("cannot close database connection: %s", err.Error())}
	}
}