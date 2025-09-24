# Host Data Migration Plan

## Overview
This document outlines the migration of host-related fields from the App Properties collection to the new App Hosts collection in Webflow, and the corresponding Supabase schema changes.

## Webflow Collections Analysis

### App Hosts Collection (Target)
**Collection ID:** `648b412e0dd8223596041179`
**Fields:**
- `name` (PlainText, Required)
- `slug` (PlainText, Required)
- `first-name` (PlainText)
- `last-name` (PlainText)
- `card-image` (Image)
- `hero-image` (Image)
- `agent-location` (PlainText)
- `short-bio` (PlainText)
- `vacation-image-first` (Image)
- `vacation-image-second` (Image)
- `email` (Email)
- `phone` (Phone)
- `instagram-link` (Link)
- `facebook-link` (Link)
- `linkedin-link` (Link)
- `youtube-link` (Link)

### App Properties Collection (Source)
**Collection ID:** `648b412e0dd822359604117b`
**Host-related fields to migrate:**
- `agent-managing-this-location` (Reference to App Hosts)
- `super-host` (Switch)
- `plus-host` (Switch)
- `premium-host` (Switch)
- `verified-host` (Switch)
- `accolade-icon` (Image)
- `host-accolades-switch-2` (Switch)
- `host-accolade-image-switch` (Switch)
- `account-owner` (PlainText)
- `whalesync-postgres-id` (PlainText)

## Migration Strategy

### 1. Supabase Schema Changes
- ✅ Rename `hosts` table to `app_hosts`
- ✅ Add new fields matching Webflow App Hosts collection
- ✅ Add host-related fields from App Properties
- ✅ Update foreign key references
- ✅ Update RLS policies and triggers

### 2. Data Migration Steps

#### Step 1: Create App Hosts Records
For each unique host referenced in App Properties:
1. Extract host information from `agent-managing-this-location` field
2. Create new App Host record with:
   - Basic info (name, email, phone, etc.)
   - Host-specific fields (super_host, plus_host, etc.)
   - Social media links
   - Bio and location info

#### Step 2: Update App Properties References
1. Update `agent-managing-this-location` to reference new App Host records
2. Remove host-specific fields from App Properties (they'll be in App Hosts now)

#### Step 3: Sync with Supabase
1. Create corresponding records in `app_hosts` table
2. Update `property_hosts` junction table
3. Remove host fields from properties table

## Fields Mapping

### From App Properties to App Hosts
| App Properties Field | App Hosts Field | Type |
|---------------------|-----------------|------|
| `agent-managing-this-location` | Reference | Reference |
| `super-host` | `super_host` | Boolean |
| `plus-host` | `plus_host` | Boolean |
| `premium-host` | `premium_host` | Boolean |
| `verified-host` | `verified_host` | Boolean |
| `accolade-icon` | `accolade_icon_url` | Image URL |
| `host-accolades-switch-2` | `host_accolades_switch` | Boolean |
| `host-accolade-image-switch` | `host_accolade_image_switch` | Boolean |
| `account-owner` | `account_owner` | Text |
| `whalesync-postgres-id` | `whalesync_postgres_id` | Text |

### New App Hosts Fields (to be populated)
| Field | Type | Source |
|-------|------|--------|
| `name` | Text | From existing host data |
| `slug` | Text | Generated from name |
| `first-name` | Text | To be collected |
| `last-name` | Text | To be collected |
| `card-image` | Image | To be uploaded |
| `hero-image` | Image | To be uploaded |
| `agent-location` | Text | To be collected |
| `short-bio` | Text | To be collected |
| `email` | Email | To be collected |
| `phone` | Phone | To be collected |
| `instagram-link` | Link | To be collected |
| `facebook-link` | Link | To be collected |
| `linkedin-link` | Link | To be collected |
| `youtube-link` | Link | To be collected |

## Implementation Notes

1. **Data Preservation**: All existing host data will be preserved during migration
2. **Reference Integrity**: Property-host relationships will be maintained
3. **Backward Compatibility**: Existing API endpoints will continue to work
4. **Gradual Migration**: Migration can be done incrementally without downtime

## Next Steps

1. ✅ Update Supabase schema
2. 🔄 Create migration scripts
3. ⏳ Execute migration in development environment
4. ⏳ Test data integrity
5. ⏳ Deploy to production
6. ⏳ Update Webflow collections
7. ⏳ Sync data between Webflow and Supabase

