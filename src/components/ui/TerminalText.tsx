import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from '../../styles/theme';

interface TerminalTextProps {
  text: string;
  typingSpeed?: number; // ms per character
  startDelay?: number; // ms delay before typing starts
  showCursor?: boolean;
  textColor?: string;
  fontSize?: string;
  onComplete?: () => void;
  glitchFrequency?: number; // 0-1, chance of glitch per character
  className?: string;
  initiallyVisible?: boolean;
}

// Blinking cursor animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const TextContainer = styled.div<{ fontSize: string }>`
  font-family: ${fonts.terminal};
  font-size: ${props => props.fontSize};
  line-height: 1.5;
  position: relative;
  display: inline-block;
`;

const GlitchChar = styled.span<{ isGlitched: boolean; textColor: string }>`
  color: ${props => props.isGlitched ? colors.neonPink : props.textColor};
  text-shadow: ${props => props.isGlitched ? `0 0 2px ${colors.neonPink}, 0 0 4px ${colors.neonPink}` : 'none'};
`;

const Cursor = styled.span<{ textColor: string }>`
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: ${props => props.textColor};
  animation: ${blink} 1s step-end infinite;
  margin-left: 2px;
  vertical-align: middle;
`;

const TerminalText: React.FC<TerminalTextProps> = ({
  text,
  typingSpeed = 40,
  startDelay = 0,
  showCursor = true,
  textColor = colors.terminalGreen,
  fontSize = '1rem',
  onComplete,
  glitchFrequency = 0.03,
  className,
  initiallyVisible = false
}) => {
  const [visibleText, setVisibleText] = useState(initiallyVisible ? text : '');
  const [isTyping, setIsTyping] = useState(!initiallyVisible);
  const [glitchedChars, setGlitchedChars] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Effect for typing animation
  useEffect(() => {
    if (initiallyVisible) {
      setVisibleText(text);
      setIsTyping(false);
      onComplete?.();
      return;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setVisibleText('');
    setIsTyping(true);
    
    const startTyping = () => {
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setVisibleText(text.substring(0, currentIndex + 1));
          currentIndex++;
          timeoutRef.current = setTimeout(typeNextChar, typingSpeed);
        } else {
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      };
      
      timeoutRef.current = setTimeout(typeNextChar, 0);
    };
    
    timeoutRef.current = setTimeout(startTyping, startDelay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, typingSpeed, startDelay, onComplete, initiallyVisible]);
  
  // Effect for random character glitching
  useEffect(() => {
    if (!visibleText || visibleText.length === 0) return;
    
    const glitchInterval = setInterval(() => {
      const newGlitchedChars: number[] = [];
      
      // For each character, there's a small chance it will glitch
      for (let i = 0; i < visibleText.length; i++) {
        if (Math.random() < glitchFrequency) {
          newGlitchedChars.push(i);
        }
      }
      
      setGlitchedChars(newGlitchedChars);
    }, 120);
    
    return () => clearInterval(glitchInterval);
  }, [visibleText, glitchFrequency]);
  
  return (
    <TextContainer fontSize={fontSize} className={className}>
      {visibleText.split('').map((char, index) => (
        <GlitchChar 
          key={index} 
          isGlitched={glitchedChars.includes(index)}
          textColor={textColor}
        >
          {char}
        </GlitchChar>
      ))}
      {showCursor && isTyping && <Cursor textColor={textColor} />}
    </TextContainer>
  );
};

export default TerminalText; 