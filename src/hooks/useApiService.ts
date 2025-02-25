/**
 * Hook for interacting with the Vibe Generator API
 */
import { UserInput, GeneratedVibe } from '../types/vibeTypes';

// API configuration
const API_URL = 'http://localhost:3002';

// Response type for generate vibe API
interface GenerateVibeResponse {
  vibe: GeneratedVibe;
}

// Health check response
interface HealthResponse {
  status: string;
  message: string;
}

/**
 * Hook providing methods to interact with the Vibe Generator API
 */
export const useApiService = () => {
  /**
   * Generate a vibe based on user input
   */
  const generateVibe = async (userInput: UserInput): Promise<GenerateVibeResponse> => {
    try {
      const response = await fetch(`${API_URL}/generate-vibe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `API request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating vibe:', error);
      throw error;
    }
  };

  /**
   * Check if the API is healthy
   */
  const checkHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      
      if (!response.ok) {
        return false;
      }
      
      const data: HealthResponse = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  };

  return {
    generateVibe,
    checkHealth,
  };
}; 