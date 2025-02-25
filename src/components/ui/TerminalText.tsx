import React, { useEffect, useState, ReactNode } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { colors, fonts } from '../../styles/theme';

// Define the props interface
interface TerminalTextProps {
  children: ReactNode;
  typing?: boolean;
  delay?: number;
  speed?: number;
  blinking?: boolean;
  glitch?: boolean;
  color?: string;
  fontSize?: string;
  maxWidth?: string;
  as?: React.ElementType;
  className?: string;
}

// Keyframes for the blinking cursor
const blink = keyframes`
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
`;

// Keyframes for glitch effect
const glitch = keyframes`
  0% {
    transform: translate(0);
    opacity: 1;
  }
  20% {
    transform: translate(-2px, 1px);
    opacity: 0.9;
  }
  40% {
    transform: translate(2px, -1px);
    opacity: 1;
  }
  60% {
    transform: translate(-1px, -1px);
    opacity: 0.9;
  }
  80% {
    transform: translate(1px, 1px);
    opacity: 1;
  }
  100% {
    transform: translate(0);
    opacity: 1;
  }
`;

// Styled component for the text container
const TextContainer = styled.div<{
  $color: string;
  $fontSize: string;
  $maxWidth?: string;
  $withCursor: boolean;
  $blinking: boolean;
  $glitch: boolean;
}>`
  color: ${props => props.$color};
  font-family: ${fonts.terminal};
  font-size: ${props => props.$fontSize};
  line-height: 1.5;
  position: relative;
  ${props => props.$maxWidth && `max-width: ${props.$maxWidth};`}
  
  ${props => props.$glitch && css`
    animation: ${glitch} 1.5s infinite alternate-reverse;
  `}
  
  ${props => props.$withCursor && css`
    &::after {
      content: '█';
      position: ${props.$blinking ? 'absolute' : 'static'};
      margin-left: 2px;
      animation: ${props.$blinking ? css`${blink} 1s infinite` : 'none'};
    }
  `}
`;

// The TerminalText component
const TerminalText: React.FC<TerminalTextProps> = ({
  children,
  typing = false,
  delay = 0,
  speed = 30,
  blinking = false,
  glitch = false,
  color = colors.terminalGreen,
  fontSize = '1rem',
  maxWidth,
  as = 'div',
  className,
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [showCursor, setShowCursor] = useState<boolean>(typing || blinking);
  const [isTyping, setIsTyping] = useState<boolean>(typing);
  const fullText = children?.toString() || '';
  
  useEffect(() => {
    if (!typing) {
      setDisplayText(fullText);
      return;
    }
    
    setDisplayText('');
    setIsTyping(true);
    
    const typingTimer = setTimeout(() => {
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayText(prev => prev + fullText.charAt(currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, speed);
      
      return () => clearInterval(typeInterval);
    }, delay);
    
    return () => clearTimeout(typingTimer);
  }, [fullText, typing, delay, speed]);
  
  return (
    <TextContainer
      as={as}
      $color={color}
      $fontSize={fontSize}
      $maxWidth={maxWidth}
      $withCursor={showCursor && (isTyping || blinking)}
      $blinking={blinking}
      $glitch={glitch}
      className={className}
    >
      {typing ? displayText : children}
    </TextContainer>
  );
};

export default TerminalText; 