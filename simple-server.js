/**
 * Simplified test server
 * 
 * Usage: npx tsx simple-server.js
 */

// Load dotenv directly
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load environment variables
const envPath = resolve(process.cwd(), '.env');
const envLocalPath = resolve(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  config({ path: envPath });
  console.log('Loaded environment variables from .env');
}

if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log('Loaded environment variables from .env.local');
}

// Import Fastify
import Fastify from 'fastify';

// Create fastify instance
const fastify = Fastify({
  logger: true
});

// Import OpenAI
import OpenAI from 'openai';

// Get API key directly from environment
const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
if (apiKey) {
  console.log(`API Key starts with: ${apiKey.substring(0, 5)}...`);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey,
});

// Basic health route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Test OpenAI connection route
fastify.get('/test-openai', async (request, reply) => {
  try {
    const models = await openai.models.list();
    return { 
      success: true, 
      message: 'Successfully connected to OpenAI API',
      models_count: models.data.length,
      sample_models: models.data.slice(0, 5).map(model => model.id)
    };
  } catch (error) {
    fastify.log.error(error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address()}`);
    console.log('Test endpoint: http://localhost:3000/test-openai');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 