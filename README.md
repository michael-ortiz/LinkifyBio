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
```
 
This will start the backend on port `3500`.

Next, open a new terminal tab, and go to `cd ./react` and run:

```sh
npm install
npm run dev:local
```

