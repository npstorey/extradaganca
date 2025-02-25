/**
 * Debug script to check environment variables and configuration
 * 
 * Usage: npx tsx debug-config.js
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load environment variables manually
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  const envLocalPath = resolve(process.cwd(), '.env.local');

  console.log('Environment paths:');
  console.log(` - .env path: ${envPath} (exists: ${fs.existsSync(envPath)})`);
  console.log(` - .env.local path: ${envLocalPath} (exists: ${fs.existsSync(envLocalPath)})`);

  // Load .env file if it exists
  if (fs.existsSync(envPath)) {
    const result = config({ path: envPath });
    console.log('\nLoaded from .env:');
    console.log(` - Parsed ${Object.keys(result.parsed || {}).length} variables`);
  }

  // Load .env.local file if it exists (overrides .env)
  if (fs.existsSync(envLocalPath)) {
    const result = config({ path: envLocalPath });
    console.log('\nLoaded from .env.local:');
    console.log(` - Parsed ${Object.keys(result.parsed || {}).length} variables`);
  }
}

// Load the environment variables
console.log('📋 ENVIRONMENT VARIABLE DEBUG INFO\n');
loadEnv();

// Check specific environment variables
console.log('\nKey environment variables:');
const vars = [
  'OPENAI_API_KEY',
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'LLM_MODEL',
  'IMAGE_MODEL'
];

vars.forEach(varName => {
  const value = process.env[varName];
  console.log(` - ${varName}: ${value ? 
    (varName.includes('KEY') || varName.includes('SECRET') ? 
      `${value.substring(0, 5)}...${value.substring(value.length - 4)}` : value) 
    : 'Not set'}`);
});

// Simulate our config.ts logic
console.log('\nSimulated config object:');
const getEnv = (key, defaultValue = '') => process.env[key] || defaultValue;

const simulatedConfig = {
  port: parseInt(getEnv('PORT', '3000')),
  environment: getEnv('NODE_ENV', 'development'),
  
  // API Keys
  openai: {
    apiKey: getEnv('OPENAI_API_KEY'),
  },
  spotify: {
    clientId: getEnv('SPOTIFY_CLIENT_ID'),
    clientSecret: getEnv('SPOTIFY_CLIENT_SECRET'),
  },
  
  // Service configuration
  llm: {
    model: getEnv('LLM_MODEL', 'gpt-4-turbo'),
    temperature: parseFloat(getEnv('LLM_TEMPERATURE', '0.7')),
    maxTokens: parseInt(getEnv('LLM_MAX_TOKENS', '500')),
  },
  image: {
    model: getEnv('IMAGE_MODEL', 'dall-e-3'),
    quality: getEnv('IMAGE_QUALITY', 'standard'),
    size: getEnv('IMAGE_SIZE', '1024x1024'),
    style: getEnv('IMAGE_STYLE', 'vivid'),
  }
};

console.log(JSON.stringify(simulatedConfig, (key, value) => {
  // Mask API keys in output
  if ((key === 'apiKey' || key.includes('Secret') || key.includes('Key')) && typeof value === 'string' && value.length > 10) {
    return `${value.substring(0, 5)}...${value.substring(value.length - 4)}`;
  }
  return value;
}, 2));

// Check for validation issues
console.log('\nValidation check:');
if (!simulatedConfig.openai.apiKey || simulatedConfig.openai.apiKey === 'your_openai_api_key_here') {
  console.log('❌ OPENAI_API_KEY is not valid');
} else {
  console.log('✅ OPENAI_API_KEY is valid');
} 