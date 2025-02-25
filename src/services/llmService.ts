/**
 * OpenAI API wrapper for text generation
 */
import OpenAI from 'openai';
import { config } from '../utils/config';
import { formatApiError } from '../utils/apiHelpers';
import { UserInput, VibeSummary } from '../types/vibeTypes';
import { VIBE_SUMMARY_PROMPT, IMAGE_PROMPT_TEMPLATE, MUSIC_RECOMMENDATION_PROMPT } from '../prompts/templates';

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
 * Replace placeholders in a prompt template with actual values
 */
const fillPromptTemplate = (template: string, replacements: Record<string, string>): string => {
  let filledTemplate = template;
  Object.entries(replacements).forEach(([key, value]) => {
    filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return filledTemplate;
};

/**
 * Generate a comprehensive vibe summary based on user input
 * @param userInput User responses to the questionnaire 
 * @returns A detailed vibe summary JSON
 */
export const generateVibeSummary = async (userInput: UserInput): Promise<VibeSummary> => {
  try {
    // Get OpenAI client on demand 
    const openai = getOpenAIClient();
    
    // Prepare the prompt with user answers
    const filledPrompt = fillPromptTemplate(VIBE_SUMMARY_PROMPT, {
      answer1: userInput.question1,
      answer2: userInput.question2,
      answer3: userInput.question3,
      answer4: userInput.question4,
      answer5: userInput.question5,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.llm.model as "gpt-4-turbo" | "gpt-4" | "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a creative vibe generator that responds only with properly formatted JSON." },
        { role: "user", content: filledPrompt }
      ],
      temperature: config.llm.temperature,
      max_tokens: config.llm.maxTokens,
      response_format: { type: "json_object" }
    });

    // Parse response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI API");
    }

    // Parse JSON response
    const vibeSummary = JSON.parse(content) as VibeSummary;
    return vibeSummary;
  } catch (error) {
    const errorMessage = formatApiError(error instanceof Error ? error : new Error('Unknown error'));
    console.error('Error generating vibe summary:', errorMessage);
    throw new Error(`Failed to generate vibe summary: ${errorMessage}`);
  }
};

/**
 * Generate image prompts based on vibe summary
 * @param vibeSummary The generated vibe summary containing title and description
 * @returns Array of tailored image prompts for DALL-E
 */
export const generateImagePrompts = async (vibeSummary: VibeSummary): Promise<string[]> => {
  try {
    // Get OpenAI client on demand
    const openai = getOpenAIClient();
    
    // Prepare the prompt with vibe summary
    const filledPrompt = fillPromptTemplate(IMAGE_PROMPT_TEMPLATE, {
      title: vibeSummary.title,
      description: vibeSummary.description,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.llm.model as "gpt-4-turbo" | "gpt-4" | "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert prompt engineer that responds only with properly formatted JSON." },
        { role: "user", content: filledPrompt }
      ],
      temperature: config.llm.temperature,
      max_tokens: config.llm.maxTokens,
      response_format: { type: "json_object" }
    });

    // Parse response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI API");
    }

    // Parse JSON response
    const result = JSON.parse(content) as { prompts: string[] };
    return result.prompts;
  } catch (error) {
    const errorMessage = formatApiError(error instanceof Error ? error : new Error('Unknown error'));
    console.error('Error generating image prompts:', errorMessage);
    throw new Error(`Failed to generate image prompts: ${errorMessage}`);
  }
};

/**
 * Generate song recommendations based on vibe summary
 */
export const generateSongRecommendations = async (vibeSummary: VibeSummary): Promise<{ artist: string, title: string }[]> => {
  try {
    // Get OpenAI client on demand
    const openai = getOpenAIClient();
    
    // Prepare the prompt with vibe summary
    const filledPrompt = fillPromptTemplate(MUSIC_RECOMMENDATION_PROMPT, {
      title: vibeSummary.title,
      description: vibeSummary.description,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a music expert that responds only with properly formatted JSON." },
        { role: "user", content: filledPrompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    // Parse response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI API");
    }

    // Parse JSON response
    const result = JSON.parse(content) as { songs: { artist: string, title: string }[] };
    return result.songs;
  } catch (error) {
    const errorMessage = formatApiError(error instanceof Error ? error : new Error('Unknown error'));
    console.error('Error generating song recommendations:', errorMessage);
    throw new Error(`Failed to generate song recommendations: ${errorMessage}`);
  }
}; 