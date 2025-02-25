/**
 * Vibe Questionnaire Step for collecting answers to 5 questions
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../../styles/theme';
import { useVibe } from '../../context/VibeContext';
import { VIBE_QUESTIONS } from '../../constants/questions';
import { UserInput } from '../../types/vibeTypes';
import { useApi } from '../../context/ApiContext';
import CRTScreen from '../ui/CRTScreen';
import TerminalText from '../ui/TerminalText';
import RetroButton from '../ui/RetroButton';

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

const FormContainer = styled.form`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const QuestionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const QuestionLabel = styled.label`
  display: block;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${colors.neonGreen};
  font-family: ${fonts.terminal};
`;

const QuestionInput = styled.textarea`
  width: 100%;
  background-color: #000;
  border: 1px solid ${colors.neonGreen};
  color: ${colors.neonPink};
  padding: 1rem;
  font-family: ${fonts.terminal};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 8px ${colors.neonGreen};
    border-color: ${colors.neonGreen};
  }
  
  &::placeholder {
    color: rgba(51, 255, 51, 0.4);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
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

const StatusText = styled.div`
  font-family: ${fonts.terminal};
  color: ${colors.neonGreen};
  margin: 0.5rem 0;
  text-align: center;
`;

const VibeQuestionnaireStep: React.FC = () => {
  const { goToStep } = useVibe();
  const { loading, error, generateVibe } = useApi();
  
  // State for form inputs
  const [formValues, setFormValues] = useState<UserInput>({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: ''
  });
  
  // Processing steps for animation
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  
  const handleInputChange = (questionId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show processing animation
      setProcessingStep('Initializing vibe generation...');
      
      // Submit to API
      const result = await generateVibe(formValues);
      
      // Simulate processing steps for a better UX
      const steps = [
        'Analyzing your responses...',
        'Crafting your personalized vibe...',
        'Generating images...',
        'Curating soundtrack...',
        'Finalizing your experience...'
      ];
      
      // Simple animation of processing steps
      for (const step of steps) {
        setProcessingStep(step);
        // Wait a bit between steps for effect
        await new Promise(r => setTimeout(r, 1500));
      }
      
      // Transition to results screen
      goToStep(5);
      
    } catch (err) {
      // Error handling managed by the API context
      console.error('Failed to generate vibe:', err);
    }
  };
  
  return (
    <CRTScreen>
      <Container>
        <TerminalText as="h1" typing delay={50}>
          VIBE QUESTIONNAIRE
        </TerminalText>
        
        <TerminalText typing delay={30} maxWidth="800px">
          Answer these 5 questions to generate your personalized vibe experience.
          Be as descriptive as possible for the best results.
        </TerminalText>
        
        {loading ? (
          <LoadingContainer>
            <TerminalText typing delay={50} blinking>
              {processingStep || 'Processing...'}
            </TerminalText>
            <StatusText>
              This may take a minute or two. We're crafting something special for you.
            </StatusText>
          </LoadingContainer>
        ) : (
          <FormContainer onSubmit={handleSubmit}>
            {VIBE_QUESTIONS.map((question) => (
              <QuestionContainer key={question.id}>
                <QuestionLabel htmlFor={question.id}>{question.text}</QuestionLabel>
                <QuestionInput
                  id={question.id}
                  name={question.id}
                  placeholder={question.placeholder}
                  value={formValues[question.id as keyof UserInput]}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required
                />
              </QuestionContainer>
            ))}
            
            <ButtonContainer>
              <RetroButton type="button" onClick={() => goToStep(3)}>
                Back
              </RetroButton>
              <RetroButton type="submit" glowing>
                Generate My Vibe
              </RetroButton>
            </ButtonContainer>
          </FormContainer>
        )}
        
        {error && (
          <ErrorMessage>
            <TerminalText color={colors.neonRed}>Error: {error}</TerminalText>
          </ErrorMessage>
        )}
      </Container>
    </CRTScreen>
  );
};

export default VibeQuestionnaireStep; 