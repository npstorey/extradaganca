/**
 * Configuration management for the application
 */
import { getEnv } from './loadEnv';

// For backwards compatibility and debugging
const PORT = parseInt(process.env.PORT || '3000', 10);

export const config = {
  // Server configuration
  port: PORT,
  PORT: PORT, // Keep for backwards compatibility
  environment: process.env.NODE_ENV || 'development',
  
  // API Keys
  openai: {
    apiKey: process.env.OPENAI_API_KEY, // Direct access to ensure it's loaded
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  
  // Service configuration
  llm: {
    model: process.env.LLM_MODEL || 'gpt-4-turbo',
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '500'),
  },
  image: {
    model: process.env.IMAGE_MODEL || 'dall-e-3',
    quality: process.env.IMAGE_QUALITY || 'standard',
    size: process.env.IMAGE_SIZE || '1024x1024',
    style: process.env.IMAGE_STYLE || 'vivid',
  },

  // Legacy access
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
};

/**
 * Validate required configuration values
 * @returns Array of missing environment variables
 */
export function validateConfig(): string[] {
  const missingVars: string[] = [];
  
  // Check for required API keys
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in the environment. Please check your .env.local file.');
    missingVars.push('OPENAI_API_KEY');
  } else if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.error('OPENAI_API_KEY still has the placeholder value. Please replace it with your actual API key.');
    missingVars.push('OPENAI_API_KEY');
  }
  
  // For Spotify, only consider them missing if both are absent or only one is present
  const hasSpotifyClientId = Boolean(process.env.SPOTIFY_CLIENT_ID);
  const hasSpotifyClientSecret = Boolean(process.env.SPOTIFY_CLIENT_SECRET);
  
  if ((hasSpotifyClientId || hasSpotifyClientSecret) && hasSpotifyClientId !== hasSpotifyClientSecret) {
    // Only one Spotify key is set, which is invalid
    console.error('Both SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set for Spotify integration.');
    if (!hasSpotifyClientId) missingVars.push('SPOTIFY_CLIENT_ID');
    if (!hasSpotifyClientSecret) missingVars.push('SPOTIFY_CLIENT_SECRET');
  }
  
  return missingVars;
} 