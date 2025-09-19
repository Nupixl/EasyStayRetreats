/**
 * Xano Meta API MCP Server
 * 
 * This module provides MCP (Model Context Protocol) integration with Xano's Metadata API.
 * It enables programmatic access to workspace schema, content, and file management.
 * 
 * Based on: https://docs.xano.com/xano-features/metadata-api
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Xano API Configuration
const XANO_BASE_URL = 'https://xxsw-1d5c-nopq.n7d.xano.io/api:meta';
const XANO_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJ4YW5vIjp7ImRibyI6Im1hc3Rlcjp1c2VyIiwiaWQiOjQyMjQ2LCJhY2Nlc3NfdG9rZW4iOnsia2V5aWQiOiJmNjNlMDQwNS1kMTNlLTQ5NWMtOWYzZC1hNWQzZDM5NDMwMzAiLCJzY29wZSI6eyJ0ZW5hbnRfY2VudGVyOmJhY2t1cCI6MCwidGVuYW50X2NlbnRlcjpkZXBsb3kiOjAsInRlbmFudF9jZW50ZXI6aW1wZXJzb25hdGUiOjAsInRlbmFudF9jZW50ZXI6bWV0YWRhdGE6YXBpIjowLCJ0ZW5hbnRfY2VudGVyOmxvZyI6MCwidGVuYW50X2NlbnRlcjpyYmFjIjowLCJ0ZW5hbnRfY2VudGVyOnNlY3JldHMiOjAsInRlbmFudF9jZW50ZXIiOjAsIndvcmtzcGFjZTphZGRvbiI6MTUsIndvcmtzcGFjZTphcGkiOjE1LCJ3b3Jrc3BhY2U6Y29udGVudCI6MTUsIndvcmtzcGFjZTpkYXRhYmFzZSI6MTUsIndvcmtzcGFjZTpkYXRhc291cmNlOmxpdmUiOjE1LCJ3b3Jrc3BhY2U6ZmlsZSI6MTUsIndvcmtzcGFjZTpmdW5jdGlvbiI6MTUsIndvcmtzcGFjZTpzZXJ2aWNlIjoxNSwid29ya3NwYWNlOmxvZyI6MTUsIndvcmtzcGFjZTptaWRkbGV3YXJlIjoxNSwid29ya3NwYWNlOnJlcXVlc3RoaXN0b3J5IjoxNSwid29ya3NwYWNlOnRhc2siOjE1LCJ3b3Jrc3BhY2U6dG9vbCI6MTV9fSwiZXhwaXJlc19hdCI6IjIwMjUtMDktMjMgMTQ6NTY6MTUrMDAwMCJ9LCJpYXQiOjE3NTgwMzQ1NzUsIm5iZiI6MTc1ODAzNDU3NSwiYXVkIjoieGFubzptZXRhIn0.YpD_plz0pH77mSHDIQzGCqDgfEWRh4ABBgOlR_DsEnQMevu4pi5sZpMDt7dnBAQphk6gd7kUvQPyrTvA1gQRfcaMgyLA5KRBWN-Kflmrb4TkJWM9Fj6_uYXZwGa0sJfxIFhXiy7NsXhEB8cZzOUsaFQSaPhE9fSKfT8xIHVbRuiERO5Qy95NsiZgf0EEMb-eoxlEhiFzfPngrXg8gw0tvAi1wAXiw7en-VcmGzMHRkl8BzldoSHoKu0biy8ZOtkGXEbG9r_AP6UWeaW_yNM4k453LfkbZUtxMnY90WxNokPaBWonisRYkrIPYoYoi12q6f-wcUO1GThoQCXeW5HD800LULgzWfEfbg0xns6Ry8u3d19RL6hLEJec5tntzfRe9p4af5IxqJmp0GMqFzifQoLt1hsqKpISWzrPW48fbyHUsEjiToru_oo2lbZIJX6jPjafJigzzlPbhvM5zIPknq57GOv7EEQ9IfdeY6-fS6IsToyOApO9l-hBJilw2kLSmjXkVnzXnUWVMR6Io3dOmGX3AZO9CbOTq8xx5MFJ04RhOB-H7o43qf29tjcdLlSb5Hs4ymOYSilmA95e_jV_aohVsyuHG_NAYXi4XQgswPDM8vVgKjHfqPDYoqGKA5EZBb5ZQGXTruSIaGuUlKMAjiHoLqvqlaQu4jUcwNBZ8es';

// Types for Xano API responses
interface XanoWorkspace {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  instance_id: number;
}

interface XanoTable {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  workspace_id: number;
  created_at: string;
  updated_at: string;
}

interface XanoField {
  id: number;
  name: string;
  display_name: string;
  type: string;
  required: boolean;
  table_id: number;
  created_at: string;
  updated_at: string;
}

interface XanoRecord {
  id: number;
  [key: string]: any;
  created_at: string;
  updated_at: string;
}

interface XanoFile {
  id: number;
  name: string;
  size: number;
  type: string;
  mime: string;
  access: string;
  path: string;
  created_at: string;
}

// HTTP client for Xano API
class XanoAPIClient {
  private baseURL: string;
  private accessToken: string;

  constructor(baseURL: string, accessToken: string) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Xano API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Account API
  async getAccount() {
    return this.makeRequest('/account');
  }

  async getInstances() {
    return this.makeRequest('/instances');
  }

  // Instance API
  async getInstance(instanceId: number) {
    return this.makeRequest(`/instance/${instanceId}`);
  }

  async getWorkspaces(instanceId: number) {
    return this.makeRequest(`/instance/${instanceId}/workspaces`);
  }

  // Workspace API
  async getWorkspace(workspaceId: number) {
    return this.makeRequest(`/workspace/${workspaceId}`);
  }

  async getTables(workspaceId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/tables`);
  }

  async getTable(workspaceId: number, tableId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}`);
  }

  async createTable(workspaceId: number, tableData: any) {
    return this.makeRequest(`/workspace/${workspaceId}/table`, {
      method: 'POST',
      body: JSON.stringify(tableData),
    });
  }

  async updateTable(workspaceId: number, tableId: number, tableData: any) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}`, {
      method: 'PUT',
      body: JSON.stringify(tableData),
    });
  }

  async deleteTable(workspaceId: number, tableId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}`, {
      method: 'DELETE',
    });
  }

  // Content API
  async getRecords(workspaceId: number, tableId: number, params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/workspace/${workspaceId}/table/${tableId}/content${queryParams ? `?${queryParams}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getRecord(workspaceId: number, tableId: number, recordId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}/content/${recordId}`);
  }

  async createRecord(workspaceId: number, tableId: number, recordData: any) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}/content`, {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  async updateRecord(workspaceId: number, tableId: number, recordId: number, recordData: any) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}/content/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(recordData),
    });
  }

  async deleteRecord(workspaceId: number, tableId: number, recordId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/table/${tableId}/content/${recordId}`, {
      method: 'DELETE',
    });
  }

  // File API
  async getFiles(workspaceId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/file`);
  }

  async getFile(workspaceId: number, fileId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/file/${fileId}`);
  }

  async deleteFile(workspaceId: number, fileId: number) {
    return this.makeRequest(`/workspace/${workspaceId}/file/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Search API
  async searchContent(workspaceId: number, tableId: number, searchTerm: string, params?: any) {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      ...params,
    }).toString();
    const endpoint = `/workspace/${workspaceId}/table/${tableId}/search?${queryParams}`;
    return this.makeRequest(endpoint);
  }
}

// Initialize Xano API client
const xanoClient = new XanoAPIClient(XANO_BASE_URL, XANO_ACCESS_TOKEN);

// MCP Server Tools
const tools: Tool[] = [
  {
    name: 'xano_get_account',
    description: 'Get account information from Xano',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'xano_get_instances',
    description: 'Get all instances for the account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'xano_get_workspaces',
    description: 'Get all workspaces for an instance',
    inputSchema: {
      type: 'object',
      properties: {
        instanceId: {
          type: 'number',
          description: 'The instance ID',
        },
      },
      required: ['instanceId'],
    },
  },
  {
    name: 'xano_get_workspace',
    description: 'Get workspace details',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'xano_get_tables',
    description: 'Get all tables in a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'xano_get_table',
    description: 'Get table details including schema',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
      },
      required: ['workspaceId', 'tableId'],
    },
  },
  {
    name: 'xano_create_table',
    description: 'Create a new table in a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        name: {
          type: 'string',
          description: 'Table name',
        },
        displayName: {
          type: 'string',
          description: 'Table display name',
        },
        description: {
          type: 'string',
          description: 'Table description',
        },
      },
      required: ['workspaceId', 'name', 'displayName'],
    },
  },
  {
    name: 'xano_get_records',
    description: 'Get records from a table',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of records to return',
        },
        offset: {
          type: 'number',
          description: 'Number of records to skip',
        },
        sortBy: {
          type: 'string',
          description: 'Field to sort by',
        },
        sortOrder: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort order',
        },
      },
      required: ['workspaceId', 'tableId'],
    },
  },
  {
    name: 'xano_get_record',
    description: 'Get a specific record by ID',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
        recordId: {
          type: 'number',
          description: 'The record ID',
        },
      },
      required: ['workspaceId', 'tableId', 'recordId'],
    },
  },
  {
    name: 'xano_create_record',
    description: 'Create a new record in a table',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
        data: {
          type: 'object',
          description: 'Record data as key-value pairs',
        },
      },
      required: ['workspaceId', 'tableId', 'data'],
    },
  },
  {
    name: 'xano_update_record',
    description: 'Update an existing record',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
        recordId: {
          type: 'number',
          description: 'The record ID',
        },
        data: {
          type: 'object',
          description: 'Updated record data as key-value pairs',
        },
      },
      required: ['workspaceId', 'tableId', 'recordId', 'data'],
    },
  },
  {
    name: 'xano_delete_record',
    description: 'Delete a record from a table',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
        recordId: {
          type: 'number',
          description: 'The record ID',
        },
      },
      required: ['workspaceId', 'tableId', 'recordId'],
    },
  },
  {
    name: 'xano_search_content',
    description: 'Search for content in a table',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        tableId: {
          type: 'number',
          description: 'The table ID',
        },
        searchTerm: {
          type: 'string',
          description: 'Search term',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
        },
        offset: {
          type: 'number',
          description: 'Number of results to skip',
        },
      },
      required: ['workspaceId', 'tableId', 'searchTerm'],
    },
  },
  {
    name: 'xano_get_files',
    description: 'Get all files in a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'xano_get_file',
    description: 'Get file details',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        fileId: {
          type: 'number',
          description: 'The file ID',
        },
      },
      required: ['workspaceId', 'fileId'],
    },
  },
  {
    name: 'xano_delete_file',
    description: 'Delete a file from workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'number',
          description: 'The workspace ID',
        },
        fileId: {
          type: 'number',
          description: 'The file ID',
        },
      },
      required: ['workspaceId', 'fileId'],
    },
  },
];

// MCP Server Implementation
class XanoMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'xano-meta-api',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'xano_get_account':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getAccount(), null, 2),
                },
              ],
            };

          case 'xano_get_instances':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getInstances(), null, 2),
                },
              ],
            };

          case 'xano_get_workspaces':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getWorkspaces(args.instanceId), null, 2),
                },
              ],
            };

          case 'xano_get_workspace':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getWorkspace(args.workspaceId), null, 2),
                },
              ],
            };

          case 'xano_get_tables':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getTables(args.workspaceId), null, 2),
                },
              ],
            };

          case 'xano_get_table':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getTable(args.workspaceId, args.tableId), null, 2),
                },
              ],
            };

          case 'xano_create_table':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.createTable(args.workspaceId, {
                    name: args.name,
                    display_name: args.displayName,
                    description: args.description,
                  }), null, 2),
                },
              ],
            };

          case 'xano_get_records':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getRecords(args.workspaceId, args.tableId, {
                    limit: args.limit,
                    offset: args.offset,
                    sort_by: args.sortBy,
                    sort_order: args.sortOrder,
                  }), null, 2),
                },
              ],
            };

          case 'xano_get_record':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getRecord(args.workspaceId, args.tableId, args.recordId), null, 2),
                },
              ],
            };

          case 'xano_create_record':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.createRecord(args.workspaceId, args.tableId, args.data), null, 2),
                },
              ],
            };

          case 'xano_update_record':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.updateRecord(args.workspaceId, args.tableId, args.recordId, args.data), null, 2),
                },
              ],
            };

          case 'xano_delete_record':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.deleteRecord(args.workspaceId, args.tableId, args.recordId), null, 2),
                },
              ],
            };

          case 'xano_search_content':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.searchContent(args.workspaceId, args.tableId, args.searchTerm, {
                    limit: args.limit,
                    offset: args.offset,
                  }), null, 2),
                },
              ],
            };

          case 'xano_get_files':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getFiles(args.workspaceId), null, 2),
                },
              ],
            };

          case 'xano_get_file':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.getFile(args.workspaceId, args.fileId), null, 2),
                },
              ],
            };

          case 'xano_delete_file':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(await xanoClient.deleteFile(args.workspaceId, args.fileId), null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Xano Meta API MCP Server running on stdio');
  }
}

// Export for use
export { XanoMCPServer, XanoAPIClient };

// Run server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new XanoMCPServer();
  server.run().catch(console.error);
}
