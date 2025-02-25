import { createGlobalStyle } from 'styled-components';
import { colors, fonts, effects } from './theme';

const GlobalStyles = createGlobalStyle`
  /* Importing fonts using @import inside createGlobalStyle doesn't work properly in some environments
     It's better to add a link in the HTML or use a different approach */
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background-color: ${colors.black};
    color: ${colors.terminalGreen};
    font-family: ${fonts.terminal};
    font-size: 16px;
    line-height: 1.5;
    ${effects.scanlines}
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at center,
        rgba(0, 50, 0, 0.1) 0%,
        rgba(0, 20, 0, 0.3) 70%,
        rgba(0, 0, 0, 0.5) 100%
      );
      pointer-events: none;
      z-index: 2;
    }
  }

  #root {
    height: 100%;
    width: 100%;
    padding: 20px;
    overflow: hidden;
    position: relative;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${fonts.display};
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 1rem;
    letter-spacing: 2px;
    color: ${colors.neonPink};
    text-shadow: 0 0 5px ${colors.neonPink}, 0 0 10px ${colors.neonPink};
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  p {
    margin-bottom: 1rem;
  }

  button, input, textarea, select {
    font-family: ${fonts.terminal};
    background-color: ${colors.darkGray};
    color: ${colors.terminalGreen};
    border: 1px solid ${colors.terminalGreen};
    padding: 0.5rem 1rem;
    outline: none;
    
    &:focus {
      box-shadow: 0 0 0 2px ${colors.neonGreen};
    }
  }

  button {
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 0 5px ${colors.terminalGreen};
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${colors.terminalGreen};
      color: ${colors.black};
    }
    
    &:active {
      transform: translateY(1px);
    }
  }

  input, textarea {
    background-color: rgba(0, 30, 0, 0.3);
    border: 1px solid ${colors.terminalGreen};
    caret-color: ${colors.neonYellow};
    padding: 0.75rem;
    
    &::placeholder {
      color: rgba(51, 255, 51, 0.5);
    }
  }

  /* For webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.darkGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.terminalGreen};
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.neonGreen};
  }

  /* Selection style */
  ::selection {
    background: ${colors.neonPink};
    color: ${colors.black};
    text-shadow: none;
  }

  /* Blinking cursor */
  .cursor {
    display: inline-block;
    width: 10px;
    height: 18px;
    background-color: ${colors.terminalGreen};
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export default GlobalStyles; 