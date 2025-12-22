# 🚀 Quick Start - Deploy in 5 Minutes

Your code is now on GitHub! Here's how to deploy it:

---

## ⚡ Fastest Way: Deploy with Vercel (Recommended)

### Step 1: Go to Vercel
👉 **Visit**: https://vercel.com/new

### Step 2: Import Your Repository
1. Click **"Import Git Repository"**
2. Search for: `Nupixl/EasyStayRetreats`
3. Click **"Import"**

### Step 3: Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://sfkadunhnyaeycfdnvfv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma2FkdW5obnlhZXljZmRudmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4ODE0MTcsImV4cCI6MjA3MzQ1NzQxN30.PukagIf_MwrCFfSuuma7XzMAIOFRkkyZ0OnR_b-L2EQ
```

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Get your live URL: `https://your-project.vercel.app`

---

## 🗄️ IMPORTANT: Update Database First!

**Before testing the live site**, run this SQL in your Supabase dashboard:

### Go to: https://supabase.com/dashboard/project/sfkadunhnyaeycfdnvfv/sql

### Run this SQL:

```sql
-- Add new columns for multiple properties
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS properties_count INTEGER,
ADD COLUMN IF NOT EXISTS properties JSONB;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_referrals_properties_count 
ON referrals(properties_count);

-- Optional: Update existing records (if you have any)
UPDATE referrals 
SET properties_count = 1,
    properties = jsonb_build_array(
        jsonb_build_object(
            'propertyType', COALESCE(property_type, ''),
            'propertyLocation', COALESCE(property_location, ''),
            'managementInterest', COALESCE(management_interest, ''),
            'currentlyListed', COALESCE(currently_listed, ''),
            'listingLinks', COALESCE(listing_links, '')
        )
    )
WHERE properties IS NULL;
```

---

## 🔧 Update API Endpoint

The API endpoint at `src/app/api/referral/route.ts` needs to handle the new properties array.

**Current payload structure:**
```typescript
{
  linkId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  propertiesCount: number,        // NEW
  properties: Array<{             // NEW
    propertyType: string,
    propertyLocation: string,
    managementInterest: string,
    currentlyListed: string,
    listingLinks: string
  }>,
  // ... tracking fields
}
```

Make sure your API route saves the `properties` array to the database.

---

## ✅ Test Your Deployment

### 1. Visit Your Live URL
Go to: `https://your-project.vercel.app/refer/[your-slug]`

### 2. Test the Form
- Fill in your contact info
- Add 2-3 properties
- Test the "Add Property" button
- Test the remove button
- Submit the form

### 3. Verify in Supabase
- Go to Supabase → Table Editor → referrals
- Check that your test submission appears
- Verify the `properties` JSONB column has your data

---

## 🎯 Your Live URLs

After deployment, your URLs will be:

- **Main App**: `https://your-project.vercel.app`
- **Referral Form**: `https://your-project.vercel.app/refer/[slug]`
- **Dashboard**: `https://your-project.vercel.app/affiliate/dashboard`

Replace `your-project` with your actual Vercel project name.

---

## 🔄 Auto-Deployments

Now that you're connected to Vercel:

- **Every push to `v2` branch** = Automatic deployment
- **Pull requests** = Preview deployment
- **No manual steps needed** = Just push code!

---

## 📱 What You Just Deployed

### New Features:
✅ Property owner-focused form  
✅ Dynamic multiple properties (up to 10)  
✅ Emerald green color theme  
✅ Add/remove property cards  
✅ Individual property details  
✅ Enhanced UX and validation  
✅ Mobile responsive  
✅ Professional success states  

### Form Fields Per Property:
- Property Type (dropdown)
- Property Location (City, State)
- Management Services Interest (dropdown)
- Currently Listed Status (dropdown)
- Listing Links/Details (optional)

---

## 🆘 Troubleshooting

### Build Failed?
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Form Not Submitting?
- Check Vercel function logs
- Verify Supabase connection
- Ensure database schema is updated
- Check browser console for errors

### Database Errors?
- Run the SQL migration above
- Check Supabase API keys are correct
- Verify RLS policies allow inserts

---

## 📞 Need Help?

1. **Check Vercel Logs**: Dashboard → Your Project → Functions → Logs
2. **Check Supabase Logs**: Dashboard → Logs → API Logs
3. **Browser Console**: F12 → Console tab
4. **Review Documentation**: See `DEPLOYMENT.md` for detailed guide

---

## 🎉 You're Live!

Once deployed and tested:

1. ✅ Share the URL with your team
2. ✅ Test with real property owner scenarios
3. ✅ Monitor submissions in Supabase
4. ✅ Set up email notifications (optional)
5. ✅ Configure custom domain (optional)

**Your form is now live and ready to collect property owner leads!** 🚀

