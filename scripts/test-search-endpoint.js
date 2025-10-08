#!/usr/bin/env node

/**
 * Test script specifically for the search-properties endpoint
 * This will help identify issues with the map search functionality
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class SearchEndpointTester {
  constructor() {
    this.testResults = [];
    this.errorCount = 0;
    this.successCount = 0;
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.request(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'SearchEndpointTester/1.0',
          'Accept': 'application/json',
          ...options.headers
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

  async testSearchEndpoint() {
    console.log('\n🔍 Testing Search Properties Endpoint');
    console.log('='.repeat(50));

    // Test 1: Basic search with sample bounds
    const sampleBounds = {
      'markers[0][latitude]': '40.7128',
      'markers[0][longitude]': '-74.0060',
      'markers[1][latitude]': '40.7128',
      'markers[1][longitude]': '-73.9960',
      'markers[2][latitude]': '40.7028',
      'markers[2][longitude]': '-73.9960',
      'markers[3][latitude]': '40.7028',
      'markers[3][longitude]': '-74.0060'
    };

    const queryString = new URLSearchParams(sampleBounds).toString();
    const searchUrl = `${BASE_URL}/api/properties/search?${queryString}`;

    try {
      console.log(`📡 Testing: ${searchUrl}`);
      const response = await this.makeRequest(searchUrl);
      
      console.log(`✅ Status: ${response.statusCode}`);
      console.log(`📊 Response:`, {
        success: response.data?.success,
        dataLength: response.data?.data?.length || 0,
        correlationId: response.headers['x-correlation-id']
      });

      if (response.data?.success && Array.isArray(response.data.data)) {
        console.log(`🎯 Found ${response.data.data.length} properties`);
        this.successCount++;
      } else {
        console.log(`❌ Invalid response format`);
        this.errorCount++;
      }

    } catch (error) {
      console.log(`❌ Search test failed: ${error.message}`);
      this.errorCount++;
    }
  }

  async testMapSearchEndpoint() {
    console.log('\n🗺️  Testing Map Search Endpoint');
    console.log('='.repeat(50));

    try {
      // Test the redirect endpoint
      const mapSearchUrl = `${BASE_URL}/api/search-properties`;
      console.log(`📡 Testing: ${mapSearchUrl}`);
      
      const response = await this.makeRequest(mapSearchUrl);
      console.log(`✅ Status: ${response.statusCode}`);
      console.log(`📊 Response:`, {
        success: response.data?.success,
        dataLength: response.data?.data?.length || 0,
        correlationId: response.headers['x-correlation-id']
      });

      if (response.statusCode === 307 || response.statusCode === 200) {
        console.log(`🎯 Map search endpoint working`);
        this.successCount++;
      } else {
        console.log(`❌ Map search endpoint failed`);
        this.errorCount++;
      }

    } catch (error) {
      console.log(`❌ Map search test failed: ${error.message}`);
      this.errorCount++;
    }
  }

  async testHealthEndpoints() {
    console.log('\n🏥 Testing Health Endpoints');
    console.log('='.repeat(50));

    const endpoints = [
      '/api/health',
      '/api/debug/status'
    ];

    for (const endpoint of endpoints) {
      try {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`📡 Testing: ${url}`);
        
        const response = await this.makeRequest(url);
        console.log(`✅ Status: ${response.statusCode}`);
        
        if (response.data) {
          console.log(`📊 Health:`, {
            status: response.data.status,
            services: response.data.services,
            correlationId: response.headers['x-correlation-id']
          });
        }

        this.successCount++;
      } catch (error) {
        console.log(`❌ Health test failed: ${error.message}`);
        this.errorCount++;
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Search Endpoint Tests');
    console.log(`📡 Base URL: ${BASE_URL}`);
    console.log('='.repeat(60));

    await this.testHealthEndpoints();
    await this.testSearchEndpoint();
    await this.testMapSearchEndpoint();

    this.printSummary();
  }

  printSummary() {
    const total = this.successCount + this.errorCount;
    const successRate = total > 0 ? ((this.successCount / total) * 100).toFixed(1) : 0;
    
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Successful: ${this.successCount}`);
    console.log(`   ❌ Failed: ${this.errorCount}`);
    console.log(`   📈 Success Rate: ${successRate}%`);
    
    if (this.errorCount > 0) {
      console.log('\n⚠️  Issues detected! Check the logs above for details.');
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('   1. Check if the app is running and accessible');
      console.log('   2. Verify Supabase configuration');
      console.log('   3. Check the logs for correlation IDs');
      console.log('   4. Test individual endpoints manually');
    } else {
      console.log('\n✅ All search endpoint tests passed!');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping search endpoint tests...');
  process.exit(0);
});

// Start testing
const tester = new SearchEndpointTester();
tester.runAllTests();
