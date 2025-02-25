// Import and run the environment loader first
import { loadEnv } from './utils/loadEnv';

// Load environment variables first, before any other imports
console.log('Loading environment variables...');
loadEnv();

// Now import all other dependencies
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { config, validateConfig } from './utils/config';
import { generateVibeSummary, generateImagePrompts, generateSongRecommendations } from './services/llmService';
import { generateImages, enhancePrompt } from './services/imageService';
import { compileVibe, formatVibeResponse, generateVibeHtml } from './services/artifactService';
import { generateRequestId } from './utils/apiHelpers';
import { UserInput } from './types/vibeTypes';

// Create fastify instance
const fastify = Fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  },
  disableRequestLogging: false
});

// Register CORS to allow frontend access
fastify.register(fastifyCors, {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Register JSON body parser with appropriate limits
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  try {
    const json = JSON.parse(body as string);
    done(null, json);
  } catch (err) {
    done(new Error('Invalid JSON'), undefined);
  }
});

// Validate required config before starting
const missingVars = validateConfig();
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Register routes
fastify.get('/', async (request, reply) => {
  return { message: 'Vibe Generator API is running!' };
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Vibe generation endpoint
fastify.post('/generate-vibe', async (request, reply) => {
  try {
    const requestId = generateRequestId();
    console.log(`Processing vibe generation request: ${requestId}`);
    
    // Parse request body
    const { userInput } = request.body as { userInput: UserInput };
    
    // Validate input
    if (!userInput || !userInput.question1) {
      return reply.status(400).send({ 
        error: { 
          code: 'INVALID_INPUT', 
          message: 'Invalid or missing user input'
        }
      });
    }
    
    // Step 1: Generate vibe summary
    console.log('Generating vibe summary...');
    const vibeSummary = await generateVibeSummary(userInput);
    console.log(`Generated vibe summary: "${vibeSummary.title}"`);
    
    // Step 2: Generate image prompts
    console.log('Generating image prompts...');
    const imagePrompts = await generateImagePrompts(vibeSummary);
    
    // Step 3: Generate images from prompts
    console.log('Generating images...');
    // Enhance each prompt for better results
    const enhancedPrompts = imagePrompts.map(enhancePrompt);
    const images = await generateImages(enhancedPrompts.slice(0, 5)); // Limit to 5 images
    console.log(`Generated ${images.length} images`);
    
    // Step 4: Generate song recommendations
    console.log('Generating song recommendations...');
    const songRecommendations = await generateSongRecommendations(vibeSummary);
    console.log(`Generated ${songRecommendations.length} song recommendations`);
    
    // Step 5: Compile everything into a single vibe
    const vibe = compileVibe(vibeSummary, images, songRecommendations);
    
    // Log completion
    console.log(`Completed vibe generation request: ${requestId}`);
    
    // Return the compiled vibe
    return formatVibeResponse(vibe, requestId);
  } catch (error) {
    console.error('Error generating vibe:', error);
    return reply.status(500).send({
      error: {
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      }
    });
  }
});

// HTML preview endpoint
fastify.get('/preview/:requestId', async (request, reply) => {
  try {
    // In a real application, this would fetch the saved vibe from storage
    // For now, we'll just return a placeholder message
    return reply.type('text/html').send(`
      <html>
        <body>
          <h1>Vibe Preview</h1>
          <p>Request ID: ${(request.params as { requestId: string }).requestId}</p>
          <p>This endpoint would display a generated vibe. In a fully implemented version, 
          the request ID would be used to look up a previously generated vibe from storage.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error displaying preview:', error);
    return reply.status(500).send({
      error: {
        code: 'PREVIEW_FAILED',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      }
    });
  }
});

// Start the server
const start = async () => {
  try {
    // Force port 3002 instead of using config.port to avoid conflicts
    const port = 3002;
    console.log(`Attempting to start server on port ${port}...`);
    
    // Use explicit IPv4 localhost address for more reliable connections
    await fastify.listen({ 
      port, 
      host: '127.0.0.1', 
      listenTextResolver: (address) => {
        return `Server listening on ${address}`;
      }
    });
    
    console.log(`Server started! Available at http://localhost:${port}`);
    console.log(`You can access the health endpoint at http://localhost:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start(); 