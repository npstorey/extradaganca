export interface Vibe {
  title: string;
  description: string;
  imageUrls?: string[];
  playlist?: string;
  mood?: string;
  colors?: string[];
  activities?: string[];
  extraInfo?: Record<string, any>;
} 