import React, { useState } from 'react';
import { ArrowLeft } from '../icons/ArrowLeft';
import { ArrowRight } from '../icons/ArrowRight';

export function TutorialButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary'
  isHighlighted = false,
  icon = null, // 'arrow_left' | 'arrow_right'
  iconSize = 30, // Size in pixels
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Color system
  const colorConfig = {
    primary: {
      text: '#272626',
      bg: '#FAE6D5',
      hoverBg: '#E5B688',
      iconColor: '#272626',
      hoverIconColor: '#272626'
    },
    secondary: {
      text: '#E5B688',
      bg: '#FAE6D5',
      hoverBg: '#E5B688',
      iconColor: '#272626',
      hoverIconColor: '#272626'
    }
  };

  const colors = colorConfig[variant];
  const currentIconColor = isHovered ? colors.hoverIconColor : colors.iconColor;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '0 2%',
        borderRadius: '1vw',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        backgroundColor: isHovered ? colors.hoverBg : colors.bg,
        color: colors.text,
        minWidth: '60px',
        fontFamily: "'Mulish', sans-serif",
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
        ...props.style
      }}
      {...props}
    >
      {icon === 'arrow_left' && (
        <ArrowLeft 
          color={currentIconColor} 
          size={iconSize}
        />
      )}
      {children || (variant === 'primary' && icon === null ? 'Iniciar' : null)}
      {icon === 'arrow_right' && (
        <ArrowRight 
          color={currentIconColor} 
          size={iconSize}
        />
      )}
    </button>
  );
}