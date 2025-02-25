/**
 * Vibe Results Screen for displaying the generated vibe
 */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../../styles/theme';
import { useVibe } from '../../context/VibeContext';
import { useApi } from '../../context/ApiContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import RetroButton from '../ui/RetroButton';
import { useSound } from '../../context/SoundContext';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  position: relative;
  color: ${colors.terminalGreen};
  overflow-y: auto;
`;

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 1rem 0;
`;

const Section = styled.section`
  margin: 2rem 0;
  width: 100%;
  border: 1px solid ${colors.neonGreen};
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(51, 255, 51, 0.2);
`;

const SectionTitle = styled.h2`
  color: ${colors.neonPink};
  font-family: ${fonts.display};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const VibeTitle = styled.h1`
  color: ${colors.neonBlue};
  font-family: ${fonts.display};
  font-size: 2.5rem;
  text-align: center;
  margin: 1rem 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px ${colors.neonBlue};
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VibeImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 2px solid ${colors.neonGreen};
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(51, 255, 51, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(51, 255, 51, 0.5);
  }
`;

const Description = styled.p`
  font-family: ${fonts.terminal};
  line-height: 1.6;
  margin: 1rem 0;
  color: ${colors.lightGray};
`;

const SongList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
`;

const SongItem = styled.li`
  padding: 0.75rem;
  border-bottom: 1px dashed ${colors.neonGreen};
  font-family: ${fonts.terminal};
  display: flex;
  justify-content: space-between;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(51, 255, 51, 0.1);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  height: 50vh;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: ${colors.neonRed};
  font-family: ${fonts.terminal};
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid ${colors.neonRed};
  border-radius: 4px;
  background-color: rgba(255, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const VibeResultsScreen: React.FC = () => {
  const { goToStep } = useVibe();
  const { loading, error, vibeData } = useApi();
  const soundEffects = useSound();
  
  // Add debug logs to check what data is being received
  useEffect(() => {
    console.log('VibeResultsScreen: Component mounted');
    console.log('VibeResultsScreen: loading:', loading);
    console.log('VibeResultsScreen: error:', error);
    console.log('VibeResultsScreen: vibeData:', vibeData);
  }, [loading, error, vibeData]);
  
  // Play a success sound when vibe data is loaded
  useEffect(() => {
    if (vibeData && !loading) {
      console.log('VibeResultsScreen: Playing success sound for received vibe data');
      soundEffects.play('success');
    }
  }, [vibeData, loading, soundEffects]);
  
  // If we don't have vibe data and we're not loading, redirect back to questionnaire
  useEffect(() => {
    if (!loading && !vibeData && !error) {
      console.log('VibeResultsScreen: No vibe data, redirecting to questionnaire');
      goToStep(4);
    }
  }, [loading, vibeData, error, goToStep]);
  
  // Function to handle regenerating a vibe
  const handleRegenerate = () => {
    console.log('VibeResultsScreen: Regenerate button clicked');
    goToStep(4);
  };
  
  // Function to export vibe as a JSON file
  const handleExport = () => {
    if (!vibeData) {
      console.log('VibeResultsScreen: Cannot export, no vibe data available');
      return;
    }
    
    console.log('VibeResultsScreen: Exporting vibe data to JSON');
    const dataStr = JSON.stringify(vibeData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `vibe-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  if (loading) {
    return (
      <CRTScreen>
        <Container>
          <LoadingContainer>
            <TerminalText fontSize="1.5rem" color={colors.neonGreen} glitch>
              LOADING YOUR VIBE...
            </TerminalText>
          </LoadingContainer>
        </Container>
      </CRTScreen>
    );
  }
  
  if (error) {
    return (
      <CRTScreen>
        <Container>
          <ErrorMessage>
            <TerminalText fontSize="1.2rem" color={colors.neonRed}>
              ERROR: {error}
            </TerminalText>
            <ButtonContainer>
              <RetroButton onClick={handleRegenerate}>
                Try Again
              </RetroButton>
            </ButtonContainer>
          </ErrorMessage>
        </Container>
      </CRTScreen>
    );
  }
  
  if (!vibeData) {
    return (
      <CRTScreen>
        <Container>
          <ErrorMessage>
            <TerminalText fontSize="1.2rem" color={colors.neonRed}>
              No vibe data available. Please generate a vibe first.
            </TerminalText>
            <ButtonContainer>
              <RetroButton onClick={handleRegenerate} glowing>
                Generate Vibe
              </RetroButton>
            </ButtonContainer>
          </ErrorMessage>
        </Container>
      </CRTScreen>
    );
  }
  
  // Convert API response format to match our component needs
  const title = vibeData.summary.title;
  const summary = vibeData.summary.description;
  const description = vibeData.summary.description;
  const imageUrls = vibeData.images.map((img: { url: string, prompt: string }) => img.url);
  const songRecommendations = vibeData.songs.map((song: { title: string, artist: string, uri?: string }) => ({
    title: song.title,
    artist: song.artist
  }));
  
  return (
    <CRTScreen>
      <Container>
        <VibeTitle>{title}</VibeTitle>
        
        <ResultsContainer>
          <Section>
            <SectionTitle>Vibe Summary</SectionTitle>
            <Description>{summary}</Description>
          </Section>
          
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{description}</Description>
          </Section>
          
          <Section>
            <SectionTitle>Visual Inspiration</SectionTitle>
            <ImagesGrid>
              {imageUrls.map((url: string, index: number) => (
                <VibeImage 
                  key={index} 
                  src={url} 
                  alt={`Vibe visual ${index + 1}`} 
                  loading="lazy" 
                />
              ))}
            </ImagesGrid>
          </Section>
          
          <Section>
            <SectionTitle>Soundtrack</SectionTitle>
            <SongList>
              {songRecommendations.map((song: {title: string, artist: string}, index: number) => (
                <SongItem key={index}>
                  <span>{song.title}</span>
                  <span>{song.artist}</span>
                </SongItem>
              ))}
            </SongList>
          </Section>
          
          <ButtonContainer>
            <RetroButton onClick={() => goToStep(4)}>
              Back to Questions
            </RetroButton>
            <RetroButton onClick={handleRegenerate} glowing>
              Generate New Vibe
            </RetroButton>
            <RetroButton onClick={handleExport}>
              Export Vibe
            </RetroButton>
          </ButtonContainer>
        </ResultsContainer>
      </Container>
    </CRTScreen>
  );
};

export default VibeResultsScreen; 