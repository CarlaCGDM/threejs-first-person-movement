import React, { useEffect, useState } from 'react';

const MobileControls = ({ updateKey }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [buttonSize, setButtonSize] = useState(100);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             'ontouchstart' in window || 
             window.innerWidth <= 768;
    };
    
    const calculateButtonSize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape) {
        // Landscape: 1/5th of height
        return Math.min(window.innerHeight / 5, 150);
      } else {
        // Portrait: 1/5th of width  
        return Math.min(window.innerWidth / 5, 150);
      }
    };
    
    setIsMobile(checkMobile());
    setButtonSize(calculateButtonSize());
    
    // Listen for resize to handle orientation changes
    const handleResize = () => {
      setIsMobile(checkMobile());
      setButtonSize(calculateButtonSize());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleButtonPress = (key) => {
    updateKey(key, true);
  };

  const handleButtonRelease = (key) => {
    updateKey(key, false);
  };

  // Don't render on desktop
  if (!isMobile) return null;

  const buttonStyle = {
    width: `${buttonSize}px`,
    height: `${buttonSize}px`,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: `${buttonSize * 0.3}px`,
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.1s ease',
    touchAction: 'manipulation',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: 'rgba(255, 255, 255, 0.6)',
    transform: 'scale(0.95)',
  };

  const forwardButtonStyle = {
    ...buttonStyle,
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
    pointerEvents: 'auto',
  };

  const ControlButton = ({ style, onPress, onRelease, children, gridArea }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPressed(true);
      onPress();
    };

    const handleEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPressed(false);
      onRelease();
    };

    // Handle touch events that might cancel the touch
    const handleCancel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPressed(false);
      onRelease();
    };

    return (
      <button
        style={{
          ...style,
          ...(isPressed ? activeButtonStyle : {}),
          gridArea,
          pointerEvents: 'auto',
        }}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchCancel={handleCancel}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      {/* Single Forward Button - Centered at bottom */}
      <ControlButton
        style={forwardButtonStyle}
        onPress={() => handleButtonPress('forward')}
        onRelease={() => handleButtonRelease('forward')}
      >
        ↑
      </ControlButton>
    </>
  );
};

export default MobileControls;