import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useVibe } from '../../context/VibeContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import RetroButton from '../ui/RetroButton';
import GlitchSlider from '../ui/GlitchSlider';
import { colors, fonts } from '../../styles/theme';
import { useSound } from '../../context/SoundContext';

// Pulse animation
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Circle expand animation
const expand = keyframes`
  0% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.6; }
  100% { transform: scale(1); opacity: 0.4; }
`;

// Matrix-like data flow
const dataFlow = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
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
  color: ${colors.neonRed};
  filter: drop-shadow(0 0 8px ${colors.neonRed});
`;

const VisualizationArea = styled.div`
  width: 100%;
  max-width: 800px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid ${colors.lightGray};
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 60%);
    z-index: 0;
  }
`;

const DataStreamBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    0deg,
    transparent 24%,
    rgba(32, 255, 255, 0.05) 25%,
    rgba(32, 255, 255, 0.05) 26%,
    transparent 27%,
    transparent 74%,
    rgba(32, 255, 255, 0.05) 75%,
    rgba(32, 255, 255, 0.05) 76%,
    transparent 77%
  ), linear-gradient(
    90deg,
    transparent 24%,
    rgba(32, 255, 255, 0.05) 25%,
    rgba(32, 255, 255, 0.05) 26%,
    transparent 27%,
    transparent 74%,
    rgba(32, 255, 255, 0.05) 75%,
    rgba(32, 255, 255, 0.05) 76%,
    transparent 77%
  );
  background-size: 50px 50px;
  opacity: 0.5;
  z-index: 1;
`;

const BinaryStream = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E text %7B font: 5px monospace; fill: rgba(0,255,0,0.3); %7D %3C/style%3E%3Ctext x='0' y='10' dominant-baseline='middle'%3E01010101010101010101010101010101%3C/text%3E%3Ctext x='2' y='20' dominant-baseline='middle'%3E10101010101010101010101010101010%3C/text%3E%3Ctext x='4' y='30' dominant-baseline='middle'%3E01010101010101010101010101010101%3C/text%3E%3Ctext x='0' y='40' dominant-baseline='middle'%3E10101010101010101010101010101010%3C/text%3E%3Ctext x='6' y='50' dominant-baseline='middle'%3E01010101010101010101010101010101%3C/text%3E%3Ctext x='2' y='60' dominant-baseline='middle'%3E10101010101010101010101010101010%3C/text%3E%3Ctext x='0' y='70' dominant-baseline='middle'%3E01010101010101010101010101010101%3C/text%3E%3Ctext x='4' y='80' dominant-baseline='middle'%3E10101010101010101010101010101010%3C/text%3E%3Ctext x='0' y='90' dominant-baseline='middle'%3E01010101010101010101010101010101%3C/text%3E%3Ctext x='2' y='100' dominant-baseline='middle'%3E10101010101010101010101010101010%3C/text%3E%3C/svg%3E");
  animation: ${dataFlow} 30s linear infinite;
  opacity: 0.2;
  z-index: 1;
`;

interface CircleProps {
  value: number;
}

const RealityCircle = styled.div<CircleProps>`
  position: absolute;
  top: 50%;
  left: 20%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid ${colors.neonRed};
  background-color: rgba(255, 0, 0, 0.1);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background-color: rgba(255, 0, 0, 0.2);
    transform: translate(-50%, -50%);
    animation: ${pulse} 2s infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 110%;
    height: 110%;
    border-radius: 50%;
    border: 1px solid rgba(255, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    animation: ${expand} 3s infinite;
  }
`;

const ArtifactCircle = styled.div<CircleProps>`
  position: absolute;
  top: 50%;
  left: 80%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid ${colors.neonBlue};
  background-color: rgba(0, 0, 255, 0.1);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background-color: rgba(0, 0, 255, 0.2);
    transform: translate(-50%, -50%);
    animation: ${pulse} 3s infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 110%;
    height: 110%;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 255, 0.3);
    transform: translate(-50%, -50%);
    animation: ${expand} 4s infinite;
  }
`;

const ConnectionLine = styled.div<CircleProps>`
  position: absolute;
  top: 50%;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(
    90deg, 
    ${colors.neonRed} 0%, 
    ${colors.purple} 50%, 
    ${colors.neonBlue} 100%
  );
  transform: translateY(-50%);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: ${props => props.value}%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colors.neonPink};
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px ${colors.neonPink};
    animation: ${pulse} 1.5s infinite;
  }
`;

const CircleLabel = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  color: ${colors.white};
  white-space: nowrap;
  text-align: center;
`;

const SliderContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const Description = styled.div`
  font-family: ${fonts.terminal};
  font-size: 1rem;
  color: ${colors.white};
  text-align: center;
  margin-bottom: 2rem;
  max-width: 600px;
  min-height: 60px;
`;

const StatusPanel = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid ${colors.lightGray};
  border-radius: 5px;
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const StatusTitle = styled.div`
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  color: ${colors.terminalGreen};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatusText = styled.div`
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  color: ${colors.terminalGreen};
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

const ConvergeDivergeStep: React.FC = () => {
  const { vibeState, setConvergeDiverge, nextStep, prevStep } = useVibe();
  const [value, setValue] = useState(vibeState.convergeDiverge);
  const [statusMessage, setStatusMessage] = useState('');
  const soundEffects = useSound();
  
  useEffect(() => {
    updateStatusMessage(value);
  }, [value]);
  
  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    
    // Play different sounds based on where the slider is moving
    if (Math.abs(newValue - value) > 20) {
      // Major movement - play glitch sound
      soundEffects.play('glitch');
    }
  };
  
  const handleContinue = () => {
    setConvergeDiverge(value);
    soundEffects.play('success');
    nextStep();
  };
  
  const updateStatusMessage = (val: number) => {
    if (val < 20) {
      setStatusMessage('CONVERGE MODE ACTIVE: Artifact will closely match reported reality parameters. Minimal deviation allowed. Reality anchors engaged at maximum strength.');
    } else if (val < 40) {
      setStatusMessage('CONVERGE MODE ACTIVE: Moderate reality alignment. Artifact will maintain core structural similarity to reported reality with minor creative adjustments.');
    } else if (val < 60) {
      setStatusMessage('BALANCED MODE: Artifact will maintain essential elements of reported reality while allowing significant creative interpretation.');
    } else if (val < 80) {
      setStatusMessage('DIVERGE MODE ACTIVE: Artifact will use reported reality as loose inspiration only. Significant deviations expected.');
    } else {
      setStatusMessage('DIVERGE MODE ACTIVE: Artifact will maximally deviate from reported reality. Reality anchors disabled. Expect unpredictable results that may bear little resemblance to input parameters.');
    }
  };
  
  const getDescription = () => {
    if (value < 50) {
      return `CONVERGENCE LEVEL: ${100 - value}%`;
    } else if (value > 50) {
      return `DIVERGENCE LEVEL: ${value}%`;
    } else {
      return 'PERFECT BALANCE: 50/50';
    }
  };
  
  return (
    <CRTScreen borderGlow={colors.neonBlue} glitchIntensity="low">
      <Container>
        <QuestionHeading>CONVERGE OR DIVERGE?</QuestionHeading>
        
        <VisualizationArea>
          <DataStreamBackground />
          <BinaryStream />
          
          <RealityCircle value={value}>
            <CircleLabel>REALITY</CircleLabel>
          </RealityCircle>
          
          <ConnectionLine value={value} />
          
          <ArtifactCircle value={value}>
            <CircleLabel>ARTIFACT</CircleLabel>
          </ArtifactCircle>
        </VisualizationArea>
        
        <SliderContainer>
          <GlitchSlider
            value={value}
            onChange={handleSliderChange}
            leftLabel="CONVERGE"
            rightLabel="DIVERGE"
            glitchIntensity="medium"
          />
        </SliderContainer>
        
        <Description>
          <TerminalText
            text={getDescription()}
            initiallyVisible={true}
            glitchFrequency={0.02}
            fontSize="1.2rem"
            textColor={value < 50 ? colors.neonRed : colors.neonBlue}
          />
        </Description>
        
        <StatusPanel>
          <StatusTitle>STATUS:</StatusTitle>
          <StatusText>
            <TerminalText
              text={statusMessage}
              initiallyVisible={true}
              glitchFrequency={0.01}
            />
          </StatusText>
        </StatusPanel>
        
        <ButtonContainer>
          <RetroButton onClick={() => {
            soundEffects.play('click');
            prevStep();
          }} variant="secondary">
            ◄ BACK
          </RetroButton>
          
          <RetroButton onClick={() => {
            soundEffects.play('success');
            handleContinue();
          }} variant="primary">
            FINALIZE ►
          </RetroButton>
        </ButtonContainer>
      </Container>
    </CRTScreen>
  );
};

export default ConvergeDivergeStep; 