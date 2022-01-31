A studying web app which generates questions & summarize reading material for users using NLP (Work in Progress Lol).

Frontend: React + TypeScript
Backend: Gin-Gonic + GORM + Postgres + Go

# Prerequisites

## React Client

1. [Learn TypeScript](https://www.typescriptlang.org/docs/)

2. Make sure you get the firebase & http credentials from [Ramko9999](https://github.com/Ramko9999)

## Gin Server

1. [Install Go](https://golang.org/doc/install)

2. [Install Postgres](https://www.postgresql.org/download/) 

3. Set up Postgres

Once you installed Postgres, enter the PSQL shell & create 2 new databases with the names ```recap_db``` and ```recap_db_test```. ```recap_db``` will refer to our development database and ```recap_db_test``` refers to our testing database to use when running tests. 

GORM will take care of creating schema.

Create a .env file in ./server/gin. This file will contain the Postgres instance credentials. Here is what should be in it:

```
PORT=...
HOST=...
NAME=recap_db
USER=...
PASSWORD=...
SSL_MODE=disable


TEST_PORT=...
TEST_HOST=...
TEST_NAME=recap_db_test
TEST_USER=...
TEST_PASSWORD=...
TEST_SSL_MODE=disable

```

4. Ensure you have firebase.json (firebase project credentials)
# Running the application components together

Simply run ```npm start``` from root directory. 
# Running the application components separately

## React Client

Navigate into ./client and run ```npm start```

## Gin Server

Navigate into ./server and run ```go run main.go```

# Running application tests

## React Client

Don't have testing setup yet

## Gin Server

Navigate into ./server and run ```go test``` or for more verbosity ```go test -v```

