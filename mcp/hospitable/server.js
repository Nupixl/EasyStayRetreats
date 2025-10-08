/**
 * Hospitable MCP Server
 * Model Context Protocol server for Hospitable API integration
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const HospitableClient = require('./client');
const HospitableSync = require('./sync');
const PropertyTools = require('./tools/properties');
const PricingTools = require('./tools/pricing');
const CalendarTools = require('./tools/calendar');
const ReservationTools = require('./tools/reservations');
const { config, validateConfig } = require('./config');

class HospitableMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // Initialize tools
    const hospitableClient = new HospitableClient(
      config.hospitable.apiKey,
      config.hospitable.baseUrl
    );
    
    const syncModule = new HospitableSync(
      config.supabase.url,
      config.supabase.key,
      config.hospitable.apiKey
    );

    this.propertyTools = new PropertyTools(hospitableClient, syncModule);
    this.pricingTools = new PricingTools(hospitableClient, syncModule);
    this.calendarTools = new CalendarTools(hospitableClient, syncModule);
    this.reservationTools = new ReservationTools(hospitableClient);

    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Property tools
          {
            name: 'get_property',
            description: 'Get property information by ID',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                }
              },
              required: ['propertyId']
            }
          },
          {
            name: 'list_properties',
            description: 'List all properties',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'sync_property',
            description: 'Sync property from Hospitable to Supabase',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                }
              },
              required: ['propertyId']
            }
          },
          // Pricing tools
          {
            name: 'get_property_pricing',
            description: 'Get pricing for a property',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                },
                startDate: {
                  type: 'string',
                  description: 'Start date (YYYY-MM-DD)'
                },
                endDate: {
                  type: 'string',
                  description: 'End date (YYYY-MM-DD)'
                }
              },
              required: ['propertyId', 'startDate', 'endDate']
            }
          },
          {
            name: 'sync_property_pricing',
            description: 'Sync pricing from Hospitable to Supabase',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                },
                startDate: {
                  type: 'string',
                  description: 'Start date (YYYY-MM-DD)'
                },
                endDate: {
                  type: 'string',
                  description: 'End date (YYYY-MM-DD)'
                }
              },
              required: ['propertyId', 'startDate', 'endDate']
            }
          },
          {
            name: 'get_pricing_suggestions',
            description: 'Get dynamic pricing suggestions',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                },
                startDate: {
                  type: 'string',
                  description: 'Start date (YYYY-MM-DD)'
                },
                endDate: {
                  type: 'string',
                  description: 'End date (YYYY-MM-DD)'
                }
              },
              required: ['propertyId', 'startDate', 'endDate']
            }
          },
          // Calendar tools
          {
            name: 'get_calendar',
            description: 'Get calendar availability',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                },
                startDate: {
                  type: 'string',
                  description: 'Start date (YYYY-MM-DD)'
                },
                endDate: {
                  type: 'string',
                  description: 'End date (YYYY-MM-DD)'
                }
              },
              required: ['propertyId', 'startDate', 'endDate']
            }
          },
          {
            name: 'sync_calendar',
            description: 'Sync calendar from Hospitable to Supabase',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                },
                startDate: {
                  type: 'string',
                  description: 'Start date (YYYY-MM-DD)'
                },
                endDate: {
                  type: 'string',
                  description: 'End date (YYYY-MM-DD)'
                }
              },
              required: ['propertyId', 'startDate', 'endDate']
            }
          },
          // Reservation tools
          {
            name: 'get_reservations',
            description: 'Get reservations for a property',
            inputSchema: {
              type: 'object',
              properties: {
                propertyId: {
                  type: 'string',
                  description: 'Hospitable property ID'
                },
                startDate: {
                  type: 'string',
                  description: 'Start date (YYYY-MM-DD)'
                },
                endDate: {
                  type: 'string',
                  description: 'End date (YYYY-MM-DD)'
                }
              },
              required: ['propertyId', 'startDate', 'endDate']
            }
          },
          {
            name: 'get_reservation',
            description: 'Get specific reservation by ID',
            inputSchema: {
              type: 'object',
              properties: {
                reservationId: {
                  type: 'string',
                  description: 'Reservation ID'
                }
              },
              required: ['reservationId']
            }
          }
        ]
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;

        switch (name) {
          // Property tools
          case 'get_property':
            result = await this.propertyTools.getProperty(args.propertyId);
            break;
          case 'list_properties':
            result = await this.propertyTools.listProperties();
            break;
          case 'sync_property':
            result = await this.propertyTools.syncProperty(args.propertyId);
            break;

          // Pricing tools
          case 'get_property_pricing':
            result = await this.pricingTools.getPropertyPricing(
              args.propertyId,
              args.startDate,
              args.endDate
            );
            break;
          case 'sync_property_pricing':
            result = await this.pricingTools.syncPropertyPricing(
              args.propertyId,
              args.startDate,
              args.endDate
            );
            break;
          case 'get_pricing_suggestions':
            result = await this.pricingTools.getPricingSuggestions(
              args.propertyId,
              args.startDate,
              args.endDate
            );
            break;

          // Calendar tools
          case 'get_calendar':
            result = await this.calendarTools.getCalendar(
              args.propertyId,
              args.startDate,
              args.endDate
            );
            break;
          case 'sync_calendar':
            result = await this.calendarTools.syncPropertyCalendar(
              args.propertyId,
              args.startDate,
              args.endDate
            );
            break;

          // Reservation tools
          case 'get_reservations':
            result = await this.reservationTools.getReservations(
              args.propertyId,
              args.startDate,
              args.endDate
            );
            break;
          case 'get_reservation':
            result = await this.reservationTools.getReservation(args.reservationId);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    try {
      validateConfig();
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.log('Hospitable MCP Server started successfully');
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      process.exit(1);
    }
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new HospitableMCPServer();
  server.start();
}

module.exports = HospitableMCPServer;
