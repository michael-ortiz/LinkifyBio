# linkifybio

## Introduction

This is a full stack application that includes a public landing page for your links in bio, and an authenticated console to manage everything about you page.

## Infrastructure Stack

This application is meant to run on AWS.

These are the services used to run the application:

* S3 for static website hosting
* Lambda for backend APIs
* DynamoDB for database
* Cognito for user creations and authentication
* Cloudfront for CDN
* Route53 for DNS management
* SSM Paramstore for secrets (Social Federetion Credentials: ex Google)

## Run Application

### Prerequisites

#### localstack

This will install a local environment to run some AWS Services. Specifically we will use S3 and DynamoDB.

```
brew install localstack/tap/localstack-cli
```

#### aws-local

Used to create S3 Bucket for profile images when starting the application.

```
pip install awscli-local
```

or if using pip3

```
pip3 install awscli-local
```

### Local Run Steps

To run this application, first go to director `cd ./lambda-api` and run:

```sh
npm install
npm start:local
```
 
This will start the backend on port `3500` and create the s3 bucket for profile images if not already created.

Next, open a new terminal tab, and go to `cd ./react` and run:

```sh
npm install
npm run dev:local
```

Next, open `http://localhost:5173` in your browser and use the application. 

### Note
Authentication is `disabled` for local development.

If you would like to connect to our actual backend, you  can do so by running:

```
npm run dev
```

This will connect to the lambda in AWS and will require Cognito for authentication.

## Deploy to AWS

The whole infrastructure is located in the `terraform` folder.

#### Important

The backend in Terraform expects that you use a valid domain name from Route 53. If you rather not use a domain, you will need to remove references from Terraform to not use a Route53 record, and cloudfront.

You will need to change the following local variables to use your own domain in `vars.tf`.


```
locals {
  domain_name = "YOUR_DOMAIN_NAME"
}
```

If you have not configured an OIDC role for GitHub Actions, you can do so by enabling the following flag in the `oidc.tf` `github-actions-oidc` module.

```
create_oidc_provider = true
```

If you already created it, set the value to `false`

Once you deploy this, in react app .env files, update the `VITE_API_URL` to your lambda API url. Then, you can use GitHub Actions to build and deploy your application.

In GitHub actions secrets and variables, set a new repository variable `AWS_ACCOUNT_ID` with the AWS account ID that you want to deploy into.

Next, in the `on_release.yaml` workflow under `.github/`, update the `linkifybio` references to your domain name used in terraform. This will ensure that you can deploy to your already created resources in terraform. 

In the react app, there are references to `linkifybio.com` / `linkifybio` that are used for Cognito redirects and branding purposes. I recommend searching for this keyword and changing any references to your domain name throughout the app.

Push your changes, and wait for the workflow to run and deploy your application.

If you have any problems, please open an issue and I will try to answer as soon as possible!

Enjoy!
