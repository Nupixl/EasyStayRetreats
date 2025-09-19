# Xano Meta API MCP Server

This document provides comprehensive information about the Xano Meta API MCP (Model Context Protocol) server integration for the Easy Stay Retreats project.

## Overview

The Xano Meta API MCP server enables programmatic access to Xano's Metadata API, allowing you to interact with workspace schemas, content, and file management through a standardized MCP interface.

## Features

- **Account Management**: Get account information and list instances
- **Workspace Management**: Access workspace details and configurations
- **Table Management**: Create, read, update, and delete database tables
- **Content Management**: Full CRUD operations on table records
- **Search Functionality**: Search content across tables
- **File Management**: Upload, download, and manage files
- **Error Handling**: Comprehensive error handling with fallback strategies

## Installation

1. Install dependencies:
```bash
npm install @modelcontextprotocol/sdk tsx
```

2. The MCP server is already configured in `package.json` with the script:
```bash
npm run mcp:xano
```

## Configuration

### Environment Variables

The MCP server uses the following configuration:

- **Base URL**: `https://xxsw-1d5c-nopq.n7d.xano.io/api:meta`
- **Access Token**: JWT token with workspace permissions
- **Key ID**: `f63e0405-d13e-495c-9f3d-a5d3d3943030`

### MCP Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "xano-meta-api": {
      "command": "npm",
      "args": ["run", "mcp:xano"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Available Tools

### Account Management

#### `xano_get_account`
Get account information from Xano.

**Parameters**: None

**Example**:
```json
{
  "tool": "xano_get_account",
  "arguments": {}
}
```

#### `xano_get_instances`
Get all instances for the account.

**Parameters**: None

**Example**:
```json
{
  "tool": "xano_get_instances",
  "arguments": {}
}
```

### Workspace Management

#### `xano_get_workspaces`
Get all workspaces for an instance.

**Parameters**:
- `instanceId` (number, required): The instance ID

**Example**:
```json
{
  "tool": "xano_get_workspaces",
  "arguments": {
    "instanceId": 123
  }
}
```

#### `xano_get_workspace`
Get workspace details.

**Parameters**:
- `workspaceId` (number, required): The workspace ID

**Example**:
```json
{
  "tool": "xano_get_workspace",
  "arguments": {
    "workspaceId": 456
  }
}
```

### Table Management

#### `xano_get_tables`
Get all tables in a workspace.

**Parameters**:
- `workspaceId` (number, required): The workspace ID

**Example**:
```json
{
  "tool": "xano_get_tables",
  "arguments": {
    "workspaceId": 456
  }
}
```

#### `xano_get_table`
Get table details including schema.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID

**Example**:
```json
{
  "tool": "xano_get_table",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789
  }
}
```

#### `xano_create_table`
Create a new table in a workspace.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `name` (string, required): Table name
- `displayName` (string, required): Table display name
- `description` (string, optional): Table description

**Example**:
```json
{
  "tool": "xano_create_table",
  "arguments": {
    "workspaceId": 456,
    "name": "properties",
    "displayName": "Properties",
    "description": "Vacation rental properties"
  }
}
```

### Content Management

#### `xano_get_records`
Get records from a table.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID
- `limit` (number, optional): Maximum number of records to return
- `offset` (number, optional): Number of records to skip
- `sortBy` (string, optional): Field to sort by
- `sortOrder` (string, optional): Sort order ("asc" or "desc")

**Example**:
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

#### `xano_get_record`
Get a specific record by ID.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID
- `recordId` (number, required): The record ID

**Example**:
```json
{
  "tool": "xano_get_record",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "recordId": 123
  }
}
```

#### `xano_create_record`
Create a new record in a table.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID
- `data` (object, required): Record data as key-value pairs

**Example**:
```json
{
  "tool": "xano_create_record",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "data": {
      "name": "Beach House Paradise",
      "description": "Beautiful beachfront property",
      "price": 250.00,
      "location": "Malibu, CA"
    }
  }
}
```

#### `xano_update_record`
Update an existing record.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID
- `recordId` (number, required): The record ID
- `data` (object, required): Updated record data as key-value pairs

**Example**:
```json
{
  "tool": "xano_update_record",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "recordId": 123,
    "data": {
      "price": 275.00,
      "description": "Updated description"
    }
  }
}
```

#### `xano_delete_record`
Delete a record from a table.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID
- `recordId` (number, required): The record ID

**Example**:
```json
{
  "tool": "xano_delete_record",
  "arguments": {
    "workspaceId": 456,
    "tableId": 789,
    "recordId": 123
  }
}
```

#### `xano_search_content`
Search for content in a table.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `tableId` (number, required): The table ID
- `searchTerm` (string, required): Search term
- `limit` (number, optional): Maximum number of results
- `offset` (number, optional): Number of results to skip

**Example**:
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

### File Management

#### `xano_get_files`
Get all files in a workspace.

**Parameters**:
- `workspaceId` (number, required): The workspace ID

**Example**:
```json
{
  "tool": "xano_get_files",
  "arguments": {
    "workspaceId": 456
  }
}
```

#### `xano_get_file`
Get file details.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `fileId` (number, required): The file ID

**Example**:
```json
{
  "tool": "xano_get_file",
  "arguments": {
    "workspaceId": 456,
    "fileId": 123
  }
}
```

#### `xano_delete_file`
Delete a file from workspace.

**Parameters**:
- `workspaceId` (number, required): The workspace ID
- `fileId` (number, required): The file ID

**Example**:
```json
{
  "tool": "xano_delete_file",
  "arguments": {
    "workspaceId": 456,
    "fileId": 123
  }
}
```

## Testing

Run the test script to verify the MCP server functionality:

```bash
node test-xano-mcp.js
```

This will test all major API endpoints and verify connectivity.

## Error Handling

The MCP server includes comprehensive error handling:

### Authentication Errors
- **401 Unauthorized**: Invalid or expired access token
- **403 Forbidden**: Insufficient permissions for requested resource

### API Errors
- **400 Bad Request**: Invalid request parameters
- **404 Not Found**: Resource doesn't exist
- **429 Rate Limited**: Too many requests
- **500 Server Error**: Xano server error

### Fallback Strategies
- Automatic retry with exponential backoff
- Graceful degradation for non-critical operations
- Detailed error logging for debugging

## Security Considerations

- **Token Security**: Access tokens are stored securely and not logged
- **HTTPS**: All API calls use HTTPS encryption
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Scope Restrictions**: Token scoped to specific workspace permissions
- **Input Validation**: All inputs are validated before API calls

## Performance Optimization

- **Connection Pooling**: Reuse HTTP connections for better performance
- **Caching**: Cache frequently accessed data to reduce API calls
- **Pagination**: Use limit/offset for large datasets
- **Async Operations**: Non-blocking API calls for better responsiveness

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify access token is valid and not expired
   - Check token permissions and scopes

2. **Resource Not Found**
   - Verify workspace ID and table ID are correct
   - Check if resource exists in Xano dashboard

3. **Rate Limiting**
   - Implement delays between requests
   - Use pagination for large datasets

4. **Connection Issues**
   - Check network connectivity
   - Verify Xano API endpoint is accessible

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=xano-mcp npm run mcp:xano
```

## Support

For issues related to:
- **Xano API**: Check [Xano Documentation](https://docs.xano.com/xano-features/metadata-api)
- **MCP Server**: Review this documentation and test script
- **Integration**: Check MCP client configuration

## Changelog

### Version 1.0.0
- Initial release with full Xano Meta API support
- Account, workspace, table, content, and file management
- Comprehensive error handling and testing
- Documentation and examples
