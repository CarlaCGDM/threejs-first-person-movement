import React from 'react';
import './WireframeAnimation.css';

const WireframeAnimation = () => {
  return (
    <div className="animation-container">
      <div className="image-wrapper">
        {/* Texture image (base layer) */}
        <img 
          src="/assets/images/environment/animation/01Texture.png" 
          alt="Textured model" 
          className="texture-image"
        />
        
        {/* Wireframe image (animated overlay) */}
        <img 
          src="/assets/images/environment/animation/01Wire.png" 
          alt="Wireframe model" 
          className="wire-image"
        />
      </div>
    </div>
  );
};

export default WireframeAnimation;