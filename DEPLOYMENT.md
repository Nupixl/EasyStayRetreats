# Deployment Guide - EasyStay Retreats

**Last Updated**: December 22, 2025  
**Project**: EasyStay Retreats - Property Management Form  
**Stack**: Next.js 16, React 19, Supabase, Tailwind CSS 4

---

## 🚀 Quick Deployment Steps

### 1. Commit Your Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add dynamic multiple properties form for property owners

- Redesigned referral form to target property owners
- Added dynamic property addition (up to 10 properties)
- Changed color scheme to emerald theme
- Each property has individual details (type, location, services, listing status)
- Updated Button component with emerald-700 solid background
- Added comprehensive documentation"

# Push to GitHub
git push origin v2
```

### 2. Deploy to Vercel (Recommended)

**Option A: Deploy via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub: `Nupixl/EasyStayRetreats`
4. Select branch: `v2`
5. Configure environment variables (see below)
6. Click "Deploy"

**Option B: Deploy via Vercel CLI**
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 3. Configure Environment Variables in Vercel

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://sfkadunhnyaeycfdnvfv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma2FkdW5obnlhZXljZmRudmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4ODE0MTcsImV4cCI6MjA3MzQ1NzQxN30.PukagIf_MwrCFfSuuma7XzMAIOFRkkyZ0OnR_b-L2EQ
```

**Note**: These are public keys and safe to expose. For sensitive keys, use Vercel's encrypted environment variables.

---

## 📋 Pre-Deployment Checklist

### Code Quality
- ✅ No linter errors
- ✅ TypeScript types are correct
- ✅ All components render without errors
- ✅ Form validation works
- ✅ Responsive design tested

### Database
- ⚠️ **IMPORTANT**: Update Supabase schema to handle new properties structure
- ⚠️ Update API endpoint to accept properties array
- ⚠️ Test API endpoint with new payload structure

### Testing
- ✅ Test form submission locally
- ✅ Test with 1 property
- ✅ Test with multiple properties (2-10)
- ✅ Test add/remove property functionality
- ✅ Test on mobile, tablet, desktop
- ✅ Test form validation

---

## 🗄️ Database Migration Required

Before deploying, you need to update your Supabase database schema:

### Option 1: Add JSONB Column (Recommended)

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS properties_count INTEGER,
ADD COLUMN IF NOT EXISTS properties JSONB;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_referrals_properties_count 
ON referrals(properties_count);

-- Update existing records (if any)
UPDATE referrals 
SET properties_count = 1,
    properties = jsonb_build_array(
        jsonb_build_object(
            'propertyType', property_type,
            'propertyLocation', property_location,
            'managementInterest', management_interest,
            'currentlyListed', currently_listed,
            'listingLinks', listing_links
        )
    )
WHERE properties IS NULL;
```

### Option 2: Create Separate Table

```sql
-- Create properties table
CREATE TABLE IF NOT EXISTS referral_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
    property_type VARCHAR(50) NOT NULL,
    property_location VARCHAR(255) NOT NULL,
    management_interest VARCHAR(100) NOT NULL,
    currently_listed VARCHAR(50) NOT NULL,
    listing_links TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_referral_properties_referral_id 
ON referral_properties(referral_id);

-- Add RLS policies
ALTER TABLE referral_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" 
ON referral_properties FOR INSERT 
WITH CHECK (true);
```

---

## 🔧 API Endpoint Update Required

Update `/src/app/api/referral/route.ts` to handle the new properties structure:

### Current Expected Payload:
```typescript
{
  linkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertiesCount: number;
  properties: Array<{
    propertyType: string;
    propertyLocation: string;
    managementInterest: string;
    currentlyListed: string;
    listingLinks: string;
  }>;
  companySource: string;
  formEngagement: 'completed' | 'partial';
  startedAt: string;
  completedAt: string;
  timeToComplete: number;
}
```

### Update Your API Route:

```typescript
// Example update for route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const { 
    linkId, 
    firstName, 
    lastName, 
    email, 
    phone,
    propertiesCount,
    properties, // NEW: Array of properties
    companySource,
    formEngagement,
    startedAt,
    completedAt,
    timeToComplete
  } = body;

  // Insert referral with properties
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      affiliate_link_id: linkId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      properties_count: propertiesCount, // NEW
      properties: properties, // NEW: Store as JSONB
      company_source: companySource,
      form_engagement: formEngagement,
      started_at: startedAt,
      completed_at: completedAt,
      time_to_complete: timeToComplete,
    })
    .select()
    .single();

  // ... rest of your logic
}
```

---

## 🧪 Testing Your Deployment

### Local Testing First

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
# Test the form thoroughly
```

### Test Checklist:
1. ✅ Form loads without errors
2. ✅ Can add properties (up to 10)
3. ✅ Can remove properties (minimum 1)
4. ✅ All fields validate correctly
5. ✅ Form submits successfully
6. ✅ Success message displays
7. ✅ Data appears in Supabase
8. ✅ Mobile responsive works
9. ✅ Emerald color theme displays correctly
10. ✅ Loading states work

### Production Testing

After deployment:
1. Visit your production URL
2. Test form submission end-to-end
3. Verify data in Supabase production database
4. Check browser console for errors
5. Test on mobile device
6. Test with multiple properties

---

## 🌐 Deployment Platforms

### Vercel (Recommended)
**Pros:**
- ✅ Built for Next.js
- ✅ Automatic deployments from GitHub
- ✅ Edge functions support
- ✅ Free SSL
- ✅ Preview deployments for PRs
- ✅ Easy environment variable management

**Deployment:**
```bash
vercel --prod
```

### Netlify
**Pros:**
- ✅ Good Next.js support
- ✅ Easy setup
- ✅ Free tier available

**Deployment:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Self-Hosted (VPS/AWS/DigitalOcean)
**Requirements:**
- Node.js 20+
- PM2 or similar process manager
- Nginx reverse proxy
- SSL certificate

```bash
# Build the app
npm run build

# Start production server
npm run start
```

---

## 🔐 Environment Variables

### Required Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Optional Variables:
```env
# For GoHighLevel integration
GHL_WEBHOOK_URL=your_ghl_webhook_url
GHL_API_KEY=your_ghl_api_key

# For analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## 📊 Post-Deployment Monitoring

### Check These After Deployment:

1. **Vercel Dashboard**
   - Deployment status
   - Build logs
   - Function logs
   - Analytics

2. **Supabase Dashboard**
   - Check referrals table for new submissions
   - Monitor API usage
   - Check for errors in logs

3. **Browser DevTools**
   - Console errors
   - Network requests
   - Form submission responses

4. **Test Form Submission**
   - Submit a test referral
   - Verify data in Supabase
   - Check email notifications (if configured)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working
- Ensure variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Form Submission Fails
- Check API endpoint logs in Vercel
- Verify Supabase connection
- Check database schema matches expected structure
- Verify CORS settings

### Styling Issues
- Clear browser cache
- Check Tailwind CSS build
- Verify CSS files are loading

---

## 🔄 Continuous Deployment

### Automatic Deployments (Recommended)

1. **Connect GitHub to Vercel:**
   - Vercel will auto-deploy on push to `v2` branch
   - Preview deployments for pull requests
   - Production deployment on merge to main

2. **Branch Strategy:**
   - `v2` - Current development branch
   - `main` - Production branch (if different)
   - Create feature branches for new features

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod --branch v2

# Deploy with custom domain
vercel --prod --domain easystayretreats.com
```

---

## 📝 Deployment Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Run linter
npm run lint

# Deploy to Vercel production
vercel --prod

# Deploy to Vercel preview
vercel

# Check deployment status
vercel ls

# View deployment logs
vercel logs
```

---

## 🎯 Next Steps After Deployment

1. **Test thoroughly** - Submit test forms with 1, 3, and 10 properties
2. **Monitor submissions** - Check Supabase for incoming data
3. **Set up notifications** - Configure email alerts for new submissions
4. **Update documentation** - Add production URL to README
5. **Share with team** - Send production link to stakeholders
6. **Set up analytics** - Track form submissions and conversions
7. **Create backup** - Export Supabase data regularly

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ✅ Final Checklist Before Going Live

- [ ] All code committed to GitHub
- [ ] Database schema updated in Supabase
- [ ] API endpoint updated to handle properties array
- [ ] Environment variables configured in Vercel
- [ ] Local testing completed successfully
- [ ] Form tested with multiple properties
- [ ] Mobile responsive verified
- [ ] Success/error states tested
- [ ] Deployment completed without errors
- [ ] Production URL accessible
- [ ] Test submission verified in database
- [ ] Team notified of new deployment
- [ ] Documentation updated

---

**Ready to deploy? Run the commands below! 🚀**

