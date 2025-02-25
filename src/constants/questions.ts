/**
 * Questions for vibe generation
 */

export interface Question {
  id: string;
  text: string;
  placeholder?: string;
}

/**
 * The 5 questions used to generate a vibe
 */
export const VIBE_QUESTIONS: Question[] = [
  {
    id: 'question1',
    text: 'If your current mood was a color, what would it be and why?',
    placeholder: 'e.g., Deep blue because I feel calm but introspective'
  },
  {
    id: 'question2',
    text: 'What activity would make your day perfect right now?',
    placeholder: 'e.g., A long walk in the woods with my dog'
  },
  {
    id: 'question3',
    text: 'Name a movie, TV show, or book that matches how you feel today.',
    placeholder: 'e.g., Almost Famous - nostalgic but energetic'
  },
  {
    id: 'question4',
    text: 'If you could teleport anywhere for the next hour, where would you go?',
    placeholder: 'e.g., A small café in Paris with a view of the Eiffel Tower'
  },
  {
    id: 'question5',
    text: 'What kind of music would be the soundtrack to your current mindset?',
    placeholder: 'e.g., Slow jazz with deep bass and subtle piano'
  }
]; 