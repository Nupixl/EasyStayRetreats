# Airtable Webhook Integration

**Date**: December 22, 2025  
**Integration**: Airtable Automation Webhook  
**Endpoint**: `/api/referral`

---

## Overview

The referral form now automatically sends submission data to Airtable via webhook for automated workflows and data management.

---

## Webhook Details

**Airtable Webhook URL:**
```
https://hooks.airtable.com/workflows/v1/genericWebhook/appgCDGkSJ1XpodGS/wflvULnylMNWY17o3/wtrfGQ2D49embpvMR
```

**Method:** POST  
**Content-Type:** application/json

---

## Payload Structure

### Data Sent to Airtable

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "propertiesCount": 3,
  "properties": [
    {
      "propertyType": "single-family",
      "propertyLocation": "Miami, FL",
      "managementInterest": "full-management",
      "currentlyListed": "yes-airbnb",
      "listingLinks": "https://airbnb.com/..."
    },
    {
      "propertyType": "condo",
      "propertyLocation": "Orlando, FL",
      "managementInterest": "cleaning-maintenance",
      "currentlyListed": "no",
      "listingLinks": ""
    }
  ],
  "listingLinks": "Additional links if provided",
  "companySource": "EasyStay",
  "submittedAt": "2025-12-22T10:30:00.000Z",
  "timeToComplete": 120,
  "referralId": "uuid-from-supabase"
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `firstName` | string | Property owner's first name |
| `lastName` | string | Property owner's last name |
| `email` | string | Contact email address |
| `phone` | string | Contact phone number |
| `propertiesCount` | number | Total number of properties submitted |
| `properties` | array | Array of property objects with details |
| `listingLinks` | string | Additional listing URLs or notes |
| `companySource` | string | Source company (default: "EasyStay") |
| `submittedAt` | string | ISO timestamp of submission |
| `timeToComplete` | number | Seconds taken to complete form |
| `referralId` | string | UUID from Supabase referrals table |

### Properties Array Structure

Each property object contains:
```json
{
  "propertyType": "single-family | condo | townhouse | multi-unit | vacation-home | other",
  "propertyLocation": "City, State",
  "managementInterest": "full-management | guest-communication | cleaning-maintenance | listing-optimization | consultation",
  "currentlyListed": "yes-airbnb | yes-vrbo | yes-multiple | no",
  "listingLinks": "URLs or additional details"
}
```

---

## Implementation Details

### API Flow

1. **User submits form** → Frontend sends data to `/api/referral`
2. **Save to Supabase** → Data stored in `referrals` table
3. **Send to Airtable** → Webhook triggered with payload
4. **Increment counter** → Update affiliate link stats
5. **Return success** → User sees confirmation

### Error Handling

The Airtable webhook is **non-blocking**:
- If Airtable fails, the form submission still succeeds
- Errors are logged to console but don't affect user experience
- Supabase data is always saved first (primary source of truth)

```typescript
try {
    // Send to Airtable
    const airtableResponse = await fetch(webhookUrl, {...});
    
    if (!airtableResponse.ok) {
        console.error('Airtable webhook failed:', await airtableResponse.text());
    }
} catch (airtableError) {
    // Don't fail the whole request
    console.error('Error sending to Airtable:', airtableError);
}
```

---

## Airtable Setup

### Recommended Airtable Base Structure

**Table: Property Referrals**

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Referral ID | Single line text | UUID from Supabase |
| First Name | Single line text | Owner's first name |
| Last Name | Single line text | Owner's last name |
| Email | Email | Contact email |
| Phone | Phone number | Contact phone |
| Properties Count | Number | Total properties |
| Properties JSON | Long text | JSON array of properties |
| Company Source | Single select | EasyStay, etc. |
| Submitted At | Date | Submission timestamp |
| Time to Complete | Number | Seconds |
| Status | Single select | New, Contacted, Qualified, etc. |

### Automation Workflow

The webhook can trigger Airtable automations:

1. **Create Record** - Add new referral to table
2. **Send Email** - Notify sales team
3. **Update Status** - Set to "New"
4. **Assign Owner** - Round-robin to team members
5. **Create Tasks** - Follow-up reminders
6. **Sync to CRM** - Push to external system

---

## Testing

### Test Webhook Locally

```bash
# Run dev server
npm run dev

# Submit test form at:
http://localhost:3000/refer/[your-slug]
```

### Verify in Airtable

1. Go to your Airtable base
2. Check the table for new record
3. Verify all fields populated correctly
4. Check automation history

### Check Logs

**Vercel Logs** (Production):
- Dashboard → Functions → Logs
- Search for "Airtable webhook"

**Local Console** (Development):
- Check terminal for log messages
- "Successfully sent to Airtable webhook" = success
- "Airtable webhook failed" = error

---

## Troubleshooting

### Webhook Not Receiving Data

**Check:**
1. Webhook URL is correct
2. Airtable automation is enabled
3. Network allows outbound requests
4. Check Vercel function logs

**Test manually:**
```bash
curl -X POST https://hooks.airtable.com/workflows/v1/genericWebhook/appgCDGkSJ1XpodGS/wflvULnylMNWY17o3/wtrfGQ2D49embpvMR \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
```

### Data Not Appearing in Airtable

**Possible causes:**
1. Automation is paused
2. Field mapping incorrect
3. Webhook URL changed
4. Rate limit reached

**Solution:**
- Check Airtable automation history
- Verify webhook configuration
- Review field mappings

### Partial Data Received

**Check:**
- Airtable field types match payload
- Long text fields for JSON data
- Number fields for numeric values
- Date fields properly formatted

---

## Security Considerations

### Webhook Security

- Webhook URL is public but unique
- No sensitive data exposed in URL
- Airtable validates webhook token
- Data is sent over HTTPS

### Data Privacy

- Only necessary data sent to Airtable
- No passwords or sensitive credentials
- Complies with data handling policies
- User consents to data collection

### Best Practices

1. **Monitor webhook usage** - Check Airtable automation runs
2. **Set up alerts** - Notify on failures
3. **Regular audits** - Review data flow
4. **Backup data** - Supabase is primary source
5. **Rate limiting** - Airtable has limits, monitor usage

---

## Monitoring & Analytics

### Key Metrics to Track

- **Success Rate**: % of successful webhook calls
- **Response Time**: Webhook latency
- **Failure Rate**: % of failed calls
- **Data Completeness**: All fields populated

### Airtable Reports

Create views to analyze:
- Daily submission count
- Properties per submission average
- Most common property types
- Geographic distribution
- Conversion funnel

---

## Future Enhancements

### Potential Additions

1. **Webhook Retry Logic** - Retry failed calls
2. **Queue System** - Buffer requests during high traffic
3. **Webhook Signature** - Add HMAC validation
4. **Multiple Webhooks** - Send to different systems
5. **Conditional Webhooks** - Based on property count, location, etc.
6. **Webhook Analytics** - Track success/failure rates
7. **Real-time Sync** - Bi-directional data sync

---

## Files Modified

- `src/app/api/referral/route.ts` - Added Airtable webhook integration
- `docs/airtable-webhook-integration.md` - This documentation

---

## Related Documentation

- `docs/property-owner-form-redesign.md` - Form structure
- `docs/dynamic-multiple-properties-feature.md` - Properties array details
- `docs/form-tracking-system.md` - Form analytics

---

## Support

**Airtable Issues:**
- Check Airtable automation logs
- Verify webhook URL is active
- Contact Airtable support if needed

**Integration Issues:**
- Check Vercel function logs
- Review API endpoint code
- Test webhook manually with curl

---

## Summary

✅ Form data automatically sent to Airtable  
✅ Non-blocking integration (won't break form)  
✅ Complete property details included  
✅ Timestamp and tracking data included  
✅ Error handling and logging implemented  
✅ Ready for Airtable automation workflows  

Your referral submissions now flow directly into Airtable for automated processing! 🎉

