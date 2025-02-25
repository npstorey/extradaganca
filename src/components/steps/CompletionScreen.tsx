import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useVibe } from '../../context/VibeContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import RetroButton from '../ui/RetroButton';
import { colors, fonts } from '../../styles/theme';

// Flickering animation
const flicker = keyframes`
  0%, 100% { opacity: 1; }
  41% { opacity: 1; }
  42% { opacity: 0.8; }
  43% { opacity: 1; }
  45% { opacity: 1; }
  46% { opacity: 0.2; }
  47% { opacity: 1; }
`;

// Hue rotation
const hueRotate = keyframes`
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
`;

// Success pulse
const successPulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
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
  color: ${colors.terminalGreen};
`;

const CompletionHeading = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 3px;
  color: ${colors.neonGreen};
  text-shadow: 0 0 10px ${colors.neonGreen}, 0 0 20px ${colors.neonGreen};
  filter: drop-shadow(0 0 8px ${colors.neonGreen});
  animation: ${flicker} 5s infinite;
`;

const SuccessIcon = styled.div`
  font-size: 5rem;
  color: ${colors.neonGreen};
  text-shadow: 0 0 15px ${colors.neonGreen}, 0 0 30px ${colors.neonGreen};
  margin-bottom: 2rem;
  animation: ${successPulse} 3s infinite;
`;

const SummaryContainer = styled.div`
  background-color: rgba(0, 20, 0, 0.5);
  border: 1px solid ${colors.neonGreen};
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 700px;
  margin-bottom: 2rem;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(0, 255, 0, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
    animation: ${hueRotate} 20s infinite linear;
  }
`;

const SummaryTitle = styled.div`
  font-family: ${fonts.display};
  font-size: 1.5rem;
  color: ${colors.neonGreen};
  text-shadow: 0 0 5px ${colors.neonGreen};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin-bottom: 1.5rem;
`;

const SummaryLabel = styled.div`
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  color: ${colors.terminalAmber};
  text-transform: uppercase;
`;

const SummaryValue = styled.div`
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  color: ${colors.white};
  word-break: break-word;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${colors.neonGreen} 50%,
    transparent 100%
  );
  margin: 1rem 0;
`;

const CompleteMessage = styled.div`
  font-family: ${fonts.terminal};
  font-size: 1.2rem;
  color: ${colors.terminalGreen};
  text-align: center;
  margin: 2rem 0;
  line-height: 1.5;
  max-width: 700px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const AsciiArt = styled.pre`
  font-family: monospace;
  font-size: 0.7rem;
  color: ${colors.terminalGreen};
  margin: 1rem 0;
  text-align: center;
  line-height: 1.2;
`;

const CompletionScreen: React.FC = () => {
  const { vibeState, resetVibe } = useVibe();
  const [completionCode, setCompletionCode] = useState('');
  
  useEffect(() => {
    // Generate a random code for the artifact
    const generateCode = () => {
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };
    
    setCompletionCode(generateCode());
  }, []);

  const handleReset = () => {
    resetVibe();
  };
  
  const handleExport = () => {
    // Convert the vibe state to a formatted string
    const exportData = {
      location: vibeState.location,
      timePeriod: vibeState.timePeriod,
      realityType: vibeState.realityType,
      description: vibeState.description,
      convergeDiverge: vibeState.convergeDiverge,
      mediaUrls: vibeState.mediaUrls,
      artifactCode: completionCode,
      timestamp: new Date().toISOString()
    };
    
    // Create a JSON blob
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `extradaganca-vibe-${completionCode.substring(0, 4)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Simple ASCII art for the artifact
  const artifactAscii = `
    .---------------------. 
    |                     | 
    |    VIBE ARTIFACT    | 
    |                     | 
    |      ▄▄▄▄▄▄▄        | 
    |     █       █       | 
    |    █         █      | 
    |    █         █      | 
    |     █       █       | 
    |      ▀▀▀▀▀▀▀        | 
    |                     | 
    | ${completionCode.substring(0, 8)} | 
    | ${completionCode.substring(9)} | 
    |                     | 
    \`---------------------'  
  `;
  
  // Get converge/diverge description
  const getConvergeDivergeText = () => {
    const value = vibeState.convergeDiverge;
    if (value < 20) return "Strongly Converged to Reality";
    if (value < 40) return "Moderately Converged to Reality";
    if (value < 60) return "Balanced Between Reality and Imagination";
    if (value < 80) return "Moderately Diverged from Reality";
    return "Strongly Diverged from Reality";
  };
  
  return (
    <CRTScreen borderGlow={colors.neonGreen} glitchIntensity="low">
      <Container>
        <CompletionHeading>VIBE ARTIFACT CREATED</CompletionHeading>
        
        <SuccessIcon>✓</SuccessIcon>
        
        <AsciiArt>{artifactAscii}</AsciiArt>
        
        <SummaryContainer>
          <SummaryTitle>Artifact Specifications</SummaryTitle>
          
          <SummaryGrid>
            <SummaryLabel>Location:</SummaryLabel>
            <SummaryValue>{vibeState.location}</SummaryValue>
            
            <SummaryLabel>Time Period:</SummaryLabel>
            <SummaryValue>{vibeState.timePeriod?.toUpperCase()}</SummaryValue>
            
            <SummaryLabel>Reality Type:</SummaryLabel>
            <SummaryValue>{vibeState.realityType === 'real' ? 'REAL LIFE' : 'IMAGINARY'}</SummaryValue>
            
            <SummaryLabel>Reality Alignment:</SummaryLabel>
            <SummaryValue>{getConvergeDivergeText()}</SummaryValue>
            
            <SummaryLabel>Reference Media:</SummaryLabel>
            <SummaryValue>{vibeState.mediaUrls.length} item(s)</SummaryValue>
            
            <SummaryLabel>Artifact Code:</SummaryLabel>
            <SummaryValue>{completionCode}</SummaryValue>
          </SummaryGrid>
          
          <Divider />
          
          <SummaryLabel>Vibe Description:</SummaryLabel>
          <SummaryValue style={{ marginTop: '0.5rem' }}>
            {vibeState.description || "No description provided."}
          </SummaryValue>
        </SummaryContainer>
        
        <CompleteMessage>
          <TerminalText
            text="Your vibe artifact has been successfully processed and encoded. This unique digital essence can now be utilized within the Extradaganca ecosystem. Artifact processing status: COMPLETE."
            initiallyVisible={true}
            glitchFrequency={0.01}
          />
        </CompleteMessage>
        
        <ButtonsContainer>
          <RetroButton onClick={handleReset} variant="secondary">
            CREATE NEW ARTIFACT
          </RetroButton>
          
          <RetroButton onClick={handleExport} variant="primary">
            EXPORT ARTIFACT
          </RetroButton>
        </ButtonsContainer>
      </Container>
    </CRTScreen>
  );
};

export default CompletionScreen; 