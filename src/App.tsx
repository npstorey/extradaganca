import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VibeProvider, useVibe } from './context/VibeContext';
import { SoundProvider, useSound } from './context/SoundContext';
import GlobalStyles from './styles/GlobalStyles';
import LocationStep from './components/steps/LocationStep';
import TimePeriodStep from './components/steps/TimePeriodStep';
import RealityStep from './components/steps/RealityStep';
import VibeDescriptionStep from './components/steps/VibeDescriptionStep';
import ConvergeDivergeStep from './components/steps/ConvergeDivergeStep';
import CompletionScreen from './components/steps/CompletionScreen';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

// Content container with a potential glitch effect on step change
const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

// Sound toggle button in the corner
const SoundToggle = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: rgba(51, 255, 51, 0.7);
  font-size: 24px;
  z-index: 1000;
  padding: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
  
  &:hover {
    color: rgba(51, 255, 51, 1);
    background: transparent;
    transform: scale(1.1);
  }
`;

// Test sound button
const TestSoundButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 70px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(51, 255, 51, 0.7);
  color: rgba(51, 255, 51, 0.7);
  font-size: 14px;
  z-index: 1000;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: rgba(51, 255, 51, 1);
    border-color: rgba(51, 255, 51, 1);
    transform: scale(1.05);
  }
`;

// Sound status indicator
const SoundStatus = styled.div<{ isLoaded: boolean }>`
  position: absolute;
  bottom: 60px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${props => props.isLoaded ? 'rgba(51, 255, 51, 0.7)' : 'rgba(255, 51, 51, 0.7)'};
  color: ${props => props.isLoaded ? 'rgba(51, 255, 51, 0.7)' : 'rgba(255, 51, 51, 0.7)'};
  font-size: 12px;
  z-index: 1000;
  padding: 3px 8px;
  border-radius: 3px;
`;

// Main app content that shows the current step
const AppContent: React.FC = () => {
  const { vibeState } = useVibe();
  const soundEffects = useSound();
  const [showStatus, setShowStatus] = useState<boolean>(true);
  
  // Hide status after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Play transition sound when changing steps
  useEffect(() => {
    console.log(`Step changed to: ${vibeState.currentStep}`);
    soundEffects.play('transition');
    
    // Start ambient sound when component mounts
    const ambientId = soundEffects.play('ambient', { loop: true });
    console.log('Ambient sound started');
    
    return () => {
      // Clean up ambient sound when component unmounts
      if (ambientId) {
        soundEffects.stop('ambient');
        console.log('Ambient sound stopped');
      }
    };
  }, [vibeState.currentStep, soundEffects]);
  
  // Render the appropriate step based on currentStep in context
  const renderStep = () => {
    switch (vibeState.currentStep) {
      case 0:
        return <LocationStep />;
      case 1:
        return <TimePeriodStep />;
      case 2:
        return <RealityStep />;
      case 3:
        return <VibeDescriptionStep />;
      case 4:
        return <ConvergeDivergeStep />;
      case 5:
        return <CompletionScreen />;
      default:
        return <LocationStep />;
    }
  };
  
  const toggleSound = () => {
    console.log('Toggle sound button clicked');
    soundEffects.toggleEnabled();
    soundEffects.play('toggle');
  };
  
  const testSound = () => {
    console.log('Test sound button clicked');
    soundEffects.play('click');
    setTimeout(() => soundEffects.play('hover'), 300);
    setTimeout(() => soundEffects.play('success'), 600);
    setTimeout(() => soundEffects.play('error'), 900);
  };
  
  return (
    <ContentContainer>
      {renderStep()}
      
      {showStatus && (
        <SoundStatus isLoaded={soundEffects.soundsLoaded}>
          {soundEffects.soundsLoaded ? 'Sound Ready' : 'Loading Sounds...'}
        </SoundStatus>
      )}
      
      <TestSoundButton 
        onClick={testSound}
        onMouseEnter={() => soundEffects.play('hover')}
        title="Test Sound"
      >
        Test Sound
      </TestSoundButton>
      
      <SoundToggle 
        onClick={toggleSound} 
        onMouseEnter={() => soundEffects.play('hover')}
        title={soundEffects.enabled ? "Sound ON" : "Sound OFF"}
      >
        {soundEffects.enabled ? "🔊" : "🔇"}
      </SoundToggle>
    </ContentContainer>
  );
};

// Main App wrapper with global providers
const App: React.FC = () => {
  return (
    <VibeProvider>
      <SoundProvider>
        <GlobalStyles />
        <AppContainer>
          <AppContent />
        </AppContainer>
      </SoundProvider>
    </VibeProvider>
  );
};

export default App;
