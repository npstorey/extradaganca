/**
 * Simple test script for the Vibe Generator API health endpoint
 * 
 * Usage: node test-health.js
 */

import fetch from 'node-fetch';

// API endpoint 
const API_URL = 'http://127.0.0.1:3002/health';

// Function to test the API
async function testHealth() {
  console.log('🌈 Testing Vibe Generator API Health...\n');
  console.log('🔄 Sending request to API health endpoint...');

  try {
    console.time('Request completed in');
    
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.timeEnd('Request completed in');
    
    console.log('\n✅ API Health Response Received!');
    console.log('\n🩺 Health Status:', result.status);
    console.log('\n✨ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testHealth(); 