import React, { useState } from 'react';

export function TutorialButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary'
  isHighlighted = false,
  icon = null, // 'arrow_left' | 'arrow_right'
  iconSize = 30, // New prop for icon size (default 20px)
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

  // Convert hex to RGB for SVG filter
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(currentIconColor);
  const filterId = `btn-filter-${icon || 'default'}`;

  // Button content
  const renderContent = () => {
    if (icon) {
      return (
        <>
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <filter id={filterId} colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values={`
                    ${r} 0 0 0 0
                    0 ${g} 0 0 0
                    0 0 ${b} 0 0
                    0 0 0 1 0
                  `}
                />
              </filter>
            </defs>
          </svg>
          <img
            src={`/assets/icons/ui/${icon}.svg`}
            alt=""
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              filter: `url(#${filterId})`,
              transition: 'filter 0.2s ease',
            }}
          />
        </>
      );
    }
    return children;
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '0.5vw 1vw',
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
      {icon === 'arrow_left' && renderContent()}
      {children || (variant === 'primary' && icon === null ? 'Iniciar' : null)}
      {icon === 'arrow_right' && renderContent()}
    </button>
  );
}