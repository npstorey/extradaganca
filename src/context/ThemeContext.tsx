import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { extractThemeFromVibe, VibeTheme } from '../services/styleExtractionService';
import { Vibe } from '../types/vibe';

interface ThemeUpdateOptions {
  mood?: string;
  colors?: string[];
  layout?: string;
  fonts?: {
    title?: string;
    body?: string;
  };
  effects?: {
    glow?: boolean;
    overlay?: string;
    backgroundPattern?: string;
  };
}

// Default theme - locally defined since we no longer import it
const defaultTheme: VibeTheme = {
  primaryColor: '#4e00ec',
  secondaryColor: '#ff00ff',
  backgroundColor: '#0c0c14',
  textColor: '#ffffff',
  accentColor: '#00ffcc',
  fontFamily: "'VT323', monospace",
  titleFontFamily: "'Orbitron', sans-serif",
  borderRadius: '4px',
  spacing: '1rem',
  glowEffect: '0 0 10px',
  glowIntensity: 0.5,
  borderStyle: 'solid',
  textShadow: '0 0 5px',
  backgroundPattern: 'none',
  animationSpeed: 'normal',
  layoutStyle: 'grid',
  overlayEffect: 'none',
  boxShadowStyle: '0 5px 15px rgba(0, 0, 0, 0.5)',
  gradientOverlay: 'none'
};

interface ThemeContextType {
  theme: VibeTheme;
  updateThemeFromVibe: (vibe: Vibe | null) => void;
  updateTheme: (options: ThemeUpdateOptions) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateThemeFromVibe: () => {},
  updateTheme: () => {},
  resetTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<VibeTheme>(defaultTheme);

  const updateThemeFromVibe = (vibe: Vibe | null) => {
    if (!vibe) {
      setTheme(defaultTheme);
      return;
    }
    
    console.log('Updating theme from vibe:', vibe.title);
    const extractedTheme = extractThemeFromVibe(vibe);
    console.log('Extracted theme:', extractedTheme);
    setTheme(extractedTheme);
  };
  
  const updateTheme = (options: ThemeUpdateOptions) => {
    console.log('Updating theme with options:', options);
    
    setTheme(prevTheme => {
      const newTheme = { ...prevTheme };
      
      // Update mood-based properties
      if (options.mood) {
        // This would normally call helper functions from styleExtractionService
        // For now, we'll just set some properties based on the mood
        
        // Example: Set different colors based on mood
        if (options.mood === 'energetic') {
          newTheme.primaryColor = '#ff4500';
          newTheme.accentColor = '#ffff00';
          newTheme.backgroundColor = '#240f00';
          newTheme.glowIntensity = 1.0;
          newTheme.animationSpeed = 'fast';
        } else if (options.mood === 'calm') {
          newTheme.primaryColor = '#4682b4';
          newTheme.accentColor = '#a0d6b4';
          newTheme.backgroundColor = '#0c1f2a';
          newTheme.glowIntensity = 0.3;
          newTheme.animationSpeed = 'slow';
        } else if (options.mood === 'mysterious') {
          newTheme.primaryColor = '#800080';
          newTheme.accentColor = '#00ffcc';
          newTheme.backgroundColor = '#150015';
          newTheme.overlayEffect = 'vignette';
          newTheme.textShadow = '0 0 8px';
        } else if (options.mood === 'retro') {
          newTheme.primaryColor = '#ff00ff';
          newTheme.accentColor = '#ffcc00';
          newTheme.backgroundColor = '#0d0d0d';
          newTheme.backgroundPattern = 'grid';
          newTheme.fontFamily = "'VT323', monospace";
          newTheme.titleFontFamily = "'Press Start 2P', cursive";
        } else if (options.mood === 'futuristic') {
          newTheme.primaryColor = '#00ff00';
          newTheme.accentColor = '#00ccff';
          newTheme.backgroundColor = '#001a00';
          newTheme.fontFamily = "'Rajdhani', sans-serif";
          newTheme.titleFontFamily = "'Orbitron', sans-serif";
          newTheme.overlayEffect = 'scanlines';
        }
      }
      
      // Override with specific colors if provided
      if (options.colors && options.colors.length > 0) {
        if (options.colors[0]) newTheme.primaryColor = options.colors[0];
        if (options.colors[1]) newTheme.accentColor = options.colors[1];
      }
      
      // Override fonts if provided
      if (options.fonts) {
        if (options.fonts.title) newTheme.titleFontFamily = options.fonts.title;
        if (options.fonts.body) newTheme.fontFamily = options.fonts.body;
      }
      
      // Override effects if provided
      if (options.effects) {
        if (options.effects.backgroundPattern) {
          newTheme.backgroundPattern = options.effects.backgroundPattern;
        }
        if (options.effects.overlay) {
          newTheme.overlayEffect = options.effects.overlay;
        }
        if (options.effects.glow !== undefined) {
          newTheme.glowIntensity = options.effects.glow ? 1.0 : 0.0;
        }
      }
      
      // Override layout if provided
      if (options.layout) {
        newTheme.layoutStyle = options.layout;
      }
      
      return newTheme;
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateThemeFromVibe, updateTheme, resetTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 