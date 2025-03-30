import React, { useState, useEffect } from 'react';

export function IconButton({
  iconOn,
  iconOff,
  isActive,
  onClick,
  title,
  color = "#E2E2E2",
  hoverColor = "#E5B688",
  highlightColor = "#FFE88D",
  isHighlighted = false,
  size = 24,
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

  // Filter ID to prevent multiple identical filter ids
  const filterId = `colorFilter-${iconPath.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <>
      {/* SVG filter dynamically updated based on currentColor */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId}  colorInterpolationFilters="sRGB">
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

      <button
        onClick={onClick}
        title={title}
        aria-pressed={isActive}
        className="icon-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <img
            src={`/assets/icons/ui/${iconPath}`}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: `url(#${filterId})`,
              transition: "filter 0.2s ease",
              opacity: 1,
            }}
          />
        </div>
      </button>
    </>
  );
}
