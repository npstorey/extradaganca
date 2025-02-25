import React, { useEffect } from 'react';
import { useSound } from '../../context/SoundContext';
import RetroButton, { RetroButtonProps } from './RetroButton';

export interface SoundButtonProps extends Omit<RetroButtonProps, 'onHover'> {
  soundType?: 'click' | 'hover' | 'success' | 'error' | 'typing';
}

const SoundButton: React.FC<SoundButtonProps> = ({
  soundType = 'click',
  onClick,
  children,
  ...props
}) => {
  const soundEffects = useSound();

  // Try to unlock audio on mount
  useEffect(() => {
    // Help unlock audio on first render
    const unlockAudio = () => {
      console.log('SoundButton attempting to unlock audio');
      // Just creating the sound context is enough to unlock audio 
      // in most modern browsers
    };
    
    unlockAudio();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Log that we're trying to play a sound
    console.log(`SoundButton click - playing sound: ${soundType}`);
    
    // Play the appropriate sound based on soundType
    if (soundType === 'click') {
      soundEffects.play('click');
    } else if (soundType === 'success') {
      soundEffects.play('success');
    } else if (soundType === 'error') {
      soundEffects.play('error');
    } else if (soundType === 'typing') {
      soundEffects.play('typing');
    }
    
    // Add a small delay to ensure sound starts playing before any navigation happens
    setTimeout(() => {
      // Call the original onClick handler if provided
      if (onClick) {
        onClick(e);
      }
    }, 10);
  };

  const handleHover = () => {
    soundEffects.play('hover');
  };

  return (
    <RetroButton
      onClick={handleClick}
      onHover={handleHover}
      {...props}
    >
      {children}
    </RetroButton>
  );
};

export default SoundButton; 