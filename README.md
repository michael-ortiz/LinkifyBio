# linkifybio

## Introduction

This is a full stack application that includes a public landing page for your links in bio, and an authenticated console to manage everything about you page.

## Infrasturecture Stack

This application is meant to run on AWS.

These are the services used to run the application:

* S3 for static hosting
* Lambda for backend APIs
* DynamoDB for database
* Cognito for user creations and authentication
* Cloudfront for CDN
* Route53 for DNS management
* SSM Paramstore for secrets (Social Login data)

## Run Application

To run this application, first go to `cd ./lambda-api` and run:

```sh
npm install
npm start:local
npm run create-s3-bucket
```
 
This will start the backend on port `3500` and create the s3 bucket for profile images.

Next, open a new terminal tab, and go to `cd ./react` and run:

```sh
npm install
npm run dev:local
```

Next, open `http://localhost:5173` and use the application. 

Authentication is disabled for local developement.

If you would like to connect to our actual backend, you  can do so by running:

```
npm run dev
```

This will connect to the lambda in AWS and will require cognito for authentication.

