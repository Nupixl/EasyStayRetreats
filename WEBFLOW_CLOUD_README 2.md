# Webflow Cloud Deployment - Easy Stay Retreats

This project is fully configured and optimized for deployment on Webflow Cloud.

## 🚀 Quick Deploy

```bash
# 1. Install dependencies
npm install

# 2. Build for Webflow Cloud
npm run webflow:build

# 3. Deploy to Webflow Cloud
npm run webflow:deploy
```

## 📋 Pre-Deployment Checklist

- [ ] **Environment Variables Set**: Configure `BASE_PATH`, `ASSETS_PREFIX`, and `BASE_URL` in Webflow Cloud
- [ ] **Webflow Site Published**: Your Webflow site must be published to make the app accessible
- [ ] **GitHub Repository**: Code pushed to GitHub repository
- [ ] **Webflow Cloud Project**: Project created and connected to GitHub repository
- [ ] **Mount Path**: Set to `/app` in Webflow Cloud environment settings

## 🔧 Configuration Files

### Key Configuration Files:
- `next.config.webflow.js` - Webflow Cloud optimized Next.js configuration
- `webflow.json` - Webflow Cloud project configuration
- `wrangler.json` - Cloudflare Workers configuration
- `webflow-cloud.env` - Environment variables template

### Build Configuration:
- **Base Path**: `/app`
- **Asset Prefix**: `/app`
- **Output**: `standalone` (optimized for Cloudflare Workers)
- **Runtime**: Edge runtime for API routes

## 🌐 Environment Variables

### Required Variables:
```bash
BASE_PATH=/app
ASSETS_PREFIX=/app
BASE_URL=https://your-site.webflow.io
```

### Optional Variables:
```bash
WEBFLOW_SITE_ID=609dfa12a141dd6e70976d48
WEBFLOW_PROJECT_ID=63f4f3d4-57ff-49c5-a8b3-3ce76d1b242f
API_BASE_URL=https://your-site.webflow.io/app/api
```

## 📦 Build Optimizations

### Bundle Size Optimization:
- **Target**: < 10MB (Webflow Cloud limit)
- **Code Splitting**: Automatic vendor and app code splitting
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip compression enabled

### Performance Features:
- **Edge Runtime**: API routes optimized for Cloudflare Workers
- **Static Assets**: Properly configured with basePath and assetPrefix
- **Image Optimization**: Disabled (Webflow handles this)
- **Caching**: Optimized cache headers

## 🔄 Deployment Workflow

### Automatic Deployment (Recommended):
1. Push changes to GitHub
2. Webflow Cloud automatically detects changes
3. Builds and deploys automatically

### Manual Deployment:
```bash
# Build and deploy
npm run webflow:deploy

# Or step by step
npm run webflow:build
webflow cloud deploy
```

## 🧪 Local Testing

Test your Webflow Cloud build locally:

```bash
# Build for Webflow Cloud
npm run webflow:build

# Test with Wrangler (simulates Cloudflare Workers)
npm run preview
```

## 📱 Access Your App

After deployment, your app will be accessible at:
```
https://your-site.webflow.io/app
```

## 🛠️ Development Commands

```bash
# Development
npm run dev                    # Local development
npm run devlink:sync          # Sync Webflow components
npm run devlink:watch         # Watch for Webflow changes

# Building
npm run build                 # Standard build
npm run webflow:build         # Webflow Cloud optimized build

# Deployment
npm run deploy                # Deploy to Webflow Cloud
npm run webflow:deploy        # Build and deploy to Webflow Cloud
```

## 🔍 Monitoring & Debugging

### Check Deployment Status:
1. Go to Webflow Cloud project dashboard
2. View deployment logs and status
3. Check build logs for any errors

### Common Issues:
- **404 Errors**: Ensure Webflow site is published
- **Asset Loading**: Check basePath and assetPrefix configuration
- **API Errors**: Verify Edge runtime configuration
- **Build Failures**: Check bundle size (must be < 10MB)

## 📚 Resources

- [Webflow Cloud Documentation](https://developers.webflow.com/webflow-cloud/)
- [Next.js on Cloudflare Workers](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Project Deployment Guide](./DEPLOYMENT.md)

## 🎯 Next Steps

After successful deployment:
1. **Test All Functionality**: Verify booking forms, search, and navigation
2. **Add Real Content**: Replace placeholder content with actual retreat data
3. **Configure Analytics**: Add Google Analytics or other tracking
4. **Set Up Email**: Configure email notifications for bookings
5. **Database Integration**: Connect to external database if needed

---

**Your Easy Stay Retreats website is now ready for Webflow Cloud! 🧘‍♀️✨**
