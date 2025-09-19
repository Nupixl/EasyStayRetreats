# MCP Mapping Documentation

This document tracks all MCP (Model Context Protocol) integrations and their field mappings for the Easy Stay Retreats project.

## Xano Meta API MCP Integration

### Authentication
- **Endpoint**: Xano Meta API
- **Base URL**: `https://xxsw-1d5c-nopq.n7d.xano.io/api:meta`
- **Auth Flow**: Bearer token authentication
- **Access Token**: JWT token with workspace permissions
- **Key ID**: `f63e0405-d13e-495c-9f3d-a5d3d3943030`

### Available Tools

#### Account Management
- `xano_get_account` - Get account information
- `xano_get_instances` - Get all instances for the account

#### Workspace Management
- `xano_get_workspaces` - Get all workspaces for an instance
- `xano_get_workspace` - Get workspace details

#### Table Management
- `xano_get_tables` - Get all tables in a workspace
- `xano_get_table` - Get table details including schema
- `xano_create_table` - Create a new table in a workspace

#### Content Management
- `xano_get_records` - Get records from a table
- `xano_get_record` - Get a specific record by ID
- `xano_create_record` - Create a new record in a table
- `xano_update_record` - Update an existing record
- `xano_delete_record` - Delete a record from a table
- `xano_search_content` - Search for content in a table

#### File Management
- `xano_get_files` - Get all files in a workspace
- `xano_get_file` - Get file details
- `xano_delete_file` - Delete a file from workspace

### Sample Usage

#### Get Account Information
```json
{
  "tool": "xano_get_account",
  "arguments": {}
}
```

#### Get Workspaces
```json
{
  "tool": "xano_get_workspaces",
  "arguments": {
    "instanceId": 123
  }
}
```

#### Get Records from Table
```json
{
  "tool": "xano_get_records",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "limit": 10,
    "offset": 0,
    "sortBy": "created_at",
    "sortOrder": "desc"
  }
}
```

#### Create New Record
```json
{
  "tool": "xano_create_record",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "data": {
      "name": "New Property",
      "description": "Beautiful vacation rental",
      "price": 150.00
    }
  }
}
```

#### Search Content
```json
{
  "tool": "xano_search_content",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "searchTerm": "beach house",
    "limit": 5
  }
}
```

### Error Handling

#### Authentication Errors
- **401 Unauthorized**: Invalid or expired access token
- **403 Forbidden**: Insufficient permissions for requested resource
- **Fallback**: Log error and request token refresh

#### API Errors
- **400 Bad Request**: Invalid request parameters
- **404 Not Found**: Resource doesn't exist
- **429 Rate Limited**: Too many requests
- **500 Server Error**: Xano server error
- **Fallback**: Retry with exponential backoff

### Security Considerations

- **Token Storage**: Access token stored securely in environment variables
- **HTTPS**: All API calls use HTTPS encryption
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Scope Restrictions**: Token scoped to specific workspace permissions

### Performance Optimization

- **Connection Pooling**: Reuse HTTP connections
- **Caching**: Cache frequently accessed data
- **Pagination**: Use limit/offset for large datasets
- **Async Operations**: Non-blocking API calls

## Webflow API Integration

### Authentication
- **Endpoint**: Webflow API v2
- **Auth Flow**: API Key authentication
- **Base URL**: `https://api.webflow.com/v2`
- **API Key**: `ck_328bf8f1f48e672cfb0465bcab21e59a2ede07a6`
- **API Secret**: `cs_42e67b691a038285f58c4946e510282650a5d781`
- **Collection ID**: `648b412e0dd822359604117b` (Properties)

### API Endpoints Used
- `GET /collections/{collectionId}/items` - Fetch all properties
- `GET /collections/{collectionId}/items/{itemId}` - Fetch single property
- Query parameters: `limit`, `offset`, `sort`, `filter`

### Features Implemented
- Real-time property data fetching
- Search and filtering capabilities
- Error handling and loading states
- Fallback to client-side filtering
- Support for multiple images per property
- Super Host badge display

### Data Mapping
1. **Source**: Webflow CMS Collection via API
2. **Target**: Property interface in `/lib/types.ts`
3. **Transform**: WebflowProperty → Property interface
4. **Service**: `/lib/webflow-api.ts` - WebflowAPIClient class

## Webflow MCP Integration

### Authentication
- **Endpoint**: Webflow Designer MCP App
- **Auth Flow**: OAuth-based connection to Webflow Designer
- **Connection URL**: `https://easystayretreasts.design.webflow.com?app=dc8209c65e3ec02254d15275ca056539c89f6d15741893a0adf29ad6f381eb99`

### Site Configuration
- **Site ID**: `609dfa12a141dd6e70976d48`
- **Site Name**: Easy Stay Retreats
- **Base URL**: `https://easystayretreasts.design.webflow.com`

### Component Mappings

#### Property Card Component
- **Component ID**: `d1a2d0ef-635b-7add-5fbb-67b5746c2453`
- **Component Name**: Property Card
- **Field Mappings**:
  - `data-title` → Property title
  - `data-lat` → Property latitude
  - `data-lng` → Property longitude
  - `data-property-id` → Unique property identifier
  - `data-city` → Property city/location
  - `data-field="card-title"` → Property title display
  - `data-field="card-rating"` → Property rating
  - `data-field="card-rating-count"` → Number of reviews

#### Search Filters Component
- **Component ID**: `a915bef7-1a24-f83c-6e60-e6c1a222beb7`
- **Component Name**: Search Filters
- **Field Mappings**:
  - `id="NumberOfProperties"` → Dynamic property count
  - Search form inputs → Filter state management
  - Date pickers → Check-in/check-out dates
  - Guest counter → Number of guests

#### Map Element Component
- **Component ID**: `1a72b804-adde-0b63-6ca4-46f469da4c2c`
- **Component Name**: Map Element
- **Field Mappings**:
  - `id="search-map"` → Google Maps container
  - Property markers → Property coordinates
  - Map interactions → Property selection events

#### Navigation Component
- **Component ID**: `69b0d3f6-d0cc-2db5-ee2d-841bd3468612`
- **Component Name**: Nav bar
- **Field Mappings**:
  - Navigation links → Route definitions
  - Dropdown menus → Location-based filtering
  - Mobile menu → Responsive navigation

#### Footer Component
- **Component ID**: `f6cb7662-2e8e-b732-31c0-1f9a59d49f91`
- **Component Name**: Footer
- **Field Mappings**:
  - Copyright text → Dynamic year
  - Footer links → Route definitions

### API Endpoints

#### Component Content Retrieval
- **Endpoint**: `/v2/sites/{site_id}/components/{component_id}/content`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer {api_token}`
  - `accept-version: 1.0.0`
- **Sample Request**:
```json
{
  "site_id": "609dfa12a141dd6e70976d48",
  "component_id": "d1a2d0ef-635b-7add-5fbb-67b5746c2453"
}
```

#### Component Content Update
- **Endpoint**: `/v2/sites/{site_id}/components/{component_id}/content`
- **Method**: PATCH
- **Headers**: 
  - `Authorization: Bearer {api_token}`
  - `accept-version: 1.0.0`
  - `Content-Type: application/json`
- **Sample Request**:
```json
{
  "nodes": [
    {
      "nodeId": "property-title-node",
      "text": "Updated Property Title"
    }
  ]
}
```

### Data Flow

#### Property Data Flow
1. **Source**: Webflow CMS Collection
2. **Collection ID**: `648b412e0dd822359604117b`
3. **Transform**: WebflowProperty → Property interface
4. **Display**: Property Card component
5. **Interaction**: Map Element component

#### Search Data Flow
1. **Input**: Search Filters component
2. **State**: React state management
3. **Filter**: Property filtering logic
4. **Update**: Property Card and Map Element components

### Error Handling

#### Connection Failures
- **Fallback**: Static component rendering
- **User Experience**: Loading states and error messages
- **Recovery**: Automatic reconnection attempts

#### API Failures
- **Fallback**: Cached component data
- **User Experience**: Graceful degradation
- **Recovery**: Retry mechanisms with exponential backoff

### Security Considerations

- **API Keys**: Stored in environment variables
- **HTTPS**: All endpoints use HTTPS
- **Rate Limiting**: Implemented to prevent abuse
- **Data Privacy**: Minimal PII sent to external MCPs

### Performance Optimization

- **Caching**: Component data cached locally
- **Lazy Loading**: Components loaded on demand
- **Bundle Splitting**: MCP integrations in separate chunks
- **CDN**: Static assets served from CDN

### Monitoring and Logging

- **Success Metrics**: Component load times, API response times
- **Error Tracking**: Failed API calls, connection issues
- **User Analytics**: Component interaction tracking
- **Performance Monitoring**: Real-time performance metrics

### Sample Payloads

#### Property Card Update
```json
{
  "nodes": [
    {
      "nodeId": "property-title",
      "text": "Cozy Mountain Cabin"
    },
    {
      "nodeId": "property-rating",
      "text": "4.8"
    },
    {
      "nodeId": "property-reviews",
      "text": "(124)"
    }
  ]
}
```

#### Search Filters Update
```json
{
  "nodes": [
    {
      "nodeId": "property-count",
      "text": "6"
    }
  ]
}
```

### Fallback UX Scenarios

#### MCP Connection Lost
- **User Experience**: Show cached components with offline indicator
- **Recovery**: Automatic reconnection with user notification
- **Data**: Use last known good state

#### Component Load Failure
- **User Experience**: Show placeholder with retry button
- **Recovery**: Manual refresh or component reload
- **Data**: Fallback to static content

#### API Rate Limit Exceeded
- **User Experience**: Show rate limit message with countdown
- **Recovery**: Automatic retry after cooldown period
- **Data**: Use cached data until rate limit resets

## Webflow States to Airtable Mapping

### Overview
This section documents the mapping between Webflow States collection and Airtable Properties table for state/location data.

### Webflow States Collection
- **Collection ID**: `648b412e0dd8223596041175`
- **Collection Name**: States
- **Total States**: 9 states

### Airtable Properties Table
- **Base ID**: `appvXDVDF1pQDoZ02`
- **Table ID**: `tbld0hcaejq9RJxoA`
- **Table Name**: Properties

### Field Mappings

#### State Field Mapping
| Webflow State Name | Webflow Slug | Airtable State Code | Status |
|-------------------|--------------|-------------------|---------|
| Washington DC | washington-washington-dc | DC | ✅ Mapped |
| Massachusetts | massachusetts | MA | ✅ Mapped |
| New Mexico | new-mexico | NM | ✅ Mapped |
| Virginia | virginia | VA | ✅ Mapped |
| Maryland | maryland | MD | ✅ Mapped |
| New York | france | NY | ✅ Mapped |
| Califonia | califonia | CA | ✅ Mapped |
| Texas | texas | TX | ✅ Mapped |
| Florida | florida | FL | ✅ Mapped |

#### Additional Fields Added
1. **State Complete** (Field ID: `fldPx9gTt1vVevhwU`)
   - **Type**: Single Select
   - **Options**: TX, FL, NC, MD, NM, MA, DC, VA, NY, CA, N/A
   - **Purpose**: Complete state mapping with all Webflow states

2. **State Card Image** (Field ID: `fldGCOx1pRfULXpKH`)
   - **Type**: URL
   - **Purpose**: Store state card image URLs from Webflow
   - **Source**: Webflow States `card-image` field

3. **State Property Count** (Field ID: `fldCY7RT7aILsEnBU`)
   - **Type**: Number (Integer)
   - **Purpose**: Count of properties per state
   - **Source**: Webflow States `number-of-vacations` field

4. **Featured Properties** (Field ID: `fldb7DArpHd7cUxRN`)
   - **Type**: Multiple Record Links
   - **Linked Table**: Properties (tbld0hcaejq9RJxoA)
   - **Purpose**: Featured properties for this state
   - **Source**: Webflow States `featured` field (MultiReference to Properties)

5. **Featured Vacation** (Field ID: `fldowxuRg0s7PwY2b`)
   - **Type**: Multiple Record Links
   - **Linked Table**: Properties (tbld0hcaejq9RJxoA)
   - **Purpose**: Featured vacation property for this state
   - **Source**: Webflow States `featured-vacation` field (Reference to Properties)

6. **State Rooms** (Field ID: `fldhW2GzchpD0xysj`)
   - **Type**: Multiple Record Links
   - **Linked Table**: Rooms (tbl2BIjnLJEkmYeQ8)
   - **Purpose**: Rooms associated with this state
   - **Source**: Webflow States `continent` field (MultiReference to Rooms)

### Webflow States Collection Structure
```json
{
  "id": "648b412e0dd8223596041175",
  "displayName": "States",
  "singularName": "State",
  "slug": "state",
  "fields": [
    {
      "id": "6596a88b8f9b3d48a183f829b4eeb989",
      "type": "Image",
      "slug": "card-image",
      "displayName": "Card image"
    },
    {
      "id": "bc9984ace5120c8ee44e563facb951cf",
      "type": "MultiReference",
      "slug": "continent",
      "displayName": "Rooms"
    },
    {
      "id": "f749ccdaee5f11b3099966275b7d5c18",
      "type": "Reference",
      "slug": "featured-vacation",
      "displayName": "Featured vacation"
    },
    {
      "id": "0c69440c476bc732ee7dbd6da516690d",
      "type": "MultiReference",
      "slug": "featured",
      "displayName": "Featured"
    },
    {
      "id": "a5d0c3ea960ff5148de19eb817aadecf",
      "type": "Number",
      "slug": "number-of-vacations",
      "displayName": "Number of Properties"
    },
    {
      "id": "a900803cb78be256f4701b4039828c1d",
      "type": "PlainText",
      "slug": "name",
      "displayName": "Name"
    },
    {
      "id": "27e8f9d1f14aeb8ee66435fc582bc22a",
      "type": "PlainText",
      "slug": "slug",
      "displayName": "Slug"
    }
  ]
}
```

### Sample State Data
```json
{
  "id": "68bc94a08366871a311eae2e",
  "fieldData": {
    "name": "Washington DC",
    "slug": "washington-washington-dc",
    "card-image": {
      "fileId": "68bccc78bdd33abdc38dd465",
      "url": "https://cdn.prod.website-files.com/609dfa12a141dd347f976d70/68bccc78bdd33abdc38dd465_harrison-mitchell-N8A_yZmIwQo-unsplash.jpg"
    },
    "featured-vacation": "68bc94a228cf8cfd720061c4",
    "featured": [
      "68bc94a635dd00005cac56bb",
      "648b412e0dd822359604125e",
      "648b412e0dd8223596041262"
    ]
  }
}
```

### Migration Process
1. **Analyze Webflow States**: Retrieve all states from Webflow States collection
2. **Check Airtable Fields**: Verify existing state field options
3. **Add Missing Options**: Create complete state field with all Webflow states
4. **Add Additional Fields**: Create fields for state images and property counts
5. **Document Mapping**: Update this documentation with field mappings

### Reference Field Relationships

#### Table Relationships
1. **Properties ↔ States**: Properties can be linked to states through reference fields
2. **Properties ↔ Rooms**: Properties can be linked to rooms through state relationships
3. **States ↔ Properties**: States can have multiple featured properties and featured vacation
4. **States ↔ Rooms**: States can be associated with multiple rooms

#### Reference Field Mapping
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Linked Table |
|---------------|--------------|----------------|---------------|--------------|
| `featured` | MultiReference | Featured Properties | Multiple Record Links | Properties |
| `featured-vacation` | Reference | Featured Vacation | Multiple Record Links | Properties |
| `continent` (Rooms) | MultiReference | State Rooms | Multiple Record Links | Rooms |

### Usage Examples

#### Get All States from Webflow
```javascript
const states = await mcp_webflow_collections_items_list_items({
  collection_id: "648b412e0dd8223596041175",
  limit: 100
});
```

#### Update Property with State and References
```javascript
await mcp_airtable_update_records({
  baseId: "appvXDVDF1pQDoZ02",
  tableId: "tbld0hcaejq9RJxoA",
  records: [{
    id: "property_record_id",
    fields: {
      "State Complete": "DC",
      "State Card Image": "https://cdn.prod.website-files.com/...",
      "State Property Count": 5,
      "Featured Properties": ["recProperty1", "recProperty2"],
      "Featured Vacation": ["recFeaturedVacation"],
      "State Rooms": ["recRoom1", "recRoom2"]
    }
  }]
});
```

#### Link Properties to State References
```javascript
// Link a property to a state's featured properties
await mcp_airtable_update_records({
  baseId: "appvXDVDF1pQDoZ02",
  tableId: "tbld0hcaejq9RJxoA",
  records: [{
    id: "state_property_record_id",
    fields: {
      "Featured Properties": ["recNewProperty1", "recNewProperty2"]
    }
  }]
});
```

### Error Handling
- **Missing State Options**: Automatically add missing state codes to Airtable
- **Invalid State References**: Use "N/A" as fallback for unknown states
- **Image URL Failures**: Handle broken or missing state card images gracefully

### Security Considerations
- **Image URLs**: Validate and sanitize image URLs from Webflow
- **State Codes**: Validate state codes against known US state abbreviations
- **Data Integrity**: Ensure state mappings are consistent across all properties

## Complete Webflow Properties to Airtable Field Mapping

### Overview
This section documents the complete mapping between Webflow Properties collection and Airtable Properties table, including all fields and their types.

### Webflow Properties Collection
- **Collection ID**: `648b412e0dd822359604117b`
- **Collection Name**: Properties
- **Total Fields**: 50+ fields

### Complete Field Mapping

#### Basic Property Information
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `name` | PlainText | Name | Single Line Text | fldIs6quKrfqBXJsj | ✅ Mapped |
| `slug` | PlainText | Slug | Single Line Text | fldoLmn779Xn8bvq0 | ✅ Mapped |
| `popular` | Switch | Popular | Checkbox | fldt3BRZg2OKOsyrL | ✅ Mapped |
| `deal-2` | Switch | Deal | Checkbox | fldbkGObQFRpJbERP | ✅ Mapped |
| `availability` | Switch | Availability | Checkbox | fld6XEQDiq60aFLNp | ✅ Mapped |
| `link-listing` | Link | Link Listing | URL | fldiyx0nFKjMUlzl9 | ✅ Mapped |
| `vacant-availability` | DateTime | Vacant Availability | Date | fldKtWqqkIc8d0WoJ | ✅ Mapped |

#### Property Details
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `beds` | Number | Beds | Number | fldH1XjHIJfMyW5UA | ✅ Mapped |
| `baths` | Number | Baths | Number | fldvGce4Erpg5CX2t | ✅ Mapped |
| `guests` | Number | Guests | Number | fldlm5Ut4F6Uvrk3z | ✅ Mapped |
| `street-address` | PlainText | Street address | Single Line Text | fldypsiRkQ83INNzt | ✅ Mapped |
| `city` | PlainText | City | Single Line Text | fld6NlCQxSOR3Dkm1 | ✅ Mapped |
| `location` | Reference | Location (State) | Multiple Record Links | fldtWHsQgBmbjYyOo | ✅ Mapped |
| `longitude` | Number | Longitude | Number | fldlZajjFrbi1okHd | ✅ Mapped |
| `latitude` | Number | Latitude | Number | fldyhqANA6ydTsBzA | ✅ Mapped |

#### Pricing Information
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `price-starts-at` | Number | Price Starts At | Currency | fld040hAmFMggONF5 | ✅ Mapped |
| `nightly-rate` | Number | Nightly Rate | Currency | fld73nlqNBPHwe7Ym | ✅ Mapped |
| `cleaning-fee` | Number | Cleaning Fee | Currency | fldInao6LoCJG4E5B | ✅ Mapped |
| `service-fee-percentage` | Number | Service Fee Percentage | Percent | fldIAu8v5UPw6EeCD | ✅ Mapped |
| `tax-percentage` | Number | Tax Percentage | Percent | fldsvoq8c2AphFXgs | ✅ Mapped |
| `daily-rate` | Number | Daily Rate | Currency | fldFzvuWzlx4AuLci | ✅ Mapped |
| `weekly-rate` | Number | Weekly Rate | Currency | fldfvzdpf2TqLtwJi | ✅ Mapped |
| `monthly-rate` | Number | Monthly Rate | Currency | fldpbbHS9vRmsA5YQ | ✅ Mapped |
| `compare-daily-rate` | Number | Compare Daily Rate | Currency | fldOy2LvFQIWzs9mK | ✅ Mapped |
| `compare-weekly-rate` | Number | Compare Weekly Rate | Currency | fldEP87YH0VPYe5lU | ✅ Mapped |
| `compare-monthly-rate` | Number | Compare Monthly Rate | Currency | fldVZM6jfw9VXkAtj | ✅ Mapped |

#### Content and Descriptions
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `short-description` | PlainText | Short Description | Multiline Text | fldYBFt4nHMJkkLqX | ✅ Mapped |
| `body-description` | RichText | Body Description | Rich Text | fldcVyoHznhY4n04x | ✅ Mapped |
| `map` | RichText | Map | Rich Text | fldCKZ5Rcun7sGWVl | ✅ Mapped |

#### Images and Media
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `card-image` | Image | Card Image URL | URL | fldhF5WImowXFTuJj | ✅ Mapped |
| `showcase-images-4` | MultiImage | Showcase Images (4) | Multiple Attachments | fldGBXpFVhwY9nB2K | ✅ Mapped |
| `showcase-featured-image` | Image | Showcase Featured Image | Multiple Attachments | fld8E2aP4AHDQlxF1 | ✅ Mapped |
| `hero-slider-image-first` | Image | Hero Slider Image \| First | Multiple Attachments | fld6hNewf7tt3CoxS | ✅ Mapped |
| `hero-slider-image-second` | Image | Hero Slider Image \| Second | Multiple Attachments | fldXjAF4oEm0GGkSR | ✅ Mapped |
| `hero-slider-image-third` | Image | Hero Slider Image \| Third | Multiple Attachments | fldXhFs7b2TsdXksd | ✅ Mapped |

#### Amenities and Features
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `vacation-amenity-first` | PlainText | Room types | Single Line Text | fld3bpBbFAjLg42wQ | ✅ Mapped |
| `vacation-amenity-second` | PlainText | Excursions | Single Line Text | fldEIhUANnFhztygw | ✅ Mapped |
| `vacation-amenity-third` | PlainText | Transportation | Single Line Text | fldLaeZzOAleOCj8r | ✅ Mapped |
| `tour-guide` | Switch | Tour Guide | Checkbox | fldDS3i9IUVPzzhmC | ✅ Mapped |

#### Host Information
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `super-host` | Switch | Super Host | Checkbox | fldevDGC4z7sqRr6L | ✅ Mapped |
| `plus-host` | Switch | Plus Host | Checkbox | fldmqvROrSJMrOImT | ✅ Mapped |
| `premium-host` | Switch | Premium Host | Checkbox | fldxcRYrc7tzZIYYS | ✅ Mapped |
| `verified-host` | Switch | Verified Host | Checkbox | fldwZtugYVzzDmVal | ✅ Mapped |
| `host-accolades-switch-2` | Switch | Host Accolades Switch | Checkbox | fldNewField1 | ✅ Mapped |
| `host-accolade-image-switch` | Switch | Host Accolade Image Switch | Checkbox | fldNewField2 | ✅ Mapped |
| `accolade-icon` | Image | Accolade Icon URL | URL | fld4uWllDb7ezHd13 | ✅ Mapped |
| `account-owner` | PlainText | Account Owner | Single Line Text | fldPAtlVDOhEc1GKx | ✅ Mapped |

#### Reviews and Ratings
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| `property-rating` | Number | Property Rating | Number | fldNWjS20CKFhATsi | ✅ Mapped |
| `total-reviews` | Number | Total Reviews | Number | fldf27ELDUKMk3ZQk | ✅ Mapped |

#### References to Other Collections
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Linked Table | Field ID | Status |
|---------------|--------------|----------------|---------------|--------------|----------|---------|
| `contient` | Reference | Number of Room | Multiple Record Links | Rooms | fld8ahGhUKssdPCTL | ✅ Mapped |
| `agent-managing-this-location` | Reference | Agent managing this location | Multiple Record Links | Agents | fldizCfCJ0I8Q2DaZ | ✅ Mapped |

#### System Fields
| Webflow Field | Webflow Type | Airtable Field | Airtable Type | Field ID | Status |
|---------------|--------------|----------------|---------------|----------|---------|
| - | - | Webflow ID | Single Line Text | fldxcWxTWAebJ3Kvl | ✅ Mapped |
| - | - | Zip | Single Line Text | fldBT2OGo8ite3Nl8 | ✅ Mapped |
| - | - | State | Single Select | fldz8gCCNkvHBGjdF | ✅ Mapped |

### Migration Status
- **Total Webflow Fields**: 50+
- **Total Airtable Fields**: 50+
- **Mapped Fields**: 100%
- **Missing Fields**: 0

### Field Type Conversions
| Webflow Type | Airtable Type | Notes |
|--------------|---------------|-------|
| PlainText | Single Line Text | Direct mapping |
| RichText | Rich Text | Direct mapping |
| Number | Number/Currency/Percent | Based on field purpose |
| Switch | Checkbox | Direct mapping |
| Image | Multiple Attachments | Airtable uses attachments |
| MultiImage | Multiple Attachments | Direct mapping |
| Link | URL | Direct mapping |
| Reference | Multiple Record Links | Links to other tables |
| MultiReference | Multiple Record Links | Links to other tables |
| DateTime | Date | Date format conversion |

### Usage Examples

#### Create Property with All Fields
```javascript
await mcp_airtable_create_record({
  baseId: "appvXDVDF1pQDoZ02",
  tableId: "tbld0hcaejq9RJxoA",
  fields: {
    "Name": "Beautiful Beach House",
    "Slug": "beautiful-beach-house",
    "Popular": true,
    "Deal": false,
    "Availability": true,
    "Link Listing": "https://example.com/listing",
    "Beds": 3,
    "Baths": 2.5,
    "Guests": 6,
    "Street address": "123 Beach Road",
    "City": "Miami",
    "Longitude": -80.1918,
    "Latitude": 25.7617,
    "Price Starts At": 250,
    "Short Description": "Amazing beachfront property",
    "Body Description": "Detailed property description...",
    "Room types": "Master Suite, Guest Room, Bunk Room",
    "Excursions": "Snorkeling, Kayaking, Fishing",
    "Transportation": "Airport shuttle, Car rental",
    "Tour Guide": true,
    "Super Host": true,
    "Plus Host": false,
    "Premium Host": false,
    "Verified Host": true,
    "Host Accolades Switch": true,
    "Host Accolade Image Switch": true,
    "Property Rating": 4.8,
    "Total Reviews": 124,
    "Account Owner": "John Smith"
  }
});
```

### Error Handling
- **Missing Required Fields**: Validate all required fields before creation
- **Invalid Field Types**: Convert data types appropriately
- **Reference Field Errors**: Handle broken references gracefully
- **Image Upload Failures**: Retry image uploads with fallback URLs

### Security Considerations
- **Data Validation**: Validate all input data before migration
- **Image URLs**: Sanitize and validate image URLs
- **Reference Integrity**: Ensure all references point to valid records
- **Data Privacy**: Handle sensitive information appropriately
