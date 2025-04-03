import React from 'react';

export const ArrowLeft = ({
  color = '#FFFFFF', // Default white, but can be overridden
  size = 55,        // Matches original width
  height = 49,      // Matches original height
  className = '',   // Additional className
  style = {},       // Additional styles
  ...props          // All other SVG props
}) => (
  <svg
    width={size}
    height={height || size * (49/55)} // Maintain aspect ratio if only size is provided
    viewBox="0 0 55 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`arrow-left ${className}`}
    style={style}
    {...props}
  >
    <path 
      d="M55 24.796C55 25.9894 54.5301 27.134 53.6938 27.9779C52.8574 28.8219 51.723 29.296 50.5402 29.296H15.2188L26.9331 41.116C27.7209 41.969 28.1498 43.0973 28.1294 44.2631C28.109 45.4289 27.641 46.5412 26.8238 47.3657C26.0067 48.1902 24.9044 48.6624 23.749 48.683C22.5936 48.7036 21.4754 48.2708 20.63 47.476L1.30428 27.976C0.469107 27.1322 0 25.9885 0 24.796C0 23.6035 0.469107 22.4597 1.30428 21.616L20.63 2.11597C21.0383 1.67384 21.5306 1.31923 22.0777 1.07328C22.6248 0.827328 23.2153 0.695077 23.8141 0.684416C24.4129 0.673755 25.0078 0.784903 25.5631 1.01123C26.1184 1.23755 26.6228 1.57442 27.0463 2.00173C27.4698 2.42905 27.8037 2.93805 28.028 3.49838C28.2523 4.05871 28.3625 4.65888 28.3519 5.2631C28.3413 5.86732 28.2103 6.4632 27.9665 7.01519C27.7227 7.56719 28.3713 8.06399 26.9331 8.47596L15.2188 20.296H50.5402C53.002 20.296 55 22.312 55 24.796Z"
      fill={color} // Use dynamic color prop
    />
  </svg>
);
