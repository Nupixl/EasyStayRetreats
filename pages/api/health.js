/**
 * Health check endpoint for monitoring
 */
import { isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      supabase: isSupabaseConfigured() ? 'configured' : 'not_configured',
      api: 'operational'
    },
    uptime: process.uptime()
  };

  // Check Supabase connection if configured
  if (isSupabaseConfigured()) {
    const connectionTest = await testSupabaseConnection();
    
    if (!connectionTest.success) {
      health.status = 'degraded';
      health.services.supabase = 'error';
      health.errors = [connectionTest.error];
    }
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return res.status(statusCode).json(health);
}
