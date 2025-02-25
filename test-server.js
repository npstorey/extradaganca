/**
 * Server component test script
 * 
 * Usage: npx tsx test-server.js
 */

// Import environment loading first
import { loadEnv } from './src/utils/loadEnv.js';
console.log('Loading environment variables...');
loadEnv();

// Import and test the config module
import { config, validateConfig } from './src/utils/config.js';
console.log('\nTesting config module:');
console.log('API Key loaded in config:', config.openai.apiKey ? 'Yes' : 'No');
console.log('API Key first 5 chars:', config.openai.apiKey ? config.openai.apiKey.substring(0, 5) : 'Not available');

// Test validation
const missingVars = validateConfig();
console.log('Missing vars:', missingVars.length ? missingVars.join(', ') : 'None');

// Try creating OpenAI client directly
import OpenAI from 'openai';
console.log('\nTesting OpenAI client creation:');
try {
  const openai = new OpenAI({
    apiKey: config.openai.apiKey,
  });
  console.log('OpenAI client created successfully');

  // Try making a simple API call to confirm it works
  console.log('\nTesting OpenAI API call:');
  async function testApiCall() {
    try {
      const models = await openai.models.list();
      console.log('API call successful, found', models.data.length, 'models');
    } catch (err) {
      console.error('API call failed:', err.message);
    }
  }

  await testApiCall();
} catch (err) {
  console.error('Failed to create OpenAI client:', err.message);
}

console.log('\nTest completed'); 