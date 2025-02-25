import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useVibe, RealityType } from '../../context/VibeContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import SoundButton from '../ui/SoundButton';
import { colors, fonts } from '../../styles/theme';
import { useSound } from '../../context/SoundContext';

// Flashing animation for buttons
const flash = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Matrix-like rain effect
const matrixRain = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// Glitch effect for imaginary button
const glitchText = keyframes`
  0%, 100% { transform: translate(0); clip-path: inset(0 0 0 0); }
  20% { transform: translate(-1px, 1px); clip-path: inset(30% 0 10% 0); }
  40% { transform: translate(1px, -1px); clip-path: inset(10% 0 50% 0); }
  60% { transform: translate(1px, 1px); clip-path: inset(0% 10% 20% 0); }
  80% { transform: translate(-1px, -1px); clip-path: inset(40% 0 0% 10%); }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const QuestionHeading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 2px;
  color: ${colors.neonBlue};
  filter: drop-shadow(0 0 8px ${colors.neonBlue});
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
  width: 100%;
  max-width: 600px;
  position: relative;
`;

const ChoiceButton = styled.div<{ 
  selected: boolean; 
  type: RealityType;
  hovered: boolean;
}>`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.type === 'real' ? css`
    background-color: ${props.selected ? colors.darkGray : 'rgba(0, 20, 50, 0.5)'};
    border: 2px solid ${props.selected ? colors.neonBlue : colors.lightGray};
    box-shadow: ${props.selected ? `0 0 20px ${colors.neonBlue}, inset 0 0 20px ${colors.neonBlue}` : 'none'};
    
    &:hover {
      border-color: ${colors.neonBlue};
      box-shadow: 0 0 10px ${colors.neonBlue};
    }
  ` : css`
    background-color: ${props.selected ? colors.darkGray : 'rgba(50, 0, 50, 0.5)'};
    border: 2px solid ${props.selected ? colors.neonPink : colors.lightGray};
    box-shadow: ${props.selected ? `0 0 20px ${colors.neonPink}, inset 0 0 20px ${colors.neonPink}` : 'none'};
    
    &:hover {
      border-color: ${colors.neonPink};
      box-shadow: 0 0 10px ${colors.neonPink};
    }
    
    // Occasional distortion on hover
    ${props.hovered && css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          ${Math.random() * 360}deg,
          rgba(255, 0, 255, 0.1),
          transparent,
          rgba(255, 0, 255, 0.1)
        );
        z-index: 1;
        animation: ${flash} 0.3s linear infinite;
      }
    `}
  `}
`;

const ButtonIcon = styled.div<{ type: RealityType; selected: boolean }>`
  font-size: 3rem;
  margin-bottom: 1rem;
  ${props => props.type === 'real' ? css`
    color: ${props.selected ? colors.neonBlue : colors.lightGray};
  ` : css`
    color: ${props.selected ? colors.neonPink : colors.lightGray};
    animation: ${props.selected ? css`${flash} 2s infinite` : 'none'};
  `}
`;

const ButtonLabel = styled.div<{ type: RealityType; selected: boolean }>`
  font-family: ${fonts.terminal};
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  ${props => props.type === 'real' ? css`
    color: ${props.selected ? colors.neonBlue : colors.white};
  ` : css`
    color: ${props.selected ? colors.neonPink : colors.white};
    animation: ${props.selected ? css`${glitchText} 5s infinite` : 'none'};
  `}
`;

const MatrixBackground = styled.div<{ active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${props => props.active ? 0.15 : 0};
  transition: opacity 0.5s ease;
  overflow: hidden;
  pointer-events: none;
  
  &::before {
    content: '01010101010101010101010101010101';
    position: absolute;
    color: ${colors.neonGreen};
    font-family: monospace;
    font-size: 20px;
    letter-spacing: 5px;
    top: 0;
    left: 0;
    width: 1000%;
    height: 100%;
    animation: ${matrixRain} 10s linear infinite;
    opacity: 0.5;
  }
`;

const ImaginaryGlitch = styled.div<{ active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 0, 255, 0.1) 0%,
    transparent 70%
  );
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: -1;
`;

const FloatingSymbols = styled.div<{ active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${props => props.active ? 0.3 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
  overflow: hidden;
`;

const Symbol = styled.div<{ x: number; y: number; delay: number; rotation: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  color: ${colors.neonPink};
  font-size: 1.5rem;
  transform: rotate(${props => props.rotation}deg);
  animation: ${flash} ${props => 2 + props.delay}s infinite;
  filter: blur(1px);
`;

const RealityDescription = styled.div`
  margin-top: 2rem;
  font-family: ${fonts.terminal};
  color: ${colors.white};
  text-align: center;
  font-size: 1rem;
  max-width: 500px;
  min-height: 60px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-top: 2rem;
`;

const RealityStep: React.FC = () => {
  const { vibeState, setRealityType, nextStep, prevStep } = useVibe();
  const [selectedReality, setSelectedReality] = useState<RealityType | null>(vibeState.realityType);
  const [hoveredButton, setHoveredButton] = useState<RealityType | null>(null);
  const soundEffects = useSound();
  const [symbols] = useState(() => 
    Array(15).fill(0).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: ['★', '♦', '✧', '♠', '◊', '✿', '✦', '♣', '♥'][Math.floor(Math.random() * 9)],
      delay: Math.random() * 2,
      rotation: Math.random() * 360
    }))
  );
  
  const handleSelect = (reality: RealityType) => {
    setSelectedReality(reality);
    
    // Play different sounds based on the selection
    if (reality === 'real') {
      soundEffects.play('click');
    } else {
      soundEffects.play('glitch');
    }
  };
  
  const handleContinue = () => {
    if (selectedReality) {
      setRealityType(selectedReality);
      soundEffects.play('success');
      nextStep();
    }
  };
  
  const getDescription = () => {
    if (!selectedReality) return "SELECT REALITY MODE...";
    
    return selectedReality === 'real' 
      ? "REALITY ANCHORS ENGAGED • SIMULATION PARAMETERS SET TO MATCH CONSENSUS REALITY"
      : "UNTETHERING FROM PHYSICAL CONSTRAINTS • ENGAGING DREAM LOGIC PROTOCOLS • REALITY CHECK BYPASSED";
  };
  
  // Random glitch effect
  useEffect(() => {
    if (hoveredButton === 'imaginary') {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          // Force a re-render by setting state
          setHoveredButton(null);
          soundEffects.play('glitch');
          setTimeout(() => setHoveredButton('imaginary'), 100);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [hoveredButton, soundEffects]);
  
  // Random image flash for imaginary button
  const getImaginaryContent = () => {
    if (Math.random() > 0.92 && (hoveredButton === 'imaginary' || selectedReality === 'imaginary')) {
      // Occasionally show a weird symbol instead
      const symbols = ['☢', '☯', '⚡', '⚠', '⚝', '⚛'];
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
    return '✧';
  };
  
  return (
    <CRTScreen borderGlow={colors.neonBlue} glitchIntensity="low">
      <Container>
        <QuestionHeading>REAL LIFE OR IMAGINARY?</QuestionHeading>
        
        <ButtonsContainer>
          <MatrixBackground active={selectedReality === 'real' || hoveredButton === 'real'} />
          <ImaginaryGlitch active={selectedReality === 'imaginary' || hoveredButton === 'imaginary'} />
          
          <ChoiceButton 
            type="real"
            selected={selectedReality === 'real'}
            hovered={hoveredButton === 'real'}
            onClick={() => handleSelect('real')}
            onMouseEnter={() => {
              setHoveredButton('real');
              soundEffects.play('hover');
            }}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <ButtonIcon type="real" selected={selectedReality === 'real'}>
              ⧂
            </ButtonIcon>
            <ButtonLabel type="real" selected={selectedReality === 'real'}>
              Real Life
            </ButtonLabel>
          </ChoiceButton>
          
          <ChoiceButton 
            type="imaginary"
            selected={selectedReality === 'imaginary'}
            hovered={hoveredButton === 'imaginary'}
            onClick={() => handleSelect('imaginary')}
            onMouseEnter={() => {
              setHoveredButton('imaginary');
              soundEffects.play('hover');
            }}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <ButtonIcon type="imaginary" selected={selectedReality === 'imaginary'}>
              {getImaginaryContent()}
            </ButtonIcon>
            <ButtonLabel type="imaginary" selected={selectedReality === 'imaginary'}>
              Imag{Math.random() > 0.9 && (hoveredButton === 'imaginary' || selectedReality === 'imaginary') ? '¡' : 'i'}nary
            </ButtonLabel>
          </ChoiceButton>
          
          <FloatingSymbols active={selectedReality === 'imaginary' || hoveredButton === 'imaginary'}>
            {symbols.map((s, i) => (
              <Symbol 
                key={i} 
                x={s.x} 
                y={s.y} 
                delay={s.delay}
                rotation={s.rotation}
              >
                {s.symbol}
              </Symbol>
            ))}
          </FloatingSymbols>
        </ButtonsContainer>
        
        <RealityDescription>
          <TerminalText
            text={getDescription()}
            initiallyVisible={true}
            glitchFrequency={selectedReality === 'imaginary' ? 0.05 : 0.01}
          />
        </RealityDescription>
        
        <NavigationButtons>
          <SoundButton onClick={prevStep} variant="secondary" soundType="click">
            ◄ BACK
          </SoundButton>
          
          <SoundButton 
            onClick={handleContinue} 
            variant="primary"
            disabled={!selectedReality}
            soundType="success"
          >
            NEXT ►
          </SoundButton>
        </NavigationButtons>
      </Container>
    </CRTScreen>
  );
};

export default RealityStep; 