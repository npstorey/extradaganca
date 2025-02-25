/**
 * Basic Vibe Generator Server
 * 
 * A simplified version of the main server that works directly with environment variables
 * Usage: npx tsx basic-server.js
 */

// Load environment variables first
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load the .env and .env.local files
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

// Check if we have all required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set. Please set it in your .env.local file.');
  process.exit(1);
}

// Now import other dependencies
import Fastify from 'fastify';
import OpenAI from 'openai';

// Create the OpenAI client directly using the environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create Fastify instance
const fastify = Fastify({
  logger: true
});

// Register JSON body parser
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  try {
    const json = JSON.parse(body);
    done(null, json);
  } catch (err) {
    done(new Error('Invalid JSON'), undefined);
  }
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Test OpenAI connection
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
    console.error('Error accessing OpenAI API:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});

// Simple generate-vibe endpoint 
fastify.post('/generate-vibe', async (request, reply) => {
  try {
    const { userInput } = request.body;
    
    if (!userInput || !userInput.question1) {
      return reply.status(400).send({ 
        error: { message: 'Invalid or missing user input' }
      });
    }
    
    // Generate a simple vibe with GPT
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a vibe generator that creates fun, descriptive vibes based on user input." 
        },
        { 
          role: "user", 
          content: `Based on these answers, create a vibe summary with a title and description:
            1. ${userInput.question1}
            2. ${userInput.question2 || 'No answer'}
            3. ${userInput.question3 || 'No answer'}
            4. ${userInput.question4 || 'No answer'}
            5. ${userInput.question5 || 'No answer'}`
        }
      ],
      temperature: 0.8,
    });
    
    // Return the vibe
    return {
      success: true,
      vibe: {
        content: response.choices[0]?.message?.content,
        created: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error generating vibe:', error);
    return reply.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// Start the server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Test the API: http://localhost:${port}/test-openai`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 