import { useState } from 'react';
import caveIcon from '/assets/icons/ui/cave.svg';

export function QualityToggle({ isHighRes, onToggle }) {
  const [isActive, setIsActive] = useState(isHighRes);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle(newState);
  };

  return (
    <div style={styles.toggleContainer}>
      {/* <label style={styles.toggleLabel}>Ver en alta calidad:</label> */}
      <div style={styles.iconContainer}>
        <img src={caveIcon} alt="Quality toggle" style={styles.icon} />
      </div>
      <div
        style={{
          ...styles.toggleSwitch,
          backgroundColor: isActive ? '#bbbbbb' : 'grey'
        }}
        onClick={handleToggle}
      >
        <div style={{
          ...styles.toggleSlider,
          transform: isActive ? 'translateX(20px)' : 'translateX(0)'
        }}>
          {isActive ? "HD" : "SD"}
        </div>
      </div>
    </div>
  );
};

const styles = {
  toggleContainer: {
    pointerEvents: "auto",
    position: "absolute",
    top: "50px",
    right: "10px",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: 0.5,

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
    borderRadius: "3px",
    padding: "3px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  toggleSlider: {
    width: "18px",
    height: "18px",
    borderRadius: "2px",
    transition: "transform 0.3s, background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    color: "black",
    fontSize: "0.7em",
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '24px',
  },
  icon: {
    height: '24px',
  }
};