#!/usr/bin/env node

/**
 * Error monitoring script for Webflow Cloud app
 * Run this to monitor API health and identify issues
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MONITOR_INTERVAL = 30000; // 30 seconds

class ErrorMonitor {
  constructor() {
    this.errorCount = 0;
    this.successCount = 0;
    this.lastError = null;
    this.startTime = Date.now();
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.request(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'ErrorMonitor/1.0',
          'Accept': 'application/json'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({
              statusCode: res.statusCode,
              data: json,
              headers: res.headers
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              data: data,
              headers: res.headers
            });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  async checkHealth() {
    try {
      console.log(`\n🔍 Checking health at ${new Date().toISOString()}`);
      
      const healthResponse = await this.makeRequest(`${BASE_URL}/api/health`);
      console.log(`✅ Health check: ${healthResponse.statusCode}`);
      
      if (healthResponse.data) {
        console.log(`   Status: ${healthResponse.data.status}`);
        console.log(`   Services: ${JSON.stringify(healthResponse.data.services, null, 2)}`);
      }
      
      this.successCount++;
    } catch (error) {
      console.log(`❌ Health check failed: ${error.message}`);
      this.errorCount++;
      this.lastError = error;
    }
  }

  async checkProperties() {
    try {
      const propertiesResponse = await this.makeRequest(`${BASE_URL}/api/properties`);
      console.log(`✅ Properties API: ${propertiesResponse.statusCode}`);
      
      if (propertiesResponse.data && propertiesResponse.data.success) {
        console.log(`   Properties returned: ${propertiesResponse.data.data?.length || 0}`);
        const correlationId = propertiesResponse.headers['x-correlation-id'];
        if (correlationId) {
          console.log(`   Correlation ID: ${correlationId}`);
        }
      } else {
        console.log(`   Error response: ${JSON.stringify(propertiesResponse.data)}`);
        this.errorCount++;
      }
      
      this.successCount++;
    } catch (error) {
      console.log(`❌ Properties API failed: ${error.message}`);
      this.errorCount++;
      this.lastError = error;
    }
  }

  async checkDebugStatus() {
    try {
      const debugResponse = await this.makeRequest(`${BASE_URL}/api/debug/status`);
      console.log(`✅ Debug status: ${debugResponse.statusCode}`);
      
      if (debugResponse.data) {
        const { environment, services, health } = debugResponse.data;
        console.log(`   Memory usage: ${health.memory.percentage}%`);
        console.log(`   Uptime: ${health.uptime.human}`);
        console.log(`   Supabase circuit breaker: ${services.supabase.circuitBreaker.state}`);
      }
      
      this.successCount++;
    } catch (error) {
      console.log(`❌ Debug status failed: ${error.message}`);
      this.errorCount++;
    }
  }

  async runCheck() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Starting error monitoring...');
    console.log('='.repeat(60));
    
    await this.checkHealth();
    await this.checkProperties();
    await this.checkDebugStatus();
    
    this.printSummary();
  }

  printSummary() {
    const total = this.successCount + this.errorCount;
    const successRate = total > 0 ? ((this.successCount / total) * 100).toFixed(1) : 0;
    const uptime = Math.round((Date.now() - this.startTime) / 1000);
    
    console.log('\n📊 Summary:');
    console.log(`   Success: ${this.successCount}`);
    console.log(`   Errors: ${this.errorCount}`);
    console.log(`   Success rate: ${successRate}%`);
    console.log(`   Monitoring time: ${uptime}s`);
    
    if (this.lastError) {
      console.log(`   Last error: ${this.lastError.message}`);
    }
    
    if (this.errorCount > 0) {
      console.log('\n⚠️  Issues detected! Check the logs above for details.');
    } else {
      console.log('\n✅ All systems operational');
    }
  }

  start() {
    console.log('🔍 Error Monitor Started');
    console.log(`📡 Monitoring: ${BASE_URL}`);
    console.log(`⏱️  Interval: ${MONITOR_INTERVAL / 1000}s`);
    console.log('Press Ctrl+C to stop\n');
    
    // Initial check
    this.runCheck();
    
    // Set up interval
    setInterval(() => {
      this.runCheck();
    }, MONITOR_INTERVAL);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping error monitor...');
  process.exit(0);
});

// Start monitoring
const monitor = new ErrorMonitor();
monitor.start();
