import React, { useState, useEffect, forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { colors, fonts, duration } from '../../styles/theme';

export interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHover?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  glitchOnHover?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  unstable?: boolean; // Adds subtle random movement
}

// Button hover glow animation
const buttonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
  50% { box-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
`;

// Random jitter animation for unstable buttons
const jitter = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-1px, 1px);
  }
  20% {
    transform: translate(1px, -1px);
  }
  30% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(2px, -2px);
  }
  50% {
    transform: translate(-1px, 1px);
  }
  60% {
    transform: translate(1px, -1px);
  }
  70% {
    transform: translate(-2px, 2px);
  }
  80% {
    transform: translate(2px, -1px);
  }
  90% {
    transform: translate(-1px, 1px);
  }
`;

// Glitch effect
const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

// Get color based on variant
const getButtonColor = (variant: 'primary' | 'secondary' | 'danger' | 'success') => {
  switch (variant) {
    case 'primary':
      return colors.neonBlue;
    case 'secondary':
      return colors.neonPink;
    case 'danger':
      return colors.neonRed;
    case 'success':
      return colors.neonGreen;
    default:
      return colors.neonBlue;
  }
};

const getButtonSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
      `;
    case 'medium':
      return css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: 0.7rem 1.4rem;
        font-size: 1.2rem;
      `;
    default:
      return css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
      `;
  }
};

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'danger' | 'success';
  $size: 'small' | 'medium' | 'large';
  $fullWidth: boolean;
  $isHovered: boolean;
  $isGlitching: boolean;
  $unstable: boolean;
}>`
  position: relative;
  background-color: ${colors.darkGray};
  color: ${props => getButtonColor(props.$variant)};
  font-family: ${fonts.terminal};
  border: 2px solid ${props => getButtonColor(props.$variant)};
  ${props => getButtonSize(props.$size)}
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all ${duration.medium} ease;
  outline: none;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  animation: ${props => props.$unstable ? css`${jitter} 10s infinite` : 'none'};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 55%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
    z-index: 1;
    pointer-events: none;
  }
  
  &:hover:not(:disabled) {
    background-color: ${props => props.$isHovered ? 'rgba(0, 0, 0, 0.7)' : getButtonColor(props.$variant)};
    color: ${props => props.$isHovered ? getButtonColor(props.$variant) : colors.black};
    box-shadow: 0 0 10px ${props => getButtonColor(props.$variant)};
    animation: ${buttonGlow} 2s infinite;
    text-shadow: 0 0 5px ${props => getButtonColor(props.$variant)};
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(2px);
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3), 0 0 0 6px ${props => getButtonColor(props.$variant)};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${colors.lightGray};
    color: ${colors.lightGray};
  }
`;

// Create glitch overlays
const GlitchOverlay = styled.span<{ $buttonColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  animation: ${glitch} 0.3s infinite;
  
  &:nth-child(1) {
    color: ${colors.neonRed};
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    transform: translate(-2px);
  }
  
  &:nth-child(2) {
    color: ${colors.neonBlue};
    clip-path: polygon(0 33%, 100% 33%, 100% 66%, 0 66%);
  }
  
  &:nth-child(3) {
    color: ${colors.neonGreen};
    clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
    transform: translate(2px);
  }
`;

const ButtonContent = styled.span`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const glitchAnim = keyframes`
  0% {
    clip-path: polygon(0 0, 100% 0, 100% 2%, 0 2%);
    transform: translate(0);
  }
  20% {
    clip-path: polygon(0 15%, 100% 15%, 100% 25%, 0 25%);
    transform: translate(-4px, 0);
  }
  40% {
    clip-path: polygon(0 45%, 100% 45%, 100% 65%, 0 65%);
    transform: translate(4px, 0);
  }
  60% {
    clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
    transform: translate(-3px, 0);
  }
  80% {
    clip-path: polygon(0 75%, 100% 75%, 100% 90%, 0 90%);
    transform: translate(2px, 0);
  }
  100% {
    clip-path: polygon(0 85%, 100% 85%, 100% 100%, 0 100%);
    transform: translate(0);
  }
`;

const GlitchText = styled.span`
  position: relative;
  display: inline-block;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::before {
    color: cyan;
    animation: ${glitchAnim} 0.3s infinite linear alternate-reverse;
    z-index: -1;
  }

  &::after {
    color: magenta;
    animation: ${glitchAnim} 0.3s infinite linear alternate;
    z-index: -2;
  }
`;

const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>((props, ref) => {
  const { 
    variant = 'primary', 
    size = 'medium', 
    fullWidth = false, 
    children, 
    onClick, 
    unstable = false,
    onHover,
    ...rest 
  } = props;
  
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (unstable && Math.random() > 0.7) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) {
      onHover();
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isHovered={isHovered}
      $isGlitching={isGlitching}
      $unstable={unstable}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {isGlitching ? (
        <GlitchText data-text={children}>{children}</GlitchText>
      ) : (
        children
      )}
    </StyledButton>
  );
});

// Add display name for debugging
RetroButton.displayName = 'RetroButton';

export default RetroButton; 