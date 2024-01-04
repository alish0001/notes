# notes

Scalable RESTful API that allows users to create, read, update, and delete notes.

## choice of framework

First of all node js library is used in the project. The projects mainly deals with the I/O operations. Node js is proficient to deal with I/O;

## choide of db

Mongo Db is used because I am familiar with mongo db. Rate limiting could have been further more inhanced with the help of redis.

## how to build this project

If you have docker and docker compose installed
simply clon the repo
run "docker compose up" in the terminal

If you want to run it manually then:
clone the repo
go to /dir/to/cloned/repo
type npm i in command line
create env from env.example file
npm run dev to run it in development mode
npm run start to run it in production mode

here is short description for the env
PORT, is for server to listen in the particular port default is 8080
MONGO_DB_URI, is for mongo db url
MAX_NOTE_SIZE, is for maximum note size in character default is 10000 character,
ACCESS_TOKEN_SECRET, secret for generating access token, use command "openssl rand -hex 32" in terminal, and paste the output here

WINDOW_DURATION, Specifies the timeframe in which the hitCount limit is enforced for monitoring incoming requests from an individual IP address. default is 1
HIT_COUNT, Defines the maximum permissible number of requests permitted from an IP address within a specified duration. default is 5
IP_RETRY_TIME, Represents the duration an IP address remains blocked before being allowed to retry requests after surpassing limits.
"basically default rate limit if 5 request per second"

MONGO_DB_URI, ACCESS_TOKEN_SECRET should not be empty
