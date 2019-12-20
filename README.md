# blogPost
Blogging Using Node JS

## Getting started

To get the Node server running locally:

    Clone this repo
    npm install to install all required dependencies
    Install MongoDB Community Edition (instructions) and run it by executing mongod
    npm run dev to start the local server


## Dependencies

    expressjs - The server for handling and routing HTTP requests
    express-jwt - Middleware for validating JWTs for authentication
    jsonwebtoken - For generating JWTs used by authentication
    mongoose - For modeling and mapping MongoDB data to javascript
    mongoose-unique-validator - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The mongoose-unique-validator plugin helps us by formatting the error like a normal mongoose ValidationError.
    passport - For handling user authentication
    slug - For encoding titles into a URL-friendly format

## Application Structure

    app.js - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
    config/ - This folder contains configuration for passport as well as a central location for configuration/environment variables.
    routes/ - This folder contains the route definitions for our API.
    models/ - This folder contains the schema definitions for our Mongoose models.
