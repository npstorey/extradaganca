import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useVibe, TimePeriod } from '../../context/VibeContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import SoundButton from '../ui/SoundButton';
import { colors, fonts } from '../../styles/theme';
import { useSound } from '../../context/SoundContext';

// Lever movement animation
const leverMovement = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

// Glitch animation
const glitch = keyframes`
  0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
  10% { transform: translate(-2px, 2px); filter: hue-rotate(45deg); }
  20% { transform: translate(2px, -2px); filter: hue-rotate(90deg); }
  30% { transform: translate(-1px, -1px); filter: hue-rotate(135deg); }
  40% { transform: translate(1px, 1px); filter: hue-rotate(180deg); }
  50% { transform: translate(-1px, 2px); filter: hue-rotate(225deg); }
  60% { transform: translate(-2px, 1px); filter: hue-rotate(270deg); }
  70% { transform: translate(2px, 1px); filter: hue-rotate(315deg); }
  80% { transform: translate(-1px, -1px); filter: hue-rotate(360deg); }
  90% { transform: translate(1px, 2px); filter: hue-rotate(45deg); }
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
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 2px;
  color: ${colors.neonYellow};
  filter: drop-shadow(0 0 8px ${colors.neonYellow});
`;

const TimeControlContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 300px;
  margin: 2rem 0;
  position: relative;
  border: 2px solid ${colors.lightGray};
  background-color: rgba(20, 20, 20, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(150, 150, 150, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 40%, rgba(150, 0, 150, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(0, 150, 150, 0.1) 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: ${fonts.display};
  font-size: 1.5rem;
  color: ${colors.white};
  text-shadow: 0 0 10px ${colors.white};
  letter-spacing: 2px;
`;

const TimeMachinePanel = styled.div`
  width: 80%;
  height: 60%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid ${colors.lightGray};
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
  z-index: 1;
`;

const TimeIcon = styled.div<{ active: boolean; period: TimePeriod }>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2rem;
  color: ${props => {
    if (!props.active) return colors.lightGray;
    switch (props.period) {
      case 'past': return colors.neonRed;
      case 'present': return colors.neonBlue;
      case 'future': return colors.neonYellow;
      default: return colors.white;
    }
  }};
  background-color: ${colors.darkGray};
  box-shadow: ${props => props.active ? `0 0 15px ${
    props.period === 'past' ? colors.neonRed : 
    props.period === 'present' ? colors.neonBlue : 
    colors.neonYellow
  }` : 'none'};
  transition: all 0.3s ease;
  animation: ${props => props.active ? css`${glitch} 5s infinite` : 'none'};
`;

const LeverArea = styled.div`
  position: relative;
  width: 80px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const LeverTrack = styled.div`
  width: 10px;
  height: 150px;
  background-color: ${colors.lightGray};
  border-radius: 5px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -10px;
    right: -10px;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    );
    border-radius: 5px;
    z-index: -1;
  }
`;

const LeverHandle = styled.div<{ position: number }>`
  width: 30px;
  height: 50px;
  background-color: ${colors.mediumGray};
  border: 2px solid ${colors.lightGray};
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: ${props => props.position * 50}%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: top 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  
  &:hover {
    animation: ${leverMovement} 1s ease infinite;
    background-color: ${colors.white};
  }
  
  &:active {
    cursor: grabbing;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 0, 0, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px red;
  }
`;

const LeverLabel = styled.div<{ active: boolean }>`
  font-family: ${fonts.terminal};
  font-size: 0.8rem;
  color: ${props => props.active ? colors.white : colors.lightGray};
  text-shadow: ${props => props.active ? '0 0 5px white' : 'none'};
  text-transform: uppercase;
  letter-spacing: 1px;
  position: absolute;
  right: -70px;
`;

const PastLabel = styled(LeverLabel)`
  top: 0;
`;

const PresentLabel = styled(LeverLabel)`
  top: 50%;
  transform: translateY(-50%);
`;

const FutureLabel = styled(LeverLabel)`
  bottom: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-top: 2rem;
`;

const TimePeriodDescription = styled.div`
  margin-top: 1rem;
  font-family: ${fonts.terminal};
  color: ${colors.white};
  text-align: center;
  font-size: 1rem;
  max-width: 500px;
  opacity: 0.9;
`;

const TimePeriodStep: React.FC = () => {
  const { vibeState, setTimePeriod, nextStep, prevStep } = useVibe();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod | null>(vibeState.timePeriod);
  const [leverPosition, setLeverPosition] = useState<number>(
    vibeState.timePeriod === 'past' ? 0 :
    vibeState.timePeriod === 'present' ? 1 :
    vibeState.timePeriod === 'future' ? 2 : 1
  );
  const soundEffects = useSound();
  
  const handleLeverChange = (position: number) => {
    setLeverPosition(position);
    
    let period: TimePeriod;
    switch (position) {
      case 0:
        period = 'past';
        break;
      case 1:
        period = 'present';
        break;
      case 2:
        period = 'future';
        break;
      default:
        period = 'present';
    }
    
    setSelectedPeriod(period);
    soundEffects.play('toggle');
    soundEffects.play('glitch');
  };
  
  const handleContinue = () => {
    if (selectedPeriod) {
      setTimePeriod(selectedPeriod);
      soundEffects.play('success');
      nextStep();
    }
  };
  
  const getPeriodDescription = () => {
    switch (selectedPeriod) {
      case 'past':
        return "ARCHIVES ACCESSED: HISTORICAL TIMESTREAM SELECTION CONFIRMED";
      case 'present':
        return "SYNCHRONIZING WITH CURRENT TEMPORAL COORDINATES";
      case 'future':
        return "WARNING: ACCESSING FUTURE PROJECTIONS • TIMELINE ACCURACY UNSTABLE";
      default:
        return "AWAITING TEMPORAL SELECTION...";
    }
  };
  
  return (
    <CRTScreen borderGlow={colors.neonYellow} glitchIntensity="low">
      <Container>
        <QuestionHeading>PAST, PRESENT, OR FUTURE?</QuestionHeading>
        
        <TimeControlContainer>
          <TimeDisplay>
            <TerminalText
              text={`SELECTED: ${selectedPeriod ? selectedPeriod.toUpperCase() : 'NONE'}`}
              initiallyVisible={true}
              glitchFrequency={0.05}
            />
          </TimeDisplay>
          
          <TimeMachinePanel>
            <TimeIcon active={selectedPeriod === 'past'} period="past">
              ◄◄
            </TimeIcon>
            
            <LeverArea>
              <LeverTrack>
                <LeverHandle 
                  position={leverPosition} 
                  onMouseDown={() => {}}
                  onClick={() => handleLeverChange((leverPosition + 1) % 3)}
                />
                <PastLabel active={selectedPeriod === 'past'}>Past</PastLabel>
                <PresentLabel active={selectedPeriod === 'present'}>Present</PresentLabel>
                <FutureLabel active={selectedPeriod === 'future'}>Future</FutureLabel>
              </LeverTrack>
            </LeverArea>
            
            <TimeIcon active={selectedPeriod === 'future'} period="future">
              ►►
            </TimeIcon>
          </TimeMachinePanel>
          
          <TimePeriodDescription>
            <TerminalText
              text={getPeriodDescription()}
              initiallyVisible={true}
              fontSize="0.9rem"
            />
          </TimePeriodDescription>
        </TimeControlContainer>
        
        <ButtonContainer>
          <SoundButton onClick={prevStep} variant="secondary" soundType="click">
            ◄ BACK
          </SoundButton>
          
          <SoundButton 
            onClick={handleContinue} 
            variant="primary"
            disabled={!selectedPeriod}
            soundType="success"
          >
            NEXT ►
          </SoundButton>
        </ButtonContainer>
      </Container>
    </CRTScreen>
  );
};

export default TimePeriodStep; 