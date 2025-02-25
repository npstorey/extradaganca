import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useVibe } from '../../context/VibeContext';
import { useSound } from '../../context/SoundContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import SoundButton from '../ui/SoundButton';
import { colors, fonts, duration } from '../../styles/theme';

// Blinking cursor animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// ASCII map animation
const mapScan = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
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
  filter: drop-shadow(0 0 8px ${colors.neonPink});
`;

const LocationInputContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
  position: relative;
`;

const LocationInput = styled.input`
  width: 100%;
  background-color: rgba(0, 20, 0, 0.8);
  border: 2px solid ${colors.terminalGreen};
  color: ${colors.terminalGreen};
  font-family: ${fonts.terminal};
  font-size: 1.2rem;
  padding: 0.8rem 1rem;
  outline: none;
  box-shadow: 0 0 10px rgba(51, 255, 51, 0.3);
  
  &:focus {
    border-color: ${colors.neonGreen};
    box-shadow: 0 0 15px rgba(51, 255, 51, 0.5);
  }
  
  &::placeholder {
    color: rgba(51, 255, 51, 0.5);
  }
`;

const CommandPrompt = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${colors.terminalGreen};
  font-family: ${fonts.terminal};
  font-size: 1.2rem;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: ${colors.terminalGreen};
  margin-left: 5px;
  animation: ${blink} 1s step-end infinite;
`;

const MapContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  border: 2px solid ${colors.terminalAmber};
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  padding: 10px;
  font-family: ${fonts.terminal};
  font-size: 0.7rem;
  color: ${colors.terminalAmber};
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
  
  &::before {
    content: "LOCATION SCAN";
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    letter-spacing: 1px;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 176, 0, 0.1),
      transparent
    );
    pointer-events: none;
  }
`;

const ASCIIMap = styled.pre`
  margin: 0;
  padding: 0;
  animation: ${mapScan} 30s linear infinite;
  transform: translateY(-30%);
  color: ${colors.terminalAmber};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const LocationStep: React.FC = () => {
  const { vibeState, setLocation, nextStep } = useVibe();
  const [inputValue, setInputValue] = useState(vibeState.location);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const soundEffects = useSound();
  const typingTimeoutRef = useRef<number | null>(null);
  
  // Show command prompt typing effect on mount
  useEffect(() => {
    setTimeout(() => setShowPrompt(false), 1500);
    setTimeout(() => {
      setIsTyping(true);
      soundEffects.play('typing');
    }, 1800);
  }, [soundEffects]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setErrorMessage('');
    
    // Play typing sound
    if (value !== inputValue) {
      soundEffects.play('typing');
      
      // Set typing flag and clear previous timeout
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Clear typing flag after short delay
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };
  
  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setErrorMessage('ERROR: LOCATION DATA REQUIRED');
      soundEffects.play('error');
      return;
    }
    
    // Play success sound directly here for immediate feedback
    soundEffects.play('success');
    console.log('Playing success sound for location submit');
    
    // Set location immediately
    setLocation(inputValue.trim());
    
    // Delay navigation to ensure sound plays
    setTimeout(() => {
      nextStep();
    }, 300); // 300ms delay to ensure sound plays before navigation
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // Generate random ASCII art for map background
  const generateASCIIMap = () => {
    const mapChars = ['█', '▓', '▒', '░', '◢', '◣', '◤', '◥', '■', '□', '▪', '▫', '●', '○', '◆', '◇'];
    const mapWidth = 25;
    const mapHeight = 40;
    let map = '';
    
    for (let i = 0; i < mapHeight; i++) {
      for (let j = 0; j < mapWidth; j++) {
        // Add some structure to make it look like a map
        if (i % 5 === 0 || j % 8 === 0) {
          map += '·';
        } else if (Math.random() > 0.7) {
          map += mapChars[Math.floor(Math.random() * mapChars.length)];
        } else {
          map += ' ';
        }
      }
      map += '\n';
    }
    
    return map;
  };
  
  return (
    <CRTScreen borderGlow={colors.terminalAmber} glitchIntensity="low">
      <Container>
        <QuestionHeading>WHERE ARE YOU?</QuestionHeading>
        
        <LocationInputContainer>
          {showPrompt ? (
            <CommandPrompt>
              LOCATION_SCAN.exe<Cursor />
            </CommandPrompt>
          ) : isTyping ? (
            <TerminalText
              text="ENTER COORDINATES OR LOCATION NAME:"
              typingSpeed={50}
              onComplete={() => {}}
            />
          ) : (
            <CommandPrompt>
              ENTER COORDINATES OR LOCATION NAME:
            </CommandPrompt>
          )}
          
          <LocationInput
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g. Tokyo, Japan or 35.6762° N, 139.6503° E"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          
          {errorMessage && (
            <TerminalText
              text={errorMessage}
              textColor={colors.neonRed}
              initiallyVisible={true}
            />
          )}
          
          <ButtonContainer>
            <SoundButton 
              onClick={handleSubmit}
              variant="primary"
              unstable={true}
              soundType="click"
            >
              LOG LOCATION
            </SoundButton>
          </ButtonContainer>
          
          {/* Sound test button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <SoundButton 
              onClick={() => {
                console.log('Testing all sounds');
                // Use the test function which will play all sounds in sequence
                const testSounds = () => {
                  soundEffects.play('click');
                  setTimeout(() => soundEffects.play('hover'), 300);
                  setTimeout(() => soundEffects.play('success'), 600);
                  setTimeout(() => soundEffects.play('error'), 900);
                  setTimeout(() => soundEffects.play('glitch'), 1200);
                  setTimeout(() => soundEffects.play('typing'), 1500);
                  setTimeout(() => soundEffects.play('transition'), 1800);
                };
                testSounds();
              }}
              variant="secondary"
              size="small"
              soundType="click"
            >
              Test All Sounds
            </SoundButton>
          </div>
        </LocationInputContainer>
        
        <MapContainer>
          <ASCIIMap>
            {generateASCIIMap()}
          </ASCIIMap>
        </MapContainer>
      </Container>
    </CRTScreen>
  );
};

export default LocationStep; 