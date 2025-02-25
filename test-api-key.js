/**
 * Simple script to test if the OpenAI API key is configured correctly
 * 
 * Usage: npx tsx test-api-key.js
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';
import OpenAI from 'openai';

// Load environment variables manually
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  const envLocalPath = resolve(process.cwd(), '.env.local');

  // Load .env file if it exists
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log('Loaded environment variables from .env');
  }

  // Load .env.local file if it exists (overrides .env)
  if (fs.existsSync(envLocalPath)) {
    config({ path: envLocalPath });
    console.log('Loaded environment variables from .env.local');
  }
}

// Load the environment variables
loadEnv();

// Get the API key
const apiKey = process.env.OPENAI_API_KEY;

console.log('\n🔑 OpenAI API Key Test 🔑\n');

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY is not set in your environment variables.');
  console.log('Please check your .env.local file and make sure it contains your actual API key.');
  process.exit(1);
}

if (apiKey === 'your_openai_api_key_here') {
  console.error('❌ OPENAI_API_KEY still has the default placeholder value.');
  console.log('Please replace it with your actual OpenAI API key in the .env.local file.');
  process.exit(1);
}

console.log('✅ OPENAI_API_KEY is set in your environment variables.');
console.log(`The key begins with: ${apiKey.substring(0, 5)}...`);

// Test the key with a simple API call
console.log('\nTesting API connectivity...');

const openai = new OpenAI({
  apiKey,
});

async function testApiKey() {
  try {
    const models = await openai.models.list();
    console.log('✅ Successfully connected to OpenAI API!');
    console.log(`Available models: ${models.data.length}`);
    // List a few models as examples
    console.log('\nSome available models:');
    models.data.slice(0, 5).forEach(model => {
      console.log(` - ${model.id}`);
    });
    console.log('\n🎉 Your OpenAI API key is configured correctly!');
  } catch (error) {
    console.error('❌ Error connecting to OpenAI API:');
    console.error(error.message);
    console.log('\nPlease check that your API key is valid and has sufficient credits.');
  }
}

testApiKey(); 