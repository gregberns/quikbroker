# GitHub Secrets for CI/CD Deployment

This document lists all the GitHub Secrets required for the QuikBroker CI/CD deployment process.

## CI/CD Workflow

The QuikBroker project uses a consolidated CI/CD pipeline implemented in `.github/workflows/ci-cd.yml`. This workflow handles:

1. Building Docker images for both the application and migrations
2. Running database migrations
3. Deploying the application to Railway

The workflow is triggered on pushes to the `main` branch, version tags, pull requests, and manual triggers.

## Required Secrets

### Database Connection Secrets

These secrets are used by the migrations container to connect to the database:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DB_HOST` | Database host address | `postgres.railway.app` |
| `DB_PORT` | Database port (default: 5432) | `5432` |
| `DB_NAME` | Database name | `railway` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `password123` |

### Railway Deployment Secrets

These secrets are used for deploying the application to Railway:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `RAILWAY_TOKEN` | API token for Railway deployments | `90d98f1e-d0a1-46ab-b69a-12a3bc4d5e6f` |
| `RAILWAY_PROJECT_ID` | Railway project ID | `12345678-abcd-1234-abcd-1234567890ab` |
| `RAILWAY_SERVICE_ID` | Railway service ID for the app | `12345678-abcd-1234-abcd-1234567890ab` |

### Container Registry Access

The workflows use `GITHUB_TOKEN` which is automatically provided by GitHub Actions for pushing to the GitHub Container Registry (GHCR). No additional setup is needed for this.

## Setting Up Secrets

To set up these secrets in your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click on "New repository secret"
5. Enter the name and value of the secret
6. Click "Add secret"

## Obtaining Railway Credentials

To get the required Railway credentials:

1. Install the Railway CLI: `npm i -g @railway/cli`
2. Login to Railway: `railway login`
3. Get your Railway token: Go to [Railway Dashboard](https://railway.app/account) > "Developer" > "API Tokens" > Generate token
4. Get your project ID: `railway projects list` or from the URL in the Railway dashboard
5. Get your service ID: From the URL in the Railway dashboard when viewing your service

## Environments

The deployment workflow supports multiple environments (production, staging). Environment-specific secrets can be configured in GitHub:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Environments"
4. Click on "New environment" or select an existing one
5. Add environment-specific secrets as needed

## Encrypted Secrets

GitHub Secrets are encrypted and only exposed as environment variables to GitHub Actions workflows during runtime. They cannot be viewed or accessed in any other way after they're set.