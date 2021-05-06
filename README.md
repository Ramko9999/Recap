A studying web app which generates questions & summarize reading material for users using NLP.

Frontend: React + TypeScript
Backend: Gin-Gonic + GORM + Postgres + Go

# Prerequisites

## Client

1. [Learn TypeScript](https://www.typescriptlang.org/docs/)

2. Make sure you get the firebase & http credentials from [Ramko9999](https://github.com/Ramko9999)

## Gin Server

1. [Install Go](https://golang.org/doc/install)

2. [Install Postgres](https://www.postgresql.org/download/) 

3. Set up Postgres

Once you installed Postgres, enter the PSQL shell & create a new database with the name ```recap_db```

GORM will take care of creating schema.

Create a .env file in ./server. This file will contain the Postgres instance credentials. Here is what should be in it:

```
PORT=...
HOST=...
NAME=recap_db
USER=...
PASSWORD=...
SSL_MODE=disable
```


# Running the application components

Simply run ```npm start``` from root directory. The scripts in ./tasks are used perform some simple checks to make sure you have the correct files and are hooked up to ```npm start``` to run both the React application & Gin-Gonic web server.