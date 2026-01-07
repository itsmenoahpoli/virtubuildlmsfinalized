# Railway Deployment Guide

This guide explains how to deploy your VirtuBuild Angular application to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js 20+ installed locally for testing

## Deployment Steps

### 1. Connect Your Repository

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo" (or your preferred Git provider)
4. Choose your repository: `virtubuildallapp-repo/virtubuildapp`

### 2. Configure Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add:

```
API_BASE_URL=https://your-backend-api-url.com/api
```

Replace `https://your-backend-api-url.com/api` with your actual backend API URL.

### 3. Deploy Configuration

Railway will automatically detect your configuration:

- **Build Command**: `npm run build:prod`
- **Start Command**: `npm run start:prod`
- **Port**: Automatically assigned by Railway

### 4. Deployment Options

You have two deployment options:

#### Option A: Using Docker (Recommended)
Railway will use your existing `Dockerfile` for deployment. This is the most reliable method.

#### Option B: Using Nixpacks
Railway can automatically detect your Angular app and build it using Nixpacks. The `railway.json` configuration file ensures proper setup.

### 5. Custom Domain (Optional)

1. In your Railway project, go to "Settings"
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Environment Configuration

The application uses environment variables for configuration:

- `API_BASE_URL`: Your backend API URL
- `PORT`: Port number (automatically set by Railway)

## Build Process

1. Railway installs dependencies: `npm ci --only=production`
2. Builds the application: `npm run build:prod`
3. Serves the application using http-server on the assigned port

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Environment Variables**: Ensure `API_BASE_URL` is set correctly
3. **Port Issues**: Railway automatically assigns ports, don't hardcode them

### Logs

View deployment logs in the Railway dashboard under the "Deployments" tab.

### Local Testing

Test your production build locally:

```bash
npm run build:prod
npm run start:prod
```

## File Structure

Key files for Railway deployment:

- `railway.json` - Railway configuration
- `Dockerfile` - Docker deployment configuration
- `package.json` - Build and start scripts
- `src/environments/environment.ts` - Production environment config

## Support

For Railway-specific issues, check the [Railway Documentation](https://docs.railway.app/).
