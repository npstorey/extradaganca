import Color from 'color';
import { Vibe } from '../types/vibe';

// Default theme values (baseline retro-futuristic theme)
export const defaultTheme = {
  primaryColor: '#4e00ec',
  secondaryColor: '#ff00ff',
  backgroundColor: '#0c0c14',
  textColor: '#ffffff',
  accentColor: '#00ffcc',
  fontFamily: "'Press Start 2P', cursive",
  titleFontFamily: "'Orbitron', sans-serif",
  borderRadius: '4px',
  spacing: '1rem',
  glowEffect: '0 0 10px',
  glowIntensity: 0.5,
  borderStyle: 'solid',
  textShadow: '0 0 5px',
  backgroundPattern: 'none',
  animationSpeed: 'normal',
  layoutStyle: 'grid',
  overlayEffect: 'none',
  boxShadowStyle: '0 5px 15px rgba(0, 0, 0, 0.5)',
  gradientOverlay: 'none'
};

export type VibeTheme = typeof defaultTheme;

// Map of mood keywords to color ranges
const moodColorMap: Record<string, { primary: string, accent: string, background: string }> = {
  // Energetic, exciting, adventurous
  energetic: { 
    primary: '#ff0000', // Red
    accent: '#ffcc00',  // Gold
    background: '#330000' // Dark red
  },
  exciting: { 
    primary: '#ff4500', // Orange-Red
    accent: '#ffff00',  // Yellow
    background: '#240f00' // Dark brown
  },
  adventurous: { 
    primary: '#ff8c00', // Dark Orange
    accent: '#00ccff',  // Bright blue
    background: '#2a1f00' // Dark amber
  },
  
  // Calm, peaceful, relaxing
  calm: { 
    primary: '#4682b4', // Steel Blue
    accent: '#a0d6b4',  // Seafoam
    background: '#0c1f2a' // Dark blue-green
  },
  peaceful: { 
    primary: '#87ceeb', // Sky Blue
    accent: '#ffffff',  // White
    background: '#19283a' // Muted navy
  },
  relaxing: { 
    primary: '#add8e6', // Light Blue
    accent: '#d4f0f0',  // Pale cyan
    background: '#1a2e3b' // Deep teal
  },
  
  // Happy, joyful, fun
  happy: { 
    primary: '#ffff00', // Yellow
    accent: '#ff66cc',  // Pink
    background: '#1f1f00' // Dark gold
  },
  joyful: { 
    primary: '#ffd700', // Gold
    accent: '#00ff00',  // Green
    background: '#1e1a00' // Dark amber
  },
  fun: { 
    primary: '#ffa500', // Orange
    accent: '#ff00ff',  // Magenta
    background: '#1f1200' // Brown
  },
  
  // Mysterious, dark, edgy
  mysterious: { 
    primary: '#800080', // Purple
    accent: '#00ffcc',  // Neon green-blue
    background: '#150015' // Very dark purple
  },
  dark: { 
    primary: '#483d8b', // Dark Slate Blue
    accent: '#9370db',  // Medium purple
    background: '#0d0a1c' // Nearly black blue
  },
  edgy: { 
    primary: '#191970', // Midnight Blue
    accent: '#ff0000',  // Red
    background: '#06061c' // Nearly black blue
  },
  
  // Futuristic, tech
  futuristic: { 
    primary: '#00ff00', // Neon Green
    accent: '#00ccff',  // Cyan blue
    background: '#001a00' // Dark green
  },
  tech: { 
    primary: '#00ffff', // Cyan
    accent: '#ff00ff',  // Magenta
    background: '#001a1a' // Dark cyan
  },
  cyberpunk: { 
    primary: '#ff00ff', // Magenta
    accent: '#00ffff',  // Cyan
    background: '#1a001a' // Dark magenta
  },
  
  // Retro, vintage
  retro: { 
    primary: '#ff00ff', // Magenta
    accent: '#ffcc00',  // Gold
    background: '#0d0d0d' // Dark gray
  },
  vintage: { 
    primary: '#deb887', // Burlywood
    accent: '#a0522d',  // Sienna
    background: '#211c13' // Dark sepia
  },
  
  // Romantic, dreamy
  romantic: { 
    primary: '#ff69b4', // Hot Pink
    accent: '#e6e6fa',  // Lavender
    background: '#1f141b' // Dark mauve
  },
  dreamy: { 
    primary: '#da70d6', // Orchid
    accent: '#87cefa',  // Light sky blue
    background: '#1a121a' // Dark lavender
  }
};

// Map of mood keywords to font families
const fontMap: Record<string, { title: string, body: string }> = {
  retro: {
    title: "'Press Start 2P', cursive",
    body: "'VT323', monospace"
  },
  tech: {
    title: "'Share Tech Mono', monospace",
    body: "'Share Tech Mono', monospace"
  },
  futuristic: {
    title: "'Orbitron', sans-serif",
    body: "'Rajdhani', sans-serif"
  },
  vintage: {
    title: "'Special Elite', cursive",
    body: "'Courier New', monospace"
  },
  elegant: {
    title: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif"
  },
  playful: {
    title: "'Fredoka One', cursive",
    body: "'Quicksand', sans-serif"
  },
  serious: {
    title: "'Roboto Mono', monospace",
    body: "'Roboto', sans-serif"
  },
  mysterious: {
    title: "'Cinzel', serif",
    body: "'Cormorant', serif"
  },
  cyberpunk: {
    title: "'Turret Road', cursive",
    body: "'Chakra Petch', sans-serif"
  },
  default: {
    title: "'Press Start 2P', cursive",
    body: "'VT323', monospace"
  }
};

// Map of style keywords to layout styles
const layoutStyleMap: Record<string, string> = {
  clean: 'flex',
  dynamic: 'grid',
  compact: 'flex-column',
  spacious: 'grid-wide',
  organized: 'columns',
  chaotic: 'asymmetric',
  horizontal: 'flex-wrap',
  vertical: 'flex-column',
  layered: 'stacked',
  minimal: 'minimal',
  default: 'grid'
};

// Map for background patterns based on vibe
const backgroundPatternMap: Record<string, string> = {
  tech: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
  grid: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
  dots: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
  waves: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 4px)',
  noise: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
  circuit: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'none\' stroke=\'%23333\' stroke-width=\'0.25\' d=\'M10 10L90 10M10 20L90 20M10 30L90 30M10 40L90 40M10 50L90 50M10 60L90 60M10 70L90 70M10 80L90 80M10 90L90 90M10 10L10 90M20 10L20 90M30 10L30 90M40 10L40 90M50 10L50 90M60 10L60 90M70 10L70 90M80 10L80 90M90 10L90 90\'/%3E%3C/svg%3E")',
  none: 'none'
};

// Map for overlay effects
const overlayEffectMap: Record<string, string> = {
  scanlines: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))',
  vignette: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.5) 100%)',
  grain: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
  none: 'none'
};

/**
 * Analyzes the text to determine the primary mood
 */
export const extractMood = (vibe: Vibe): string => {
  // If mood is explicitly provided, use it
  if (vibe.mood) {
    return vibe.mood.toLowerCase();
  }
  
  // Check title and description for mood keywords
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  // Create an array of all mood keywords
  const moodKeywords = Object.keys(moodColorMap);
  
  for (const mood of moodKeywords) {
    if (allText.includes(mood)) {
      return mood;
    }
  }
  
  // If no specific mood is found, try to categorize broader mood groups
  if (/calm|peaceful|tranquil|serene|gentle/i.test(allText)) {
    return 'calm';
  } else if (/energ|vibrant|lively|dynamic|active/i.test(allText)) {
    return 'energetic';
  } else if (/happy|joy|fun|playful|cheerful/i.test(allText)) {
    return 'happy';
  } else if (/myster|dark|shadow|enigma|obscure/i.test(allText)) {
    return 'mysterious';
  } else if (/future|tech|cyber|digital|scifi/i.test(allText)) {
    return 'futuristic';
  } else if (/retro|vintage|old|classic|nostalgic/i.test(allText)) {
    return 'retro';
  } else if (/romantic|love|passion|intimate|dreamy/i.test(allText)) {
    return 'romantic';
  }
  
  // Default to neutral mood
  return 'retro';
};

/**
 * Extracts a primary color from the vibe content
 */
const extractPrimaryColor = (vibe: Vibe): string => {
  // If colors are explicitly provided, use the first one
  if (vibe.colors && vibe.colors.length > 0) {
    return vibe.colors[0];
  }
  
  // Extract mood and use its color scheme
  const mood = extractMood(vibe);
  if (moodColorMap[mood]) {
    return moodColorMap[mood].primary;
  }
  
  // Default to the default theme color
  return defaultTheme.primaryColor;
};

/**
 * Extracts accent color from the vibe
 */
const extractAccentColor = (vibe: Vibe): string => {
  // If colors are explicitly provided, use the second one or generate a complement
  if (vibe.colors && vibe.colors.length > 1) {
    return vibe.colors[1];
  }
  
  // Extract mood and use its accent color
  const mood = extractMood(vibe);
  if (moodColorMap[mood]) {
    return moodColorMap[mood].accent;
  }
  
  // Create a complementary color to the primary
  try {
    const primaryColor = extractPrimaryColor(vibe);
    const color = Color(primaryColor);
    return color.rotate(180).saturate(0.2).hex();
  } catch (error) {
    return defaultTheme.accentColor;
  }
};

/**
 * Extracts background color based on primary color and mood
 */
const extractBackgroundColor = (vibe: Vibe): string => {
  try {
    // Extract mood and use its background color
    const mood = extractMood(vibe);
    if (moodColorMap[mood]) {
      return moodColorMap[mood].background;
    }
    
    // Otherwise create a dark shade of the primary color
    const primaryColor = extractPrimaryColor(vibe);
    const color = Color(primaryColor);
    return color.darken(0.75).desaturate(0.3).hex();
  } catch (error) {
    console.error('Error generating background color:', error);
    return defaultTheme.backgroundColor;
  }
};

/**
 * Extracts text color ensuring contrast with background
 */
const extractTextColor = (backgroundColor: string): string => {
  try {
    const bgColor = Color(backgroundColor);
    // Ensure high contrast for text
    return bgColor.isDark() ? '#ffffff' : '#0c0c14';
  } catch (error) {
    console.error('Error generating text color:', error);
    return defaultTheme.textColor;
  }
};

/**
 * Extracts font families based on mood and vibe keywords
 */
const extractFonts = (vibe: Vibe): { titleFont: string, bodyFont: string } => {
  // Check all text for style hints
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  // First try to match specific style keywords
  for (const [keyword, fonts] of Object.entries(fontMap)) {
    if (allText.includes(keyword)) {
      return { titleFont: fonts.title, bodyFont: fonts.body };
    }
  }
  
  // If no specific style found, use the mood to determine font
  const mood = extractMood(vibe);
  if (mood === 'futuristic' || mood === 'tech') {
    return { titleFont: fontMap.futuristic.title, bodyFont: fontMap.tech.body };
  } else if (mood === 'retro' || mood === 'vintage') {
    return { titleFont: fontMap.retro.title, bodyFont: fontMap.retro.body };
  } else if (mood === 'mysterious' || mood === 'dark') {
    return { titleFont: fontMap.mysterious.title, bodyFont: fontMap.mysterious.body };
  } else if (mood === 'happy' || mood === 'fun' || mood === 'joyful') {
    return { titleFont: fontMap.playful.title, bodyFont: fontMap.playful.body };
  } else if (mood === 'calm' || mood === 'peaceful') {
    return { titleFont: fontMap.elegant.title, bodyFont: fontMap.elegant.body };
  }
  
  // Default fonts
  return { titleFont: fontMap.default.title, bodyFont: fontMap.default.body };
};

/**
 * Extracts layout style based on vibe content
 */
const extractLayoutStyle = (vibe: Vibe): string => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  for (const [keyword, style] of Object.entries(layoutStyleMap)) {
    if (allText.includes(keyword)) {
      return style;
    }
  }
  
  // Extract by mood
  const mood = extractMood(vibe);
  if (mood === 'chaotic' || mood === 'exciting') {
    return 'asymmetric';
  } else if (mood === 'calm' || mood === 'peaceful') {
    return 'spacious';
  } else if (mood === 'organized' || mood === 'tech') {
    return 'grid';
  }
  
  return defaultTheme.layoutStyle;
};

/**
 * Extract background pattern based on vibe
 */
const extractBackgroundPattern = (vibe: Vibe): string => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  if (/tech|digital|cyber|circuit|computer/i.test(allText)) {
    return backgroundPatternMap.circuit;
  } else if (/grid|matrix|pattern|order/i.test(allText)) {
    return backgroundPatternMap.grid;
  } else if (/dot|point|spot|constellation/i.test(allText)) {
    return backgroundPatternMap.dots;
  } else if (/wave|flow|ocean|water|smooth/i.test(allText)) {
    return backgroundPatternMap.waves;
  } else if (/noise|static|grain|distort/i.test(allText)) {
    return backgroundPatternMap.noise;
  }
  
  // Extract by mood
  const mood = extractMood(vibe);
  if (mood === 'tech' || mood === 'futuristic') {
    return backgroundPatternMap.tech;
  } else if (mood === 'mysterious') {
    return backgroundPatternMap.noise;
  }
  
  return backgroundPatternMap.none;
};

/**
 * Extract overlay effect based on vibe
 */
const extractOverlayEffect = (vibe: Vibe): string => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  if (/screen|monitor|tv|display|retro/i.test(allText)) {
    return overlayEffectMap.scanlines;
  } else if (/dark|shadow|night|noir|mystic/i.test(allText)) {
    return overlayEffectMap.vignette;
  } else if (/grain|noise|film|analog|vintage/i.test(allText)) {
    return overlayEffectMap.grain;
  }
  
  // Extract by mood
  const mood = extractMood(vibe);
  if (mood === 'retro' || mood === 'vintage') {
    return overlayEffectMap.scanlines;
  } else if (mood === 'mysterious' || mood === 'dark') {
    return overlayEffectMap.vignette;
  }
  
  return overlayEffectMap.none;
};

/**
 * Extract border style based on vibe
 */
const extractBorderStyle = (vibe: Vibe): string => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  if (/tech|digital|cyber|future/i.test(allText)) {
    return 'solid';
  } else if (/flow|wave|ocean|water/i.test(allText)) {
    return 'none';
  } else if (/retro|vintage|classic/i.test(allText)) {
    return 'dashed';
  } else if (/playful|fun|joyful/i.test(allText)) {
    return 'dotted';
  }
  
  return 'solid';
};

/**
 * Extract box shadow style based on vibe
 */
const extractBoxShadowStyle = (vibe: Vibe, primaryColor: string): string => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  const mood = extractMood(vibe);
  
  if (/glow|neon|luminous|bright/i.test(allText)) {
    return `0 0 20px ${Color(primaryColor).alpha(0.5).toString()}`;
  } else if (/shadow|dark|noir/i.test(allText)) {
    return '0 10px 30px rgba(0, 0, 0, 0.7)';
  } else if (/flat|minimal|clean/i.test(allText)) {
    return 'none';
  } else if (mood === 'futuristic' || mood === 'tech') {
    return `0 5px 15px ${Color(primaryColor).darken(0.7).alpha(0.5).toString()}`;
  }
  
  return defaultTheme.boxShadowStyle;
};

/**
 * Extract gradient overlay based on vibe
 */
const extractGradientOverlay = (vibe: Vibe, primaryColor: string, accentColor: string): string => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  if (/gradient|rainbow|colorful/i.test(allText)) {
    return `linear-gradient(45deg, ${Color(primaryColor).alpha(0.2).toString()}, ${Color(accentColor).alpha(0.2).toString()})`;
  } else if (/sunset|dusk|dawn/i.test(allText)) {
    return 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(255,60,0,0.2))';
  } else if (/night|dark|space/i.test(allText)) {
    return 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,50,0.3))';
  }
  
  return 'none';
};

/**
 * Extract glow intensity based on vibe
 */
const extractGlowIntensity = (vibe: Vibe): number => {
  const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
  
  if (/bright|glow|neon|luminous|radiant/i.test(allText)) {
    return 1.0;
  } else if (/soft|gentle|subtle/i.test(allText)) {
    return 0.3;
  } else if (/dark|shadow|night/i.test(allText)) {
    return 0.7;
  }
  
  // Extract by mood
  const mood = extractMood(vibe);
  if (mood === 'futuristic' || mood === 'tech' || mood === 'cyberpunk') {
    return 0.8;
  } else if (mood === 'calm' || mood === 'peaceful') {
    return 0.2;
  }
  
  return 0.5;
};

/**
 * Main function to extract a theme from vibe content
 */
export const extractThemeFromVibe = (vibe: Vibe): VibeTheme => {
  if (!vibe) return defaultTheme;
  
  try {
    // Extract mood to guide our theme creation
    const mood = extractMood(vibe);
    console.log('Extracted mood:', mood);
    
    // Extract colors
    const primaryColor = extractPrimaryColor(vibe);
    const accentColor = extractAccentColor(vibe);
    const backgroundColor = extractBackgroundColor(vibe);
    const textColor = extractTextColor(backgroundColor);
    
    // Extract fonts
    const { titleFont, bodyFont } = extractFonts(vibe);
    
    // Extract layout style
    const layoutStyle = extractLayoutStyle(vibe);
    
    // Extract border radius based on vibe
    const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
    const isPlayful = ['fun', 'playful', 'joyful', 'happy', 'bouncy'].some(word => allText.includes(word));
    const isTech = ['tech', 'futuristic', 'digital', 'cyber'].some(word => allText.includes(word));
    const borderRadius = isPlayful ? '12px' : isTech ? '0px' : '4px';
    
    // Extract glow effect
    const glowIntensity = extractGlowIntensity(vibe);
    const glowEffect = `0 0 ${Math.floor(glowIntensity * 20)}px`;
    
    // Extract spacing
    const isSpacious = ['spacious', 'airy', 'open', 'vast'].some(word => allText.includes(word));
    const isCrowded = ['crowded', 'dense', 'compact', 'tight'].some(word => allText.includes(word));
    const spacing = isSpacious ? '2rem' : isCrowded ? '0.5rem' : '1rem';
    
    // Extract border style
    const borderStyle = extractBorderStyle(vibe);
    
    // Extract background pattern
    const backgroundPattern = extractBackgroundPattern(vibe);
    
    // Extract overlay effect
    const overlayEffect = extractOverlayEffect(vibe);
    
    // Extract box shadow style
    const boxShadowStyle = extractBoxShadowStyle(vibe, primaryColor);
    
    // Extract gradient overlay
    const gradientOverlay = extractGradientOverlay(vibe, primaryColor, accentColor);
    
    // Extract animation speed
    const isFast = ['fast', 'quick', 'rapid', 'energetic'].some(word => allText.includes(word));
    const isSlow = ['slow', 'gentle', 'calm', 'peaceful'].some(word => allText.includes(word));
    const animationSpeed = isFast ? 'fast' : isSlow ? 'slow' : 'normal';
    
    // Text shadow based on mood
    const textShadow = mood === 'futuristic' || mood === 'tech' || mood === 'cyberpunk' 
      ? `0 0 10px ${accentColor}80`
      : mood === 'mysterious' || mood === 'dark' 
        ? '2px 2px 4px rgba(0,0,0,0.5)'
        : '0 0 5px';
    
    return {
      primaryColor,
      secondaryColor: accentColor,
      backgroundColor,
      textColor,
      accentColor,
      fontFamily: bodyFont,
      titleFontFamily: titleFont,
      borderRadius,
      spacing,
      glowEffect,
      glowIntensity,
      borderStyle,
      textShadow,
      backgroundPattern,
      animationSpeed,
      layoutStyle,
      overlayEffect,
      boxShadowStyle,
      gradientOverlay
    };
  } catch (error) {
    console.error('Error extracting theme from vibe:', error);
    return defaultTheme;
  }
}; 