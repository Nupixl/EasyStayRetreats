/**
 * Debug script to test Hospitable client step by step
 */

require('dotenv').config({ path: '.env.local' });

const HospitableClient = require('../mcp/hospitable/client');

async function debugHospitableClient() {
  console.log('🔍 Debugging Hospitable Client...\n');

  const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTYyNGRmMC0xMmYxLTQ0OGUtYjg4NC00MzY3ODBhNWQzY2QiLCJqdGkiOiI5ZTlmZjNiMzRkZmIzZWUyZjgwOWZkNzIzNmU1NThlMDUxOTNlODFmZTExYzc1ZDNhZDUzZWQzYTIwNDY0MDg4NGY5MTRhMjYwODZjOTU2NCIsImlhdCI6MTc1OTI2NDA0Mi42NzgzMDQsIm5iZiI6MTc1OTI2NDA0Mi42NzgzMDgsImV4cCI6MTc5MDgwMDA0Mi42NzMyOTYsInN1YiI6IjE4ODcyOCIsInNjb3BlcyI6WyJwYXQ6cmVhZCIsInBhdDp3cml0ZSJdfQ.SJP3txl34iV1Z1JiRbUFtlfryFO6XqJfNepKM9F_WlH5uForYSo1rR0yCcw3EHqXnl4EGzL5epocdJNgpiukVBR06CIkccG6rX9O7bpes3NCxhzr2FJV2JjRe3kYzC0b0YRWg3ieAxO_utS3YExnuy8vSbxOHXmdkduLiabAvzvCMzFWP7EOrt8JjQJljCdrU4U7JMTZeIZ9LXW3WExFYVreVnlz2k9MmCQux34414cTznARLDs5Xz84N41FiOxWc3o2lkbr2tgDrpWMFf6_RZKnxQj0V7PamgNjpgCvO36JoWrE3rdO0SmN8uT9nkouBN3tNvixn82DIXOSfmFfzqt6lwE9CjqY48qxpmcxTiq0CgMqx7oqoqVaH9u46DHkGEShde8p8Vp8MKYQ-U680BI3qHxUCXRzI1VFG3Fp_jEdmV7quIzTGGahlSilsXIoouSnP29hmyeYeFp4-IIgzrzJlnHfVdVuLveoEYHKfACRh2a6i0W7sgrIDl-ENES-mop0N5hpZ8Wbl3HuMroZyFxqDO2rUlSdN5oyHEJpWIe9mh0nQ9pzE6HmCoEmp4mN0IRF_GaedMAjVdSEaxqzdAWn-onrQdjv5wXHAQncdk9VG8scJ4Up8eb1jNRq0rIhJEyvPY00u-VPmNHa64rROcUkZ_uhJQuW4xee5DMKlH8';
  
  console.log('1. Creating HospitableClient instance...');
  const client = new HospitableClient(apiKey, 'https://public.api.hospitable.com/v2');
  
  console.log('2. Testing connection...');
  try {
    const result = await client.testConnection();
    console.log('✅ Connection test result:', result);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }

  console.log('\n3. Testing direct properties call...');
  try {
    const properties = await client.getProperties();
    console.log('✅ Properties retrieved successfully!');
    console.log('📊 Properties count:', properties.data?.length || 0);
    
    if (properties.data && properties.data.length > 0) {
      console.log('\n🏠 Sample properties:');
      properties.data.slice(0, 3).forEach((property, index) => {
        console.log(`   ${index + 1}. ${property.name} (${property.id})`);
      });
    }
  } catch (error) {
    console.error('❌ Properties call failed:', error.message);
  }
}

debugHospitableClient();
