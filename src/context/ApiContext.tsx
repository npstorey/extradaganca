/**
 * Context for managing the Vibe Generator API state
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useApiService } from '../hooks/useApiService';
import { GeneratedVibe, UserInput } from '../types/vibeTypes';
import { Vibe } from '../types/vibe';

// Define the shape of our API context
export interface ApiContextType {
  loading: boolean;
  error: string | null;
  vibeData: Vibe | null;
  generateVibe: (userInput: UserInput) => Promise<void>;
  checkHealth: () => Promise<boolean>;
}

// Create the context with default values
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vibeData, setVibeData] = useState<Vibe | null>(null);
  const apiService = useApiService();

  // Function to transform the API response to the Vibe format
  const transformToVibe = (generatedVibe: GeneratedVibe): Vibe => {
    return {
      title: generatedVibe.summary.title,
      description: generatedVibe.summary.description,
      imageUrls: generatedVibe.images.map(img => img.url),
      playlist: generatedVibe.playlistUrl,
      mood: extractMoodFromDescription(generatedVibe.summary.description),
      colors: ['#4e00ec', '#00ffcc'], // Default colors
      activities: [],
    };
  };

  // Simple helper to extract mood from description text
  const extractMoodFromDescription = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('energetic') || lowerDesc.includes('vibrant')) return 'energetic';
    if (lowerDesc.includes('calm') || lowerDesc.includes('peaceful')) return 'calm';
    if (lowerDesc.includes('happy') || lowerDesc.includes('joyful')) return 'happy';
    if (lowerDesc.includes('mysterious') || lowerDesc.includes('dark')) return 'mysterious';
    if (lowerDesc.includes('futuristic') || lowerDesc.includes('tech')) return 'futuristic';
    if (lowerDesc.includes('retro') || lowerDesc.includes('vintage')) return 'retro';
    return 'retro'; // Default
  };

  // Function to generate a vibe
  const generateVibe = async (userInput: UserInput): Promise<void> => {
    console.log('ApiContext: Starting generateVibe with input:', userInput);
    setLoading(true);
    setError(null);
    
    try {
      console.log('ApiContext: Calling apiService.generateVibe...');
      const response = await apiService.generateVibe(userInput);
      console.log('ApiContext: Received API response:', response);
      
      if (response && response.vibe) {
        // Transform the API response to the Vibe format
        const transformedVibe = transformToVibe(response.vibe);
        console.log('ApiContext: Setting vibeData with transformed vibe:', transformedVibe);
        setVibeData(transformedVibe);
      } else {
        console.error('ApiContext: Invalid response format, missing vibe data');
        setError('Received invalid response format from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate vibe';
      console.error('ApiContext: Error generating vibe:', errorMessage, err);
      setError(errorMessage);
    } finally {
      console.log('ApiContext: Finished generateVibe, setting loading to false');
      setLoading(false);
    }
  };

  // Function to check API health
  const checkHealth = async (): Promise<boolean> => {
    try {
      return await apiService.checkHealth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API health check failed');
      console.error('API health check error:', err);
      return false;
    }
  };

  // Provide the context values to children
  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        vibeData,
        generateVibe,
        checkHealth
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the API context
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
}; 