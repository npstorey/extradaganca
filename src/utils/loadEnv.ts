/**
 * Utility for loading environment variables from multiple sources
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

/**
 * Load environment variables from .env and .env.local files
 */
export function loadEnv(): void {
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

  // Print loading status for key variables (but not their values)
  const keysToCheck = [
    'OPENAI_API_KEY',
    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET',
  ];

  keysToCheck.forEach(key => {
    if (process.env[key]) {
      console.log(`✅ ${key}: loaded successfully`);
    } else {
      console.log(`❌ ${key}: missing`);
    }
  });
}

/**
 * Get an environment variable with fallback
 * @param key The environment variable name
 * @param defaultValue Optional default value if not found
 * @returns The environment variable value or default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  // Directly access process.env to get the variable
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
} 