/**
 * Hook for playing sound effects in the application
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// Types for sound categories
export type SoundCategory = 'ui' | 'ambient' | 'notification';

// Interface for a sound effect
export interface SoundEffect {
  id: string;
  src: string;
  volume: number;
  category: SoundCategory;
  loop?: boolean;
}

// Sound effects collection
const SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'click',
    src: '/sounds/button-click.mp3',
    volume: 0.3,
    category: 'ui'
  },
  {
    id: 'hover',
    src: '/sounds/hover.mp3',
    volume: 0.2,
    category: 'ui'
  },
  {
    id: 'transition',
    src: '/sounds/transition.mp3',
    volume: 0.4,
    category: 'ui'
  },
  {
    id: 'success',
    src: '/sounds/success.mp3',
    volume: 0.5,
    category: 'notification'
  },
  {
    id: 'error',
    src: '/sounds/error.mp3',
    volume: 0.5,
    category: 'notification'
  },
  {
    id: 'ambient',
    src: '/sounds/ambient-synth.mp3',
    volume: 0.2,
    category: 'ambient',
    loop: true
  },
  {
    id: 'toggle',
    src: '/sounds/toggle.mp3',
    volume: 0.3,
    category: 'ui'
  }
];

/**
 * Custom hook for managing sound effects
 */
export const useSoundEffects = (autoInit = true) => {
  const [enabled, setEnabled] = useState(true);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const loadAttempted = useRef<boolean>(false);
  
  // Initialize audio elements
  useEffect(() => {
    if (!autoInit || loadAttempted.current) return;
    
    loadAttempted.current = true;
    console.log('Initializing sound effects...');
    
    // Try to create audio elements, but handle missing files gracefully
    let loadedCount = 0;
    const totalSounds = SOUND_EFFECTS.length;
    
    SOUND_EFFECTS.forEach(sound => {
      try {
        const audio = new Audio();
        
        // Set up event listeners for loading
        audio.addEventListener('canplaythrough', () => {
          loadedCount++;
          console.log(`Loaded sound: ${sound.id} (${loadedCount}/${totalSounds})`);
          if (loadedCount === totalSounds) {
            setSoundsLoaded(true);
            console.log('All sounds loaded successfully!');
          }
        });
        
        audio.addEventListener('error', (e) => {
          console.warn(`Failed to load sound "${sound.id}":`, e);
          // Still count as "loaded" to avoid hanging
          loadedCount++;
          if (loadedCount === totalSounds) {
            setSoundsLoaded(true);
            console.log('Sound loading completed with some errors');
          }
        });
        
        // Configure audio properties
        audio.volume = sound.volume;
        audio.loop = !!sound.loop;
        audio.preload = 'auto';
        
        // Set source last to trigger loading
        audio.src = sound.src;
        
        audioRefs.current[sound.id] = audio;
      } catch (error) {
        console.error(`Error initializing sound "${sound.id}":`, error);
        audioRefs.current[sound.id] = null;
        
        // Count errors toward total to avoid hanging
        loadedCount++;
        if (loadedCount === totalSounds) {
          setSoundsLoaded(true);
          console.log('Sound loading completed with some errors');
        }
      }
    });
    
    // Fallback to mark sounds as "loaded" if they're taking too long
    const timeout = setTimeout(() => {
      if (!soundsLoaded) {
        console.warn('Sound loading timeout - marking as loaded anyway');
        setSoundsLoaded(true);
      }
    }, 5000);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [autoInit, soundsLoaded]);
  
  /**
   * Play a sound by its ID
   */
  const play = useCallback((soundId: string, options?: { loop?: boolean }) => {
    // Don't try to play if disabled or not loaded
    if (!enabled) return null;
    
    const audio = audioRefs.current[soundId];
    
    if (audio) {
      try {
        // Set options if provided
        if (options?.loop !== undefined) {
          audio.loop = options.loop;
        }
        
        // Reset the audio if it's already playing
        audio.currentTime = 0;
        
        // Return a Promise for the play operation
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(err => {
            console.warn(`Failed to play sound "${soundId}":`, err);
          });
        }
        
        return soundId; // Return ID for reference (to stop later)
      } catch (err) {
        console.warn(`Error playing sound "${soundId}":`, err);
      }
    } else {
      console.warn(`Sound "${soundId}" not found or not loaded`);
    }
    
    return null;
  }, [enabled]);
  
  /**
   * Stop a sound by its ID
   */
  const stop = useCallback((soundId: string) => {
    const audio = audioRefs.current[soundId];
    
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (err) {
        console.warn(`Error stopping sound "${soundId}":`, err);
      }
    }
  }, []);
  
  /**
   * Toggle sound on/off
   */
  const toggleEnabled = useCallback(() => {
    setEnabled(prev => !prev);
    
    // Apply state to all audio elements
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = !enabled;
        if (!enabled && audio.loop) {
          audio.pause();
        }
      }
    });
    
    return !enabled;
  }, [enabled]);
  
  /**
   * Play the transition sound
   */
  const playTransitionSound = useCallback(() => {
    return play('transition');
  }, [play]);
  
  return {
    play,
    stop,
    enabled,
    toggleEnabled,
    soundsLoaded,
    playTransitionSound
  };
};

export default useSoundEffects; 