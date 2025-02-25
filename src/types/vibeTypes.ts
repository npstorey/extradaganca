/**
 * Types related to vibe generation
 */

/**
 * User input for generating a vibe
 */
export interface UserInput {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
}

/**
 * Generated text summary of a vibe
 */
export interface VibeSummary {
  title: string;
  description: string;
}

/**
 * Represents a generated image for a vibe
 */
export interface VibeImage {
  prompt: string;
  url: string;
}

/**
 * Represents a song recommendation for a vibe
 */
export interface VibeSong {
  title: string;
  artist: string;
  uri: string; // Spotify URI
}

/**
 * Complete generated vibe including all components
 */
export interface GeneratedVibe {
  summary: VibeSummary;
  images: VibeImage[];
  songs: VibeSong[];
  playlistUrl?: string;
  createdAt: Date;
} 