# Webflow Cloud Deployment Guide

This guide will walk you through deploying your Easy Stay Retreats website to Webflow Cloud.

## Prerequisites

- ✅ Webflow account with site ID: `609dfa12a141dd6e70976d48`
- ✅ GitHub account
- ✅ Node.js 20.0.0+ installed
- ✅ This project built and tested locally

## Step 1: Push to GitHub

First, push your project to a GitHub repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Easy Stay Retreats website"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/EasyStayRetreats.git

# Push to GitHub
git push -u origin main
```

## Step 2: Connect Webflow Cloud

1. **Navigate to Webflow Cloud**
   - Go to your Webflow site dashboard
   - Click on your site (Site ID: 609dfa12a141dd6e70976d48)
   - In the left sidebar, click "Webflow Cloud"

2. **Authenticate with GitHub**
   - Click "Login to GitHub"
   - Authorize Webflow to access your GitHub account
   - Click "Install GitHub App"
   - Select your EasyStayRetreats repository
   - Click "Install"

## Step 3: Create Webflow Cloud Project

1. **Create New Project**
   - Click "Create New Project"
   - Fill in the details:
     - **Name**: `Easy Stay Retreats`
     - **GitHub Repository**: Select your EasyStayRetreats repository
     - **Description**: `Wellness retreat website with booking system`
   - Click "Create project"

2. **Create Environment**
   - Click "Create environment"
   - Configure the environment:
     - **Branch**: `main` (or your default branch)
     - **Mount Path**: `/app` (this matches your next.config.ts)
   - Click "Create environment"

## Step 4: Configure Environment Variables

If your app needs environment variables:

1. Go to your project's environment settings
2. Click "Environment Variables" tab
3. Add any required variables (API keys, database URLs, etc.)

## Step 5: Deploy

### Option A: Automatic Deployment (Recommended)

Simply push changes to your GitHub repository:

```bash
git add .
git commit -m "Deploy to Webflow Cloud"
git push origin main
```

Webflow Cloud will automatically detect changes and deploy your app.

### Option B: Manual Deployment

Install the Webflow CLI and deploy manually:

```bash
# Install Webflow CLI
npm install -g @webflow/cli

# Login to Webflow
webflow login

# Deploy your project
webflow cloud deploy
```

## Step 6: Verify Deployment

1. **Check Deployment Status**
   - Go to your Webflow Cloud project dashboard
   - View the deployment status in "Environment Details"
   - Check build logs for any errors

2. **Test Your App**
   - Visit your Webflow site URL + mount path
   - Example: `https://your-site.webflow.io/app`
   - Test all functionality including the booking form

## Step 7: Publish Your Webflow Site

**Important**: After creating your Webflow Cloud environment, you must publish your Webflow site to make it live:

1. Go to your Webflow Designer
2. Click "Publish" in the top right corner
3. Select "Publish to Webflow.io"
4. Your app will now be accessible at your site URL + mount path

## Troubleshooting

### Common Issues

1. **404 Error on App**
   - Ensure your Webflow site is published
   - Check that the mount path matches your configuration

2. **Assets Not Loading**
   - Verify `basePath` and `assetPrefix` in `next.config.ts`
   - Check that images are in the `public/images/` directory

3. **API Routes Not Working**
   - Ensure API routes have `export const runtime = 'edge';`
   - Check that client-side fetch calls include the base path

4. **Build Failures**
   - Check build logs in Webflow Cloud dashboard
   - Verify Node.js version compatibility
   - Ensure all dependencies are properly installed

### Local Testing

Test your app locally with Wrangler to simulate the Webflow Cloud environment:

```bash
npm run preview
```

This will build your app and serve it using the same Edge runtime as Webflow Cloud.

## Next Steps

After successful deployment:

1. **Add Images**: Replace placeholder images in `public/images/` with actual retreat photos
2. **Configure Analytics**: Add Google Analytics or other tracking
3. **Set Up Email**: Configure email notifications for booking requests
4. **Database Integration**: Connect to a database for persistent booking storage
5. **Payment Processing**: Integrate Stripe or other payment processors

## Support

- **Webflow Cloud Docs**: [https://developers.webflow.com/webflow-cloud/bring-your-own-app](https://developers.webflow.com/webflow-cloud/bring-your-own-app)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues**: Create an issue in this repository

---

**Your Easy Stay Retreats website is now ready for Webflow Cloud! 🧘‍♀️✨**
