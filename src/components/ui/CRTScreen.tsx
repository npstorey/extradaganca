import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../../styles/theme';

interface CRTScreenProps {
  children: ReactNode;
  flicker?: boolean;
}

const flicker = keyframes`
  0% {
    opacity: 0.97;
  }
  5% {
    opacity: 0.95;
  }
  10% {
    opacity: 0.94;
  }
  15% {
    opacity: 0.98;
  }
  20% {
    opacity: 0.93;
  }
  25% {
    opacity: 0.97;
  }
  30% {
    opacity: 0.94;
  }
  35% {
    opacity: 0.93;
  }
  40% {
    opacity: 0.96;
  }
  45% {
    opacity: 0.97;
  }
  50% {
    opacity: 0.92;
  }
  55% {
    opacity: 0.95;
  }
  60% {
    opacity: 0.98;
  }
  70% {
    opacity: 0.92;
  }
  80% {
    opacity: 0.94;
  }
  90% {
    opacity: 0.98;
  }
  100% {
    opacity: 0.96;
  }
`;

const scanline = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
`;

const screenGlow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(51, 255, 51, 0.2);
  }
  50% {
    box-shadow: 0 0 15px rgba(51, 255, 51, 0.5);
  }
  100% {
    box-shadow: 0 0 10px rgba(51, 255, 51, 0.2);
  }
`;

const Container = styled.div<{ $flicker: boolean }>`
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
  overflow: hidden;
  z-index: 0;
  box-shadow: 0 0 15px rgba(51, 255, 51, 0.3);
  animation: ${screenGlow} 3s infinite ease-in-out;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(51, 255, 51, 0.03),
      transparent
    );
    background-size: 100% 3px;
    z-index: 2;
    pointer-events: none;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      transparent 30%,
      rgba(0, 0, 0, 0.3) 90%
    );
    z-index: 3;
    pointer-events: none;
  }
  
  ${props => props.$flicker && `
    animation: ${flicker} 0.3s infinite alternate-reverse;
  `}
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to bottom,
    rgba(51, 255, 51, 0),
    rgba(51, 255, 51, 0.1),
    rgba(51, 255, 51, 0)
  );
  opacity: 0.1;
  z-index: 4;
  animation: ${scanline} 6s linear infinite;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.85);
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: ${colors.neonGreen} ${colors.black};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.black};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.neonGreen};
    border-radius: 4px;
    border: 2px solid ${colors.black};
  }
`;

const CRTScreen: React.FC<CRTScreenProps> = ({ children, flicker = false }) => {
  return (
    <Container $flicker={flicker}>
      <Scanline />
      <Content>{children}</Content>
    </Container>
  );
};

export default CRTScreen; 