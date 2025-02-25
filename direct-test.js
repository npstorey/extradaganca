/**
 * Direct test script that doesn't rely on our utility functions
 * 
 * Usage: node direct-test.js
 */

// Directly load the dotenv package
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';
import OpenAI from 'openai';

console.log('🔍 DIRECT ENVIRONMENT TEST\n');

// Step 1: Directly load the environment files
const envPath = resolve(process.cwd(), '.env');
const envLocalPath = resolve(process.cwd(), '.env.local');

console.log('Environment files:');
console.log(` - .env: ${fs.existsSync(envPath) ? 'Found' : 'Not found'}`);
console.log(` - .env.local: ${fs.existsSync(envLocalPath) ? 'Found' : 'Not found'}`);

if (fs.existsSync(envPath)) {
  const envResult = config({ path: envPath });
  console.log('\nLoaded from .env:');
  console.log(envResult.parsed ? ' - Success' : ' - Failed');
}

if (fs.existsSync(envLocalPath)) {
  const localResult = config({ path: envLocalPath });
  console.log('\nLoaded from .env.local:');
  console.log(localResult.parsed ? ' - Success' : ' - Failed');
}

// Step 2: Check if OPENAI_API_KEY is in process.env
console.log('\nOPENAI_API_KEY in process.env:');
if (process.env.OPENAI_API_KEY) {
  const key = process.env.OPENAI_API_KEY;
  console.log(` - Found: ${key.substring(0, 5)}...${key.substring(key.length - 4)}`);
  console.log(` - Length: ${key.length} characters`);
} else {
  console.log(' - Not found');
}

// Step 3: Try to use the key directly
console.log('\nTesting OpenAI client with direct API key:');
try {
  const apiKey = process.env.OPENAI_API_KEY;
  
  // If no API key, try to read it directly from the file
  if (!apiKey && fs.existsSync(envLocalPath)) {
    console.log(' - Trying to read API key directly from .env.local file');
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(/OPENAI_API_KEY=(.+)/);
    if (match && match[1]) {
      const directKey = match[1].trim();
      console.log(` - Found direct key: ${directKey.substring(0, 5)}...${directKey.substring(directKey.length - 4)}`);
      
      // Try with this direct key
      const openai = new OpenAI({
        apiKey: directKey,
      });
      
      console.log(' - Created OpenAI client with direct key');
      
      // Test the key
      const testKey = async () => {
        try {
          const models = await openai.models.list();
          console.log(' - API call successful, found', models.data.length, 'models');
        } catch (err) {
          console.error(' - API call failed:', err.message);
        }
      };
      
      await testKey();
    }
  } else if (apiKey) {
    const openai = new OpenAI({
      apiKey,
    });
    
    console.log(' - Created OpenAI client with process.env key');
    
    // Test the key
    const testKey = async () => {
      try {
        const models = await openai.models.list();
        console.log(' - API call successful, found', models.data.length, 'models');
      } catch (err) {
        console.error(' - API call failed:', err.message);
      }
    };
    
    await testKey();
  } else {
    console.log(' - No API key available');
  }
} catch (err) {
  console.error(' - Error:', err.message);
}

console.log('\nTest completed'); 