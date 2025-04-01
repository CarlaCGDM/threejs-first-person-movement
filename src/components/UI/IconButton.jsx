import React, { useState } from 'react';

export function IconButton({
  iconOn,
  iconOff,
  isActive,
  onClick,
  title,
  color = "#E2E2E2",
  hoverColor = "#E5B688",
  highlightColor = "#FFE88D",
  backgroundColor = "transparent",
  isHighlighted = false,
  size = 30,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const iconPath = isActive ? iconOn : (iconOff || iconOn);

  // Determine the current color to be applied
  const currentColor = isHovered ? hoverColor : (isHighlighted ? highlightColor : color);

  // Function to convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(currentColor);
  const filterId = `colorFilter-${iconPath.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Tooltip */}
      {/* {isHovered && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#E5B688',
          color: '#272626',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'Mulish, sans-serif',
          whiteSpace: 'nowrap',
          zIndex: 100,
          marginBottom: '8px',
          pointerEvents: 'none',
        }}>
          {title}
        </div>
      )} */}

      {/* Glow Effect */}
      {isHighlighted && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          left: '-4px',
          right: '-4px',
          bottom: '-4px',
          backgroundColor: highlightColor,
          borderRadius: '50%',
          filter: 'blur(4px)',
          opacity: 0,
          animation: 'pulse 2s infinite',
          pointerEvents: 'none',
          zIndex: '2000',
        }}/>
      )}

      {/* SVG filter */}
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

      {/* Button */}
      <button
        onClick={onClick}
        title={title} // Fallback for mobile
        aria-pressed={isActive}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: backgroundColor,
          border: "none",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "5px",
          position: 'relative',
          zIndex: '1000',
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={`/assets/icons/ui/${iconPath}`}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: `url(#${filterId})`,
              transition: "filter 0.2s ease",
            }}
          />
        </div>
      </button>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(0.75); }
          50% { opacity: 0.7; transform: scale(0.80); }
          100% { opacity: 0.3; transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
}