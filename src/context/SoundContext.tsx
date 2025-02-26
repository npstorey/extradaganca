import React, { createContext, useContext, ReactNode } from 'react';
import useSoundEffects, { SoundEffect } from '../hooks/useSoundEffects';

// Create a context for our sound effects
const SoundContext = createContext<ReturnType<typeof useSoundEffects> | null>(null);

// Provider component that will wrap our app
export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create a single instance of our sound effects hook with sounds disabled by default
  const soundEffects = useSoundEffects(false);
  
  return (
    <SoundContext.Provider value={soundEffects}>
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook to use the sound context
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}; 