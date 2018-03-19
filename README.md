# Auth-Service

This application exposes a REST API with a simple authentication layer using node.js, express, passport, passport-jwt, and bcryptjs.

## Development

### Environment Variables

In order to run the application, you will need to set up three environment variables at a minimum.  Create a `.env` file in the root directory with the following environment variables.  

```text
DB_ACCOUNT=myCloudantAccount
DB_PASSWORD=myCloudantPassword
JWT_SECRET=mySuperSecretJwtKey
```

This application uses Cloudant.  To set up your database connection, use your Cloudant account and password as values for `DB_ACCOUNT` and `DB_PASSWORD`.  Make sure that you have a `users` database set up in Cloudant. 

Generate a random key to use as your `JWT_SECRET`. 

To see a sample of available environment variables, use `.env.sample`

### Running the Application

0. Install dependencies: `npm install`
0. Run application in dev mode: `npm run dev`

## Database

To start, you may need to create a user manually in Cloudant, as you will not be able to access the endpoint to create a user.  The Cloudant document for a user looks like this:

```json
{
  "_id": "some database id"
  "username": "user1",
  "password": "an encrypted password"
}
```

## Endpoints

There are three endpoints available. All endpoints except `/login` will require an authentication token in the `Authentication` request header.  The token must be preceded with the string "JWT" or the token will not be recognized.

There is also a Postman collection available in the root directory - `auth-service.postman_collection.json`. 

### POST /users 

To create a user, post to `/users` with 

```json
{
  "username": "user1",
  "password": "Abc123!"
}
```

### GET /users/:username

Retrieve a user by username

### POST /login

To login, post to `/login` with:

```json
{
  "username": "user1",
  "password": "Abc123!"
}
```

Successful login will return the following:

```json
{
    "token": "JWT super secret token",
    "expires": "some expiration date",
    "username": "user1"
}
```

The current code will create token on login and set the expiration date for 24 hours from the current date.  To use the token, add it to the `Authorization` header of any of the other endpoints.  The token must be preceded with the string "JWT" or the token will not be recognized.