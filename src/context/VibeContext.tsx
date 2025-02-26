import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vibe } from '../types/vibe';
import { useApi } from './ApiContext';

// Define the types for our context
export type TimePeriod = 'past' | 'present' | 'future';
export type RealityType = 'real' | 'imaginary';
export type ConvergeDiverge = number; // 0-100, where 0 is fully converge, 100 is fully diverge

export interface VibeState {
  location: string;
  timePeriod: TimePeriod | null;
  realityType: RealityType | null;
  description: string;
  mediaUrls: string[];
  convergeDiverge: ConvergeDiverge; // 0-100
  currentStep: number;
}

interface VibeContextType {
  vibeState: VibeState;
  setLocation: (location: string) => void;
  setTimePeriod: (period: TimePeriod) => void;
  setRealityType: (type: RealityType) => void;
  setDescription: (description: string) => void;
  addMediaUrl: (url: string) => void;
  removeMediaUrl: (url: string) => void;
  setConvergeDiverge: (value: ConvergeDiverge) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetVibe: () => void;
  // Add API state
  vibeData: Vibe | null;
  setVibeData: (data: Vibe | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const initialState: VibeState = {
  location: '',
  timePeriod: null,
  realityType: null,
  description: '',
  mediaUrls: [],
  convergeDiverge: 50, // Default to middle
  currentStep: 0
};

// Create context with default values
const VibeContext = createContext<VibeContextType>({
  vibeState: initialState,
  setLocation: () => {},
  setTimePeriod: () => {},
  setRealityType: () => {},
  setDescription: () => {},
  addMediaUrl: () => {},
  removeMediaUrl: () => {},
  setConvergeDiverge: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  resetVibe: () => {},
  // Add API state defaults
  vibeData: null,
  setVibeData: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {}
});

// Provider component
export const VibeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vibeState, setVibeState] = useState<VibeState>(initialState);
  const [vibeData, setVibeData] = useState<Vibe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get data from ApiContext to sync with VibeContext
  const api = useApi();
  
  // Sync with ApiContext
  useEffect(() => {
    console.log('VibeContext: Syncing with ApiContext', {
      apiLoading: api.loading,
      apiError: api.error,
      apiVibeData: api.vibeData
    });
    
    setLoading(api.loading);
    setError(api.error);
    
    if (api.vibeData) {
      console.log('VibeContext: Setting vibeData from ApiContext');
      setVibeData(api.vibeData);
    }
  }, [api.loading, api.error, api.vibeData]);

  const setLocation = (location: string) => {
    setVibeState(prev => ({ ...prev, location }));
  };

  const setTimePeriod = (timePeriod: TimePeriod) => {
    setVibeState(prev => ({ ...prev, timePeriod }));
  };

  const setRealityType = (realityType: RealityType) => {
    setVibeState(prev => ({ ...prev, realityType }));
  };

  const setDescription = (description: string) => {
    setVibeState(prev => ({ ...prev, description }));
  };

  const addMediaUrl = (url: string) => {
    setVibeState(prev => ({ 
      ...prev, 
      mediaUrls: [...prev.mediaUrls, url] 
    }));
  };

  const removeMediaUrl = (url: string) => {
    setVibeState(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter(u => u !== url)
    }));
  };

  const setConvergeDiverge = (value: ConvergeDiverge) => {
    setVibeState(prev => ({ ...prev, convergeDiverge: value }));
  };

  const nextStep = () => {
    setVibeState(prev => ({ 
      ...prev, 
      currentStep: Math.min(prev.currentStep + 1, 5) // Max 5 steps (0-indexed)
    }));
  };

  const prevStep = () => {
    setVibeState(prev => ({ 
      ...prev, 
      currentStep: Math.max(prev.currentStep - 1, 0) // Min 0 step
    }));
  };

  const goToStep = (step: number) => {
    setVibeState(prev => ({ 
      ...prev, 
      currentStep: Math.min(Math.max(step, 0), 5) // Keep between 0-5
    }));
  };

  const resetVibe = () => {
    setVibeState(initialState);
    setVibeData(null);
    setError(null);
  };

  return (
    <VibeContext.Provider
      value={{
        vibeState,
        setLocation,
        setTimePeriod,
        setRealityType,
        setDescription,
        addMediaUrl,
        removeMediaUrl,
        setConvergeDiverge,
        nextStep,
        prevStep,
        goToStep,
        resetVibe,
        // Add API state
        vibeData,
        setVibeData,
        loading,
        setLoading,
        error,
        setError
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};

// Custom hook to use the context
export const useVibe = () => useContext(VibeContext);

// Custom hook to use just the vibe data part of the context
export const useVibeData = () => {
  const { vibeData, loading, error } = useContext(VibeContext);
  return { vibeData, loading, error };
};

export default VibeContext; 