# 🚀 Quick Start Guide - Webflow-First Development

## ⚡ Get Started in 5 Minutes

### 1. **Sync Your Webflow Components**
```bash
npm run workflow:sync
```
This pulls your latest components from Webflow Designer.

### 2. **Start Development Server**
```bash
npm run workflow:dev
```
This starts your Next.js app at http://localhost:3000

### 3. **Full Workflow (Recommended)**
```bash
npm run workflow:full
```
This syncs components AND starts the dev server.

## 🎨 Create a New Component

### In Webflow Designer:
1. Go to https://webflow.com/design/easystayretreasts
2. Create a "Components" page (if it doesn't exist)
3. Design your component visually
4. Select all elements → Right-click → "Create Component"
5. Name your component (e.g., "Navigation", "SearchFilters")
6. Set up component properties for dynamic content

### In Your Terminal:
```bash
npm run workflow:sync
```
Your component is now available in `src/components/`!

## 📱 Test Your Component

### In Next.js:
```tsx
import { YourComponent } from '@/components/YourComponent';

export default function Page() {
  return (
    <YourComponent
      prop1="value1"
      prop2="value2"
    />
  );
}
```

## 🔄 Development Cycle

1. **Design** → Create in Webflow Designer
2. **Sync** → `npm run workflow:sync`
3. **Test** → Check in Next.js app
4. **Iterate** → Make changes in Webflow, re-sync
5. **Deploy** → `npm run workflow:deploy`

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run workflow:sync` | Sync components from Webflow |
| `npm run workflow:dev` | Start development server |
| `npm run workflow:full` | Sync + start dev server |
| `npm run workflow:watch` | Watch for Webflow changes |
| `npm run workflow:deploy` | Deploy to Webflow Cloud |

## 🎯 Your Current Setup

✅ **PropertyCard Component** - Already working!  
✅ **DevLink Integration** - Connected to your Webflow site  
✅ **Local Development** - Running at http://localhost:3000  
✅ **Workflow Scripts** - Ready to use  

## 🚨 Troubleshooting

### Component not syncing?
- Check component name in Webflow
- Verify DevLink configuration
- Run `npm run workflow:sync` again

### Styling issues?
- Check CSS classes in Webflow
- Verify responsive settings
- Test in browser dev tools

### Build errors?
- Check component imports
- Verify TypeScript types
- Run `npm run lint` for errors

## 📚 Next Steps

1. **Create Navigation Component** in Webflow Designer
2. **Design Search Filters** for property search
3. **Build Booking Form** for reservations
4. **Test All Components** together
5. **Deploy to Webflow Cloud**

---

**🎉 You're ready to build with Webflow-first development!**

Start by creating a Navigation component in Webflow Designer, then sync it with `npm run workflow:sync`.
