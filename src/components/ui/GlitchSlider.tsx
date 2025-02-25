import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, effects } from '../../styles/theme';
import { useSound } from '../../context/SoundContext';

interface GlitchSliderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  glitchIntensity?: 'none' | 'low' | 'medium' | 'high';
  showValueDisplay?: boolean;
  width?: string;
  className?: string;
}

// Glitch animation for the knob
const glitchAnim = keyframes`
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-2px, 1px); }
  20% { transform: translate(2px, -1px); }
  30% { transform: translate(-1px, -1px); }
  40% { transform: translate(1px, 1px); }
  50% { transform: translate(-1px, 2px); }
  60% { transform: translate(-2px, 1px); }
  70% { transform: translate(2px, 1px); }
  80% { transform: translate(-1px, -1px); }
  90% { transform: translate(1px, 2px); }
`;

// Static noise animation
const staticNoise = keyframes`
  0%, 100% { background-position: 0% 0%; }
  10% { background-position: -5% -5%; }
  20% { background-position: -10% 5%; }
  30% { background-position: 5% -10%; }
  40% { background-position: -5% 15%; }
  50% { background-position: -15% -5%; }
  60% { background-position: 15% 5%; }
  70% { background-position: 5% 15%; }
  80% { background-position: -10% -15%; }
  90% { background-position: 10% 5%; }
`;

// Get glitch animation intensity
const getGlitchStyle = (intensity: 'none' | 'low' | 'medium' | 'high') => {
  switch (intensity) {
    case 'low':
      return `${glitchAnim} 8s step-end infinite`;
    case 'medium':
      return `${glitchAnim} 4s step-end infinite`;
    case 'high':
      return `${glitchAnim} 2s step-end infinite`;
    default:
      return 'none';
  }
};

// Container for the slider
const SliderContainer = styled.div<{ width: string }>`
  position: relative;
  width: ${props => props.width};
  margin: 40px 0;
`;

// The track of the slider
const SliderTrack = styled.div<{ 
  $value: number, 
  $min: number, 
  $max: number 
}>`
  position: relative;
  height: 6px;
  background: linear-gradient(
    to right,
    ${colors.neonBlue} 0%,
    ${colors.neonPink} 100%
  );
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(255, 0, 255, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.1;
    animation: ${staticNoise} 2s steps(10) infinite;
    border-radius: 3px;
    pointer-events: none;
  }
  
  // Add ticks to the track
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 0;
    right: 0;
    height: 14px;
    background-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 9%,
      rgba(255, 255, 255, 0.3) 9.5%,
      transparent 10%
    );
    z-index: 1;
    pointer-events: none;
  }
`;

// The knob/thumb of the slider
const SliderKnob = styled.div<{ 
  $value: number, 
  $min: number, 
  $max: number,
  $glitchAnim: string 
}>`
  position: absolute;
  top: 50%;
  left: ${props => {
    const percentage = ((props.$value - props.$min) / (props.$max - props.$min)) * 100;
    return `calc(${percentage}% - 10px)`;
  }};
  width: 20px;
  height: 20px;
  background-color: ${colors.white};
  border-radius: 50%;
  transform: translateY(-50%);
  cursor: grab;
  z-index: 10;
  box-shadow: 
    0 0 0 2px ${colors.black},
    0 0 0 4px rgba(255, 255, 255, 0.5),
    0 0 10px rgba(0, 255, 255, 0.7),
    0 0 20px rgba(0, 255, 255, 0.5);
  animation: ${props => props.$glitchAnim};
  
  &:active {
    cursor: grabbing;
    box-shadow: 
      0 0 0 2px ${colors.black},
      0 0 0 4px rgba(255, 255, 255, 0.7),
      0 0 15px rgba(0, 255, 255, 0.9),
      0 0 30px rgba(0, 255, 255, 0.7);
  }
  
  // Knob details
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background-color: ${colors.neonBlue};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 5px ${colors.neonBlue}, 0 0 10px ${colors.neonBlue};
  }
`;

// The labels on the left and right
const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const SliderLabel = styled.span<{ $side: 'left' | 'right' }>`
  font-size: 1rem;
  color: ${props => props.$side === 'left' ? colors.neonBlue : colors.neonPink};
  text-shadow: 0 0 5px ${props => props.$side === 'left' ? colors.neonBlue : colors.neonPink};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

// Value display above the slider
const ValueDisplay = styled.div<{ $value: number, $min: number, $max: number }>`
  position: absolute;
  top: -35px;
  left: ${props => {
    const percentage = ((props.$value - props.$min) / (props.$max - props.$min)) * 100;
    return `calc(${percentage}% - 20px)`;
  }};
  background-color: ${colors.darkGray};
  color: ${colors.terminalGreen};
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${colors.terminalGreen};
  font-size: 0.85rem;
  ${effects.flicker}
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: ${colors.terminalGreen} transparent transparent transparent;
  }
`;

const GlitchSlider: React.FC<GlitchSliderProps> = ({
  min = 0,
  max = 100,
  value,
  onChange,
  leftLabel = 'Min',
  rightLabel = 'Max',
  glitchIntensity = 'low',
  showValueDisplay = true,
  width = '100%',
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const glitchAnim = getGlitchStyle(glitchIntensity);
  const soundEffects = useSound();
  const lastValueRef = useRef(value);
  
  // Handles the start of dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    soundEffects.play('click');
    updateValue(e.clientX);
  };
  
  // Calculate new slider value based on mouse position
  const updateValue = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width;
      const offsetX = clientX - rect.left;
      
      // Calculate the new value
      let newValue = min + (offsetX / sliderWidth) * (max - min);
      
      // Clamp the value between min and max
      newValue = Math.max(min, Math.min(newValue, max));
      
      // Round to integer if needed
      newValue = Math.round(newValue);
      
      // Only play sound if value changed significantly
      if (Math.abs(newValue - lastValueRef.current) >= 5) {
        soundEffects.play('slider');
        lastValueRef.current = newValue;
      }
      
      setDisplayValue(newValue);
      onChange(newValue);
    }
  };
  
  // Handles dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        soundEffects.play('click');
      }
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, onChange, soundEffects]);
  
  // Update display value when props value changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);
  
  // Random glitch effect for the value display
  useEffect(() => {
    if (displayValue === value) return;
    
    const glitchTimeout = setTimeout(() => {
      setDisplayValue(value);
      if (Math.random() > 0.7) {
        soundEffects.play('glitch');
      }
    }, 500);
    
    return () => clearTimeout(glitchTimeout);
  }, [displayValue, value, soundEffects]);
  
  return (
    <SliderContainer 
      width={width} 
      className={className}
      ref={sliderRef}
    >
      {showValueDisplay && (
        <ValueDisplay 
          $value={value} 
          $min={min} 
          $max={max}
        >
          {displayValue}
        </ValueDisplay>
      )}
      
      <SliderTrack 
        $value={value} 
        $min={min} 
        $max={max} 
        onClick={handleMouseDown}
      >
        <SliderKnob 
          $value={value} 
          $min={min} 
          $max={max}
          $glitchAnim={glitchAnim}
          onMouseDown={handleMouseDown}
        />
      </SliderTrack>
      
      <SliderLabels>
        <SliderLabel $side="left">{leftLabel}</SliderLabel>
        <SliderLabel $side="right">{rightLabel}</SliderLabel>
      </SliderLabels>
    </SliderContainer>
  );
};

export default GlitchSlider; 