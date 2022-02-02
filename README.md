# auth-nest-js

### Table of Contents

1. [General-Information](#general-information)

2. [Features](#features)

3. [Technologies](#technologies)

4. [Documentation](#documentation)

5. [Setup](#setup)

### General-Information

Authentication based personal project.
The purpose of this project: learn typescript & nestjs basics, and more

API provides data manipulation only for users who are either signed in & has verified account or has
already created an account that is need to be logged in for access and modification.
This kind of authorization is enabled with custom tokens which are generated for every single user.
API also provides verification for newly created accounts.
Crud operations on products can be made only by valid & authenticated users.
Database can store 2 types of users:
-BASIC: can only fetch resources from the database
-ADMIN: can do everything

### Features

-   REST API

-   Typescript/ESM

-   Authentication system:

    -   Login

    -   Register

    -   Logout

    -   Account confirmation

-   Custom token based authentication

-   Password reset

-   Request body validation

-   Custom error responses

-   API documentation

### Technologies

1. Node

2. NestJS

3. Mongo ODM

4. RabbitMQ

## Documentation

-   internal: http://localhost{port}/api

### Setup

Steps:

-   install dependencies

-   set up the environment file

    -   create .env

    -   add variables manually

-   run project in development mode

```shell

$ npm i

$ touch .env

$ npm run dev

```
