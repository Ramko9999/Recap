A studying web app which generates questions & summarize reading material for users using NLP.

Frontend: React + TypeScript
Backend:
    - (REST Api) Gin-Gonic + Go
    - (NLP Consumer) Python
    - (Message Queue) RabbitMQ
    - (Database) Postgres

# Prerequisites

## React Client

1. [Learn TypeScript](https://www.typescriptlang.org/docs/)

2. Make sure you get the firebase & http credentials from [Ramko9999](https://github.com/Ramko9999)

## Gin Server

1. [Install Go](https://golang.org/doc/install)

2. [Install Docker Desktop](https://www.docker.com/products/docker-desktop) 

3. [Learn & Set up Docker](https://www.youtube.com/watch?v=3c-iBn73dDE)

4. [Install Docker Postgres Image](https://hub.docker.com/_/postgres/)

5. [Install Docker RabbitMQ Image](https://hub.docker.com/_/rabbitmq)

```bash
docker pull postgres

docker pull rabbitmq
```

6. Create a .env file in ./server. Put a password for the Postgres instance as follows in the .env file:
```
PASSWORD=...
```

7. Run the docker-compose.yaml file from ./server

```bash
docker compose up -d

docker ps # verify containers are running
```

8. Go into postgres container with the following command and create 2 databases (recap_db & recap_db_test)

```bash
docker exec -it <postgres-container-id> psql -U postgres
```

```sql
postgres=# CREATE DATABASE recap_db;

postgres=# CREATE DATABASE recap_db_test;
```

```recap_db``` will be the local development database and ```recap_db_test``` will be database when running tests.

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

4. Ensure you have firebase.json in ./server/gin (firebase project credentials)

Ask Ramko9999 if you don't have them


# Running the application components together

Simply run ```npm start``` from root directory. The scripts in ./tasks are used perform some simple checks to make sure you have the correct files and are hooked up to ```npm start``` to run both the React application & Gin-Gonic web server.

# Running the application components separately

## React Client

Navigate into ./client and run ```npm start```

## Gin Server

Navigate into ./server/gin and run ```go run main.go```

# Running application tests

## React Client

Don't have testing setup yet

## Gin Server

Navigate into ./server/gin and run ```go test``` or for more verbosity ```go test -v```

