import Color from 'color';
import { Vibe } from '../types/vibe';

// Style themes representing different aesthetic directions
// These serve as complete style packages rather than just color schemes
const styleThemes = {
  // Retro-futuristic / synthwave style
  retroFuturistic: {
    primaryColor: '#4e00ec',
    secondaryColor: '#ff00ff',
    backgroundColor: '#0c0c14',
    textColor: '#ffffff',
    accentColor: '#00ffcc',
    fontFamily: "'VT323', monospace",
    titleFontFamily: "'Orbitron', sans-serif",
    borderRadius: '4px',
    spacing: '1rem',
    glowEffect: '0 0 10px',
    glowIntensity: 0.8,
    borderStyle: 'solid',
    textShadow: '0 0 5px',
    backgroundPattern: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
    animationSpeed: 'fast',
    layoutStyle: 'grid',
    overlayEffect: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))',
    boxShadowStyle: '0 5px 15px rgba(0, 0, 0, 0.5)',
    gradientOverlay: 'none'
  },
  
  // Playful, childlike, whimsical style
  playful: {
    primaryColor: '#ff66cc',
    secondaryColor: '#ffcc00',
    backgroundColor: '#fff5f9',
    textColor: '#333333',
    accentColor: '#66ccff',
    fontFamily: "'Comic Neue', cursive",
    titleFontFamily: "'Fredoka One', cursive",
    borderRadius: '24px',
    spacing: '1.2rem',
    glowEffect: 'none',
    glowIntensity: 0,
    borderStyle: 'dashed',
    textShadow: 'none',
    backgroundPattern: 'radial-gradient(rgba(255, 102, 204, 0.1) 1px, transparent 1px)',
    animationSpeed: 'fast',
    layoutStyle: 'flex-wrap',
    overlayEffect: 'none',
    boxShadowStyle: '0 8px 0 rgba(0,0,0,0.1)',
    gradientOverlay: 'linear-gradient(120deg, rgba(255,255,255,0.7), rgba(255,255,255,0))'
  },
  
  // Elegant, sophisticated, luxury style
  elegant: {
    primaryColor: '#c9b37e',
    secondaryColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#c9b37e',
    fontFamily: "'Cormorant Garamond', serif",
    titleFontFamily: "'Playfair Display', serif",
    borderRadius: '0px',
    spacing: '2rem',
    glowEffect: 'none',
    glowIntensity: 0,
    borderStyle: 'solid',
    textShadow: 'none',
    backgroundPattern: 'none',
    animationSpeed: 'slow',
    layoutStyle: 'flex-column',
    overlayEffect: 'none',
    boxShadowStyle: '0 1px 3px rgba(0,0,0,0.1)',
    gradientOverlay: 'none'
  },
  
  // Mysterious, dark, gothic style
  mysterious: {
    primaryColor: '#800020',
    secondaryColor: '#483d8b',
    backgroundColor: '#0d0d0d',
    textColor: '#d3d3d3',
    accentColor: '#9370db',
    fontFamily: "'Cormorant', serif",
    titleFontFamily: "'Playfair Display', serif",
    borderRadius: '0px',
    spacing: '2rem',
    glowEffect: '0 0 15px',
    glowIntensity: 0.3,
    borderStyle: 'solid',
    textShadow: '2px 2px 8px rgba(128,0,32,0.7)',
    backgroundPattern: 'radial-gradient(rgba(128, 0, 32, 0.1) 1px, transparent 1px)',
    animationSpeed: 'slow',
    layoutStyle: 'flex-column',
    overlayEffect: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.7) 100%)',
    boxShadowStyle: '0 10px 30px rgba(0, 0, 0, 0.8)',
    gradientOverlay: 'linear-gradient(to bottom, rgba(13,13,13,0), rgba(128,0,32,0.1))'
  },
  
  // Clean, minimalist, modern style
  minimalist: {
    primaryColor: '#000000',
    secondaryColor: '#555555',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#4285f4',
    fontFamily: "'Inter', sans-serif",
    titleFontFamily: "'Montserrat', sans-serif",
    borderRadius: '2px',
    spacing: '2rem',
    glowEffect: 'none',
    glowIntensity: 0,
    borderStyle: 'none',
    textShadow: 'none',
    backgroundPattern: 'none',
    animationSpeed: 'normal',
    layoutStyle: 'flex',
    overlayEffect: 'none',
    boxShadowStyle: '0 1px 2px rgba(0,0,0,0.07)',
    gradientOverlay: 'none'
  },
  
  // Natural, earthy, organic style
  natural: {
    primaryColor: '#5d4037',
    secondaryColor: '#7cb342',
    backgroundColor: '#f5f3e7',
    textColor: '#3e2723',
    accentColor: '#8d6e63',
    fontFamily: "'Quattrocento Sans', sans-serif",
    titleFontFamily: "'Amatic SC', cursive",
    borderRadius: '8px',
    spacing: '1.5rem',
    glowEffect: 'none',
    glowIntensity: 0,
    borderStyle: 'solid',
    textShadow: 'none',
    backgroundPattern: 'none',
    animationSpeed: 'slow',
    layoutStyle: 'flex-column',
    overlayEffect: 'none',
    boxShadowStyle: '0 4px 6px rgba(93, 64, 55, 0.2)',
    gradientOverlay: 'linear-gradient(to bottom, rgba(245, 243, 231, 0), rgba(245, 243, 231, 0.8))'
  },
  
  // Default base theme (retroFuturistic as fallback)
  default: {
    primaryColor: '#4e00ec',
    secondaryColor: '#ff00ff',
    backgroundColor: '#0c0c14',
    textColor: '#ffffff',
    accentColor: '#00ffcc',
    fontFamily: "'VT323', monospace",
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
  }
};

export type VibeTheme = typeof styleThemes.default;

// Map of mood keywords to style themes
const moodStyleMap: Record<string, keyof typeof styleThemes> = {
  // Energetic, exciting moods
  energetic: 'retroFuturistic',
  exciting: 'retroFuturistic',
  vibrant: 'retroFuturistic',
  
  // Happy, playful moods
  happy: 'playful',
  playful: 'playful',
  joyful: 'playful',
  fun: 'playful',
  whimsical: 'playful',
  childlike: 'playful',
  magical: 'playful',
  
  // Calm, elegant moods
  elegant: 'elegant', 
  sophisticated: 'elegant',
  luxury: 'elegant',
  classy: 'elegant',
  
  // Mysterious, gothic moods
  mysterious: 'mysterious',
  dark: 'mysterious',
  shadowy: 'mysterious',
  gothic: 'mysterious',
  eerie: 'mysterious',
  
  // Minimalist, clean moods
  minimalist: 'minimalist',
  clean: 'minimalist',
  modern: 'minimalist',
  simple: 'minimalist',
  
  // Natural, earthy moods
  natural: 'natural',
  earthy: 'natural',
  organic: 'natural',
  rustic: 'natural'
};

// Map of font pairs for different styles
const fontPairings = {
  // Additional font pairings to choose from
  handwritten: {
    title: "'Permanent Marker', cursive",
    body: "'Caveat', cursive"
  },
  
  scifi: {
    title: "'Orbitron', sans-serif",
    body: "'Exo 2', sans-serif"
  },
  
  fantasy: {
    title: "'MedievalSharp', cursive",
    body: "'Metamorphous', serif"
  },
  
  technical: {
    title: "'Share Tech Mono', monospace",
    body: "'Source Code Pro', monospace"
  },
  
  romantic: {
    title: "'Great Vibes', cursive",
    body: "'Lora', serif"
  },
  
  corporate: {
    title: "'Montserrat', sans-serif",
    body: "'Open Sans', sans-serif"
  },
  
  retro70s: {
    title: "'Monoton', cursive",
    body: "'Poppins', sans-serif"
  },
  
  retro80s: {
    title: "'Press Start 2P', cursive",
    body: "'VT323', monospace"
  },
  
  artDeco: {
    title: "'Poiret One', cursive",
    body: "'Josefin Sans', sans-serif"
  }
};

// More diverse layout options
const layoutOptions = {
  grid: 'grid',
  flexColumn: 'flex-column',
  flexRow: 'flex-row',
  masonry: 'masonry',
  magazine: 'magazine',
  cards: 'cards',
  polaroid: 'polaroid',
  timeline: 'timeline',
  diagonal: 'diagonal',
  circular: 'circular',
  asymmetric: 'asymmetric',
  stacked: 'stacked'
};

// More diverse background patterns
const backgroundPatterns = {
  grid: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
  dots: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
  diagonalLines: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 4px)',
  horizontalLines: 'linear-gradient(0deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
  verticalLines: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
  noise: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
  circuit: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'none\' stroke=\'%23333\' stroke-width=\'0.25\' d=\'M10 10L90 10M10 20L90 20M10 30L90 30M10 40L90 40M10 50L90 50M10 60L90 60M10 70L90 70M10 80L90 80M10 90L90 90M10 10L10 90M20 10L20 90M30 10L30 90M40 10L40 90M50 10L50 90M60 10L60 90M70 10L70 90M80 10L80 90M90 10L90 90\'/%3E%3C/svg%3E")',
  confetti: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'confetti\' patternUnits=\'userSpaceOnUse\' width=\'40\' height=\'40\' patternTransform=\'scale(1) rotate(0)\'%3E%3Crect x=\'15\' y=\'10\' width=\'2\' height=\'2\' fill=\'%23FF00FF20\'/%3E%3Crect x=\'25\' y=\'16\' width=\'1\' height=\'1\' fill=\'%2300FFFF20\'/%3E%3Crect x=\'33\' y=\'33\' width=\'3\' height=\'3\' fill=\'%23FFFF0020\'/%3E%3Crect x=\'10\' y=\'25\' width=\'2\' height=\'2\' fill=\'%23FF000020\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23confetti)\'/%3E%3C/svg%3E")',
  bubbles: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle fill=\'%23FFFFFF10\' cx=\'20\' cy=\'20\' r=\'5\'/%3E%3Ccircle fill=\'%23FFFFFF10\' cx=\'60\' cy=\'40\' r=\'7\'/%3E%3Ccircle fill=\'%23FFFFFF10\' cx=\'35\' cy=\'75\' r=\'4\'/%3E%3Ccircle fill=\'%23FFFFFF10\' cx=\'80\' cy=\'80\' r=\'6\'/%3E%3C/svg%3E")',
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
  
  // Look for specific mood keywords
  for (const mood of Object.keys(moodStyleMap)) {
    if (allText.includes(mood)) {
      return mood;
    }
  }
  
  // If no direct match, try broader categories
  if (/pink|playful|whimsi|magic|unicorn|fantasy|fairy|child/i.test(allText)) {
    return 'playful';
  } else if (/jazz|crimson|moon|night|mysterious|noir|shadow|saxophone|steakhouse|saxophone|dimly lit|red light|aura/i.test(allText)) {
    return 'mysterious';
  } else if (/elegant|sophisticated|class|luxury|formal|rich/i.test(allText)) {
    return 'elegant';
  } else if (/clean|simple|minimal|modern|sleek|pure/i.test(allText)) {
    return 'minimalist';
  } else if (/nature|natural|earth|organic|wood|plant|forest|leaf/i.test(allText)) {
    return 'natural';
  } else if (/neon|cyber|digital|future|tech|retro|synth/i.test(allText)) {
    return 'retroFuturistic';
  }
  
  // Analyze dominant color mentions
  if (/red|crimson|maroon|ruby|scarlet/i.test(allText)) {
    return 'mysterious';
  } else if (/pink|magenta|rose|fuchsia/i.test(allText)) {
    return 'playful';
  } else if (/blue|azure|sapphire|navy/i.test(allText)) {
    return 'retroFuturistic';
  } else if (/green|emerald|mint|olive/i.test(allText)) {
    return 'natural';
  } else if (/gold|yellow|amber|bronze/i.test(allText)) {
    return 'elegant';
  } else if (/white|gray|silver|black/i.test(allText)) {
    return 'minimalist';
  } else if (/purple|violet|lavender|indigo/i.test(allText)) {
    return 'mysterious';
  }
  
  // Analyze references to time periods and aesthetics
  if (/80s|retro|synth|neon|arcade|wave/i.test(allText)) {
    return 'retroFuturistic';
  } else if (/victorian|gothic|ancient|medieval|classical/i.test(allText)) {
    return 'mysterious';
  } else if (/modern|contemporary|futuristic|sleek/i.test(allText)) {
    return 'minimalist';
  } else if (/rustic|cottage|garden|wild|forest/i.test(allText)) {
    return 'natural';
  }
  
  // Default to retroFuturistic as the fallback
  return 'retroFuturistic';
};

/**
 * Main function to extract a theme from vibe content
 */
export const extractThemeFromVibe = (vibe: Vibe): VibeTheme => {
  if (!vibe) return styleThemes.default;
  
  try {
    // Extract mood to guide our theme creation
    const mood = extractMood(vibe);
    console.log('Extracted mood:', mood);
    
    // Determine the base style theme to use
    const baseStyleName = moodStyleMap[mood] || 'default';
    const baseStyle = styleThemes[baseStyleName];
    console.log('Using base style:', baseStyleName);
    
    // Create a copy of the base style to customize
    const customTheme = { ...baseStyle };
    
    // Get color information from the vibe
    if (vibe.colors && vibe.colors.length > 0) {
      customTheme.primaryColor = vibe.colors[0];
      if (vibe.colors.length > 1) {
        customTheme.accentColor = vibe.colors[1];
      }
    }
    
    // Fine-tune the theme based on specific keywords in the vibe
    const allText = `${vibe.title} ${vibe.description}`.toLowerCase();
    
    // Check for specific font style mentions
    if (/handwritten|script|cursive|hand-drawn/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.handwritten.title;
      customTheme.fontFamily = fontPairings.handwritten.body;
    } else if (/technical|code|programming|computer|digital/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.technical.title;
      customTheme.fontFamily = fontPairings.technical.body;
    } else if (/fantasy|dragon|medieval|magic|wizard/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.fantasy.title;
      customTheme.fontFamily = fontPairings.fantasy.body;
    } else if (/romantic|love|passion|heart|dreamy/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.romantic.title;
      customTheme.fontFamily = fontPairings.romantic.body;
    } else if (/business|corporate|professional|formal/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.corporate.title;
      customTheme.fontFamily = fontPairings.corporate.body;
    } else if (/70s|disco|groove|funk/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.retro70s.title;
      customTheme.fontFamily = fontPairings.retro70s.body;
    } else if (/80s|arcade|synthwave|pixel/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.retro80s.title;
      customTheme.fontFamily = fontPairings.retro80s.body;
    } else if (/art deco|gatsby|1920s|elegant/i.test(allText)) {
      customTheme.titleFontFamily = fontPairings.artDeco.title;
      customTheme.fontFamily = fontPairings.artDeco.body;
    }
    
    // Check for layout mentions
    if (/grid|tiled|gallery/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.grid;
    } else if (/column|stack/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.flexColumn;
    } else if (/row|side by side/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.flexRow;
    } else if (/magazine|editorial/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.magazine;
    } else if (/card|polaroid/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.polaroid;
    } else if (/timeline|history/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.timeline;
    } else if (/diagonal|angle/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.diagonal;
    } else if (/circle|round/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.circular;
    } else if (/chaos|random|asymmetric/i.test(allText)) {
      customTheme.layoutStyle = layoutOptions.asymmetric;
    }
    
    // Check for pattern mentions
    if (/grid|square|graph/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.grid;
    } else if (/dot|spot|point/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.dots;
    } else if (/diagonal|slant/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.diagonalLines;
    } else if (/horizontal|row/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.horizontalLines;
    } else if (/vertical|column/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.verticalLines;
    } else if (/noise|static|grain/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.noise;
    } else if (/circuit|tech|computer|digital/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.circuit;
    } else if (/confetti|celebrate|party/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.confetti;
    } else if (/bubble|dot|circle/i.test(allText)) {
      customTheme.backgroundPattern = backgroundPatterns.bubbles;
    }
    
    // Fine-tune border radius based on the mood
    if (baseStyleName === 'playful' || /bubble|round|soft/i.test(allText)) {
      customTheme.borderRadius = '24px';
    } else if (baseStyleName === 'elegant' || baseStyleName === 'mysterious' || /sharp|edge|corner/i.test(allText)) {
      customTheme.borderRadius = '0px';
    } else if (baseStyleName === 'minimalist' || /clean|simple/i.test(allText)) {
      customTheme.borderRadius = '2px';
    } else if (baseStyleName === 'natural' || /organic|rounded/i.test(allText)) {
      customTheme.borderRadius = '8px';
    }
    
    // Fine-tune border style
    if (baseStyleName === 'playful' || /fun|casual|playful/i.test(allText)) {
      customTheme.borderStyle = 'dashed';
    } else if (baseStyleName === 'elegant' && /vintage|classic|luxury/i.test(allText)) {
      customTheme.borderStyle = 'double';
    } else if (baseStyleName === 'mysterious' && /ornate|detailed|intricate/i.test(allText)) {
      customTheme.borderStyle = 'double';
    } else if (baseStyleName === 'minimalist' || /clean|simple|modern/i.test(allText)) {
      customTheme.borderStyle = 'none';
    }
    
    // Set appropriate overlay effects
    if (baseStyleName === 'retroFuturistic' || /retro|80s|arcade/i.test(allText)) {
      customTheme.overlayEffect = 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))';
    } else if (baseStyleName === 'mysterious' || /dark|shadow|noir/i.test(allText)) {
      customTheme.overlayEffect = 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%)';
    } else if (/grainy|film|analog/i.test(allText)) {
      customTheme.overlayEffect = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")';
    }
    
    // Adjust animation speed
    if (/energetic|fast|quick|rapid/i.test(allText)) {
      customTheme.animationSpeed = 'fast';
    } else if (/calm|slow|gentle|peaceful/i.test(allText)) {
      customTheme.animationSpeed = 'slow';
    }
    
    console.log('Generated custom theme:', customTheme);
    return customTheme;
  } catch (error) {
    console.error('Error extracting theme from vibe:', error);
    return styleThemes.default;
  }
}; 