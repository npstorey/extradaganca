/**
 * Image generation service using DALL-E via OpenAI
 */
import OpenAI from 'openai';
import { config } from '../utils/config';
import { formatApiError } from '../utils/apiHelpers';
import { VibeImage } from '../types/vibeTypes';

/**
 * Get the OpenAI client, handling API key access in a more robust way
 */
function getOpenAIClient() {
  // Try multiple sources for the API key
  const apiKey = process.env.OPENAI_API_KEY || config.openai.apiKey;
  
  if (!apiKey) {
    console.error('No OpenAI API key found! Please check your .env.local file.');
    throw new Error('Missing OpenAI API key');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
}

/**
 * Generate images based on prompts using DALL-E
 * @param prompts Array of text prompts for image generation
 * @returns Array of generated images with their prompts and URLs
 */
export const generateImages = async (prompts: string[]): Promise<VibeImage[]> => {
  const images: VibeImage[] = [];
  
  // Get OpenAI client on demand
  const openai = getOpenAIClient();
  
  // Process prompts sequentially to avoid rate limiting
  for (const prompt of prompts) {
    try {
      console.log(`Generating image for prompt: ${prompt.substring(0, 80)}...`);
      
      const response = await openai.images.generate({
        model: config.image.model as "dall-e-3",
        prompt: prompt,
        n: 1, // Generate one image per prompt
        size: config.image.size as "1024x1024" | "256x256" | "512x512" | "1792x1024" | "1024x1792",
        quality: config.image.quality as "standard" | "hd",
        style: config.image.style as "vivid" | "natural",
      });

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI API");
      }

      // Add the generated image to our collection
      images.push({
        prompt,
        url: imageUrl,
      });

      // Brief pause to prevent hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      // Log error but continue with other prompts
      const errorMessage = formatApiError(error instanceof Error ? error : new Error('Unknown error'));
      console.error(`Error generating image for prompt: ${prompt.substring(0, 50)}...`, errorMessage);
      
      // We could choose to continue with other prompts or throw an error
      // For now, we'll continue but log the error
    }
  }

  if (images.length === 0) {
    throw new Error("Failed to generate any images");
  }

  return images;
};

/**
 * Optimizes a prompt to work better with DALL-E
 * @param prompt Original prompt
 * @returns Enhanced prompt
 */
export const enhancePrompt = (prompt: string): string => {
  // Add specific style directives to get better results
  let enhanced = prompt.trim();
  
  // Only add these enhancements if they're not already in the prompt
  if (!enhanced.toLowerCase().includes('detailed')) {
    enhanced += ", detailed composition";
  }
  
  if (!enhanced.toLowerCase().includes('high quality')) {
    enhanced += ", high quality";
  }
  
  return enhanced;
}; 