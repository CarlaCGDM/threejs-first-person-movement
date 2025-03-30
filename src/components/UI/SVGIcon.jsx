// Create a file called SVGIcon.jsx
import React from 'react';

export function SVGIcon({ src, color, ...props }) {
  const [svgContent, setSvgContent] = React.useState(null);

  React.useEffect(() => {
    fetch(src)
      .then(response => response.text())
      .then(text => {
        // Replace currentColor with the specified color
        const coloredSvg = text.replace(/color/g, color);
        setSvgContent(coloredSvg);
      });
  }, [src, color]);

  return svgContent ? (
    <div 
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  ) : null;
}