import React from 'react';

export const Language = ({
  color = '#FFFFFF', // Default white, but can be overridden
  size = 32,        // Matches original width
  height = 28,      // Matches original height
  className = '',   // Additional className
  style = {},       // Additional styles
  ...props          // All other SVG props
}) => (
  <svg
    width={size}
    height={height || size } // Maintain aspect ratio if only size is provided
    viewBox="0 0 32 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`arrow-left ${className}`}
    style={style}
    {...props}
  >
    <path d="M18.6667 25.6667L24.5 10.6667L30.3333 25.6667M20.125 22.3334H28.875M2 5.66671H13.6667M13.6667 5.66671H17M13.6667 5.66671C13.6667 8.38337 12.345 12.21 9.935 15.0917M9.935 15.0917C8.31667 17.0334 6.20167 18.5417 3.66667 19M9.935 15.0917L5.33333 10.6667M9.935 15.0917L14 19M9.5 5.36337V2.33337" stroke={color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);
