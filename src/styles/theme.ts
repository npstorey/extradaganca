import { css } from 'styled-components';

// Color palette
export const colors = {
  // Neon colors
  neonGreen: '#0cff0c',
  neonPink: '#ff00ff',
  neonBlue: '#00ffff',
  neonYellow: '#ffff00',
  neonRed: '#ff0000',
  
  // Base colors
  black: '#000000',
  darkGray: '#121212',
  mediumGray: '#222222',
  lightGray: '#333333',
  white: '#ffffff',
  
  // Terminal colors
  terminalGreen: '#33ff33',
  terminalAmber: '#ffb000',
  
  // Accent colors
  purple: '#9900ff',
  electricBlue: '#0077ff',
};

// Typography
export const fonts = {
  terminal: '"VT323", "Courier New", monospace',
  display: '"Press Start 2P", "VT323", monospace',
  pixel: '"Silkscreen", "Press Start 2P", monospace',
  glitch: '"Orbitron", "Blade Runner", sans-serif',
};

// Effects
export const effects = {
  // CRT scan line effect
  scanlines: css`
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0.25) 50%
      );
      background-size: 100% 4px;
      z-index: 100;
      pointer-events: none;
      opacity: 0.3;
    }
  `,
  
  // CRT flicker effect
  flicker: css`
    animation: flicker 0.3s infinite alternate;
    
    @keyframes flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        opacity: 1;
      }
      20%, 24%, 55% {
        opacity: 0.8;
      }
    }
  `,
  
  // Glitch effect
  glitch: css`
    position: relative;
    
    &::before, &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    &::before {
      left: 2px;
      text-shadow: -1px 0 ${colors.neonRed};
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
    }
    
    &::after {
      left: -2px;
      text-shadow: 1px 0 ${colors.neonBlue};
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
    }
    
    @keyframes glitch-anim-1 {
      0%, 100% { clip-path: inset(50% 0 30% 0); }
      20% { clip-path: inset(33% 0 33% 0); }
      40% { clip-path: inset(10% 0 60% 0); }
      60% { clip-path: inset(80% 0 7% 0); }
      80% { clip-path: inset(27% 0 40% 0); }
    }
    
    @keyframes glitch-anim-2 {
      0%, 100% { clip-path: inset(33% 0 33% 0); }
      20% { clip-path: inset(50% 0 20% 0); }
      40% { clip-path: inset(10% 0 60% 0); }
      60% { clip-path: inset(40% 0 43% 0); }
      80% { clip-path: inset(5% 0 80% 0); }
    }
  `,
  
  // CRT screen border effect
  crtBorder: css`
    position: relative;
    border-radius: 10px;
    box-shadow: 
      0 0 10px ${colors.neonGreen},
      inset 0 0 10px ${colors.neonGreen};
    padding: 20px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 10px;
      background: radial-gradient(
        ellipse at center,
        transparent 60%,
        rgba(0, 0, 0, 0.6) 100%
      );
      pointer-events: none;
    }
  `,
  
  // Screen distortion
  distortion: css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
      opacity: 0.2;
    }
  `,
};

// Responsive breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

// Z-index layers
export const layers = {
  base: 1,
  mid: 10,
  top: 100,
  overlay: 1000,
};

// Animation durations
export const duration = {
  fast: '150ms',
  medium: '300ms',
  slow: '500ms',
};

export default {
  colors,
  fonts,
  effects,
  breakpoints,
  layers,
  duration,
}; 