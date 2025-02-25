import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { colors, fonts } from '../../styles/theme';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  small?: boolean;
  danger?: boolean;
  outline?: boolean;
  glowing?: boolean;
}

const pulse = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(51, 255, 51, 0.5), 0 0 10px rgba(51, 255, 51, 0.3);
  }
  50% {
    box-shadow: 0 0 10px rgba(51, 255, 51, 0.8), 0 0 15px rgba(51, 255, 51, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(51, 255, 51, 0.5), 0 0 10px rgba(51, 255, 51, 0.3);
  }
`;

const StyledButton = styled.button<{
  $primary?: boolean;
  $small?: boolean;
  $danger?: boolean;
  $outline?: boolean;
  $glowing?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.terminal};
  font-size: ${props => props.$small ? '0.85rem' : '1rem'};
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: ${props => props.$small ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  user-select: none;
  
  /* Color variations */
  ${props => {
    if (props.$danger) {
      if (props.$outline) {
        return css`
          color: ${colors.neonRed};
          border-color: ${colors.neonRed};
          background: transparent;
          
          &:hover, &:focus {
            background: rgba(255, 0, 0, 0.1);
          }
        `;
      }
      return css`
        color: ${colors.black};
        border-color: ${colors.neonRed};
        background: ${colors.neonRed};
        
        &:hover, &:focus {
          background: #ff4444;
        }
      `;
    }
    
    if (props.$primary) {
      if (props.$outline) {
        return css`
          color: ${colors.neonGreen};
          border-color: ${colors.neonGreen};
          background: transparent;
          
          &:hover, &:focus {
            background: rgba(51, 255, 51, 0.1);
          }
        `;
      }
      return css`
        color: ${colors.black};
        border-color: ${colors.neonGreen};
        background: ${colors.neonGreen};
        
        &:hover, &:focus {
          background: #5aff5a;
        }
      `;
    }
    
    // Default styles
    if (props.$outline) {
      return css`
        color: ${colors.neonBlue};
        border-color: ${colors.neonBlue};
        background: transparent;
        
        &:hover, &:focus {
          background: rgba(51, 153, 255, 0.1);
        }
      `;
    }
    return css`
      color: ${colors.black};
      border-color: ${colors.neonBlue};
      background: ${colors.neonBlue};
      
      &:hover, &:focus {
        background: #5a9dff;
      }
    `;
  }}
  
  /* Glow effect */
  ${props => props.$glowing && css`
    animation: ${pulse} 2s infinite;
  `}
  
  /* Active state */
  &:active {
    transform: translateY(2px);
    filter: brightness(0.9);
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    filter: grayscale(50%);
  }
  
  /* Additional effects */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    transition: all 0.3s ease;
    opacity: 0;
  }
  
  &:hover::before, &:focus::before {
    opacity: 1;
  }
`;

const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ primary, small, danger, outline, glowing, children, ...props }, ref) => {
    return (
      <StyledButton
        $primary={primary}
        $small={small}
        $danger={danger}
        $outline={outline}
        $glowing={glowing}
        ref={ref}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

RetroButton.displayName = 'RetroButton';

export default RetroButton; 