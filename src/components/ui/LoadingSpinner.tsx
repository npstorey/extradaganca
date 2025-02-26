import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SpinnerContainer = styled.div<{
  $size: number;
  $speed: 'slow' | 'normal' | 'fast';
}>`
  display: inline-block;
  position: relative;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterRing = styled.div<{
  $size: number;
  $color: string;
  $speed: 'slow' | 'normal' | 'fast';
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: ${props => Math.max(2, props.$size / 20)}px solid transparent;
  border-top-color: ${props => props.$color};
  border-right-color: ${props => props.$color};
  border-radius: 50%;
  animation: ${rotate} ${props => 
    props.$speed === 'slow' ? '3s' : 
    props.$speed === 'fast' ? '1s' : 
    '2s'
  } linear infinite;
`;

const InnerRing = styled.div<{
  $size: number;
  $color: string;
  $speed: 'slow' | 'normal' | 'fast';
}>`
  position: absolute;
  top: ${props => props.$size / 5}px;
  left: ${props => props.$size / 5}px;
  width: ${props => props.$size * 0.6}px;
  height: ${props => props.$size * 0.6}px;
  border: ${props => Math.max(2, props.$size / 25)}px solid transparent;
  border-bottom-color: ${props => props.$color};
  border-left-color: ${props => props.$color};
  border-radius: 50%;
  animation: ${rotate} ${props => 
    props.$speed === 'slow' ? '2.5s' : 
    props.$speed === 'fast' ? '0.75s' : 
    '1.5s'
  } linear infinite reverse;
`;

const Center = styled.div<{
  $size: number;
  $color: string;
}>`
  position: absolute;
  width: ${props => props.$size / 5}px;
  height: ${props => props.$size / 5}px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color,
  secondaryColor,
  speed = 'normal',
  className
}) => {
  // Use theme colors if not provided
  const primaryColor = color || '#00ffcc';
  const secondColor = secondaryColor || '#4e00ec';

  return (
    <SpinnerContainer $size={size} $speed={speed} className={className}>
      <OuterRing $size={size} $color={primaryColor} $speed={speed} />
      <InnerRing $size={size} $color={secondColor} $speed={speed} />
      <Center $size={size} $color={primaryColor} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 