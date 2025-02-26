export interface Vibe {
  title: string;
  description: string;
  imageUrls?: string[];
  playlist?: string;
  mood?: string;
  colors?: string[];
  activities?: string[];
  songs?: { title: string; artist: string; uri?: string }[];
  extraInfo?: Record<string, any>;
} 