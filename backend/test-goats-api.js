import sql from './db.js';
import axios from 'axios';

async function testGoatsAPI() {
  try {
    console.log('🔍 Testing Goats API...\n');

    // Test 1: Direct database query
    console.log('1. Testing direct database query...');
    const goats = await sql`SELECT * FROM goats LIMIT 3`;
    console.log(`✅ Database query successful: ${goats.length} goats`);
    if (goats.length > 0) {
      console.log('Sample:', goats[0]);
    }

    // Test 2: Check if server is running
    console.log('\n2. Testing if backend server is running...');
    try {
      const response = await axios.get('http://localhost:1230/api/breeding-farm/goats', {
        headers: {
          Authorization: 'Bearer fake-token-for-test'
        }
      });
      console.log('✅ API response:', response.status);
    } catch (err) {
      console.log(`❌ API error: ${err.response?.status} - ${err.message}`);
      if (err.response?.data) {
        console.log('Error details:', err.response.data);
      }
    }

    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testGoatsAPI();
