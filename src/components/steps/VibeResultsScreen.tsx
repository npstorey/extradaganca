/**
 * Vibe Results Screen for displaying the generated vibe
 */
import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useVibeData } from '../../context/VibeContext';
import { useTheme } from '../../context/ThemeContext';
import { extractMood } from '../../services/styleExtractionService';
import { exportVibeToHTML } from '../../utils/exportHelper';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Color from 'color';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glitchEffect = keyframes`
  0% {
    transform: translate(0);
    text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
  }
  2% {
    transform: translate(-2px, 2px);
    text-shadow: 2px -2px #ff00ff, -2px 2px #00ffff;
  }
  4% {
    transform: translate(2px, -2px);
    text-shadow: -2px 2px #ff00ff, 2px -2px #00ffff;
  }
  6% {
    transform: translate(0);
    text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
  }
  100% {
    transform: translate(0);
    text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
  }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// Styled components with dynamic theming
const Container = styled.div<{ $theme?: any }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.backgroundColor};
  position: relative;
  overflow: auto;
  min-height: 100vh;
  max-height: 100vh;
  animation: ${fadeIn} 1s ease-in;
  transition: all 0.5s ease;
  
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.accentColor} ${props => props.theme.backgroundColor};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => Color(props.theme.backgroundColor).darken(0.2).toString()};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.accentColor};
    border-radius: 4px;
    border: 2px solid ${props => props.theme.backgroundColor};
  }
  
  ${props => props.theme.backgroundPattern !== 'none' && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: ${props.theme.backgroundPattern};
      background-size: 50px 50px;
      opacity: 0.15;
      z-index: 0;
      pointer-events: none;
    }
  `}
  
  ${props => props.theme.overlayEffect !== 'none' && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${props.theme.overlayEffect};
      pointer-events: none;
      z-index: 1;
      animation: ${scanline} 8s linear infinite;
    }
  `}
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const Section = styled.section<{ $mood?: string }>`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 2px ${props => props.theme.borderStyle} ${props => props.theme.primaryColor};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => Color(props.theme.backgroundColor).lighten(0.1).alpha(0.6).toString()};
  position: relative;
  box-shadow: ${props => props.theme.boxShadowStyle};
  transition: all 0.3s ease;
  
  ${props => props.theme.glowEffect !== '0 0 0' && css`
    &:hover {
      box-shadow: ${props.theme.glowEffect} ${props.theme.glowIntensity * 2}px ${props.theme.primaryColor};
    }
  `}

  ${props => props.$mood === 'futuristic' && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${props.theme.accentColor}, transparent);
      animation: ${pulseGlow} 3s infinite;
    }
  `}
  
  ${props => props.$mood === 'tech' && css`
    border-left: 4px solid ${props.theme.accentColor};
  `}
  
  ${props => props.$mood === 'retro' && css`
    border-image: linear-gradient(45deg, ${props.theme.primaryColor}, ${props.theme.accentColor}) 1;
  `}
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.titleFontFamily};
  font-size: 1.8rem;
  color: ${props => props.theme.accentColor};
  margin-top: 0;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  
  ${props => props.theme.animationSpeed === 'fast' && css`
    animation: ${glitchEffect} 5s infinite;
  `}
`;

const VibeTitle = styled.h1`
  font-family: ${props => props.theme.titleFontFamily};
  font-size: 3rem;
  color: ${props => props.theme.primaryColor};
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: 3px;
  text-shadow: ${props => props.theme.textShadow} ${props => props.theme.accentColor};
  
  ${props => props.theme.animationSpeed === 'fast' && css`
    animation: ${glitchEffect} 5s infinite;
  `}
`;

const Description = styled.p`
  font-family: ${props => props.theme.fontFamily};
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 2rem;
  text-align: center;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.theme.layoutStyle === 'grid' ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(1, 1fr)'};
  gap: ${props => props.theme.spacing};
  margin-top: 1.5rem;
`;

const VibeImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${props => props.theme.borderRadius};
  border: 2px ${props => props.theme.borderStyle} ${props => props.theme.accentColor};
  box-shadow: ${props => props.theme.boxShadowStyle};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: ${props => props.theme.glowEffect} ${props => props.theme.glowIntensity}px ${props => props.theme.accentColor};
  }
`;

const SongsSection = styled(Section)`
  background-color: ${props => Color(props.theme.backgroundColor).darken(0.1).alpha(0.7).toString()};
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SongItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${props => Color(props.theme.primaryColor).alpha(0.3).toString()};
  font-family: ${props => props.theme.fontFamily};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => Color(props.theme.backgroundColor).lighten(0.2).alpha(0.5).toString()};
  }
`;

const SongTitle = styled.span`
  font-weight: bold;
  color: ${props => props.theme.primaryColor};
  margin-right: 0.5rem;
`;

const SongArtist = styled.span`
  color: ${props => props.theme.textColor};
  opacity: 0.8;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: rgba(255, 0, 0, 0.1);
  border-left: 4px solid #ff0000;
  color: #ff0000;
  margin-bottom: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  font-family: ${props => props.theme.fontFamily};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  position: relative;
  z-index: 3;
`;

const ExportButton = styled(Button)`
  background-color: ${props => props.theme.accentColor};
  color: ${props => Color(props.theme.backgroundColor).darken(0.5).toString()};
  
  &:hover {
    background-color: ${props => Color(props.theme.accentColor).lighten(0.2).toString()};
    box-shadow: ${props => props.theme.glowEffect} ${props => props.theme.glowIntensity}px ${props => props.theme.accentColor};
  }
`;

const BackButton = styled(Button)`
  background-color: transparent;
  border: 2px solid ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryColor};
  
  &:hover {
    background-color: ${props => Color(props.theme.primaryColor).alpha(0.2).toString()};
  }
`;

const VibeResultsScreen: React.FC = () => {
  const { vibeData, loading, error } = useVibeData();
  const { theme, updateTheme } = useTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log for debugging
    console.log('VibeResultsScreen: Component mounted');
    console.log('Loading state:', loading);
    console.log('Error message:', error);
    console.log('Vibe data:', vibeData);
    
    // Update theme based on vibe data when it loads
    if (vibeData && !loading) {
      console.log('VibeResultsScreen: Updating theme based on vibe data');
      const mood = vibeData.mood || extractMoodFromText(vibeData.description || '');
      const colors = vibeData.colors || extractColorsFromImages(vibeData.imageUrls || []);
      
      updateTheme({
        mood,
        colors
      });
    }
  }, [vibeData, loading, updateTheme]);
  
  // Helper function to extract mood from text
  const extractMoodFromText = (text: string): string => {
    const moodKeywords = {
      energetic: ['energetic', 'dynamic', 'vibrant', 'lively'],
      calm: ['calm', 'peaceful', 'serene', 'tranquil'],
      happy: ['happy', 'joyful', 'cheerful', 'playful'],
      mysterious: ['mysterious', 'enigmatic', 'dark', 'shadowy'],
      futuristic: ['futuristic', 'tech', 'digital', 'cyber'],
      retro: ['retro', 'vintage', 'nostalgic', 'classic'],
      romantic: ['romantic', 'dreamy', 'passionate', 'sensual']
    };
    
    text = text.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return mood;
      }
    }
    
    return 'retro'; // Default mood
  };
  
  // Helper function to extract colors from images (placeholder - would actually analyze images)
  const extractColorsFromImages = (imageUrls: string[]): string[] => {
    // In a real implementation, this would analyze the images
    // For now, return some placeholder colors based on the length of URLs
    if (!imageUrls || imageUrls.length === 0) return ['#4e00ec', '#00ffcc'];
    
    // Use the URL strings to deterministically generate colors
    const colors = imageUrls.map(url => {
      const hash = url.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      const h = Math.abs(hash) % 360;
      return `hsl(${h}, 80%, 60%)`;
    });
    
    return colors.slice(0, 2); // Return at most 2 colors
  };
  
  const handleExport = () => {
    if (vibeData) {
      exportVibeToHTML(vibeData, theme);
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <Section>
            <LoadingSpinner size={60} />
            <p style={{ textAlign: 'center' }}>Generating your vibe experience...</p>
          </Section>
        </ContentWrapper>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <ErrorMessage>
            <p>Error: {error}</p>
            <ButtonContainer>
              <BackButton onClick={handleBack}>Go Back</BackButton>
              <Button onClick={handleRetry}>Retry</Button>
            </ButtonContainer>
          </ErrorMessage>
        </ContentWrapper>
      </Container>
    );
  }
  
  if (!vibeData) {
    console.error('VibeResultsScreen: No vibe data available');
    return (
      <Container>
        <ContentWrapper>
          <ErrorMessage>
            <p>No vibe data available. Please try again.</p>
            <ButtonContainer>
              <BackButton onClick={handleBack}>GO BACK</BackButton>
              <Button onClick={handleRetry}>Retry</Button>
            </ButtonContainer>
          </ErrorMessage>
        </ContentWrapper>
      </Container>
    );
  }
  
  // Get mood for conditional styling
  const mood = vibeData.mood || extractMoodFromText(vibeData.description || '');
  
  return (
    <Container>
      <ContentWrapper>
        <VibeTitle>{vibeData.title}</VibeTitle>
        <Description>{vibeData.description}</Description>
        
        {vibeData.imageUrls && vibeData.imageUrls.length > 0 && (
          <Section $mood={mood}>
            <SectionTitle>Visual Inspiration</SectionTitle>
            <ImagesGrid>
              {vibeData.imageUrls.map((url, index) => (
                <VibeImage key={`image-${index}`} src={url} alt={`Vibe inspiration ${index + 1}`} />
              ))}
            </ImagesGrid>
          </Section>
        )}
        
        {/* Show songs section if either playlist or songs are available */}
        <SongsSection $mood={mood}>
          <SectionTitle>Soundtrack</SectionTitle>
          {vibeData.playlist ? (
            <p>Explore this vibe's sounds: <a href={vibeData.playlist} target="_blank" rel="noopener noreferrer">{vibeData.playlist}</a></p>
          ) : (
            /* This is from the API - we're showing songs even without a playlist URL */
            <div>
              <p>Recommended tracks for this vibe:</p>
              <SongList>
                {Array.isArray(vibeData.songs) && vibeData.songs.length > 0 ? (
                  vibeData.songs.map((song, index) => (
                    <SongItem key={`song-${index}`}>
                      <SongTitle>{song.title}</SongTitle> by <SongArtist>{song.artist}</SongArtist>
                    </SongItem>
                  ))
                ) : (
                  <p>No song recommendations available.</p>
                )}
              </SongList>
            </div>
          )}
        </SongsSection>
        
        <ButtonContainer>
          <BackButton onClick={handleBack}>Create New Vibe</BackButton>
          <ExportButton onClick={handleExport}>Export Vibe</ExportButton>
        </ButtonContainer>
      </ContentWrapper>
    </Container>
  );
};

export default VibeResultsScreen; 