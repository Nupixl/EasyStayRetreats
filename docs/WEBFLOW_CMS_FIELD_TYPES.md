# Webflow CMS Field Types Guide

## Overview

This guide explains how to ensure your Webflow CMS fields are properly configured to use Rich Text Format (RTF) instead of HTML for body descriptions and property features.

## Field Types in Webflow CMS

### 1. Rich Text Field (RTF) ✅ **RECOMMENDED**
- **Purpose**: Long-form content with formatting (headings, lists, bold, italic, etc.)
- **Behavior**: Automatically converts content to HTML for display
- **Use Cases**: Body descriptions, property features, detailed content
- **Benefits**: 
  - Preserves formatting and structure
  - Supports rich content editing
  - Automatically handles HTML conversion
  - Better for SEO and accessibility

### 2. Plain Text Field
- **Purpose**: Simple text without formatting
- **Behavior**: Stores content as plain text
- **Use Cases**: Short descriptions, titles, simple content
- **Limitations**: No formatting support

### 3. HTML Field ⚠️ **NOT RECOMMENDED**
- **Purpose**: Raw HTML content
- **Behavior**: Stores HTML directly
- **Use Cases**: Custom HTML content
- **Issues**: 
  - Requires manual HTML editing
  - No visual editor
  - Security concerns with user input
  - Difficult to maintain

## Current Project Analysis

Based on the project structure, the data is currently stored in Supabase with the following key fields:

- `body_description` - Property detailed description
- `short_description` - Property brief description  
- `property_features` - Property amenities and features

## Recommended Field Configuration

### For Body Descriptions
```
Field Name: Body Description
Field Type: Rich Text
Slug: body_description
Purpose: Detailed property descriptions with formatting
```

### For Property Features
```
Field Name: Property Features
Field Type: Rich Text
Slug: property_features
Purpose: Property amenities and features with formatting
```

## How to Check Current Field Types

### 1. Using the Analysis Script
```bash
# Install webflow-api if not already installed
npm install webflow-api

# Set up environment variables
echo "WEBFLOW_API_TOKEN=your_token_here" >> .env.local
echo "WEBFLOW_SITE_ID=your_site_id_here" >> .env.local

# Run the field analysis
node scripts/check-webflow-cms-fields.js
```

### 2. Manual Check in Webflow Designer
1. Open your Webflow project
2. Go to CMS Collections
3. Click on your properties collection
4. Check field types for:
   - Body description fields
   - Property feature fields
   - Any other content fields

## Converting Fields to Rich Text

### Step 1: Identify Fields to Convert
Look for fields that:
- Contain formatted text (line breaks, bold, italic)
- Are used for body descriptions
- Are used for property features
- Currently use HTML or Plain Text type

### Step 2: Convert in Webflow Designer
1. Open Webflow Designer
2. Go to CMS Collections
3. Select your properties collection
4. For each field to convert:
   - Click on the field
   - Change field type to "Rich Text"
   - Save the collection

### Step 3: Verify Conversion
```bash
# Run the setup script to verify
node scripts/setup-webflow-cms-rtf.js
```

## Content Migration Considerations

### Before Conversion
- **Backup your data**: Export collection data
- **Test on staging**: Use a staging site first
- **Document current content**: Note any custom HTML

### During Conversion
- **Content may need reformatting**: Some HTML might not convert perfectly
- **Test thoroughly**: Check all content displays correctly
- **Update any custom logic**: Code that processes HTML may need updates

### After Conversion
- **Verify content display**: Check all properties show correctly
- **Test rich text editing**: Ensure editors can format content properly
- **Update documentation**: Document any changes made

## Best Practices

### 1. Field Naming
- Use descriptive names: "Body Description" not "Body"
- Include purpose in name: "Property Features" not "Features"
- Be consistent across collections

### 2. Content Guidelines
- Use proper heading hierarchy (H1, H2, H3)
- Format lists properly (bulleted or numbered)
- Use bold and italic for emphasis
- Include line breaks for readability

### 3. API Integration
- When fetching content, Rich Text fields return formatted HTML
- Process HTML content appropriately in your application
- Consider using a rich text parser if needed

## Troubleshooting

### Common Issues

#### 1. Content Not Displaying Properly
- **Cause**: Field type mismatch
- **Solution**: Verify field is set to Rich Text
- **Check**: Content in Webflow Designer

#### 2. Formatting Lost
- **Cause**: Content was in HTML field
- **Solution**: Re-format content in Rich Text editor
- **Prevention**: Use Rich Text fields from the start

#### 3. API Returns Raw HTML
- **Cause**: This is expected behavior for Rich Text fields
- **Solution**: Process HTML in your application
- **Alternative**: Use a rich text parser library

### Getting Help

1. **Check Webflow Documentation**: [Webflow CMS Field Types](https://help.webflow.com/hc/en-us/articles/360061472214)
2. **Run Analysis Scripts**: Use the provided scripts to diagnose issues
3. **Test in Designer**: Verify field types and content in Webflow Designer
4. **Check API Responses**: Verify data structure in your application

## Scripts Reference

### `scripts/check-webflow-cms-fields.js`
- Analyzes current field types
- Identifies potential issues
- Provides detailed field analysis

### `scripts/setup-webflow-cms-rtf.js`
- Generates conversion recommendations
- Analyzes content for conversion needs
- Provides step-by-step conversion guide

## Environment Variables Required

```env
WEBFLOW_API_TOKEN=your_webflow_api_token
WEBFLOW_SITE_ID=your_webflow_site_id
```

## Next Steps

1. **Set up environment variables** with your Webflow credentials
2. **Run the analysis script** to check current field types
3. **Follow conversion guide** to update field types
4. **Test thoroughly** to ensure everything works correctly
5. **Update documentation** with any changes made

---

**Note**: Field type changes in Webflow CMS require manual intervention in the Designer. The provided scripts help analyze and guide the conversion process, but cannot automatically change field types via the API.

