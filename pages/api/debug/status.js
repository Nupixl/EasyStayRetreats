/**
 * Debug status endpoint for monitoring API health and performance
 */
import { isSupabaseConfigured, testSupabaseConnection } from '../../../lib/supabase'
import { supabaseCircuitBreaker } from '../../../lib/circuitBreaker'
import DebugLogger from '../../../lib/debugLogger'

export default async function handler(req, res) {
  const logger = new DebugLogger('debug-status');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const status = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: process.env.NODE_ENV
      },
      services: {
        supabase: {
          configured: isSupabaseConfigured(),
          connection: null,
          circuitBreaker: supabaseCircuitBreaker.getStats()
        }
      },
      performance: {
        cpuUsage: process.cpuUsage(),
        loadAverage: process.platform !== 'win32' ? require('os').loadavg() : null
      }
    };

    // Test Supabase connection if configured
    if (isSupabaseConfigured()) {
      const connectionTest = await testSupabaseConnection();
      status.services.supabase.connection = connectionTest;
    }

    // Add recent error logs (if available)
    status.recentErrors = [];
    
    // Add system health indicators
    const memoryUsage = process.memoryUsage();
    status.health = {
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
      },
      uptime: {
        seconds: Math.round(process.uptime()),
        human: formatUptime(process.uptime())
      }
    };

    logger.info('Debug status requested', {
      status: status.services.supabase.configured ? 'healthy' : 'degraded'
    });

    const statusCode = status.services.supabase.connection?.success !== false ? 200 : 503;
    
    return res.status(statusCode).json(status);
  } catch (error) {
    logger.error('Error generating debug status', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate status',
      timestamp: new Date().toISOString()
    });
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}
