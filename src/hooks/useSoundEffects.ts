import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

type SoundType = 
  | 'click'      // Standard button click
  | 'hover'      // Hover over interactive elements
  | 'glitch'     // Glitch effect sound
  | 'success'    // Positive action completed
  | 'error'      // Error or negative action
  | 'typing'     // Terminal typing sound
  | 'transition' // Screen transition
  | 'ambient'    // Background ambient noise
  | 'slider'     // Slider movement
  | 'toggle';    // Toggle switch

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  rate?: number; // playback rate (1.0 = normal)
}

// Using local sound URLs to avoid CORS issues
const SOUND_URLS: Record<SoundType, string> = {
  click: 'https://cdn.freesound.org/previews/242/242429_3509815-lq.mp3',
  hover: 'https://cdn.freesound.org/previews/242/242430_3509815-lq.mp3',
  glitch: 'https://cdn.freesound.org/previews/350/350986_6364455-lq.mp3',
  success: 'https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3',
  error: 'https://cdn.freesound.org/previews/142/142608_1840739-lq.mp3',
  typing: 'https://cdn.freesound.org/previews/157/157296_2538033-lq.mp3',
  transition: 'https://cdn.freesound.org/previews/264/264828_5003867-lq.mp3',
  ambient: 'https://cdn.freesound.org/previews/396/396571_7396240-lq.mp3',
  slider: 'https://cdn.freesound.org/previews/256/256116_3263906-lq.mp3',
  toggle: 'https://cdn.freesound.org/previews/522/522640_10166159-lq.mp3',
};

// Create a silent sound to unlock audio on iOS/Safari
const unlockAudio = () => {
  // Create and play a silent sound to unlock audio
  const silentSound = new Howl({
    src: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA0L2YLwxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='],
    volume: 0.001,
    autoplay: true,
    loop: false,
    onend: () => {
      console.log('Silent sound played - audio unlocked');
    }
  });
};

const useSoundEffects = (initiallyEnabled = true) => {
  const [enabled, setEnabled] = useState<boolean>(initiallyEnabled);
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);
  const loadedSoundsCount = useRef<number>(0);
  const soundsRef = useRef<Record<SoundType, Howl | null>>({
    click: null,
    hover: null,
    glitch: null,
    success: null,
    error: null,
    typing: null,
    transition: null,
    ambient: null,
    slider: null,
    toggle: null
  });
  
  // Unlock audio on first user interaction
  useEffect(() => {
    const unlockOnInteraction = () => {
      if (!audioUnlocked) {
        console.log('Attempting to unlock audio...');
        unlockAudio();
        setAudioUnlocked(true);
        
        // Force Howler to resume if suspended
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
          Howler.ctx.resume().then(() => {
            console.log('AudioContext resumed successfully');
          });
        }
      }
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', unlockOnInteraction, { once: true });
    document.addEventListener('touchstart', unlockOnInteraction, { once: true });
    document.addEventListener('keydown', unlockOnInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', unlockOnInteraction);
      document.removeEventListener('touchstart', unlockOnInteraction);
      document.removeEventListener('keydown', unlockOnInteraction);
    };
  }, [audioUnlocked]);
  
  // Initialize sounds when hook mounts
  useEffect(() => {
    // Set global Howler settings
    Howler.volume(1.0); // Master volume
    Howler.autoUnlock = true; // Try to automatically unlock audio
    
    // Preload all sounds
    const totalSounds = Object.keys(SOUND_URLS).length;
    loadedSoundsCount.current = 0;
    
    Object.entries(SOUND_URLS).forEach(([type, url]) => {
      console.log(`Loading sound: ${type} from ${url}`);
      
      soundsRef.current[type as SoundType] = new Howl({
        src: [url],
        volume: 0.8, // Higher default volume
        preload: true,
        html5: true, // Use HTML5 Audio to avoid playback issues
        onload: () => {
          console.log(`Sound loaded: ${type}`);
          loadedSoundsCount.current += 1;
          if (loadedSoundsCount.current === totalSounds) {
            console.log('All sounds loaded successfully');
            setSoundsLoaded(true);
          }
        },
        onloaderror: (id, error) => {
          console.error(`Error loading sound ${type}:`, error);
          loadedSoundsCount.current += 1; // Still count it to avoid getting stuck
          if (loadedSoundsCount.current === totalSounds) {
            setSoundsLoaded(true);
          }
        },
        onplayerror: (id, error) => {
          console.error(`Error playing sound ${type}:`, error);
          
          // Try to recover by recreating the sound
          soundsRef.current[type as SoundType] = new Howl({
            src: [url],
            volume: 0.8,
            html5: true
          });
        }
      });
    });
    
    // Clean up on unmount
    return () => {
      Object.values(soundsRef.current).forEach(sound => {
        if (sound) sound.unload();
      });
    };
  }, []);
  
  // Get a preloaded sound
  const getSound = useCallback((type: SoundType, options?: SoundOptions): Howl | null => {
    const sound = soundsRef.current[type];
    
    if (sound && options) {
      // Apply volume if specified
      if (options.volume !== undefined) {
        sound.volume(options.volume);
      }
      
      // Apply loop setting if specified
      if (options.loop !== undefined) {
        sound.loop(options.loop);
      }
      
      // Apply rate if specified
      if (options.rate !== undefined) {
        sound.rate(options.rate);
      }
    }
    
    return sound;
  }, []);
  
  // Play a sound effect
  const play = useCallback((type: SoundType, options?: SoundOptions): number | null => {
    if (!enabled) {
      console.log(`Sound not played (${type}) - sounds disabled`);
      return null;
    }
    
    if (!soundsLoaded) {
      console.log(`Sound not played (${type}) - sounds still loading`);
      return null;
    }
    
    try {
      const sound = getSound(type, options);
      if (!sound) {
        console.log(`Sound not played (${type}) - sound not found`);
        return null;
      }
      
      // Force unlock audio if needed
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        console.log('AudioContext is suspended, attempting to resume...');
        Howler.ctx.resume();
      }
      
      const id = sound.play();
      console.log(`Playing sound: ${type}, ID: ${id}`);
      
      // Check if sound is actually playing
      setTimeout(() => {
        if (sound.playing(id)) {
          console.log(`Sound ${type} is playing correctly`);
        } else {
          console.log(`Sound ${type} failed to play`);
        }
      }, 100);
      
      return id;
    } catch (error) {
      console.error('Failed to play sound:', error);
      return null;
    }
  }, [enabled, getSound, soundsLoaded]);
  
  // Stop a specific sound
  const stop = useCallback((type: SoundType) => {
    const sound = soundsRef.current[type];
    if (sound) sound.stop();
  }, []);
  
  // Stop all sounds
  const stopAll = useCallback(() => {
    Object.values(soundsRef.current).forEach(sound => {
      if (sound) sound.stop();
    });
  }, []);
  
  // Toggle sound on/off
  const toggleEnabled = useCallback(() => {
    setEnabled((prev: boolean) => {
      const newState = !prev;
      console.log(`Sound toggled to: ${newState ? 'ON' : 'OFF'}`);
      
      // If turning on, make sure audio is unlocked
      if (newState && Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
      
      // If turning off, stop all sounds
      if (!newState) {
        stopAll();
      }
      
      return newState;
    });
  }, [stopAll]);
  
  // Simple effects for common interactions
  const buttonClick = useCallback(() => play('click', { volume: 0.9 }), [play]);
  const buttonHover = useCallback(() => play('hover', { volume: 0.5 }), [play]);
  const toggleSwitch = useCallback(() => play('toggle', { volume: 0.9 }), [play]);
  const sliderMove = useCallback(() => play('slider', { volume: 0.7 }), [play]);
  const typeWriter = useCallback(() => play('typing', { volume: 0.5 }), [play]);
  const screenTransition = useCallback(() => play('transition', { volume: 0.9 }), [play]);
  const glitchEffect = useCallback(() => play('glitch', { volume: 0.9 }), [play]);
  const successEffect = useCallback(() => play('success', { volume: 0.9 }), [play]);
  const errorEffect = useCallback(() => play('error', { volume: 0.9 }), [play]);
  
  // Start ambient background sound
  const startAmbient = useCallback(() => {
    if (!enabled) {
      console.log('Ambient sound not started - sounds disabled');
      return null;
    }
    
    if (!soundsLoaded) {
      console.log('Ambient sound not started - sounds still loading');
      return null;
    }
    
    try {
      const sound = getSound('ambient', { loop: true, volume: 0.4 });
      if (!sound) {
        console.log('Ambient sound not started - sound not found');
        return null;
      }
      
      // Force unlock audio if needed
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        console.log('AudioContext is suspended, attempting to resume...');
        Howler.ctx.resume();
      }
      
      const id = sound.play();
      console.log(`Playing ambient sound, ID: ${id}`);
      
      // Check if sound is actually playing
      setTimeout(() => {
        if (sound.playing(id)) {
          console.log('Ambient sound is playing correctly');
        } else {
          console.log('Ambient sound failed to play');
        }
      }, 100);
      
      return () => {
        sound.stop(id);
        console.log('Stopped ambient sound');
      };
    } catch (error) {
      console.error('Failed to play ambient sound:', error);
      return null;
    }
  }, [enabled, getSound, soundsLoaded]);
  
  // Test sound function to verify audio is working
  const testSound = useCallback(() => {
    console.log('Testing sound system...');
    
    // Try to play each sound type in sequence
    const soundTypes: SoundType[] = ['click', 'success', 'error', 'glitch', 'transition'];
    let delay = 0;
    
    soundTypes.forEach((type) => {
      setTimeout(() => {
        console.log(`Testing sound: ${type}`);
        play(type, { volume: 1.0 });
      }, delay);
      delay += 500; // 500ms between each sound
    });
    
    return true;
  }, [play]);
  
  return {
    play,
    stop,
    stopAll,
    enabled,
    toggleEnabled,
    setEnabled,
    buttonClick,
    buttonHover,
    toggleSwitch,
    sliderMove,
    typeWriter,
    screenTransition,
    glitchEffect,
    successEffect,
    errorEffect,
    startAmbient,
    testSound,
    soundsLoaded
  };
};

export default useSoundEffects; 