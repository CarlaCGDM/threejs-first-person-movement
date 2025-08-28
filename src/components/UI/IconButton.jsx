import React, { useMemo, useState } from 'react';

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
  isHighlighted = false,   // <- parent controls this
  size = 30,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  const iconPath = isActive ? iconOn : (iconOff || iconOn);

  const handleClick = () => {
    setHasBeenClicked(true);    // stop the glow after the first click
    onClick?.();
  };

  const currentColor = isHovered
    ? hoverColor
    : (isHighlighted && !hasBeenClicked ? highlightColor : color);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  };

  const { r, g, b } = useMemo(() => hexToRgb(currentColor), [currentColor]);
  const filterId = `colorFilter-${iconPath.replace(/[^a-zA-Z0-9]/g, '')}`;

  const pxSize = typeof size === 'number' ? size : parseFloat(size); // if you pass "30px"

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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

      <button
        onClick={handleClick}
        title={title}
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
          padding: 4,
          borderRadius: 8,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Centered glow — uses prop, not local state */}
        {isHighlighted && !hasBeenClicked && (
          <span
            className="glow"
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: pxSize * 1.1,   // halo size
              height: pxSize * 1.1,
              backgroundColor: highlightColor,
              borderRadius: '50%',
              filter: 'blur(8px)',
              pointerEvents: 'none',
              zIndex: 0,              // behind the icon
            }}
          />
        )}

        {/* Icon */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
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

      <style jsx>{`
        .glow {
          opacity: 0.35;
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0%   { transform: translate(-50%, -50%) scale(0.75); opacity: 0.3; }
          50%  { transform: translate(-50%, -50%) scale(0.80); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(0.75); opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .glow { animation: none; }
        }
      `}</style>
    </div>
  );
}
