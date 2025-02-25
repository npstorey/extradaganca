import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useVibe } from '../../context/VibeContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import RetroButton from '../ui/RetroButton';
import { colors, fonts } from '../../styles/theme';
import { useSound } from '../../context/SoundContext';

// Static noise animation
const staticNoise = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

// Blinking cursor animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// File load bar animation
const loadProgress = keyframes`
  0% { width: 0%; }
  20% { width: 40%; }
  30% { width: 50%; }
  40% { width: 55%; }
  50% { width: 60%; }
  70% { width: 75%; }
  90% { width: 90%; }
  100% { width: 100%; }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  position: relative;
  overflow-y: auto;
`;

const QuestionHeading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 2px;
  color: ${colors.neonGreen};
  filter: drop-shadow(0 0 8px ${colors.neonGreen});
`;

const EditorContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const EditorHeader = styled.div`
  background-color: ${colors.darkGray};
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border: 1px solid ${colors.neonGreen};
  border-bottom: none;
`;

const EditorTitle = styled.div`
  font-family: ${fonts.terminal};
  color: ${colors.neonGreen};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EditorControls = styled.div`
  display: flex;
  gap: 10px;
  
  .control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    
    &.minimize {
      background-color: #ffbd2e;
    }
    
    &.maximize {
      background-color: #27c93f;
    }
    
    &.close {
      background-color: #ff5f56;
    }
  }
`;

const TextAreaWrapper = styled.div`
  position: relative;
  border: 1px solid ${colors.neonGreen};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.05;
    animation: ${staticNoise} 5s linear infinite;
    pointer-events: none;
    z-index: 0;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  background-color: rgba(0, 20, 0, 0.9);
  color: ${colors.terminalGreen};
  font-family: ${fonts.terminal};
  font-size: 1rem;
  line-height: 1.5;
  padding: 1rem;
  border: none;
  outline: none;
  resize: vertical;
  position: relative;
  z-index: 1;
  
  &::placeholder {
    color: rgba(51, 255, 51, 0.3);
  }
`;

const LineNumbers = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  padding: 1rem 0;
  background-color: rgba(0, 0, 0, 0.4);
  color: rgba(51, 255, 51, 0.5);
  font-family: ${fonts.terminal};
  font-size: 0.8rem;
  text-align: right;
  user-select: none;
  pointer-events: none;
  z-index: 2;
`;

const LineNumber = styled.div`
  padding-right: 5px;
  height: 1.5rem;
`;

const UploaderSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed ${colors.neonGreen};
  border-radius: 5px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 20, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 30, 0, 0.4);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  color: ${colors.neonGreen};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-family: ${fonts.terminal};
  color: ${colors.terminalGreen};
  text-align: center;
  margin-bottom: 1rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  width: 100%;
  margin-top: 1.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background-color: rgba(0, 20, 0, 0.5);
  border: 1px solid ${colors.darkGray};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  &:hover {
    background-color: rgba(0, 30, 0, 0.6);
  }
`;

const FileName = styled.div`
  font-family: ${fonts.terminal};
  color: ${colors.terminalGreen};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

const FileSize = styled.div`
  font-family: ${fonts.terminal};
  color: ${colors.terminalAmber};
  font-size: 0.8rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${colors.neonRed};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.2rem 0.5rem;
  
  &:hover {
    color: ${colors.neonPink};
  }
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${colors.darkGray};
  margin-top: 0.3rem;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: ${colors.neonGreen};
    animation: ${loadProgress} 1.5s ease-out forwards;
  }
`;

const UrlInputSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 1rem;
`;

const UrlInputLabel = styled.div`
  font-family: ${fonts.terminal};
  color: ${colors.terminalGreen};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

const UrlInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const UrlInput = styled.input`
  flex: 1;
  background-color: rgba(0, 20, 0, 0.8);
  border: 1px solid ${colors.terminalGreen};
  color: ${colors.terminalGreen};
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  outline: none;
  
  &:focus {
    border-color: ${colors.neonGreen};
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
  }
  
  &::placeholder {
    color: rgba(51, 255, 51, 0.3);
  }
`;

const UrlList = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const UrlItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background-color: rgba(0, 20, 0, 0.5);
  border: 1px solid ${colors.darkGray};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  &:hover {
    background-color: rgba(0, 30, 0, 0.6);
  }
`;

const UrlText = styled.a`
  font-family: ${fonts.terminal};
  color: ${colors.neonBlue};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 85%;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: ${colors.terminalGreen};
  margin-left: 5px;
  animation: ${blink} 1s step-end infinite;
  vertical-align: middle;
`;

const ErrorMessage = styled.div`
  color: ${colors.neonRed};
  font-family: ${fonts.terminal};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

// Mock file interface for the prototype
interface MockFile {
  id: string;
  name: string;
  size: string;
  url: string;
}

const VibeDescriptionStep: React.FC = () => {
  const { vibeState, setDescription, addMediaUrl, removeMediaUrl, nextStep, prevStep } = useVibe();
  const [descriptionText, setDescriptionText] = useState(vibeState.description);
  const [mockFiles, setMockFiles] = useState<MockFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [lineCount, setLineCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const soundEffects = useSound();
  const typingTimeoutRef = useRef<number | null>(null);
  
  // Update line numbers when text changes
  useEffect(() => {
    const lines = (descriptionText.match(/\n/g) || []).length + 1;
    setLineCount(lines);
  }, [descriptionText]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(e.target.value);
    
    // Play typing sound with throttling
    if (e.target.value !== descriptionText) {
      soundEffects.play('typing');
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to prevent too many sounds
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 200);
    }
  };
  
  const handleFileClick = () => {
    if (fileInputRef.current) {
      soundEffects.play('click');
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length) {
      setIsLoading(true);
      soundEffects.play('transition');
      
      // Simulate file upload (would connect to real upload in production)
      setTimeout(() => {
        const files = Array.from(fileInputRef.current?.files || []);
        
        const mockFileList = files.map(file => {
          // Create a mocked file object
          const mockFile: MockFile = {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: formatFileSize(file.size),
            url: URL.createObjectURL(file)
          };
          
          // Add to media URLs in context
          addMediaUrl(mockFile.url);
          
          return mockFile;
        });
        
        setMockFiles(prev => [...prev, ...mockFileList]);
        setIsLoading(false);
        soundEffects.play('success');
        
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);
    }
  };
  
  const handleDeleteFile = (file: MockFile) => {
    setMockFiles(prev => prev.filter(f => f.id !== file.id));
    removeMediaUrl(file.url);
    URL.revokeObjectURL(file.url);
    soundEffects.play('error');
  };
  
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    
    // Very basic URL validation
    if (!isValidUrl(urlInput)) {
      setUrlError('ERROR: INVALID URL FORMAT');
      soundEffects.play('error');
      return;
    }
    
    addMediaUrl(urlInput);
    setUrlInput('');
    setUrlError('');
    soundEffects.play('success');
  };
  
  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddUrl();
    }
  };
  
  const handleRemoveUrl = (url: string) => {
    removeMediaUrl(url);
    soundEffects.play('error');
  };
  
  const handleContinue = () => {
    setDescription(descriptionText);
    soundEffects.play('success');
    nextStep();
  };
  
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Basic URL validation
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  // Generate line numbers
  const renderLineNumbers = () => {
    return Array(lineCount)
      .fill(0)
      .map((_, i) => <LineNumber key={i}>{i + 1}</LineNumber>);
  };
  
  return (
    <CRTScreen borderGlow={colors.neonGreen} glitchIntensity="low">
      <Container>
        <QuestionHeading>DESCRIBE THE VIBE</QuestionHeading>
        
        <EditorContainer>
          <EditorHeader>
            <EditorTitle>vibe_description.txt</EditorTitle>
            <EditorControls>
              <div className="control minimize"></div>
              <div className="control maximize"></div>
              <div className="control close"></div>
            </EditorControls>
          </EditorHeader>
          
          <TextAreaWrapper>
            <LineNumbers>
              {renderLineNumbers()}
            </LineNumbers>
            <StyledTextArea
              value={descriptionText}
              onChange={handleTextChange}
              placeholder="
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DESCRIBE YOUR DESIRED VIBE IN DETAIL
  
  EXAMPLE:
  - Atmosphere: neon-lit rainy streets, steamy sewers
  - Mood: melancholy with underlying hope
  - Sensory details: smell of wet concrete, distant sirens
  - Key references: Blade Runner meets 90s internet cafes
  
  OR JUST FREESTYLE YOUR DESCRIPTION BELOW:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              "
              spellCheck={false}
            />
          </TextAreaWrapper>
        </EditorContainer>
        
        <UploaderSection>
          <UploadArea onClick={handleFileClick}>
            <UploadIcon>↑</UploadIcon>
            <UploadText>
              DRAG FILES HERE OR CLICK TO UPLOAD REFERENCE IMAGES
            </UploadText>
            <HiddenInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
          </UploadArea>
          
          {isLoading && <LoadingBar />}
          
          {mockFiles.length > 0 && (
            <FileList>
              {mockFiles.map(file => (
                <FileItem key={file.id}>
                  <FileName>{file.name}</FileName>
                  <FileSize>{file.size}</FileSize>
                  <DeleteButton onClick={() => handleDeleteFile(file)}>×</DeleteButton>
                </FileItem>
              ))}
            </FileList>
          )}
        </UploaderSection>
        
        <UrlInputSection>
          <UrlInputLabel>
            ADD URL/REFERENCE LINK<Cursor />
          </UrlInputLabel>
          <UrlInputWrapper>
            <UrlInput
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError('');
              }}
              onKeyDown={handleUrlKeyDown}
              placeholder="https://example.com/inspiration"
            />
            <RetroButton 
              onClick={handleAddUrl}
              size="small"
              variant="primary"
            >
              ADD
            </RetroButton>
          </UrlInputWrapper>
          
          {urlError && <ErrorMessage>{urlError}</ErrorMessage>}
          
          {vibeState.mediaUrls.filter(url => url.startsWith('http')).length > 0 && (
            <UrlList>
              {vibeState.mediaUrls
                .filter(url => url.startsWith('http'))
                .map((url, index) => (
                  <UrlItem key={index}>
                    <UrlText href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </UrlText>
                    <DeleteButton onClick={() => handleRemoveUrl(url)}>×</DeleteButton>
                  </UrlItem>
                ))}
            </UrlList>
          )}
        </UrlInputSection>
        
        <ButtonContainer>
          <RetroButton 
            onClick={() => {
              soundEffects.play('click');
              prevStep();
            }} 
            variant="secondary"
          >
            ◄ BACK
          </RetroButton>
          
          <RetroButton 
            onClick={() => {
              soundEffects.play('success');
              handleContinue();
            }} 
            variant="primary"
          >
            NEXT ►
          </RetroButton>
        </ButtonContainer>
      </Container>
    </CRTScreen>
  );
};

export default VibeDescriptionStep; 