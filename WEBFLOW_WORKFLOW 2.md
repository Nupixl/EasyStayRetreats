# Webflow-First Development Workflow

## 🎯 Overview
This workflow ensures all components are designed in Webflow first, maintaining visual consistency across your Easy Stay Retreats website.

## 📋 Workflow Steps

### 1. **Design in Webflow Designer**
- Open your Webflow Designer: https://webflow.com/design/easystayretreasts
- Navigate to the "Components" page (create if it doesn't exist)
- Design your component visually using Webflow's design tools
- Use consistent styling, spacing, and typography

### 2. **Convert to Component**
- Select all elements that make up your component
- Right-click → "Create Component" or use the component panel
- Name your component (e.g., "PropertyCard", "SearchFilters", "Navigation")
- Set up component properties for dynamic content

### 3. **Export via DevLink**
```bash
# Sync components from Webflow to your Next.js app
webflow devlink sync
```

### 4. **Test in Next.js**
- Components are automatically available in `src/components/`
- Import and use in your React components
- Test functionality and styling

### 5. **Iterate and Deploy**
- Make changes in Webflow Designer
- Re-sync with DevLink
- Test locally
- Deploy to Webflow Cloud

## 🛠️ Available Commands

### Development Commands
```bash
# Start local development server
npm run dev

# Sync Webflow components
npm run devlink:sync

# Watch for Webflow changes (auto-sync)
npm run devlink:watch

# Build for production
npm run build

# Deploy to Webflow Cloud
npm run deploy
```

### Webflow Commands
```bash
# Sync components from Webflow
webflow devlink sync

# Watch for changes and auto-sync
webflow devlink watch

# Deploy to Webflow Cloud
webflow cloud deploy
```

## 📁 Project Structure

```
src/
├── components/           # Webflow components (auto-generated)
│   ├── PropertyCard.js   # Your Webflow PropertyCard component
│   ├── _Builtin/         # Webflow built-in components
│   └── ...
├── app/                  # Next.js app router pages
│   ├── page.tsx          # Home page
│   ├── search-properties/
│   └── book/
└── ...
```

## 🎨 Component Development Guidelines

### 1. **Naming Convention**
- Use PascalCase for component names
- Be descriptive: `PropertyCard`, `SearchFilters`, `BookingForm`
- Avoid generic names like `Card` or `Button`

### 2. **Component Properties**
- Set up dynamic properties in Webflow
- Use clear, descriptive property names
- Consider data types (text, number, image, etc.)

### 3. **Styling Consistency**
- Use Webflow's design system
- Maintain consistent spacing, colors, and typography
- Test on different screen sizes

### 4. **Testing**
- Always test components locally after syncing
- Verify responsive behavior
- Check interactive elements

## 🔄 Development Cycle

1. **Design** → Create component in Webflow Designer
2. **Sync** → Run `webflow devlink sync`
3. **Test** → Test in Next.js app
4. **Iterate** → Make changes in Webflow, re-sync
5. **Deploy** → Deploy to Webflow Cloud

## 📚 Best Practices

### Webflow Designer
- Keep components focused and reusable
- Use semantic HTML structure
- Optimize images and assets
- Test responsive behavior

### Next.js Integration
- Import components from `@/components/`
- Use TypeScript for type safety
- Handle component props properly
- Test component functionality

### Deployment
- Always test locally before deploying
- Use version control for code changes
- Keep Webflow and code in sync
- Monitor deployment status

## 🚨 Troubleshooting

### Common Issues
1. **Component not syncing**: Check Webflow component name and DevLink configuration
2. **Styling issues**: Verify CSS classes and responsive settings
3. **Build errors**: Check component imports and TypeScript types
4. **Deployment failures**: Verify Webflow Cloud configuration

### Getting Help
- Check Webflow DevLink documentation
- Review component exports in `src/components/`
- Test components in isolation
- Use browser dev tools for debugging

## 🎯 Next Steps

1. Create a "Components" page in Webflow Designer
2. Design your first component (e.g., Navigation, SearchFilters)
3. Convert to component and sync with DevLink
4. Test in your Next.js app
5. Iterate and improve

---

**Remember**: Always design in Webflow first, then sync to code. This ensures visual consistency and leverages Webflow's powerful design tools.
