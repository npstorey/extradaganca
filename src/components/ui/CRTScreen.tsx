import React, { ReactNode, useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { colors, effects } from '../../styles/theme';

interface CRTScreenProps {
  children: ReactNode;
  glitchIntensity?: 'none' | 'low' | 'medium' | 'high';
  flicker?: boolean;
  scanlines?: boolean;
  borderGlow?: string;
  curvature?: 'none' | 'slight' | 'medium' | 'heavy';
  width?: string;
  height?: string;
  noise?: boolean;
}

// Random glitch animation
const glitchAnimation = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

// Screen turn on animation
const turnOn = keyframes`
  0% {
    transform: scale(1, 0.005);
    opacity: 0;
  }
  9% {
    transform: scale(1, 0.005);
    opacity: 1;
  }
  10% {
    transform: scale(1, 0.03);
  }
  11% {
    transform: scale(1, 0.03);
    opacity: 1;
  }
  14% {
    transform: scale(1, 0.02);
  }
  15% {
    transform: scale(1, 0.08);
  }
  16% {
    transform: scale(1, 0.15);
  }
  20% {
    transform: scale(1, 0.3);
  }
  25% {
    transform: scale(1, 0.5);
    opacity: 1;
  }
  29% {
    transform: scale(1, 0.8);
  }
  30% {
    transform: scale(1, 0.9);
  }
  35% {
    transform: scale(1, 0.95);
  }
  39% {
    transform: scale(1, 0.98);
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Noise pattern
const noiseAnimation = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 100%; }
`;

// Define screen curvature styles based on intensity
const getCurvatureStyle = (curvature: 'none' | 'slight' | 'medium' | 'heavy') => {
  switch (curvature) {
    case 'slight':
      return css`border-radius: 10px; &::before { border-radius: 10px; }`;
    case 'medium':
      return css`border-radius: 15px; &::before { border-radius: 15px; }`;
    case 'heavy':
      return css`border-radius: 20px; &::before { border-radius: 20px; }`;
    default:
      return '';
  }
};

// Get glitch animation intensity
const getGlitchStyle = (intensity: 'none' | 'low' | 'medium' | 'high') => {
  switch (intensity) {
    case 'low':
      return css`
        animation: ${glitchAnimation} 8s step-end infinite;
      `;
    case 'medium':
      return css`
        animation: ${glitchAnimation} 4s step-end infinite;
      `;
    case 'high':
      return css`
        animation: ${glitchAnimation} 2s step-end infinite;
      `;
    default:
      return '';
  }
};

const Screen = styled.div<{
  glitchIntensity: 'none' | 'low' | 'medium' | 'high';
  flicker: boolean;
  scanlines: boolean;
  borderGlow: string;
  curvature: 'none' | 'slight' | 'medium' | 'heavy';
  width: string;
  height: string;
  noise: boolean;
}>`
  position: relative;
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${colors.black};
  color: ${colors.terminalGreen};
  overflow: hidden;
  box-shadow: 
    0 0 0 3px ${colors.darkGray}, 
    0 0 0 5px ${colors.black}, 
    0 0 10px ${props => props.borderGlow},
    0 0 20px rgba(0, 0, 0, 0.5);
  padding: 20px;
  animation: ${turnOn} 2s ease-in-out;
  ${props => getCurvatureStyle(props.curvature)}
  ${props => props.flicker && effects.flicker}
  ${props => props.scanlines && effects.scanlines}
  ${props => getGlitchStyle(props.glitchIntensity)}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 60%,
      rgba(0, 0, 0, 0.7) 100%
    );
    pointer-events: none;
    z-index: 2;
  }
  
  ${props => props.noise && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.05;
      pointer-events: none;
      animation: ${noiseAnimation} 1s linear infinite;
      z-index: 1;
    }
  `}
`;

const ScreenContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 3;
  overflow: auto;
  padding: 15px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.darkGray};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.terminalGreen};
  }
`;

// Interference lines that randomly appear
const Interference = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 10;
  opacity: 0;
  transform: translateY(-10px);
  transition: transform 0.05s linear, opacity 0.05s linear;
`;

const CRTScreen: React.FC<CRTScreenProps> = ({
  children,
  glitchIntensity = 'low',
  flicker = true,
  scanlines = true,
  borderGlow = colors.neonGreen,
  curvature = 'medium',
  width = '100%',
  height = '100%',
  noise = true
}) => {
  const [interference, setInterference] = useState({ visible: false, position: 0 });
  
  // Random interference effect
  useEffect(() => {
    const interferenceInterval = setInterval(() => {
      // 10% chance of interference
      if (Math.random() > 0.9) {
        const position = Math.floor(Math.random() * 100);
        setInterference({ visible: true, position });
        
        // Hide after a short time
        setTimeout(() => {
          setInterference({ visible: false, position });
        }, 200);
      }
    }, 2000);
    
    return () => clearInterval(interferenceInterval);
  }, []);
  
  return (
    <Screen
      glitchIntensity={glitchIntensity}
      flicker={flicker}
      scanlines={scanlines}
      borderGlow={borderGlow}
      curvature={curvature}
      width={width}
      height={height}
      noise={noise}
    >
      <Interference 
        style={{ 
          opacity: interference.visible ? 0.7 : 0,
          transform: `translateY(${interference.position}%)`
        }} 
      />
      <ScreenContent>
        {children}
      </ScreenContent>
    </Screen>
  );
};

export default CRTScreen; 