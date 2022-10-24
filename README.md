# NodeJS API Asessment

## Background
Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses.

## Technologies and major libraries used
- Nodejs
- Express
- Joi
- MySQL
- Prisma
- Docker
- Jest
- PM2

## Prerequisites

Ensure to have docker and nodejs installed to be able to run the api.

## Setup environment and start server

Run the following command to start the server and the database instance in a dockerized container.

    git clone git@github.com:sathyajitloganathan/tadmin-api.git

    cd tadmin-api

    npm install

    npm run start:migrate:prod

## Run unit tests

The following commands creates a test database instance in a dockerized instance and runs the unit tests utilizing the test database.

    npm run test

## Postman Collection URL

    https://www.getpostman.com/collections/ee5797ca16918d9199ed

## Contact

Feel free to contact me at loganathansathyajit@gmail.com for any queries.