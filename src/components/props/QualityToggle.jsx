import { useState } from 'react';

export function QualityToggle ({ isHighRes, onToggle }) {
  const [isActive, setIsActive] = useState(isHighRes);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle(newState);
  };

  return (
    <div style={styles.toggleContainer}>
      <label style={styles.toggleLabel}>Ver en alta calidad:</label>
      <div 
        style={{
            ...styles.toggleSwitch,
            backgroundColor: isActive ? '#4CAF50' : 'grey'
          }}
        onClick={handleToggle}
      >
        <div style={{
          ...styles.toggleSlider,
          transform: isActive ? 'translateX(20px)' : 'translateX(0)'
        }}>
          
        </div>
      </div>
    </div>
  );
};

const styles = {
  toggleContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    
  },
  toggleLabel: {
    fontSize: "14px",
    color: "#333",
    fontWeight: "bold",
    userSelect: "none",
  },
  toggleSwitch: {
    width: "44px",
    height: "24px",
    backgroundColor: "#e0e0e0",
    borderRadius: "15px",
    padding: "3px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  toggleSlider: {
    width: "18px",
    height: "18px",
    borderRadius: "12px",
    transition: "transform 0.3s, background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  }
};