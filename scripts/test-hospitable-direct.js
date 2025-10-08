/**
 * Direct test of Hospitable API using node-fetch
 */

const fetch = require('node-fetch');

async function testHospitableDirect() {
  console.log('🔍 Testing Hospitable API directly...\n');

  const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTYyNGRmMC0xMmYxLTQ0OGUtYjg4NC00MzY3ODBhNWQzY2QiLCJqdGkiOiI5ZTlmZjNiMzRkZmIzZWUyZjgwOWZkNzIzNmU1NThlMDUxOTNlODFmZTExYzc1ZDNhZDUzZWQzYTIwNDY0MDg4NGY5MTRhMjYwODZjOTU2NCIsImlhdCI6MTc1OTI2NDA0Mi42NzgzMDQsIm5iZiI6MTc1OTI2NDA0Mi42NzgzMDgsImV4cCI6MTc5MDgwMDA0Mi42NzMyOTYsInN1YiI6IjE4ODcyOCIsInNjb3BlcyI6WyJwYXQ6cmVhZCIsInBhdDp3cml0ZSJdfQ.SJP3txl34iV1Z1JiRbUFtlfryFO6XqJfNepKM9F_WlH5uForYSo1rR0yCcw3EHqXnl4EGzL5epocdJNgpiukVBR06CIkccG6rX9O7bpes3NCxhzr2FJV2JjRe3kYzC0b0YRWg3ieAxO_utS3YExnuy8vSbxOHXmdkduLiabAvzvCMzFWP7EOrt8JjQJljCdrU4U7JMTZeIZ9LXW3WExFYVreVnlz2k9MmCQux34414cTznARLDs5Xz84N41FiOxWc3o2lkbr2tgDrpWMFf6_RZKnxQj0V7PamgNjpgCvO36JoWrE3rdO0SmN8uT9nkouBN3tNvixn82DIXOSfmFfzqt6lwE9CjqY48qxpmcxTiq0CgMqx7oqoqVaH9u46DHkGEShde8p8Vp8MKYQ-U680BI3qHxUCXRzI1VFG3Fp_jEdmV7quIzTGGahlSilsXIoouSnP29hmyeYeFp4-IIgzrzJlnHfVdVuLveoEYHKfACRh2a6i0W7sgrIDl-ENES-mop0N5hpZ8Wbl3HuMroZyFxqDO2rUlSdN5oyHEJpWIe9mh0nQ9pzE6HmCoEmp4mN0IRF_GaedMAjVdSEaxqzdAWn-onrQdjv5wXHAQncdk9VG8scJ4Up8eb1jNRq0rIhJEyvPY00u-VPmNHa64rROcUkZ_uhJQuW4xee5DMKlH8';
  const url = 'https://public.api.hospitable.com/v2/properties';

  try {
    console.log('📡 Making request to:', url);
    console.log('🔑 Using API key (first 20 chars):', apiKey.substring(0, 20) + '...');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'HospitableMCP/1.0.0'
      }
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success! Retrieved properties:');
    console.log('📈 Total properties:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n🏠 Sample properties:');
      data.data.slice(0, 3).forEach((property, index) => {
        console.log(`\n${index + 1}. ${property.name}`);
        console.log(`   ID: ${property.id}`);
        console.log(`   Location: ${property.address?.city}, ${property.address?.state}`);
        console.log(`   Type: ${property.property_type}`);
        console.log(`   Capacity: ${property.capacity?.max} guests`);
      });
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testHospitableDirect();
