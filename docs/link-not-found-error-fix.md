# "Link not found" Error Fix

**Date**: December 22, 2025  
**Error**: "Link not found." when trying to publish landing page  
**Component**: Landing Page Builder  
**API**: `/api/landing-pages`

---

## Issue

When clicking "Publish" in the landing page builder, you receive the error: **"Link not found."**

---

## Root Causes

### 1. Authentication Issue (Most Common)
The user is not properly authenticated when trying to save the landing page.

### 2. Missing Affiliate Link
The affiliate link doesn't exist in the `affiliate_links` table.

### 3. RLS Policy Blocking Query
Row Level Security policy prevents the query from finding the link.

### 4. Ownership Mismatch
The logged-in user doesn't own the affiliate link they're trying to edit.

---

## Solution Applied

### Enhanced Authentication & Authorization

The API endpoint now:
1. ✅ Checks if user is authenticated
2. ✅ Verifies the affiliate link exists
3. ✅ Confirms user owns the link
4. ✅ Provides detailed error messages

### Code Changes

**Before:**
```typescript
// No auth check
const { data: link } = await supabase
    .from('affiliate_links')
    .select('id')
    .eq('id', linkId)
    .single();

if (!link) {
    return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
}
```

**After:**
```typescript
// Check authentication first
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
}

// Verify link exists and user owns it
const { data: link, error: linkError } = await supabase
    .from('affiliate_links')
    .select('id, affiliate_id')
    .eq('id', linkId)
    .single();

// Detailed error messages
if (linkError) {
    return NextResponse.json({ 
        error: `Link not found: ${linkError.message}`,
        details: linkError 
    }, { status: 404 });
}

// Check ownership
if (link.affiliate_id !== user.id) {
    return NextResponse.json({ 
        error: 'Forbidden. You do not have permission to edit this link.' 
    }, { status: 403 });
}
```

---

## Possible Error Messages Now

### "Unauthorized. Please log in."
**Cause**: User is not authenticated  
**Fix**: Log in to your account

### "Link not found: [detailed message]"
**Cause**: Affiliate link doesn't exist in database  
**Fix**: 
1. Check the link ID in the URL
2. Verify link exists in Supabase `affiliate_links` table
3. Create the affiliate link if missing

### "Forbidden. You do not have permission to edit this link."
**Cause**: User doesn't own this affiliate link  
**Fix**: 
1. Log in with the correct account
2. Verify `affiliate_id` matches your user ID

---

## Debugging Steps

### 1. Check Browser Console
Open DevTools (F12) → Console tab

Look for detailed error messages:
```
Attempting to save landing page for linkId: xxx by user: yyy
```

### 2. Verify Authentication
```typescript
// In browser console
fetch('/api/landing-pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkId: 'your-link-id', sections: [], publish: false })
})
.then(r => r.json())
.then(console.log)
```

### 3. Check Supabase Data

**Verify affiliate link exists:**
```sql
SELECT id, name, affiliate_id, slug 
FROM affiliate_links 
WHERE id = 'your-link-id';
```

**Check your user ID:**
```sql
SELECT id, email 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

**Verify ownership:**
```sql
SELECT 
    al.id,
    al.name,
    al.affiliate_id,
    au.email as owner_email
FROM affiliate_links al
JOIN auth.users au ON au.id = al.affiliate_id
WHERE al.id = 'your-link-id';
```

### 4. Check Vercel Logs

If deployed:
- Go to Vercel Dashboard
- Navigate to your project
- Click "Functions" → "Logs"
- Look for console.log messages

---

## Common Scenarios

### Scenario 1: Not Logged In

**Error**: "Unauthorized. Please log in."

**Solution:**
1. Navigate to `/login`
2. Log in with your affiliate account
3. Return to the builder
4. Try publishing again

### Scenario 2: Link Doesn't Exist

**Error**: "Link not found: [message]"

**Solution:**
1. Go to Supabase Table Editor
2. Open `affiliate_links` table
3. Check if link with that ID exists
4. If not, create it or use correct link ID

### Scenario 3: Wrong Account

**Error**: "Forbidden. You do not have permission to edit this link."

**Solution:**
1. Log out
2. Log in with the account that owns the link
3. Or update the link's `affiliate_id` to your user ID

### Scenario 4: RLS Policy Issue

**Error**: "Link not found: new row violates row-level security policy"

**Solution:**
Check RLS policies on `landing_pages` table:

```sql
-- View policies
SELECT * FROM pg_policies 
WHERE tablename = 'landing_pages';

-- Temporarily disable for testing (DEV ONLY)
ALTER TABLE landing_pages DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
```

---

## Prevention

### For Developers

1. **Always check authentication** in API endpoints
2. **Verify ownership** before allowing modifications
3. **Provide detailed error messages** for debugging
4. **Log important operations** for troubleshooting

### For Users

1. **Stay logged in** while using the builder
2. **Use correct account** that owns the link
3. **Check URL** to ensure correct link ID
4. **Refresh page** if session expires

---

## Testing After Fix

### 1. Test Authentication
- Log out
- Try to publish → Should see "Unauthorized"
- Log in
- Try to publish → Should work

### 2. Test Ownership
- Log in as different user
- Try to edit someone else's link
- Should see "Forbidden" error

### 3. Test Valid Save
- Log in as link owner
- Make changes to landing page
- Click "Publish"
- Should see "saved" state
- Verify in Supabase `landing_pages` table

---

## Files Modified

- `src/app/api/landing-pages/route.ts` - Added authentication and ownership checks
- `docs/link-not-found-error-fix.md` - This documentation

---

## Related Issues

- See `docs/landing-page-save-error-fix.md` for general save errors
- See `DEPLOYMENT.md` for deployment configuration

---

## Quick Fix Checklist

- [ ] User is logged in
- [ ] Affiliate link exists in database
- [ ] User owns the affiliate link (affiliate_id matches)
- [ ] RLS policies allow the operation
- [ ] Browser has valid session cookies
- [ ] No console errors in browser
- [ ] Vercel logs show no errors

---

## Summary

The "Link not found" error is now fixed with:
- ✅ Proper authentication checks
- ✅ Ownership verification
- ✅ Detailed error messages
- ✅ Better logging for debugging

Try publishing again - you should now see a more specific error message if something is wrong!

