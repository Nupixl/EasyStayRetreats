# Easy Stay Retreats

A beautiful, modern wellness retreat website built with Next.js and designed for Webflow Cloud deployment.

## 🧘‍♀️ About

Easy Stay Retreats offers transformative wellness experiences in stunning locations around the world. This website showcases our retreat offerings with a focus on mindfulness, natural healing, and community connection.

## 🚀 Features

- **Modern Design**: Clean, responsive design following Client-First principles
- **Webflow Cloud Ready**: Configured for seamless deployment on Webflow Cloud
- **Performance Optimized**: Built with Next.js 15 and optimized for Edge runtime
- **Mobile First**: Fully responsive design that works on all devices
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Styling**: CSS with Client-First methodology
- **Deployment**: Webflow Cloud with Edge runtime
- **Package Manager**: npm
- **TypeScript**: Full TypeScript support

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 20.0.0 or higher
- npm package manager
- A Webflow account
- A Webflow site (Site ID: 609dfa12a141dd6e70976d48)
- A GitHub account

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 3. Build for Production

```bash
npm run build
```

### 4. Preview with Wrangler (Webflow Cloud simulation)

```bash
npm run preview
```

## 🌐 Webflow Cloud Deployment

This project is configured for Webflow Cloud deployment. Follow these steps:

### 1. Connect to Webflow Cloud

1. In your Webflow site settings, navigate to "Webflow Cloud"
2. Click "Login to GitHub" and authenticate
3. Click "Install GitHub App" to connect your repositories

### 2. Create Webflow Cloud Project

1. Click "Create New Project"
2. Add project details:
   - **Name**: Easy Stay Retreats
   - **GitHub Repository**: Your repository URL
   - **Description**: Wellness retreat website
3. Click "Create project"

### 3. Create Environment

1. Choose your deployment branch (usually `main`)
2. Set mount path (e.g., `/app`)
3. Click "Create environment"

### 4. Deploy

```bash
# Deploy using Webflow CLI
webflow cloud deploy

# Or push to GitHub for automatic deployment
git add .
git commit -m "Deploy to Webflow Cloud"
git push origin main
```

## 📁 Project Structure

```
EasyStayRetreats/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles with Client-First system
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   └── components/
│       ├── hero.tsx             # Hero section
│       ├── features.tsx         # Features section
│       ├── retreats.tsx         # Retreats showcase
│       ├── testimonials.tsx     # Customer testimonials
│       ├── cta.tsx              # Call-to-action section
│       └── footer.tsx           # Footer
├── public/
│   └── images/                  # Image assets
├── next.config.ts               # Next.js configuration
├── webflow.json                 # Webflow Cloud configuration
├── open-next.config.ts          # OpenNext configuration
├── wrangler.jsonc               # Wrangler configuration
└── cloudflare-env.d.ts          # Environment types
```

## 🎨 Design System

This project follows the Client-First methodology:

### Class Naming Convention

- **Utility Classes**: Use dashes (`text-size-large`, `background-color-primary`)
- **Global Classes**: Use dashes or underscores (`faq_item`, `header_background-layer`)
- **Custom Classes**: Use underscores for grouping (`hero_content`, `retreat_card`)
- **Combo Classes**: Use `is-` prefix for variants (`button is-primary`)

### Typography

- Use semantic heading tags (H1-H6)
- Utility classes for styling: `heading-style-h1` through `heading-style-h6`
- Text utilities: `text-size-[size]`, `text-weight-[weight]`, `text-align-[direction]`

### Spacing

- Utility classes: `padding-[direction]-[size]`, `margin-[direction]-[size]`
- Section padding: `padding-section-[small|medium|large]`
- All units in rem for accessibility

## 🖼️ Images

Place your images in the `public/images/` directory:

- `hero-retreat.jpg` - Hero section (800x600px)
- `retreat-mountain.jpg` - Mountain retreat (400x300px)
- `retreat-coastal.jpg` - Coastal retreat (400x300px)
- `retreat-forest.jpg` - Forest retreat (400x300px)

## 🔧 Configuration

### Environment Variables

Configure environment variables in Webflow Cloud:

1. Navigate to your project's environment settings
2. Click "Environment Variables" tab
3. Add required variables (API keys, database URLs, etc.)

### Base Path Configuration

The app is configured with a base path of `/app`. To change this:

1. Update `basePath` and `assetPrefix` in `next.config.ts`
2. Update the mount path in your Webflow Cloud environment
3. Update `wrangler.jsonc` if needed

## 🚀 Deployment

### Automatic Deployment

Push to your connected GitHub branch for automatic deployment:

```bash
git add .
git commit -m "Update website"
git push origin main
```

### Manual Deployment

```bash
webflow cloud deploy
```

## 🐛 Troubleshooting

### Common Issues

1. **404 Error**: Ensure your Webflow site is published
2. **Assets Not Loading**: Check base path configuration
3. **Build Failures**: Verify Node.js version (20.0.0+) and dependencies
4. **Deployment Issues**: Check GitHub App permissions

### Local Testing

Use Wrangler for local testing:

```bash
npm run preview
```

This simulates the Webflow Cloud environment locally.

## 📞 Support

For issues related to:
- **Webflow Cloud**: Check the [Webflow Cloud documentation](https://developers.webflow.com/webflow-cloud/bring-your-own-app)
- **Next.js**: Refer to [Next.js documentation](https://nextjs.org/docs)
- **Project Issues**: Create an issue in this repository

## 📄 License

This project is proprietary to Easy Stay Retreats.

---

**Built with ❤️ for wellness and mindfulness**