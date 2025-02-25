/**
 * Types for API responses and requests
 */

import { GeneratedVibe, UserInput } from './vibeTypes';

/**
 * Request to generate a vibe
 */
export interface GenerateVibeRequest {
  userInput: UserInput;
}

/**
 * Response from the vibe generation endpoint
 */
export interface GenerateVibeResponse {
  vibe: GeneratedVibe;
  requestId: string;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
} 